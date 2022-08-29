import { Router } from "express";
import {
  getOwnTeacherInformation,
  getSpecificStudentAssignments,
  getSpecificStudentInfo,
} from "../../db/teacher-functions";
export const teacherInfoRouter = Router();

//Get specific student information
teacherInfoRouter.get("/students/:studentID", async (req, res) => {
  try {
    const student = await getSpecificStudentInfo(req.params.studentID);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error });
  }
});

teacherInfoRouter.get("/students/:studentID/assignments", async (req, res) => {
  try {
    const studentAssignments = await getSpecificStudentAssignments(
      req.params.studentID
    );
    res.status(200).json(studentAssignments);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Get own information
teacherInfoRouter.get("/me", async (req, res) => {
  try {
    const teacher = await getOwnTeacherInformation(req.user.ID);
    res.status(200).json(teacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});
