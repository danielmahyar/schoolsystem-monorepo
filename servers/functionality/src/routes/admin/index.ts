import { Router } from "express";
import { Role } from "types";
import { adminStudentRouter } from "./students";
import { adminTeacherRouter } from "./teachers";
import { extname } from "path";
import multer from "multer";
import { writeFile } from "fs";
import { adminDashboardRouter } from "./dashboard";
export const adminRouter = Router();
import { MulterAzureStorage, MASNameResolver, MASObjectResolver } from 'multer-azure-blob-storage';
import { v1 as uuid } from "uuid";
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


const allowedRoles: Role[] = [Role.ADMIN];
adminRouter.use((req, res, next) => {
  console.log(req.cookies);
  if (!allowedRoles.includes(req.user.ROLE))
    return res.status(403).json({
      error:
        "You are not authorized to access this page. You tried signing in as a " +
        req.user.ROLE,
    });
  console.log({ cookies: req.cookies, cookiedSigned: req.signedCookies });
  next();
});

adminRouter.use("/students", adminStudentRouter);
adminRouter.use("/teachers", adminTeacherRouter);
adminRouter.use("/app", adminDashboardRouter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/assets");
  },
  filename: (req, file, cb) => {
    const fileType = extname(file.originalname);
    if (fileType === ".jpg" || fileType === ".png" || fileType === ".mov") {
      cb(null, Date.now().toString() + extname(file.originalname));
    } else {
      return cb(
        new Error("Only images are allowed"),
        Date.now().toString() + extname(file.originalname)
      );
    }
  },
});

const upload = multer({ storage: azureStorage });

adminRouter.post("/image-upload", upload.single("image"), (req, res) => {
  try {
    console.log(__dirname);
    console.log(req.file);
    res
      .status(200)
      .json({ url: (true) ? req.file?.path : `http://localhost:3002/v1/assets/${req.file?.filename}` });
  } catch (error) {
    console.log(error);
  }
});

adminRouter.post("/upload", (req, res) => {
  console.log(req.files);
  res.sendStatus(200);
});
