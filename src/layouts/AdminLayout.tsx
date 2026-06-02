import { Button, Layout, Menu } from "antd";
import {
  DashboardOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { logout } from "../store/auth.slice";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const selectedKey = location.pathname.split("/")[2] || "dashboard";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout className="min-h-screen w-full">
      <Sider width={250} className="min-h-screen">
        <div className="h-16 flex items-center justify-center text-white text-xl font-bold">
          AIRBNB ADMIN
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            if (key === "dashboard") navigate("/admin");
            if (key === "users") navigate("/admin/users");
            if (key === "locations") navigate("/admin/locations");
            if (key === "rooms") navigate("/admin/rooms");
            if (key === "bookings") navigate("/admin/bookings");
          }}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "users",
              icon: <UserOutlined />,
              label: "Quản lý người dùng",
            },
            {
              key: "locations",
              icon: <EnvironmentOutlined />,
              label: "Quản lý vị trí",
            },
            {
              key: "rooms",
              icon: <HomeOutlined />,
              label: "Quản lý phòng thuê",
            },
            {
              key: "bookings",
              icon: <ScheduleOutlined />,
              label: "Quản lý đặt phòng",
            },
          ]}
        />
      </Sider>

      <Layout className="min-h-screen">
        <Header className="bg-white flex justify-between items-center px-6 shadow-sm">
          <h2 className="m-0 text-xl font-semibold text-white">Trang quản trị</h2>

          <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Header>

        <Content className="flex-1 m-6 p-6 bg-white rounded-xl shadow-sm">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;