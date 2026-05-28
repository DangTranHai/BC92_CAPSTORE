import { api } from "./api";
import type { User } from "../types/auth.type";
import type { ApiResponse, Booking, Location, Room } from "../types/admin.type";

export const adminService = {
  getUsers: async () => {
    const res = await api.get<ApiResponse<User[]>>("/api/users");
    return res.data.content;
  },

  getLocations: async () => {
    const res = await api.get<ApiResponse<Location[]>>("/api/vi-tri");
    return res.data.content;
  },

  getRooms: async () => {
    const res = await api.get<ApiResponse<Room[]>>("/api/phong-thue");
    return res.data.content;
  },

  getBookings: async () => {
    const res = await api.get<ApiResponse<Booking[]>>("/api/dat-phong");
    return res.data.content;
  },
};