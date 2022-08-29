import { Role } from "./school-types";

export type AuthState = {
  user: {
    ID: number;
    USERNAME: string;
    ROLE: Role;
    iat: number;
    PHOTO_URL: string;
    PUBLIC_NAME: string;
    /**
     * Expiration date
     */
    exp: number;
  };
  accessToken: string;
};

export type UserJWTDecoded = {
  ID: number;
  USERNAME: string;
  ROLE: Role;
  iat: number;
  PHOTO_URL: string;
  PUBLIC_NAME: string;
  /**
   * Expiration date
   */
  exp: number;
};
