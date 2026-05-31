import axios from "axios";


const TOKEN_CYBERSOFT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5MiIsIkhldEhhblN0cmluZyI6IjE5LzA5LzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc4OTc3NjAwMDAwMCIsIm5iZiI6MTc2MTMyNTIwMCwiZXhwIjoxNzg5OTIzNjAwfQ.ArBHlkISJbOimRkNdscBYDKzIqhCxv2DkUsGJh3zRLY";

export const api = axios.create({
  baseURL: "https://airbnbnew.cybersoft.edu.vn",
  timeout: 30000,
  headers: {
    tokenCybersoft: TOKEN_CYBERSOFT,
  },
});

api.interceptors.request.use((config) => {
const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.tokenCybersoft = TOKEN_CYBERSOFT;

  return config;
});