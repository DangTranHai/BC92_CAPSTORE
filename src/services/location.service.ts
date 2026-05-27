import { api } from "./api";
import type { ViTri, PhanTrangViTri } from "../types/location.type.ts";

// Lấy danh sách vị trí để tìm kiếm (autocomplete)
export const layDanhSachViTri = async (): Promise<ViTri[]> => {
  const response = await api.get("/api/vi-tri");
  return response.data.content;
};

// Lấy danh sách vị trí có hình ảnh (section Khám phá gần đây)
export const layViTriPhanTrang = async (
  pageIndex: number = 1,
  pageSize: number = 8,
  keywords: string = ""
): Promise<PhanTrangViTri> => {
  const response = await api.get("/api/vi-tri/phan-trang-tim-kiem", {
    params: { pageIndex, pageSize, keywords },
  });
  return response.data.content;
};