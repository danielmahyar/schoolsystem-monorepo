import { Router } from "express";
import { getStudentsAndTeachers } from "../../db/admin";
import {
  getAssignmentsByTeacher,
  getClassAssignmentsByTeacher,
  getOwnTeacherInformation,
} from "../../db/teacher-functions";

export const adminDashboardRouter = Router();

adminDashboardRouter.get("/", async (req, res) => {
  try {
    const users = await getStudentsAndTeachers();
    res.status(200).json({ students: users[0], teachers: users[1] });
  } catch (error) {
    console.log(error);
  }
});

adminDashboardRouter.get("/teacher/:teacherID", async (req, res) => {
  try {
    const teacher = await getOwnTeacherInformation(req.params.teacherID);
    const assignments = await getAssignmentsByTeacher(req.params.teacherID);
    res.status(200).json({ teacher, assignments });
  } catch (error) {
    console.log(error);
  }
});

adminDashboardRouter.get(
  "/teacher/:teacherID/assignments",
  async (req, res) => {
    try {
      const assignments = await getAssignmentsByTeacher(req.params.teacherID);
      res.status(200).json(assignments);
    } catch (error) {
      console.log(error);
    }
  }
);
