import { forage } from "@tauri-apps/tauri-forage";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import { AuthenticationAPIEndpoints, FunctionalityAPIEndpoints } from "types";
import { axiosAuth } from "api";
type Error = {
  message: string;
  server: string;
};

export async function axiosPost<ResponseData = any>(
  route: string,
  bodyData: any,
  headersUser?: AxiosRequestHeaders
): Promise<ResponseData> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const { data } = await axios.post<ResponseData>(route, bodyData, {
      headers:
        headersUser !== undefined
          ? headersUser
          : {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
    });
    return data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      const e = error as AxiosError<any>;
      if (e?.response?.status === 401)
        throw { message: "Unauthorized", server: "Authentication" };
      throw {
        message: e.response?.data?.message,
        server: e.response?.data?.server,
      } as Error;
    } else {
      throw error as Error;
    }
  }
}

export async function axiosGet<ResponseData = any>(
  route: string,
  headersUser?: AxiosRequestHeaders
): Promise<ResponseData> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const { data } = await axios.get<ResponseData>(route, {
      headers:
        headersUser !== undefined
          ? headersUser
          : {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      const e = error as AxiosError<any>;
      if (e?.response?.status === 401)
        throw { message: "Unauthorized", server: "Authentication" };
      throw {
        message: e.response?.data?.message,
        server: e.response?.data?.server,
      } as Error;
    } else {
      throw error as Error;
    }
  }
}
