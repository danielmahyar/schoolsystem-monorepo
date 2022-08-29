import React, { useContext, useState } from "react";
import { useSetRecoilState } from "recoil";
import { jwtToUser } from "../helper-functions/jwt";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { AuthenticationAPIEndpoints, AuthState } from "types";
import { motion } from "framer-motion";
import { forage } from "@tauri-apps/tauri-forage";
import { AuthContext } from "api";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  // const setAuth = useSetRecoilState(authState);
  const { setAuth } = useContext(AuthContext);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const promise = axios.post(
      AuthenticationAPIEndpoints.AUTHENTICATION_LOGIN_ADMIN,
      { username, password }
    );
    try {
      const res = await toast.promise(promise, {
        loading: "Logging in...",
        success: (data) => {
          console.log(data);
          const user = jwtToUser(data.data.accessToken);

          return "Logged in " + user.USERNAME;
        },
        error: (err: AxiosError<{ error: { message: string } }>) => {
          console.log(err);
          if (err.response?.status === 401)
            return "Unaurthorized to make this call";
          if (err.response?.status === 500) return "Server Error";
          return "Error: " + err.response?.data.error.message;
        },
      });

      const user = jwtToUser(res.data.accessToken);
      await forage.setItem({
        key: "refreshToken",
        value: res.data.refreshToken,
      })();

      if (user.ROLE !== "ADMIN")
        return toast.error("You are not authorized to login as an admin");
      if (res.data.accessToken === res.data.refreshToken)
        return toast.error("RefreshToken error");
      console.log(res.data.accessToken === res.data.refreshToken);
      setAuth({ user, accessToken: res.data.accessToken } as AuthState);
    } catch (error) {
      toast.error("There was an error with Login");
      console.log("Error");
    }
  };

  return (
    <motion.section
      className="w-full h-full bg-backgrond flex items-center justify-center bg-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 3,
        type: { type: "spring", stiffness: 100, damping: 15 },
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-6 flex flex-col bg-dark rounded-lg text-white min-w-fit space-y-4"
      >
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            className="w-72 px-3 py-1 bg-transparent border-input-border border rounded-sm text-white font-semibold outline-none focus:border-primary transition-all ease-in-out duration-300"
            placeholder="Username"
            onInput={(e) => setUsername(e.currentTarget.value)}
          />
          <input
            type="password"
            className="w-72 px-3 py-1 bg-transparent border-input-border border rounded-sm text-white font-semibold outline-none focus:border-primary transition-all ease-in-out duration-300"
            placeholder="Password"
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-primary py-2 px-4 rounded cursor-pointer font-bold"
        >
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </motion.section>
  );
};

export default LoginPage;
