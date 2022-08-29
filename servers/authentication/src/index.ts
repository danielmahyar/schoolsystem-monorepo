import express from "express";
import swagger from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import * as SwaggerDocument from "./swagger.json";
import { JWTHandler } from "./JWThandler";
import { authRouter } from "./routes/auth";
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET: string = process.env.JWT_SECRET || "";
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || "";
export const jwtHandler = new JWTHandler(JWT_SECRET, JWT_REFRESH_TOKEN_SECRET);

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://tauri.localhost",
      "tauri://localhost",
    ],
    credentials: true,
  })
);
app.use(cookieParser(JWT_SECRET));
app.use(
  "/api-docs",
  swagger.serve,
  swagger.setup(SwaggerDocument, { explorer: true })
);
app.use(express.json());

//Routes
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
