import axios from 'axios';

const TokenCybersoft =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA0OSIsIkhldEhhblN0cmluZyI6IjA2LzAzLzIwMjQiLCJIZXRIYW5UaW1lIjoiMTcwOTY4MzIwMDAwMCIsIm5iZiI6MTY4MjYxNDgwMCwiZXhwIjoxNzA5ODMwODAwfQ.k43D4dhebGpNofw1VImBYXXnqBcxtrDhQaHzcaN4mr8";

export const https = axios.create({
    baseURL: "https://jiranew.cybersoft.edu.vn",
    headers: {
        TokenCybersoft,
        Authorization: 'Bearer ' + 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ0aHVhbjMzNDRAZ21haWwuY29tIiwibmJmIjoxNzA4NTkzMjk0LCJleHAiOjE3MDg1OTY4OTR9.QpJCH-pwwIQ5EdXbDQO_AZK7a8sCeNDPln1lQLyv0cs'
    },
});