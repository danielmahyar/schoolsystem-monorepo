import { mkdirSync } from "fs";
import multer from "multer";
import { extname } from "path";
import { Role } from "types";

export const storageStudentAssignment = multer.diskStorage({
  destination: (req, file, cb) => {
    mkdirSync(`./src/assignments/${req.params.assignmentID}`, {
      recursive: true,
    });
    cb(null, `./src/assignments/${req.params.assignmentID}`);
  },
  filename: (req, file, cb) => {
    const fileType = extname(file.originalname);
    const fileName = file.originalname.split(".")[0];
    const ID =
      req.user.ROLE === Role.STUDENT ? req.user.ID : req.params.studentID;
    cb(null, `${ID}-${req.params.assignmentID}-${fileName}${fileType}`);
  },
});
