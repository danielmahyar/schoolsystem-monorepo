import { useState, useEffect, useContext } from "react";
import { axiosAuth } from "../axios-frontend";
import { AuthContext } from "api";
import { forage } from "@tauri-apps/tauri-forage";

export function useRefreshToken() {
  // const [auth, setAuth] = useRecoilState(authState);
  const { auth, setAuth } = useContext(AuthContext);
  const refresh = async () => {
    const refreshToken = await forage.getItem({ key: "refreshToken" })();
    const { data } = await axiosAuth.post("/refresh", {
      refreshToken,
    });
    console.log(data.accessToken === auth?.accessToken);
    console.log(data.accessToken);
    setAuth(auth && { ...auth, accessToken: data.accessToken });
    return data.accessToken;
  };
  return refresh;
}
