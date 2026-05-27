import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  GlobalOutlined,
  HomeOutlined,
  MenuOutlined,
  UserOutlined,
  WifiOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import {
  MdKitchen, MdAcUnit, MdLocalLaundryService,
  MdTv, MdPool, MdLocalParking, MdStar
} from "react-icons/md";
import type{ Phong } from "../../types/room.type";
import { api } from "../../services/api";
import RoomGallery from "./components/RoomGallery";
import BookingForm from "./components/BookingForm";
import CommentSection from "./components/CommentSection";
import { message } from "antd";
import type{ BinhLuan } from "../../types/booking.type.ts";
import { layBinhLuanTheoPhong } from "../../services/comment.service.ts";
import type{ ViTri } from "../../types/location.type.ts";
import { layDanhSachViTri } from "../../services/location.service.ts";

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [phong, setPhong] = useState<Phong | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [binhLuans, setBinhLuans] = useState<BinhLuan[]>([]);
  const [daLuu, setDaLuu] = useState<boolean>(false);
  const [tenViTri, setTenViTri] = useState<string>("");

  useEffect(() => {
    const fetchPhong = async () => {
      try {
        const response = await api.get(`/api/phong-thue/${id}`);
        setPhong(response.data.content);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPhong();
  }, [id]);

  useEffect(() => {
    const fetchBinhLuan = async () => {
      try {
        const data = await layBinhLuanTheoPhong(Number(id));
        setBinhLuans(data);
        
      } catch (error) {
        console.error(error);
      }
    };

    const fetchViTri = async ( maViTri: Number ) => {
      try {
        const data = await layDanhSachViTri();
        const viTri = data.find((vt: ViTri) => vt.id === maViTri);
        if(viTri) setTenViTri(`${viTri.tenViTri}, ${viTri.tinhThanh}`);
      } catch (error) {
        console.error(error);
      }
    };

    if(id) {
      fetchBinhLuan();
    };

    if (phong?.maViTri) {
      fetchViTri(phong.maViTri);
    };

  }, [id, phong]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-400">Đang tải...</p>
    </div>
  );

  if (!phong) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-400">Không tìm thấy phòng.</p>
    </div>
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("Đã sao chép link!");
  };
  const handleYeuThich = () => {
    setDaLuu(!daLuu);
    message.success(daLuu ? "Đã bỏ lưu!" : "Đã lưu vào yêu thích!");
  };

  const tienNghi = [
    { icon: <MdKitchen />, label: "Bếp", value: phong.bep },
    { icon: <WifiOutlined />, label: "Wifi", value: phong.wifi },
    { icon: <MdAcUnit />, label: "Điều hòa nhiệt độ", value: phong.dieuHoa },
    { icon: <MdLocalLaundryService />, label: "Máy giặt", value: phong.mayGiat },
    { icon: <MdTv />, label: "Tivi", value: phong.tivi },
    { icon: <MdPool />, label: "Hồ bơi", value: phong.hoBoi },
    { icon: <MdLocalParking />, label: "Đỗ xe", value: phong.doXe },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-rose-500">
            <HomeOutlined />
            <span>airbnb</span>
          </Link>

          <nav className="hidden items-center gap-10 text-sm font-medium md:flex">
            <a className="text-white hover:text-rose-400">Nơi ở</a>
            <a className="text-white hover:text-rose-400">Trải nghiệm</a>
            <a className="text-white hover:text-rose-400">
              Trải nghiệm trực tuyến
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/register" className="hidden text-sm font-semibold text-black md:block">
              Đăng ký
            </Link>

            <Link to="/login" className="hidden text-sm font-semibold text-black md:block">
              Đăng nhập
            </Link>

            <GlobalOutlined className="hidden text-lg md:block" />

            <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 text-black">
              <MenuOutlined />
              <UserOutlined />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Tên phòng */}
        <h1 className="mb-2 text-3xl font-bold">{phong.tenPhong}</h1>
        {/* Dòng ghi chú dưới */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {/* Left */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="flex items-center gap-1 font-semibold text-gray-400">
              <MdStar/> {binhLuans.length > 0 
              ? (binhLuans.reduce((acc, bl) => acc + bl.saoBinhLuan, 0) / binhLuans.length).toFixed(2)
               : "Chưa có"}
            </span>
            {binhLuans.length > 0 && (
              <>
                <span className="cursor-pointer text-gray-400 fw-light underline">({binhLuans.length} đánh giá)</span>
              </>
            )}

            <span>·</span>
            <span className="cursor-pointer text-gray-400 fw-light underline">{tenViTri}</span>
          </div>
          {/* Right */}
          <div className="flex items-center gap-1">
            <button onClick={handleShare} className="flex items-center gap-1 rounded-lg px-3 text-sm underline hover:bg-gray-200 fw-lighter">
              <ShareAltOutlined /> Chia sẻ
            </button>

            <button onClick={handleYeuThich} className="flex items-center gap-1 rounded-lg px-3 text-sm underline hover:bg-gray-200 fw-lighter">
              {daLuu ? <HeartFilled className="text-rose-500"/> : <HeartOutlined/>}
              {daLuu ? "Đã Lưu" : "Lưu"}
            </button>
          </div>

        </div>

        {/* Gallery */}
        <RoomGallery hinhAnh={phong.hinhAnh} tenPhong={phong.tenPhong} />

        {/* Nội dung chính */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Cột trái */}
          <div className="lg:col-span-2">
            {/* Thông tin cơ bản */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold">Toàn bộ căn hộ</h2>
              <p className="mt-1 text-gray-500">
                {phong.khach} khách · {phong.phongNgu} phòng ngủ ·{" "}
                {phong.giuong} giường · {phong.phongTam} phòng tắm
              </p>
            </div>

            {/* Mô tả */}
            <div className="border-b py-6">
              <p className="text-gray-700 leading-relaxed">{phong.moTa}</p>
            </div>

            {/* Tiện nghi */}
            <div className="py-6">
              <h2 className="mb-4 text-xl font-semibold">Tiện nghi</h2>
              <div className="grid grid-cols-2 gap-3">
                {tienNghi
                  .filter((t) => t.value)
                  .map((t) => (
                    <div key={t.label} className="flex items-center gap-3 text-sm">
                      <span className="text-xl">{t.icon}</span>
                      <span>{t.label}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Bình luận */}
            <CommentSection maPhong={phong.id} />
          </div>

          {/* Cột phải - Form đặt phòng */}
          <div>
            <BookingForm phong={phong} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;