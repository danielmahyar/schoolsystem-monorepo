import { useContext } from "react";
import { axiosAuth } from "../library/axios";
import { AuthContext } from "../library/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useRefreshToken() {
  const { auth, setAuth } = useContext(AuthContext);
  const refresh = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("auth");
      console.log("Test")
      if (!refreshToken) return;
      console.log("Here")
      const { data } = await axiosAuth.post("/refresh", {
        refreshToken,
      });
      setAuth(auth && { ...auth, accessToken: data.accessToken });
      return data.accessToken;
    } catch (error) {
      console.log(error)
    }
  };
  return refresh;
}
