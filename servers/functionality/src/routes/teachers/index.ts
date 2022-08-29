import { Router } from "express";
import { Role } from "types";
import { teacherClassRouter } from "./classes";
import { teacherInfoRouter } from "./info";
export const teacherRouter = Router();

const allowedRoles: Role[] = [Role.TEACHER, Role.ADMIN];

teacherRouter.use((req, res, next) => {
  if (!allowedRoles.includes(req.user.ROLE))
    return res
      .status(403)
      .json({
        error:
          "You are not authorized to access this page. You tried signing in as a " +
          req.user.ROLE,
      });
  next();
});

teacherRouter.use("/classes", teacherClassRouter);
teacherRouter.use("/info", teacherInfoRouter);
