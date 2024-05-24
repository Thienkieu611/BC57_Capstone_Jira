import axios from "axios";

const TokenCybersoft =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA1NyIsIkhldEhhblN0cmluZyI6IjE1LzA2LzIwMjQiLCJIZXRIYW5UaW1lIjoiMTcxODQwOTYwMDAwMCIsIm5iZiI6MTY4ODkyMjAwMCwiZXhwIjoxNzE4NTU3MjAwfQ.vY7VplGBpsG599RYLEeMeajQNALOV5QUJ2dGV6Ow_q4";

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
      Authorization: `Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ0aHVhbjMzNDRAZ21haWwuY29tIiwibmJmIjoxNzEzMzM3MzEwLCJleHAiOjE3MTMzNDA5MTB9.69RuXhxQjuZAKjqnW9O6ca00nClWnRJ295hNIMd8Cts`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
