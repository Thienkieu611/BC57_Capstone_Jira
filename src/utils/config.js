import axios from "axios";

const TokenCybersoft =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA0OSIsIkhldEhhblN0cmluZyI6IjA2LzAzLzIwMjQiLCJIZXRIYW5UaW1lIjoiMTcwOTY4MzIwMDAwMCIsIm5iZiI6MTY4MjYxNDgwMCwiZXhwIjoxNzA5ODMwODAwfQ.k43D4dhebGpNofw1VImBYXXnqBcxtrDhQaHzcaN4mr8";

export const USER_LOGIN = "userLogin";
export const TOKEN = "accessToken";

export const https = axios.create({
  baseURL: "https://jiranew.cybersoft.edu.vn",
  headers: {
    TokenCybersoft,
  },
});

https.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
