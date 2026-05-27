import { api } from "./api";
import type{ Phong } from "../types/room.type";

export const layPhongTheoViTri = async (viTriId: number): Promise<Phong[]> => {
  const response = await api.get(
    `/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${viTriId}`
  );
  return response.data.content;
};