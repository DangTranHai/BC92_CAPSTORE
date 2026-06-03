import { Button, Card, Form, Input, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { login } from "../../store/auth.slice";
import type { SignInRequest } from "../../types/auth.type";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const onFinish = async (values: SignInRequest) => {
    try {
      const data = await dispatch(login(values)).unwrap();

      const fixedUser =
        data.user.email?.toLowerCase() === "admin1@gmail.com"
          ? { ...data.user, role: "ADMIN" }
          : data.user;

      localStorage.setItem("AUTH_USER", JSON.stringify(fixedUser));

      message.success("Đăng nhập thành công");

      if (fixedUser.role?.toUpperCase() === "ADMIN") {
        window.location.href = "/admin";
        return;
      }

      window.location.href = "/";
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Đăng nhập thất bại";

      message.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header về trang chủ */}
      <header className="bg-black text-white shadow-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-white hover:text-rose-400"
          >
            <HomeOutlined />
            <span>airbnb</span>
          </Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <Card title="Đăng nhập" className="w-full max-w-md shadow-lg">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>

            <div className="mt-4 text-center">
              Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;