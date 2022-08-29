import express, { Router } from "express";
import multer from "multer";
import { join } from "path";
import {
  getSpecificAssignment,
  getStudentAssignments,
  submitWorkAssignment,
  uploadWorkToAssignment,
} from "../../db/student-functions";
import { storageStudentAssignment } from "../../helper/multer-options";
export const studentAssignmentRouter = Router();

const upload = multer({ storage: storageStudentAssignment });

studentAssignmentRouter.use(
  "/files",
  express.static(join(__dirname, "..", "..", "assignments"))
);

// GET API endpoint where student can view all of its assignments
studentAssignmentRouter.get("/", async (req, res) => {
  let query = (req.query?.type) ? JSON.parse(req.query.type as string) : null;
  console.log(query)
  try {
    const assignments = await getStudentAssignments(
      req.user.ID,
      query,
      req.query?.search as string || ""
    );
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// GET API endpoint to view a specific assignment
studentAssignmentRouter.get("/:assignmentID", async (req, res) => {
  try {
    const assignment = await getSpecificAssignment(
      req.user.ID,
      req.params.assignmentID
    );
    res.json(assignment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// GET API endpoint to view a specific assignment
studentAssignmentRouter.post(
  "/:assignmentID/upload-files",
  upload.array("files"),
  async (req, res) => {
    try {
      res.json({ file: req.file });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  }
);

// PATCH API endpoint where student can submit their work
studentAssignmentRouter.patch("/:assignmentID", async (req, res) => {
  try {
    const result = await uploadWorkToAssignment(
      req.params.assignmentID,
      req.user.ID,
      req.body.submittedWork
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// PATCH API endpoint where student can submit their work
studentAssignmentRouter.patch("/:assignmentID/submit", async (req, res) => {
  try {
    const result = await submitWorkAssignment(
      req.params.assignmentID,
      req.user.ID
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});
