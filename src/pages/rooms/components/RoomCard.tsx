import { HeartOutlined } from "@ant-design/icons";
import type{ Phong } from "../../../types/room.type";
import { useNavigate } from "react-router-dom";

interface Props {
  phong: Phong;
}

const RoomCard = ({ phong }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex cursor-pointer gap-4 rounded-2xl p-4 hover:bg-gray-50 border border-gray-100"
      onClick={() => navigate(`/rooms/detail/${phong.id}`)}
    >
      {/* Ảnh */}
      <div className="relative h-48 w-64 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={phong.hinhAnh}
          alt={phong.tenPhong}
          className="h-full w-full object-cover"
        />
        <button
          className="absolute right-3 top-3"
          onClick={(e) => e.stopPropagation()}
        >
          <HeartOutlined className="text-xl text-white drop-shadow" />
        </button>
      </div>

      {/* Thông tin */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <p className="text-sm text-gray-500">Toàn bộ căn hộ</p>
          <h3 className="mt-1 text-lg font-semibold line-clamp-1">
            {phong.tenPhong}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{phong.moTa}</p>

          <div className="mt-2 flex flex-wrap gap-x-3 text-sm text-gray-500">
            <span>{phong.khach} khách</span>
            <span>·</span>
            <span>{phong.phongNgu} phòng ngủ</span>
            <span>·</span>
            <span>{phong.giuong} giường</span>
            <span>·</span>
            <span>{phong.phongTam} phòng tắm</span>
          </div>

          {/* Tiện ích */}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            {phong.wifi && <span>Wifi</span>}
            {phong.bep && <span>· Bếp</span>}
            {phong.dieuHoa && <span>· Điều hòa nhiệt độ</span>}
            {phong.mayGiat && <span>· Máy giặt</span>}
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold">${phong.giaTien}</span>
          <span className="text-sm text-gray-500"> / tháng</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;