import mysql from "mysql";
import { pool } from ".";
import { AssignmentStatus, ClassAssignment, StudentAssignmentFile } from "types";

export function getClassByID(id: number | string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(
        `SELECT STUDENT_ID, USERNAME, PHOTO_URL FROM students WHERE students.STUDENT_ID IN ( 
                    SELECT STUDENT_ID FROM enrollments WHERE enrollments.CLASS_ID = ? 
                );`,
        [id],
        (err, results) => {
          connection.release();
          if (err) return reject(err);
          console.log(results);
          resolve([...results]);
        }
      );
    });
  });
}

export function getSpecificStudentInfo(id: string | number): Promise<any> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(
        `SELECT si.*, s.PHOTO_URL FROM student_infos si INNER JOIN students s ON s.STUDENT_ID = si.STUDENT_ID WHERE si.STUDENT_ID = ?;`,
        [id],
        (err, results) => {
          connection.release();
          if (err) return reject(err);
          console.log(results);
          resolve({ ...results[0] });
        }
      );
    });
  });
}

export function getSpecificStudentAssignments(
  id: string | number
): Promise<any> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(
        `SELECT sa.STATUS, sa.STUDENT_TASK_ID, a.* FROM student_assignments sa INNER JOIN assignments a ON sa.ASSIGNMENT_ID = a.ASSIGNMENT_ID WHERE sa.STUDENT_ID = ?`,
        [id],
        (err, results) => {
          connection.release();
          if (err) return reject(err);
          console.log(results);
          resolve([...results]);
        }
      );
    });
  });
}

export function makeClassAssigment(
  classID: string | number,
  teacherID: string | number,
  assignment: ClassAssignment
): Promise<mysql.OkPacket> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(
        `INSERT INTO assignments (ASSIGNMENT_ID, TEACHER_ID, ASSIGNMENT_NAME, GRADE_TYPE, SUBJECT, CLASS_ID, DEADLINE) VALUES (NULL, ?, ?, ?, ?, ?, ?);`,
        [
          teacherID,
          assignment.ASSIGNMENT_NAME,
          assignment.ASSIGNMENT_GRADE_TYPE,
          assignment.ASSIGNMENT_SUBJECT,
          classID,
          assignment.ASSIGNMENT_DEADLINE,
        ],
        (err, ok) => {
          connection.release();
          if (err) return reject(err);
          resolve(ok);
        }
      );
    });
  });
}

export function editClassAssigment(
  classID: string | number,
  teacherID: string | number,
  assignmentID: string,
  assignment: ClassAssignment
): Promise<mysql.OkPacket> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(
        `UPDATE assignments SET ASSIGNMENT_NAME = ?, GRADE_TYPE = ?, SUBJECT = ?, DEADLINE = ? WHERE ASSIGNMENT_ID = ? AND CLASS_ID = ? AND TEACHER_ID = ?;`,
        [
          assignment.ASSIGNMENT_NAME,
          assignment.ASSIGNMENT_GRADE_TYPE,
          assignment.ASSIGNMENT_SUBJECT,
          assignment.ASSIGNMENT_DEADLINE,
          assignmentID,
          classID,
          teacherID,
        ],
        (err, ok) => {
          connection.release();
          if (err) return reject(err);
          if (ok.affectedRows === 0) return reject("No rows affected");
          resolve(ok);
        }
      );
    });
  });
}

export function giveClassAssignment(
  classID: number | string,
  assignmentID: number | string
): Promise<mysql.OkPacket> {
  return new Promise((resolve, reject) => {
    pool.getConnection(async (err, connection) => {
      if (err) return reject(err);
      //Retrieve all students
      try {
        const students = await getClassByID(classID);
        connection.query(
          `INSERT INTO student_assignments (ASSIGNMENT_ID, STUDENT_ID, GRADE, STATUS) VALUES ?`,
          [students.map((s) => [assignmentID, s.STUDENT_ID, null, "NOT_DONE"])],
          (err, ok) => {
            connection.release();
            if (err) return reject(err);
            resolve(ok);
          }
        );
      } catch (error) {
        return reject(error);
      }
    });
  });
}

export function deleteClassAssignment(
  assignmentID: number | string,
  teacherID: number | string
): Promise<mysql.OkPacket> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(
        `DELETE FROM assignments WHERE ASSIGNMENT_ID = ? AND TEACHER_ID = ?`,
        [assignmentID, teacherID],
        (err, ok) => {
          connection.release();
          if (err) reject(err);
          if (ok.affectedRows === 0)
            return reject(
              "ID WRONG OR YOU DO NOT HAVE PERMISSION TO DELETE THIS ASSIGNMENT"
            );
          resolve(ok);
        }
      );
    });
  });
}

export function getClassAssignmentsByTeacher(
  classID: number | string,
  teacherID: number | string
): Promise<ClassAssignment[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM assignments WHERE CLASS_ID = ? AND TEACHER_ID = ? `,
      [classID, teacherID],
      (err, results: ClassAssignment[]) => {
        if (err) return reject(err);
        resolve([...results]);
      }
    );
  });
}

export function getAssignmentsByTeacher(
  teacherID: number | string
): Promise<ClassAssignment[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM assignments WHERE TEACHER_ID = ? `,
      [teacherID],
      (err, results: ClassAssignment[]) => {
        if (err) return reject(err);
        resolve([...results]);
      }
    );
  });
}

export function getStudentAssignmentWork(
  assignmentID: number | string,
  teacherID: number | string,
  classID: number | string
): Promise<any[]> {
  //Missing following params in follwing order:
  // 1) ASSIGNMENT_ID
  // 2) TEACHER_ID
  // 3) CLASS_ID
  const SQL_STATEMENT = `SELECT student_assignments.*, students.STUDENT_ID, students.USERNAME FROM student_assignments INNER JOIN students ON student_assignments.STUDENT_ID = students.STUDENT_ID WHERE student_assignments.ASSIGNMENT_ID = (SELECT assignments.ASSIGNMENT_ID FROM assignments WHERE assignments.ASSIGNMENT_ID = ? AND assignments.TEACHER_ID = ? AND assignments.CLASS_ID = ?);`;
  return new Promise((resolve, reject) => {
    pool.query(
      SQL_STATEMENT,
      [assignmentID, teacherID, classID],
      (err, results: any[]) => {
        if (err) return reject(err);
        resolve([...results]);
      }
    );
  });
}

export function getStudentAssignmentFiles(
  assignmentID: number | string,
  studentID: number | string
): Promise<StudentAssignmentFile[]> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM student_assignment_files WHERE ASSIGNMENT_ID = ? AND STUDENT_ID = ?`,
      [assignmentID, studentID],
      (err, results: StudentAssignmentFile[]) => {
        if (err) return reject(err);
        resolve([...results]);
      }
    );
  });
}

export function gradeSingleStudent(
  assignmentID: number | string,
  studentID: number | string,
  grade: string
): Promise<mysql.OkPacket> {
  console.log(grade);
  return new Promise<mysql.OkPacket>((resolve, reject) => {
    pool.query(
      `UPDATE student_assignments SET GRADE = ?, STATUS = 'GRADED' WHERE ASSIGNMENT_ID = ? AND STUDENT_ID = ?`,
      [grade, assignmentID, studentID],
      (err, ok: mysql.OkPacket) => {
        if (err) return reject(err);
        if (ok.affectedRows === 0) return reject("No rows affected");
        resolve(ok);
      }
    );
  });
}

export function releaseSubmittedAssignment(
  assignmentID: number | string,
  studentID: number | string,
): Promise<mysql.OkPacket> {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE student_assignments SET STATUS = '${AssignmentStatus.NOT_DONE}' WHERE ASSIGNMENT_ID = ? AND STUDENT_ID = ?`,
      [assignmentID, studentID],
      (err, ok: mysql.OkPacket) => {
        if (err) return reject(err);
        if (ok.affectedRows === 0) return reject("No rows affected");
        resolve(ok);
      }
    );
  });
}

export function getOwnTeacherInformation(
  teacherID: number | string
): Promise<any> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(
        `SELECT * FROM teachers INNER JOIN employees ON teachers.EMPLOYEE_ID = employees.EMPLOYEE_ID WHERE teachers.TEACHER_ID = 6;`,
        [teacherID],
        (err, results) => {
          connection.release();
          if (err) reject(err);
          console.log(results);
          resolve({ ...results[0] });
        }
      );
    });
  });
}
