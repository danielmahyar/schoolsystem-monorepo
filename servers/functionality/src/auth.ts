import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "types";
require("dotenv").config();

declare module "express-serve-static-core" {
  interface Request {
    user: User;
  }
}

const JWT_SECRET: string = process.env.JWT_SECRET || "";
export function authenticateHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(403).send("No token");
  jwt.verify(token, JWT_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.status(403).send("Invalid token");
    if (typeof user === "string" || typeof user === "undefined")
      return res.sendStatus(500);
    req.user = user as User;
    next();
  });
}
