import { readFileSync } from "fs";
import mysql from "mysql";
import path from "path";
require('dotenv').config();

const config: mysql.PoolConfig = {
  host: "schoolsystem-func-server.mysql.database.azure.com",
  user: "rootadmin",
  password: process.env.DB_PASS || "",
  database: "schoolsystem",
  port: 3306,
  multipleStatements: true,
  ssl: { ca: readFileSync(path.join(__dirname, 'cerf.pem')) },
};

export const pool = mysql.createPool(true ? config : {
  connectionLimit: 10, // the number of connections will node hold open to our database
  host: "localhost",
  user: "root",
  password: "",
  database: "schoolsystem",
  multipleStatements: true,
});


pool.on("acquire", function (connection) {
  console.log("Connection %d acquired", connection.threadId);
});

pool.on("enqueue", function () {
  console.log("Waiting for available connection slot");
});

pool.on("release", function (connection) {
  console.log("Connection %d released", connection.threadId);
});
