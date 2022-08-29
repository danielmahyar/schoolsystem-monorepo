import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { join } from "path";
import { authenticateHeader } from "./auth";
import { adminRouter } from "./routes/admin";
import { studentsRouter } from "./routes/students";
import { teacherRouter } from "./routes/teachers";
import { BlobServiceClient } from "@azure/storage-blob";
require("dotenv").config();
export interface User {
  username: string;
  password: string;
}

const version = "v1";
const PORT = process.env.PORT || 3000;
const AZURE_STORAGE_KEY = process.env.AZURE_STORAGE_KEY || "";



const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_KEY
);

export const profileImages = blobServiceClient.getContainerClient("profile-images");
export const assignmentFiles = blobServiceClient.getContainerClient("assignment-files");




const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://tauri.localhost",
      "tauri://localhost",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(`/${version}/assets`, express.static(join(__dirname, "assets")));
app.use(authenticateHeader);
app.use(cookieParser());
app.use(`/${version}/api/admin`, adminRouter);
app.use(`/${version}/api/teachers`, teacherRouter);
app.use(`/${version}/api/students`, studentsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
