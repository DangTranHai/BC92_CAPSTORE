export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: "USER" | "ADMIN";
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
};

export type AuthData = {
  user: User;
  token: string;
};

export type StoredUser = User & {
  password: string;
};