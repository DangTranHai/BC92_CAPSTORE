import { api } from "./api";
import type{ BinhLuan, BinhLuanRequest } from "../types/booking.type";

export const layBinhLuanTheoPhong = async (
  maPhong: number
): Promise<BinhLuan[]> => {
  const response = await api.get(
    `/api/binh-luan/lay-binh-luan-theo-phong/${maPhong}`
  );
  return response.data.content;
};

export const themBinhLuan = async (
  data: BinhLuanRequest
): Promise<BinhLuan> => {
  const response = await api.post("/api/binh-luan", data);
  return response.data.content;
};