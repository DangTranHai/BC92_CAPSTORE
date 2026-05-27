import { api } from "./api";
import type{ DatPhong, DatPhongRequest } from "../types/booking.type";

export const datPhong = async (data: DatPhongRequest): Promise<DatPhong> => {
  const response = await api.post("/api/dat-phong", data);
  return response.data.content;
};

export const layDanhSachDatPhong = async (): Promise<DatPhong[]> => {
  const response = await api.get("/api/dat-phong");
  return response.data.content;
};