import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Radio, DatePicker, message, Modal } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { RootState, AppDispatch } from "../../store";
import { logout } from "../../store/auth.slice";
import { userService } from "../../services/user.service";
import { layDatPhongTheoNguoiDung } from "../../services/booking.service";
import type { User } from "../../types/auth.type";
import type { DatPhong } from "../../types/booking.type";
import type { Phong } from "../../types/room.type";
import { api } from "../../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { data: authData } = useSelector((state: RootState) => state.auth);

  const [user, setUser] = useState<User | null>(null);
  const [danhSachDatPhong, setDanhSachDatPhong] = useState<DatPhong[]>([]);
  const [danhSachPhong, setDanhSachPhong] = useState<Phong[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!authData) {
      navigate("/login");
    }
  }, [authData]);

  // Fetch thông tin user
  useEffect(() => {
    const fetchUser = async () => {
      if (!authData) return;
      try {
        const data = await userService.getById(authData.user.id);
        setUser(data);
        form.setFieldsValue({
          ...data,
          birthday: data.birthday ? dayjs(data.birthday) : null,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [authData]);

  // Fetch danh sách đặt phòng + thông tin từng phòng
  useEffect(() => {
    const fetchDatPhong = async () => {
      if (!authData) return;
      try {
        const data = await layDatPhongTheoNguoiDung(authData.user.id);
        setDanhSachDatPhong(data);

        // Lấy thông tin chi tiết từng phòng
        const phongList = await Promise.all(
          data.map(async (dp) => {
            const res = await api.get(`/api/phong-thue/${dp.maPhong}`);
            return res.data.content;
          })
        );
        setDanhSachPhong(phongList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDatPhong();
  }, [authData]);

  // Cập nhật thông tin
  const handleUpdate = async (values: any) => {
    if (!authData) return;
    try {
      setLoading(true);
      await userService.update(authData.user.id, {
        ...values,
        birthday: values.birthday
          ? dayjs(values.birthday).format("YYYY-MM-DD")
          : "",
      });
      message.success("Cập nhật thành công!");
      setIsModalOpen(false);
    } catch (error) {
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!authData || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-rose-500">
            <HomeOutlined />
            <span>airbnb</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Cột trái */}
          <div className="space-y-4">
            {/* Card avatar */}
            <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                  <UserOutlined className="text-4xl text-gray-400" />
                </div>
              )}
              <button className="mt-3 text-sm font-semibold underline hover:text-gray-500">
                Cập nhật ảnh
              </button>
            </div>

            {/* Card xác minh */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircleOutlined className="text-gray-700" />
                <span>Xác minh danh tính</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Xác thực danh tính của bạn với huy hiệu xác minh danh tính.
              </p>
              <Button className="mt-4 w-full" size="large">
                Nhận huy hiệu
              </Button>

              <div className="mt-4 border-t pt-4">
                <p className="font-semibold">Du đã xác nhận</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleOutlined className="text-gray-500" />
                  <span>Địa chỉ email</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="lg:col-span-2">
            {/* Tiêu đề */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Xin chào, tôi là {user.name}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Bắt đầu tham gia vào {dayjs(user.birthday).format("YYYY")}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 flex items-center gap-1 text-sm font-semibold underline hover:text-gray-500"
              >
                <EditOutlined />
                Chỉnh sửa hồ sơ
              </button>
            </div>

            {/* Danh sách phòng đã thuê */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">Phòng đã thuê</h2>

              {danhSachPhong.length === 0 ? (
                <p className="text-gray-400">Bạn chưa đặt phòng nào.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {danhSachPhong.map((phong, index) => (
                    <div
                      key={danhSachDatPhong[index]?.id}
                      onClick={() => navigate(`/rooms/detail/${phong.id}`)}
                      className="flex cursor-pointer gap-4 rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md"
                    >
                      <img
                        src={phong.hinhAnh}
                        alt={phong.tenPhong}
                        className="h-32 w-48 flex-shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <p className="text-sm text-gray-500">Toàn bộ căn hộ</p>
                          <h3 className="mt-1 font-semibold line-clamp-1">
                            {phong.tenPhong}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {phong.khach} khách · {phong.phongNgu} phòng ngủ ·{" "}
                            {phong.giuong} giường · {phong.phongTam} phòng tắm
                          </p>
                          <div className="mt-1 text-xs text-gray-400">
                            {phong.wifi && "Wifi · "}
                            {phong.bep && "Bếp · "}
                            {phong.dieuHoa && "Điều hòa · "}
                            {phong.mayGiat && "Máy giặt"}
                          </div>
                        </div>
                        <p className="font-bold text-gray-800">
                          ${phong.giaTien}
                          <span className="text-sm font-normal text-gray-500"> / tháng</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa hồ sơ */}
      <Modal
        title="Chỉnh sửa hồ sơ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Họ tên" name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="birthday">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Radio.Group>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}
              className="bg-rose-500">
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;