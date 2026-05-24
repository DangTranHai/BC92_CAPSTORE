import axios from "axios";

export const api = axios.create({
  baseURL: "https://airbnbnew.cybersoft.edu.vn",
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});