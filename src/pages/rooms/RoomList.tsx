import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type{ Phong } from "../../types/room.type";
import { layPhongTheoViTri } from "../../services/room.service";
import RoomCard from "./components/RoomCard";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const footerColumns = [
  {
    title: "GIỚI THIỆU",
    items: [
      "Phương thức hoạt động của Airbnb",
      "Trang tin tức",
      "Nhà đầu tư",
      "Airbnb Plus",
      "Airbnb Luxe",
      "HotelTonight",
      "Airbnb for Work",
    ],
  },
  {
    title: "CỘNG ĐỒNG",
    items: [
      "Sự đa dạng và cảm giác thân thuộc",
      "Tiện nghi phù hợp cho người khuyết tật",
      "Đối tác liên kết Airbnb",
      "Chỗ ở cho tuyến đầu",
      "Lượt giới thiệu của khách",
      "Airbnb.org",
    ],
  },
  {
    title: "ĐÓN TIẾP KHÁCH",
    items: [
      "Cho thuê nhà",
      "Tổ chức Trải nghiệm trực tuyến",
      "Tổ chức trải nghiệm",
      "Đón tiếp khách có trách nhiệm",
      "Trung tâm tài nguyên",
      "Trung tâm cộng đồng",
    ],
  },
  {
    title: "HỖ TRỢ",
    items: [
      "Biện pháp ứng phó với đại dịch COVID-19",
      "Trung tâm trợ giúp",
      "Các tùy chọn hủy",
      "Hỗ trợ khu dân cư",
      "Tin cậy và an toàn",
    ],
  },
];

const RoomList = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [danhSachPhong, setDanhSachPhong] = useState<Phong[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPhong = async () => {
      try {
        setLoading(true);
        const data = await layPhongTheoViTri(Number(locationId));
        setDanhSachPhong(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    if (locationId) fetchPhong();
  }, [locationId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-rose-500">
            <HomeOutlined />
            <span>airbnb</span>
          </Link>
          <p className="text-sm text-gray-500">
            {danhSachPhong.length} chỗ ở được tìm thấy
          </p>
        </div>
      </header>

      {/* Nội dung */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold">
          Chỗ ở tại khu vực bạn đã chọn
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Hơn {danhSachPhong.length} chỗ ở
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-gray-400">Đang tải...</p>
          </div>
        ) : danhSachPhong.length === 0 ? (
          <div className="flex justify-center py-20">
            <p className="text-gray-400">Không tìm thấy phòng nào.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {danhSachPhong.map((phong) => (
              <RoomCard key={phong.id} phong={phong} />
            ))}
          </div>
        )}
      </div>
      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 text-sm font-bold">{column.title}</h4>

                <ul className="space-y-3">
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t pt-6 text-sm text-gray-600 md:flex-row">
            <p>© 2026 Airbnb Clone, BC92 CAPSTORE. All rights reserved.</p>

            <div className="flex items-center gap-5">
              <span>Tiếng Việt</span>
              <span>USD</span>
              <span>Facebook</span>
              <span>Twitter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RoomList;