import { api } from "./api";

export type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone: string | null;
  birthday: string;
  avatar?: string | null;
  gender: boolean;
  role: "USER" | "ADMIN";
};

export type UserForm = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: "USER" | "ADMIN";
};

export const userService = {
  getUsersPagination: (pageIndex = 1, pageSize = 10, keyword = "") => {
    return api.get("/api/users/phan-trang-tim-kiem", {
      params: { pageIndex, pageSize, keyword },
    });
  },

  getUserById: (id: number) => {
    return api.get(`/api/users/${id}`);
  },

  addUser: (data: UserForm) => {
    return api.post("/api/users", data);
  },

  updateUser: (id: number, data: UserForm) => {
    return api.put(`/api/users/${id}`, data);
  },

  deleteUser: (id: number) => {
    return api.delete("/api/users", {
      params: { id },
    });
  },
};