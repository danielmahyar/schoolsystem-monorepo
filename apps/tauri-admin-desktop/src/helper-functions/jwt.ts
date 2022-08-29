import jwtDecode from "jwt-decode";
import { UserJWTDecoded } from "types";

export const jwtToUser = (accessToken: string): UserJWTDecoded =>
  jwtDecode<UserJWTDecoded>(accessToken);
