import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "../../services/api";

type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  birthday: string;
  avatar?: string;
  gender: boolean;
  role: "USER" | "ADMIN";
};

type UserForm = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: "USER" | "ADMIN";
};

const initialForm: UserForm = {
  id: 0,
  name: "",
  email: "",
  password: "",
  phone: "",
  birthday: "",
  gender: true,
  role: "USER",
};

export default function UserManagement() {
  const [form] = Form.useForm<UserForm>();

  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (search = keyword) => {
    try {
      setLoading(true);

      const res = await api.get("/api/users/phan-trang-tim-kiem", {
        params: {
          pageIndex: 1,
          pageSize: 100,
          keyword: search.trim(),
        },
      });

      const content = res.data.content;
      const data = Array.isArray(content) ? content : content?.data || [];

      setUsers(data);
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không tải được danh sách người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialForm);
    fetchUsers("");
  }, []);

  const handleSubmit = async (values: UserForm) => {
    try {
      const payload: any = {
        id: editingId || 0,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || "",
        birthday: values.birthday || "",
        gender: values.gender,
        role: values.role,
      };

      if (values.password?.trim()) {
        payload.password = values.password.trim();
      }

      if (editingId) {
        await api.put(`/api/users/${editingId}`, payload);
        message.success("Cập nhật người dùng thành công");
      } else {
        await api.post("/api/users", {
          ...payload,
          password: values.password.trim(),
        });
        message.success("Thêm người dùng thành công");
      }

      handleReset();
      fetchUsers(keyword);
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Thao tác thất bại"
      );
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await api.get(`/api/users/${id}`);
      const user: User = res.data.content;

      setEditingId(user.id);

      form.setFieldsValue({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        birthday: user.birthday?.slice(0, 10) || "",
        gender: user.gender,
        role: user.role || "USER",
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không lấy được chi tiết người dùng"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete("/api/users", {
        params: { id },
      });

      message.success("Xóa người dùng thành công");
      fetchUsers(keyword);
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Xóa người dùng thất bại"
      );
    }
  };

  const handleReset = () => {
    setEditingId(null);
    form.resetFields();

    setTimeout(() => {
      form.setFieldsValue({
        id: 0,
        name: "",
        email: "",
        password: "",
        phone: "",
        birthday: "",
        gender: true,
        role: "USER",
      });
    }, 0);
  };

  const handleSearch = () => {
    fetchUsers(keyword);
  };

  const handleClearSearch = () => {
    setKeyword("");
    fetchUsers("");
  };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      render: (text: string) => text || "Chưa có",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text: string) => text || "Chưa có",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      render: (text: string) => text || "Chưa có",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      render: (text: string) => text?.slice(0, 10) || "Chưa có",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (gender: boolean) => (gender ? "Nam" : "Nữ"),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role: string) =>
        role === "ADMIN" ? (
          <Tag color="red">ADMIN</Tag>
        ) : (
          <Tag color="blue">USER</Tag>
        ),
    },
    {
      title: "Hành động",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý người dùng">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialForm}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/* Chặn trình duyệt tự động điền email/mật khẩu đăng nhập cũ */}
        <input
          type="text"
          name="fake_username"
          autoComplete="username"
          style={{ display: "none" }}
        />

        <input
          type="password"
          name="fake_password"
          autoComplete="current-password"
          style={{ display: "none" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên",
              },
            ]}
          >
            <Input
              placeholder="Nhập họ tên"
              autoComplete="off"
              name="new-user-name"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email",
              },
              {
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input
              placeholder="Nhập email"
              autoComplete="new-email"
              name="new-user-email"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={
              editingId
                ? []
                : [
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu",
                    },
                  ]
            }
          >
            <Input.Password
              placeholder={
                editingId
                  ? "Không nhập nếu không muốn đổi mật khẩu"
                  : "Nhập mật khẩu"
              }
              autoComplete="new-password"
              name="new-user-password"
            />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input
              placeholder="Nhập số điện thoại"
              autoComplete="off"
              name="new-user-phone"
            />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="birthday">
            <Input type="date" autoComplete="off" name="new-user-birthday" />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Select
              options={[
                {
                  label: "Nam",
                  value: true,
                },
                {
                  label: "Nữ",
                  value: false,
                },
              ]}
            />
          </Form.Item>

          <Form.Item label="Vai trò" name="role">
            <Select
              options={[
                {
                  label: "USER",
                  value: "USER",
                },
                {
                  label: "ADMIN",
                  value: "ADMIN",
                },
              ]}
            />
          </Form.Item>
        </div>

        <Space>
          <Button type="primary" htmlType="submit">
            {editingId ? "Cập nhật người dùng" : "Thêm người dùng"}
          </Button>

          <Button onClick={handleReset}>Làm mới</Button>
        </Space>
      </Form>

      <div className="flex justify-between items-center my-6">
        <Space>
          <Input
            placeholder="Tìm kiếm người dùng"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
            allowClear
          />

          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>

          <Button onClick={handleClearSearch}>Xóa tìm kiếm</Button>
        </Space>

        <b>Tổng: {users.length} người dùng</b>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
    </Card>
  );
}