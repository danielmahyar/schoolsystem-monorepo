import { forage } from "@tauri-apps/tauri-forage";
import { axiosAuth } from "api";
import { useEffect, useState } from "react";
import { AuthState, UserJWTDecoded } from "types";
import jwtDecode from "jwt-decode";
export const jwtToUser = (accessToken: string): UserJWTDecoded =>
  jwtDecode<UserJWTDecoded>(accessToken);

export const useAuthentication = () => {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = auth !== null;
  console.log("isLoggedIn: " + isLoggedIn);
  useEffect(() => {
    const checkRefreshToken = async () => {
      try {
        const refreshToken = await forage.getItem({ key: "refreshToken" })();
        if (refreshToken) {
          const { data } = await axiosAuth.post("/refresh", {
            refreshToken,
          });
          const user = jwtToUser(data.accessToken);
          setAuth({ user, accessToken: data.accessToken } as AuthState);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    setLoading(true);
    if (!auth) {
      checkRefreshToken();
    } else {
      setLoading(false);
    }
  }, [auth]);

  return { loading, isLoggedIn, auth, setAuth };
};
