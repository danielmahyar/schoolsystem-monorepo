import mysql from "mysql";
import { pool } from ".";
import {
  AssignmentFile,
  AssignmentStatus,
  StudentAssignment,
  StudentAssignmentFile,
} from "types";
import { MulterFile } from "types";

export function getStudentAssignments(
  studentID: number | string,
  type = [],
  search = "",
): Promise<StudentAssignment[]> {
  return new Promise<StudentAssignment[]>((resolve, reject) => {
    pool.query(
      `SELECT s.*, a.*, t.PUBLIC_NAME as TEACHER_PUBLIC_NAME FROM student_assignments s INNER JOIN assignments a ON s.ASSIGNMENT_ID = a.ASSIGNMENT_ID INNER JOIN teachers t ON a.TEACHER_ID = t.TEACHER_ID WHERE s.STUDENT_ID = ? ${
        type.length > 0 && !type.some(o => o === 'All') ? `AND (${type.map((t, i) => `${i !== 0 ? 'OR' : ''} a.SUBJECT = '${t}'`).join(" ")})` : ''
      } AND a.ASSIGNMENT_NAME LIKE '${search}%'`,
      [studentID],
      (err, results: StudentAssignment[]) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

export function getSpecificAssignment(
  studentID: number | string,
  assignmentID: number | string
): Promise<StudentAssignment> {
  return new Promise<StudentAssignment>((resolve, reject) => {
    pool.query(
      `SELECT s.*, a.*, t.PUBLIC_NAME as TEACHER_PUBLIC_NAME FROM student_assignments s INNER JOIN assignments a ON s.ASSIGNMENT_ID = a.ASSIGNMENT_ID INNER JOIN teachers t ON a.TEACHER_ID = t.TEACHER_ID WHERE s.STUDENT_ID = ? AND s.ASSIGNMENT_ID = ?;
            SELECT * FROM student_assignment_files WHERE ASSIGNMENT_ID = ? AND STUDENT_ID = ?;
            SELECT * FROM assignment_files WHERE ASSIGNMENT_ID = ?;
            `,
      [studentID, assignmentID, assignmentID, studentID, assignmentID],
      (
        err,
        results: [
          StudentAssignment[],
          StudentAssignmentFile[],
          AssignmentFile[]
        ]
      ) => {
        if (err) return reject(err);
        resolve({
          ...results[0][0],
          WORK_FILES: [...results[1]],
          ASSIGNMENT_FILES: [...results[2]],
        });
      }
    );
  });
}

export function uploadWorkToAssignment(
  assignmentID: number | string,
  studentID: number | string,
  submission: MulterFile[]
): Promise<mysql.OkPacket> {
  return new Promise<mysql.OkPacket>((resolve, reject) => {
    console.log(submission);
    pool.query(
      `INSERT INTO student_assignment_files (STUDENT_ID, ASSIGNMENT_ID, FILE_NAME, FILE_URL) VALUES ?;`,
      [
        submission.map((file) => [
          studentID,
          assignmentID,
          file.originalname,
          file.url,
        ]),
      ],
      (err, ok: mysql.OkPacket) => {
        if (err) return reject(err);
        if (ok.affectedRows === 0) return reject("NOT_AUTHORIZED");
        return resolve(ok);
      }
    );
  });
}

export function submitWorkAssignment(
  assignmentID: number | string,
  studentID: number | string
): Promise<mysql.OkPacket> {
  return new Promise<mysql.OkPacket>((resolve, reject) => {
    pool.query(
      `UPDATE student_assignments SET STATUS = '${AssignmentStatus.SUBMITTED}' WHERE STUDENT_ID = ? AND ASSIGNMENT_ID = ?`,
      [studentID, assignmentID],
      (err, ok: mysql.OkPacket) => {
        if (err) return reject(err);
        if (ok.affectedRows === 0) return reject("NOT_AUTHORIZED");
        if (ok.changedRows === 1) return resolve(ok);
        else reject("UNEXPECTED_RESULT");
      }
    );
  });
}

export function deleteStudentFile(
  studentID: number | string,
  assignmentID: number | string,
  fileName: string
): Promise<mysql.OkPacket> {
  return new Promise<mysql.OkPacket>((resolve, reject) => {
    pool.query(
      `DELETE FROM student_assignment_files WHERE STUDENT_ID = ? AND ASSIGNMENT_ID = ? AND FILE_NAME = ?`,
      [studentID, assignmentID, fileName],
      (err, ok: mysql.OkPacket) => {
        if (err) return reject(err);
        if (ok.affectedRows === 1) return resolve(ok);
        else reject("UNEXPECTED_RESULT");
      }
    );
  });
}

export function getOwnInformation(studentID: number | string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    pool.query(
      `SELECT * FROM student_infos INNER JOIN students ON student_infos.STUDENT_ID = students.STUDENT_ID WHERE student_infos.STUDENT_ID = ?`,
      [studentID],
      (err, results: any[]) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
}
