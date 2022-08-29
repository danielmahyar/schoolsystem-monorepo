import jwt from "jsonwebtoken";
import {
  storeRefreshToken,
  getRefreshTokens,
  deleteRefreshToken,
  checkSpecificRefreshTokenExistence,
} from "./database";
export class JWTHandler {
  private secret: string;
  private JWT_REFRESH_TOKEN_SECRET: string;

  constructor(secret: string, JWT_REFRESH_TOKEN_SECRET: string) {
    this.secret = secret;
    this.JWT_REFRESH_TOKEN_SECRET = JWT_REFRESH_TOKEN_SECRET;
  }

  sign(payload: string) {
    return jwt.sign(payload, this.secret);
  }

  verify(refreshToken: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.verify(refreshToken, this.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return reject(err);
        //Remember jwt.Payload object
        if (typeof user === "string" || typeof user === "undefined")
          return reject();
        delete user.iat;
        delete user.exp;
        resolve(this.generateAccessToken(user));
      });
    });
  }

  generateAccessToken(obj: object) {
    return jwt.sign(obj, this.secret, { expiresIn: "2 hours" });
  }

  generateRefreshToken(obj: object) {
    return jwt.sign(obj, this.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "2 days" });
  }

  // retrieveRefreshTokens(): Promise<Array<string>>{
  //     return new Promise<Array<string>>(async (resolve, reject) => {
  //         //Retrieve refresh tokens from database
  //         try {
  //             const refreshTokens = await getRefreshTokens();
  //             resolve(refreshTokens);
  //         } catch (error) {
  //             reject(error);
  //         }
  //     })
  // }

  storeRefreshToken(token: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      //Store refresh token in database
      try {
        await storeRefreshToken(token);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  removeRefreshToken(token: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      //Remove refresh token from database
      try {
        await deleteRefreshToken(token);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  checkRefreshTokenInDB(token: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      //Check if refresh token is in database
      try {
        resolve(await checkSpecificRefreshTokenExistence(token));
      } catch (error) {
        return reject(error);
      }
    });
  }
}
