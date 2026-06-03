import { Button, Card, Form, Input, message, Radio } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { registerUser } from "../../store/auth.slice";
import type { SignUpRequest } from "../../types/auth.type";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const onFinish = async (values: SignUpRequest) => {
    try {
      await dispatch(registerUser(values)).unwrap();

      message.success("Đăng ký thành công, vui lòng đăng nhập");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Đăng ký thất bại";

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

      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8">
        <Card title="Đăng ký tài khoản" className="w-full max-w-md shadow-lg">
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ gender: true }}
          >
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>

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

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item label="Giới tính" name="gender">
              <Radio.Group>
                <Radio value={true}>Nam</Radio>
                <Radio value={false}>Nữ</Radio>
              </Radio.Group>
            </Form.Item>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng ký
            </Button>

            <div className="mt-4 text-center">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;