import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect } from "react";
import { AuthContext } from "../library/AuthContext";
import { axiosFunc } from "../library/axios";
import { useRefreshToken } from "./useNativeRefreshToken";

export default function useNativeAxiosPrivate() {
    const refresh = useRefreshToken();
    const { auth, setAuth } = useContext(AuthContext);
    useEffect(() => {
        const requestIntercept = axiosFunc.interceptors.request.use(
            (config) => {
                if (config.headers && !config?.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosFunc.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    try {
                        prevRequest.sent = true;
                        const newAccessToken = await refresh();
                        prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                        return axiosFunc(prevRequest);
                    } catch (error) {
                        setAuth(null);
                        await AsyncStorage.removeItem("auth");
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosFunc.interceptors.request.eject(requestIntercept);
            axiosFunc.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refresh]);

  return axiosFunc;
}