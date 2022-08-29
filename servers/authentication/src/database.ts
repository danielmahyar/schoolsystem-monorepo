import mysql from "mysql";
import { Admin, Role, Student, Teacher, User } from "types";
import bcrypt from "bcrypt";
import { CreateStudentUI } from "./routes/auth";
import { readFileSync } from "fs";
import path from "path";
require('dotenv').config();

const config: mysql.PoolConfig = {
  host: "schoolsystem-func-server.mysql.database.azure.com",
  user: "rootadmin",
  password: process.env.DB_PASS,
  database: "schoolsystem",
  port: 3306,
  multipleStatements: true,
  ssl: { ca: readFileSync(path.join(__dirname, 'cerf.pem')) },
};

const pool = mysql.createPool(true ? config : {
  connectionLimit: 10, // the number of connections will node hold open to our database
  host: "localhost",
  user: "root",
  password: "",
  database: "schoolsystem",
});

export function handleStudentLogin(
  username: string,
  password: string
): Promise<User> {
  return new Promise<User>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      connection.query(
        `SELECT * FROM students WHERE username = '${username}'`,
        (err, results) => {
          connection.release();
          if (err) return reject(err);
          if (results.length === 0) {
            return reject({ message: "No student found" });
          }
          const student = results[0] as Student;
          if (bcrypt.compareSync(password, student.PASSWORD)) {
            resolve({
              ID: student.STUDENT_ID,
              USERNAME: student.USERNAME,
              ROLE: Role.STUDENT,
              PHOTO_URL: student.PHOTO_URL,
              PUBLIC_NAME: student.PUBLIC_NAME,
            });
          } else {
            return reject({ message: "Incorrect password" });
          }
        }
      );
    });
  });
}

export function handleTeacherLogin(
  username: string,
  password: string
): Promise<User> {
  return new Promise<User>((resolve, reject) => {
    pool.query(
      `SELECT * FROM teachers WHERE username = '${username}'`,
      (err, results) => {
        if (err) return reject(err);
        if (results.length === 0)
          return reject({ message: "No teacher found" });
        const teacher = results[0] as Teacher;
        if (!bcrypt.compareSync(password, teacher.PASSWORD))
          return reject({ message: "Incorrect password" });

        resolve({
          ID: teacher.TEACHER_ID,
          USERNAME: teacher.USERNAME,
          ROLE: Role.TEACHER,
          PHOTO_URL: teacher.PHOTO_URL,
          PUBLIC_NAME: teacher.PUBLIC_NAME,
        });
      }
    );
  });
}

export function handleAdminLogin(
  username: string,
  password: string
): Promise<User> {
  return new Promise<User>((resolve, reject) => {
    pool.query(
      `SELECT * FROM admins WHERE username = '${username}'`,
      (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return reject({ message: "No admin found" });
        const admin = results[0] as Admin;
        if (!bcrypt.compareSync(password, admin.PASSWORD))
          return reject({ message: "Incorrect password" });
        resolve({
          ID: admin.ADMIN_ID,
          USERNAME: admin.USERNAME,
          ROLE: Role.ADMIN,
          PHOTO_URL: admin.PHOTO_URL,
          PUBLIC_NAME: admin.PUBLIC_NAME,
        });
      }
    );
  });
}

export function createTestStudent(
  req: CreateStudentUI,
  classID = 1
): Promise<void> {
  const photoUrl =
    req.photoUrl || "http://localhost:3002/v1/assets/default.jpg";
  return new Promise(async (resolve, reject) => {
    try {
      const status = await insertQuery(
        `INSERT INTO student_infos (STUDENT_ID, ADDRESS, PHONE_NUMBER, EMAIL, FIRSTNAME, LASTNAME) VALUES (NULL, ?, ?, ?, ?, ?)`,
        [
          `${req.address}, ${req.zip} ${req.city}`,
          req.phone,
          req.email,
          req.firstName,
          req.lastName,
        ]
      );
      await insertQuery(
        `INSERT INTO students (STUDENT_ID, PHOTO_URL, USERNAME, PASSWORD) VALUES (?, ?, ?, ?)`,
        [
          status.insertId,
          photoUrl,
          req.username,
          bcrypt.hashSync(req.password, 10),
        ]
      );
      await insertQuery(
        `INSERT INTO enrollments (STUDENT_ID, CLASS_ID) VALUES (?, ?)`,
        [status.insertId, classID]
      );
      resolve();
    } catch (error) {
      return reject(error);
    }
  });
}

export function createTestTeacher(
  username: string,
  password: string
): Promise<void> {
  console.log(password);
  return new Promise(async (resolve, reject) => {
    try {
      const status = await insertQuery(
        `INSERT INTO employees (EMPLOYEE_ID, FIRSTNAME, LASTNAME, EMAIL, HIRED_AT, ROLE) VALUES (NULL, 'Lars', 'Jørgensen', 'teeest@gmail.com', '2022-07-24', 'TEACHING')`,
        []
      );
      await insertQuery(
        `INSERT INTO teachers (TEACHER_ID, EMPLOYEE_ID, USERNAME, PASSWORD, SUBJECTS) VALUES (NULL, ?, ?, ?, ?)`,
        [status.insertId, username, bcrypt.hashSync(password, 10), "Danish"]
      );
      resolve();
    } catch (error) {
      return reject(error);
    }
  });
}

export function createAdminUser(
  username: string,
  password: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const status = await insertQuery(
        `INSERT INTO employees (EMPLOYEE_ID, FIRSTNAME, LASTNAME, EMAIL, HIRED_AT, ROLE) VALUES (NULL, 'Daniel', 'Mahyar', 'thediamonds764@gmail.com', '2022-07-24', 'ADMIN')`,
        []
      );
      await insertQuery(
        `INSERT INTO admins (ADMIN_ID, EMPLOYEE_ID, USERNAME, PASSWORD, PHOTO_URL, PUBLIC_NAME) VALUES (NULL, ?, ?, ?, 'http://localhost:3002/v1/assets/default.jpg', 'Daniel Cargar Mahyar')`,
        [status.insertId, username, bcrypt.hashSync(password, 10)]
      );
    } catch (error) {
      return reject(error);
    }
  });
}

export function getRefreshTokens(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.release();
      if (err) reject(err);
      connection.query("SELECT * FROM refresh_tokens", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  });
}

export function checkSpecificRefreshTokenExistence(
  token: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM refresh_tokens WHERE REFRESH_TOKEN = ?`,
      [token],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.length === 1);
      }
    );
  });
}

export function storeRefreshToken(token: string): Promise<void> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.release();
      if (err) return reject(err);
      connection.query(
        "INSERT INTO refresh_tokens (REFRESH_TOKEN) VALUES (?)",
        [token],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  });
}

export function deleteRefreshToken(token: string): Promise<void> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.release();
      if (err) return reject(err);
      connection.query(
        "DELETE FROM refresh_tokens WHERE REFRESH_TOKEN = ?",
        [token],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  });
}

export function insertQuery(
  SQL: string,
  values: any[]
): Promise<mysql.OkPacket> {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.release();
      if (err) return reject(err);
      connection.query(SQL, values, (err, status: mysql.OkPacket) => {
        if (err) return reject(err);
        resolve(status);
      });
    });
  });
}
