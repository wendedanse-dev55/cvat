import axios from "axios";

export const axiosRequest = axios.create({
    baseURL: "https://main.mlserver.inf.2up.dev/"
})
