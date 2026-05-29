import {
  GlobalOutlined,
  HomeOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth.slice.ts";
import type { AppDispatch, RootState } from "../../store/index.ts";
import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import { layViTriPhanTrang } from "../../services/location.service";
import type { ViTri } from "../../types/location.type";

const nearbyLocations = [
  {
    name: "Thành phố Hồ Chí Minh",
    time: "15 phút lái xe",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Cần Thơ",
    time: "3 giờ lái xe",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Nha Trang",
    time: "5.5 giờ lái xe",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Phú Quốc",
    time: "5 giờ lái xe",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Thành phố Tuy Hòa",
    time: "7.5 giờ lái xe",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Thành phố Biên Hòa",
    time: "45 phút lái xe",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Thị xã Thuận An",
    time: "30 phút lái xe",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Phan Rang - Tháp Chàm",
    time: "5 giờ lái xe",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300&auto=format&fit=crop",
  },
];

const travelTypes = [
  {
    title: "Toàn bộ nhà",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=500&auto=format&fit=crop",
  },
  {
    title: "Chỗ ở độc đáo",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=500&auto=format&fit=crop",
  },
  {
    title: "Trang trại và thiên nhiên",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=500&auto=format&fit=crop",
  },
  {
    title: "Cho phép mang theo thú cưng",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=500&auto=format&fit=crop",
  },
];

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

const Home = () => {
  const [nearbyLocations, setNearbyLocations] = useState<ViTri[]>([]);

  useEffect(() => {
    const fetchViTri = async () => {
      try {
        const data = await layViTriPhanTrang(1, 8);
        setNearbyLocations(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchViTri();
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data: authData } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 bg-black text-white shadow-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-white"
          >
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
            {authData ? (
              <>
                <Link to="/profile" className="hidden text-sm font-semibold text-white hover:text-rose-400 md:block">
                  Xin chào,{authData.user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden text-sm font-semibold text-white hover:text-rose-400 md:block"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="hidden text-sm font-semibold text-white hover:text-rose-400 md:block"
                >
                  Đăng ký
                </Link>
                <Link
                  to="/login"
                  className="hidden text-sm font-semibold text-white hover:text-rose-400 md:block"
                >
                  Đăng nhập
                </Link>
              </>
            )}

            <GlobalOutlined className="hidden text-lg md:block" />

            <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 text-black">
              <Link to="/profile" className="hover:text-rose-400"
              >
                <MenuOutlined />
                <UserOutlined />
              </Link>

            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-black pb-16">
        <div className="mx-auto max-w-7xl px-6 pt-8">
          <SearchBar />

          <div className="relative overflow-hidden rounded-b-3xl">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop"
              alt="Airbnb hero"
              className=" w-full object-cover opacity-90"
            />

            <div className="absolute inset-0 from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-12 left-1/2 w-full -translate-x-1/2 px-6 text-center text-white">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                Nhờ có Host, mọi điều đều có thể
              </h1>
              <p className="mx-auto max-w-2xl text-base text-gray-200 md:text-lg">
                Tìm kiếm nơi ở, trải nghiệm và những điểm đến đáng nhớ cho
                chuyến đi tiếp theo của bạn.
              </p>

              {!authData && (
                <div className="mt-8 flex justify-center gap-4">
                  <Link to="/login">
                    <Button type="primary" size="large" className="bg-rose-500">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="large">Đăng ký tài khoản</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-14">
        <section>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Khám phá những điểm đến gần đây
              </h2>
              <p className="mt-2 text-gray-500">
                Gợi ý các địa điểm phổ biến cho chuyến đi của bạn.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {nearbyLocations.map((item) => (
              <div
                key={item.id}
                className="flex cursor-pointer items-center gap-4 rounded-2xl p-3 transition hover:bg-gray-100"
              >
                <img
                  src={item.hinhAnh}
                  alt={item.tenViTri}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold">{item.tenViTri}</h3>
                  <p className="text-sm text-gray-500">{item.tinhThanh}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-3xl font-bold">Ở bất cứ đâu</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {travelTypes.map((item) => (
              <Card
                key={item.title}
                hoverable
                className="overflow-hidden rounded-2xl border-none shadow-sm"
                cover={
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-56 object-cover"
                  />
                }
              >
                <h3 className="text-base font-semibold">{item.title}</h3>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-3xl bg-black text-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-14">
              <h2 className="text-4xl font-bold leading-tight">
                Trở thành người đón tiếp khách
              </h2>
              <p className="mt-4 text-gray-300">
                Chia sẻ không gian của bạn, kết nối với khách du lịch và quản lý
                mọi thứ dễ dàng trên hệ thống.
              </p>

              <Link to="/login">
                <Button size="large" className="mt-8">
                  Vào trang quản trị
                </Button>
              </Link>
            </div>

            <img
              src="https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1000&auto=format&fit=crop"
              alt="Host"
              className="h-full  w-full object-cover"
            />
          </div>
        </section>
      </main>

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

export default Home;
