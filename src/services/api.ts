import axios from "axios";

const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTUiLCJIZXRIYW5TdHJpbmciOiIzMC8xMS8yMDI2IiwiSGV0SGFuVGltZSI6IjE3OTU5OTY4MDAwMDAiLCJuYmYiOjE3NzY4NzcyMDAsImV4cCI6MTc5NjE0NDQwMH0.dW2oFfeCoaI7K77oFCtov_5gJwMfh0HNBUlcEAgEHcU";

export const api = axios.create({
  baseURL: "https://airbnbnew.cybersoft.edu.vn",
  timeout: 30000,
  headers: {
    tokenCybersoft: TOKEN_CYBERSOFT,
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  config.headers.tokenCybersoft = TOKEN_CYBERSOFT;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers.token = accessToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.content ||
      error?.response?.data?.message ||
      "";

    if (
      message.toLowerCase().includes("token") ||
      error?.response?.status === 401
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("AUTH_USER");
    }

    return Promise.reject(error);
  }
);