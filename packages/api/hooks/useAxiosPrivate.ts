import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { axiosFunctions } from "../axios-frontend";
import { useRefreshToken } from "./useRefreshToken";
import { forage } from "@tauri-apps/tauri-forage";

export function useAxiosPrivate() {
  const refresh = useRefreshToken();
  // const [auth, setAuth] = useRecoilState(authState);
  const { auth, setAuth } = useContext(AuthContext);
  useEffect(() => {
    const requestIntercept = axiosFunctions.interceptors.request.use(
      (config) => {
        console.log("Request section: " + auth?.accessToken);
        if (config.headers && !config?.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosFunctions.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("Response section " + auth?.accessToken);
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          try {
            prevRequest.sent = true;
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosFunctions(prevRequest);
          } catch (error) {
            setAuth(null);
            await forage.clear()();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosFunctions.interceptors.request.eject(requestIntercept);
      axiosFunctions.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosFunctions;
}
