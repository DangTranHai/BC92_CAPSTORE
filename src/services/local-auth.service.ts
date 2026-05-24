import { AUTH_KEY, USERS_KEY } from "../constants/auth.constant";
import type {
  AuthData,
  SignInRequest,
  SignUpRequest,
  StoredUser,
  User,
} from "../types/auth.type";

const defaultAdmin: StoredUser = {
  id: 66159,
  name: "Admin Capstore",
  email: "admin1@gmail.com",
  password: "123456",
  phone: "0909090909",
  birthday: "2000-01-01",
  avatar: "",
  gender: true,
  role: "ADMIN",
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getUsers = (): StoredUser[] => {
  const rawUsers = localStorage.getItem(USERS_KEY);
  const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

  const hasDefaultAdmin = users.some(
    (user) => user.email.toLowerCase() === defaultAdmin.email.toLowerCase()
  );

  if (!hasDefaultAdmin) {
    const nextUsers = [defaultAdmin, ...users];
    saveUsers(nextUsers);
    return nextUsers;
  }

  return users;
};

export const localAuthService = {
  signIn: async (payload: SignInRequest): Promise<AuthData> => {
    const users = getUsers();

    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === payload.email.toLowerCase() &&
        user.password === payload.password
    );

    if (!foundUser) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    const { password, ...safeUser } = foundUser;

    const authData: AuthData = {
      user: safeUser,
      token: `local-token-${Date.now()}`,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

    return authData;
  },

  signUp: async (payload: SignUpRequest): Promise<User> => {
    const users = getUsers();

    const existedEmail = users.some(
      (user) => user.email.toLowerCase() === payload.email.toLowerCase()
    );

    if (existedEmail) {
      throw new Error("Email đã tồn tại");
    }

    const newUser: StoredUser = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      birthday: payload.birthday,
      avatar: "",
      gender: payload.gender,
      role: "USER",
    };

    saveUsers([...users, newUser]);

    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  getCurrentAuth: (): AuthData | null => {
    const rawAuth = localStorage.getItem(AUTH_KEY);
    return rawAuth ? JSON.parse(rawAuth) : null;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },
};