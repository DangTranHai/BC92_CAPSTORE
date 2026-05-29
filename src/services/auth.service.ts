import { api } from "./api";
import type { AuthData, SignInRequest, SignUpRequest, User } from "../types/auth.type";

export const authService = {
  signIn: async (payload: SignInRequest): Promise<AuthData> => {
    const response = await api.post("/api/auth/signin", payload);
    const data = response.data.content;

    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  signUp: async (payload: SignUpRequest): Promise<User> => {
    const response = await api.post("/api/auth/signup", payload);
    return response.data.content;
  },

  signOut: (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
},

  getCurrentUser: (): AuthData | null => {
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) return null;
    return {
      token,
      user: JSON.parse(userStr),
    };
  },
};