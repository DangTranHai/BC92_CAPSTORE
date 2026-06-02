import { AUTH_KEY } from "../constants/auth.constant";
import { api } from "./api";
import type {
  AuthData,
  SignInRequest,
  SignUpRequest,
  User,
} from "../types/auth.type";

const adminEmails = ["admin1@gmail.com", "admin@gmail.com"];

export const localAuthService = {
  signIn: async (payload: SignInRequest): Promise<AuthData> => {
    const res = await api.post("/api/auth/signin", payload);

    const content = res.data.content;

    const user: User = {
      ...content.user,
      role: adminEmails.includes(content.user.email?.toLowerCase())
        ? "ADMIN"
        : content.user.role || "USER",
    };

    const authData: AuthData = {
      user,
      token: content.token,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

    return authData;
  },

  signUp: async (payload: SignUpRequest): Promise<User> => {
    const res = await api.post("/api/auth/signup", payload);
    return res.data.content.user || res.data.content;
  },

  getCurrentAuth: (): AuthData | null => {
    const rawAuth = localStorage.getItem(AUTH_KEY);
    return rawAuth ? JSON.parse(rawAuth) : null;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },
};