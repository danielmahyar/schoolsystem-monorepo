import { Router } from "express";

import multer from "multer";
import { MulterFile } from "types";
import {
  deleteStudentFile,
  getSpecificAssignment,
  submitWorkAssignment,
  uploadWorkToAssignment,
} from "../../db/student-functions";

import { MulterAzureStorage, MASNameResolver, MASObjectResolver, MulterOutFile } from 'multer-azure-blob-storage';
import { v1 as uuid } from "uuid";
import { extname } from "path";
require('dotenv').config();
export type MetadataObj = { [k: string]: string };

const resolveBlobName: MASNameResolver = (req, file) => {
  return new Promise((resolve, reject) => {
      const blobName = `${uuid()}${extname(file.originalname)}`;
      resolve(blobName);
  });
};

const azureStorage: MulterAzureStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_KEY,
  accessKey: "demBcEA10EgTPvK3Jibs0dgNljl+TkxkldbMQgvWenMxp332fZ9+EXxfHdbsw3MpUXNXrZ9JdRP/+AStkPnRIg==",
  accountName: 'schoolsystemstorage',
  containerName: 'profile-images',
  blobName: resolveBlobName,
  containerAccessLevel: 'blob',
  urlExpirationTime: 60
});
export const adminStudentRouter = Router();

const upload = multer({ storage: azureStorage });

// GET API endpoint to view a specific assignment
adminStudentRouter.get(
  "/:studentID/assignments/:assignmentID",
  async (req, res) => {
    try {
      const assignment = await getSpecificAssignment(
        req.params.studentID,
        req.params.assignmentID
      );
      res.json(assignment);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

// GET API endpoint that gets
adminStudentRouter.post(
  "/:studentID/assignments/:assignmentID/upload-files",
  upload.array("files"),
  async (req, res) => {
    try {
      const files = req.files as MulterOutFile[];
      if (files.length === 0)
        return res.status(400).json({ error: "No files were uploaded" });
      const parsedFiles: MulterFile[] = files
        // files &&
        // files.map((file: MulterFile) => ({
        //   ...file,
        //   path: convertAssignmentFileToURL(
        //     req.params.assignmentID,
        //     file.filename
        //   ),
        // }));
      await uploadWorkToAssignment(
        req.params.assignmentID,
        req.params.studentID,
        parsedFiles
      );
      res.json({ files: parsedFiles });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

adminStudentRouter.delete(
  "/:studentID/assignments/:assignmentID/:studentFileName",
  async (req, res) => {
    try {
      await deleteStudentFile(
        req.params.studentID,
        req.params.assignmentID,
        req.params.studentFileName
      );
      res.json({ message: "File deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

adminStudentRouter.patch(
  "/:studentID/assignments/:assignmentID/submit",
  async (req, res) => {
    try {
      await submitWorkAssignment(req.params.assignmentID, req.params.studentID);
      res.json({ message: "Assignment submitted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

function convertAssignmentFileToURL(assignmentID: string, fileName: string) {
  const FILE_URL = `http://localhost:3002/v1/api/students/assignments/files/${assignmentID}/${fileName}`;
  return FILE_URL;
}
