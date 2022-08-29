import axios from "axios";

const PRODUCTION_URL_AUTH = ""

export const axiosAuth = axios.create({
    baseURL: "https://schoolsystem-auth-server.herokuapp.com/api/auth",
})

export const axiosFunc = axios.create({
    baseURL: "https://schoolsystem-application.herokuapp.com/v1/api",
})



