import { useState, useEffect, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, InputNumber } from "antd";
import { useNavigate } from "react-router-dom";
import type{ ViTri } from "../../../types/location.type.ts";
import { layDanhSachViTri } from "../../../services/location.service.ts";
import dayjs, { Dayjs } from "dayjs";

const SearchBar = () => {
  const navigate = useNavigate();

  // State
  const [danhSachViTri, setDanhSachViTri] = useState<ViTri[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [viTriDaChon, setViTriDaChon] = useState<ViTri | null>(null);
  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
  const [soKhach, setSoKhach] = useState<number>(1);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách vị trí khi component mount
  useEffect(() => {
    const fetchViTri = async () => {
      try {
        const data = await layDanhSachViTri();
        setDanhSachViTri(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách vị trí:", error);
      }
    };
    fetchViTri();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lọc vị trí theo keyword
  const danhSachLoc = danhSachViTri.filter(
    (vt) =>
      vt.tenViTri.toLowerCase().includes(keyword.toLowerCase()) ||
      vt.tinhThanh.toLowerCase().includes(keyword.toLowerCase())
  );

  // Chọn vị trí từ dropdown
  const handleChonViTri = (viTri: ViTri) => {
    setViTriDaChon(viTri);
    setKeyword(`${viTri.tenViTri}, ${viTri.tinhThanh}`);
    setShowDropdown(false);
  };

  // Bấm tìm kiếm
  const handleTimKiem = () => {
    if (!viTriDaChon) return;
    navigate(`/rooms/${viTriDaChon.id}`);
  };

  return (
    <div className="relative z-20 mx-auto -mb-10 grid max-w-5xl grid-cols-1 overflow-visible rounded-full bg-white shadow-2xl md:grid-cols-5">
      
      {/* Ô địa điểm */}
      <div className="relative border-b px-8 py-4 md:col-span-2 md:border-b-0 md:border-r" ref={dropdownRef}>
        <p className="text-xs font-bold">Địa điểm</p>
        <input
          type="text"
          placeholder="Bạn sắp đi đâu?"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setViTriDaChon(null);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full border-none bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400"
        />

        {/* Dropdown gợi ý */}
        {showDropdown && danhSachLoc.length > 0 && (
          <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-80 overflow-y-auto rounded-2xl bg-white shadow-xl">
            {danhSachLoc.map((vt) => (
              <div
                key={vt.id}
                onClick={() => handleChonViTri(vt)}
                className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-100"
              >
                <SearchOutlined className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{vt.tenViTri}</p>
                  <p className="text-xs text-gray-400">{vt.tinhThanh}, {vt.quocGia}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nhận phòng */}
      <div className="border-b px-8 py-4 md:border-b-0 md:border-r">
        <p className="text-xs font-bold">Nhận phòng</p>
        <DatePicker
          placeholder="Thêm ngày"
          value={checkIn}
          onChange={(date) => setCheckIn(date)}
          disabledDate={(d) => d.isBefore(dayjs(), "day")}
          bordered={false}
          className="w-full p-0 text-sm text-gray-500"
        />
      </div>

      {/* Trả phòng */}
      <div className="border-b px-8 py-4 md:border-b-0 md:border-r">
        <p className="text-xs font-bold">Trả phòng</p>
        <DatePicker
          placeholder="Thêm ngày"
          value={checkOut}
          onChange={(date) => setCheckOut(date)}
          disabledDate={(d) =>
            checkIn ? d.isBefore(checkIn, "day") : d.isBefore(dayjs(), "day")
          }
          bordered={false}
          className="w-full p-0 text-sm text-gray-500"
        />
      </div>

      {/* Số khách + nút tìm */}
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <p className="text-xs font-bold">Khách</p>
          <InputNumber
            min={1}
            max={20}
            value={soKhach}
            onChange={(val) => setSoKhach(val ?? 1)}
            bordered={false}
            className="w-20 p-0 text-sm text-gray-500"
          />
        </div>

        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<SearchOutlined />}
          onClick={handleTimKiem}
          disabled={!viTriDaChon}
          className="bg-rose-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;