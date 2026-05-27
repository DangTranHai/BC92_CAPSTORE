export interface ViTri {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export interface PhanTrangViTri {
  pageIndex: number;
  pageSize: number;
  totalRow: number;
  keyword: string;
  data: ViTri[];
}

export interface SearchParams {
  locationId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
}