import { Router } from "express";
import { ClassAssignment } from "types";
import {
  deleteClassAssignment,
  editClassAssigment,
  getClassAssignmentsByTeacher,
  getClassByID,
  getStudentAssignmentFiles,
  getStudentAssignmentWork,
  giveClassAssignment,
  gradeSingleStudent,
  makeClassAssigment,
  releaseSubmittedAssignment,
} from "../../db/teacher-functions";
export const teacherClassRouter = Router();

// Get a class by ID
teacherClassRouter.get("/:id", async (req, res) => {
  try {
    const students = await getClassByID(req.params.id);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Make an assignment for a class
/* INPUT
{ 
    "ASSIGNMENT_NAME": "Assignment 1",
    "ASSIGNMENT_DESCRIPTION": "Assignment 1 description",
    "ASSIGNMENT_DUE_DATE": "2020-01-01",
    "ASSIGNMENT_FILE": "https://www.google.com/",
    "ASSIGNMENT_SUBJECT": "Math",
    "ASSIGNMENT_GRADE_TYPE": "Percentage"
}
*/
teacherClassRouter.post("/:classID/assignments", async (req, res) => {
  const assignmentFromTeacher: ClassAssignment = req.body;
  try {
    const assignmentPacket = await makeClassAssigment(
      req.params.classID,
      req.user.ID,
      assignmentFromTeacher
    );
    await giveClassAssignment(req.params.classID, assignmentPacket.insertId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//Delete an existing assignment (deleted all student_assignments too)
teacherClassRouter.delete("/assignments/:assignmentID", async (req, res) => {
  try {
    await deleteClassAssignment(req.params.assignmentID, req.user.ID);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//Edit an existing assignment
teacherClassRouter.patch(
  "/:classID/assignments/:assignmentID",
  async (req, res) => {
    try {
      await editClassAssigment(
        req.params.classID,
        req.user.ID,
        req.params.assignmentID,
        req.body as ClassAssignment
      );
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

//Get all assignments for one class assigned self
teacherClassRouter.get("/:classID/assignments", async (req, res) => {
  try {
    const assignments = await getClassAssignmentsByTeacher(
      req.params.classID,
      req.query.teacherID?.toString() || req.user.ID
    );
    res.status(200).json(assignments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//Get work sumbitted for assignment
teacherClassRouter.get(
  "/:classID/assignments/:assignmentID/work",
  async (req, res) => {
    try {
      console.log(req.params);
      const studentWorks = await getStudentAssignmentWork(
        req.params.assignmentID,
        req.user.ID,
        req.params.classID
      );
      res.status(200).json(studentWorks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

//Get submitted files from one student
teacherClassRouter.get(
  "/:classID/assignments/:assignmentID/work/:studentID",
  async (req, res) => {
    try {
      const studentWorks = await getStudentAssignmentFiles(
        req.params.assignmentID,
        req.params.studentID
      );
      res.status(200).json(studentWorks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

// Release a submitted assignment from student
teacherClassRouter.patch(
  "/:classID/assignments/:assignmentID/student/:studentID",
  async (req, res) => {
    try {
      await releaseSubmittedAssignment(req.params.assignmentID, req.params.studentID);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
});

teacherClassRouter.put(
  "/:classID/assignments/:assignmentID/student/:studentID",
  async (req, res) => {
    try {
      await gradeSingleStudent(
        req.params.assignmentID,
        req.params.studentID,
        req.body.grade
      );
      res.sendStatus(201);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);
