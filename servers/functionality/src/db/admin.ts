import { Student, Teacher } from "types";
import { pool } from ".";

export function getStudentsAndTeachers(): Promise<[Student[], Teacher[]]> {
  return new Promise<[Student[], Teacher[]]>((resolve, reject) => {
    pool.query(
      `SELECT STUDENT_ID, PUBLIC_NAME, PHOTO_URL FROM students LIMIT 25; SELECT TEACHER_ID, EMPLOYEE_ID, PUBLIC_NAME, PHOTO_URL, SUBJECTS FROM teachers LIMIT 25;`,
      (err, rows: [Student[], Teacher[]]) => {
        if (err) return reject(err);
        return resolve(rows);
      }
    );
  });
}
