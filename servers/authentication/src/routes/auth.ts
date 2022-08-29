import { Router } from "express";
import { jwtHandler } from "..";
import { User } from "types";
import {
  createAdminUser,
  createTestStudent,
  createTestTeacher,
  handleAdminLogin,
  handleStudentLogin,
  handleTeacherLogin,
} from "../database";

export type CreateStudentUI = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  email: string;
  dob: string;
  username: string;
  photoUrl: string;
  password: string;
};

export const authRouter = Router();

authRouter.post("/login/teacher", async (req, res) => {
  try {
    const user = await handleTeacherLogin(req.body.username, req.body.password);
    const accessToken = jwtHandler.generateAccessToken(user);
    const refreshToken = jwtHandler.generateRefreshToken(user);

    try {
      await jwtHandler.storeRefreshToken(refreshToken);
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.sendStatus(500);
    }
  } catch (error: any) {
    if (error.code === "ECONNREFUSED")
      return res
        .status(500)
        .json({ error: { ...error, server: "database_problems" } });
    console.log(error);
    res
      .status(401)
      .json({ error: { ...error, server: "authentication_failed" } });
  }
});

authRouter.post("/login/student", async (req, res) => {
  try {
    const user = await handleStudentLogin(req.body.username, req.body.password);
    const accessToken = jwtHandler.generateAccessToken(user);
    const refreshToken = jwtHandler.generateRefreshToken(user);

    try {
      await jwtHandler.storeRefreshToken(refreshToken);
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.sendStatus(500);
    }
  } catch (error: any) {
    console.log(error);
    res
      .status(401)
      .json({ error: { ...error, server: "authentication_failed" } });
  }
});

authRouter.post("/login/admin", async (req, res) => {
  try {
    const user = await handleAdminLogin(req.body.username, req.body.password);
    const accessToken = jwtHandler.generateAccessToken(user);
    const refreshToken = jwtHandler.generateRefreshToken(user);

    try {
      await jwtHandler.storeRefreshToken(refreshToken);
      console.log("here");
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        signed: true,
        sameSite: "none",
      });
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.sendStatus(500);
    }
  } catch (error: any) {
    console.log(error);
    res
      .status(401)
      .json({ error: { ...error, server: "authentication_failed" } });
  }
});

authRouter.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  try {
    if ((await jwtHandler.checkRefreshTokenInDB(refreshToken)) === false)
      return res.status(403).json({ message: "Invalid refresh token" });
    const accessToken = await jwtHandler.verify(refreshToken);

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.sendStatus(403);
  }
});

authRouter.delete("/logout", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    await jwtHandler.removeRefreshToken(refreshToken);
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

authRouter.post("/create/student", async (req, res) => {
  console.log(req.body);
  try {
    await createTestStudent(req.body as CreateStudentUI);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

authRouter.post("/create/teacher", async (req, res) => {
  try {
    await createTestTeacher(req.body.username, req.body.password);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

authRouter.post("/create/admin", async (req, res) => {
  try {
    await createAdminUser(req.body.username, req.body.password);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
