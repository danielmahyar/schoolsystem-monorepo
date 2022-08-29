import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: "https://schoolsystem-auth-server.herokuapp.com/api/auth",
});

export const axiosFunctions = axios.create({
  baseURL: "https://schoolsystem-application.herokuapp.com/v1/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
