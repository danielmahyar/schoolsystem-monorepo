import { Router } from "express";
import { studentAssignmentRouter } from "./assignments";
import { studentInfoRouter } from "./info";
export const studentsRouter = Router();

studentsRouter.use("/assignments", studentAssignmentRouter);
studentsRouter.use("/info", studentInfoRouter);
