import { api } from "./api";
import type { User } from "../types/auth.type";

export const userService = {
  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/api/users/${id}`);
    return response.data.content;
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data.content;
  },
};