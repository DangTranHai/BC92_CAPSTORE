import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  EnvironmentOutlined,
  HomeOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const users = JSON.parse(localStorage.getItem("AUTH_USERS") || "[]");
  const locations = JSON.parse(localStorage.getItem("ADMIN_LOCATIONS") || "[]");
  const rooms = JSON.parse(localStorage.getItem("ADMIN_ROOMS") || "[]");
  const bookings = JSON.parse(localStorage.getItem("ADMIN_BOOKINGS") || "[]");

  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <Paragraph>
        Tổng quan hệ thống quản trị Airbnb Clone.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={users.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Vị trí"
              value={locations.length}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Phòng thuê"
              value={rooms.length}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Đặt phòng"
              value={bookings.length}
              prefix={<ScheduleOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;