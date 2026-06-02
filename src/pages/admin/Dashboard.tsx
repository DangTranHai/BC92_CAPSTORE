import {
  EnvironmentOutlined,
  HomeOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Spin, Statistic, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../services/admin.service";
import { AUTH_KEY } from "../../constants/auth.constant";

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalLocations, setTotalLocations] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  const rawAuth = localStorage.getItem(AUTH_KEY);
  const auth = rawAuth ? JSON.parse(rawAuth) : null;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [users, locations, rooms, bookings] = await Promise.all([
          adminService.getUsers(),
          adminService.getLocations(),
          adminService.getRooms(),
          adminService.getBookings(),
        ]);

        setTotalUsers(users.length);
        setTotalLocations(locations.length);
        setTotalRooms(rooms.length);
        setTotalBookings(bookings.length);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải dữ liệu Dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Title level={3} className="mb-0">
          Dashboard
        </Title>
        <Paragraph className="  mb-0 text-gray-500">
          Xin chào {auth?.user?.name || "Admin"}, đây là trang tổng quan hệ
          thống quản trị Airbnb 
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card className="rounded-xl shadow-sm">
            <Statistic title="Người dùng" value={totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card className="rounded-xl shadow-sm">
            <Statistic title="Vị trí" value={totalLocations} prefix={<EnvironmentOutlined />} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card className="rounded-xl shadow-sm">
            <Statistic title="Phòng thuê" value={totalRooms} prefix={<HomeOutlined />} />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card className="rounded-xl shadow-sm">
            <Statistic title="Đặt phòng" value={totalBookings} prefix={<ScheduleOutlined />} />
          </Card>
        </Col>
      </Row>

      <div className="mt-10">
        <Title level={4}>Quản lý nhanh</Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={6}>
            <Link to="/admin/users">
              <Card hoverable className="rounded-xl text-center">
                <UserOutlined className="mb-3 text-3xl text-blue-500" />
                <h3 className="font-semibold">Quản lý người dùng</h3>
                <p className="text-gray-500">Thêm, sửa, xóa người dùng</p>
              </Card>
            </Link>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Link to="/admin/locations">
              <Card hoverable className="rounded-xl text-center">
                <EnvironmentOutlined className="mb-3 text-3xl text-green-500" />
                <h3 className="font-semibold">Quản lý vị trí</h3>
                <p className="text-gray-500">Quản lý địa điểm cho thuê</p>
              </Card>
            </Link>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Link to="/admin/rooms">
              <Card hoverable className="rounded-xl text-center">
                <HomeOutlined className="mb-3 text-3xl text-orange-500" />
                <h3 className="font-semibold">Quản lý phòng thuê</h3>
                <p className="text-gray-500">Quản lý thông tin phòng</p>
              </Card>
            </Link>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Link to="/admin/bookings">
              <Card hoverable className="rounded-xl text-center">
                <ScheduleOutlined className="mb-3 text-3xl text-purple-500" />
                <h3 className="font-semibold">Quản lý đặt phòng</h3>
                <p className="text-gray-500">Theo dõi lịch đặt phòng</p>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;