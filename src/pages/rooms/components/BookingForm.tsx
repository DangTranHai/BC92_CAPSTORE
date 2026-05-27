import { useState } from "react";
import { DatePicker, InputNumber, Button, message } from "antd";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { datPhong } from "../../../services/booking.service";
import type{ Phong } from "../../../types/room.type";

interface Props {
  phong: Phong;
}

const BookingForm = ({ phong }: Props) => {
  const [ngayDen, setNgayDen] = useState<Dayjs | null>(null);
  const [ngayDi, setNgayDi] = useState<Dayjs | null>(null);
  const [soKhach, setSoKhach] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Tính số đêm
  const soNgay = ngayDen && ngayDi ? ngayDi.diff(ngayDen, "day") : 0;
  const tongTien = soNgay * phong.giaTien;

  const handleDatPhong = async () => {
    // Kiểm tra đăng nhập
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      message.warning("Vui lòng đăng nhập để đặt phòng!");
      return;
    }

    if (!ngayDen || !ngayDi) {
      message.warning("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(userStr);
      await datPhong({
        maPhong: phong.id,
        ngayDen: ngayDen.toISOString(),
        ngayDi: ngayDi.toISOString(),
        soLuongKhach: soKhach,
        maNguoiDung: user.id,
      });
      message.success("Đặt phòng thành công!");
    } catch (error) {
      message.error("Đặt phòng thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-2xl border p-6 shadow-lg">
      {/* Giá */}
      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-2xl font-bold">${phong.giaTien}</span>
        <span className="text-gray-500">/ đêm</span>
      </div>

      {/* Ngày */}
      <div className="mb-3 overflow-hidden rounded-xl border">
        <div className="grid grid-cols-2 divide-x">
          <div className="p-3">
            <p className="text-xs font-bold">NHẬN PHÒNG</p>
            <DatePicker
              placeholder="Thêm ngày"
              value={ngayDen}
              onChange={(date) => setNgayDen(date)}
              disabledDate={(d) => d.isBefore(dayjs(), "day")}
              bordered={false}
              className="w-full p-0 text-sm"
            />
          </div>
          <div className="p-3">
            <p className="text-xs font-bold">TRẢ PHÒNG</p>
            <DatePicker
              placeholder="Thêm ngày"
              value={ngayDi}
              onChange={(date) => setNgayDi(date)}
              disabledDate={(d) =>
                ngayDen
                  ? d.isBefore(ngayDen, "day")
                  : d.isBefore(dayjs(), "day")
              }
              bordered={false}
              className="w-full p-0 text-sm"
            />
          </div>
        </div>

        {/* Số khách */}
        <div className="border-t p-3">
          <p className="text-xs font-bold">KHÁCH</p>
          <InputNumber
            min={1}
            max={phong.khach}
            value={soKhach}
            onChange={(val) => setSoKhach(val ?? 1)}
            bordered={false}
            className="w-full p-0 text-sm"
          />
        </div>
      </div>

      {/* Nút đặt */}
      <Button
        type="primary"
        block
        size="large"
        loading={loading}
        onClick={handleDatPhong}
        className="bg-rose-500 hover:bg-rose-600"
      >
        Đặt phòng
      </Button>

      {/* Chi tiết giá */}
      {soNgay > 0 && (
        <div className="mt-4 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span>${phong.giaTien} x {soNgay} đêm</span>
            <span>${tongTien}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Tổng</span>
            <span>${tongTien}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;