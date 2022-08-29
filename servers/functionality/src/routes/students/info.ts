import { Router } from "express";
import { getOwnInformation } from "../../db/student-functions";
export const studentInfoRouter = Router();

// GET API endpoint where student can view own data
studentInfoRouter.get("/me", async (req, res) => {
  try {
    const student = await getOwnInformation(req.user.ID);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error });
  }
});
