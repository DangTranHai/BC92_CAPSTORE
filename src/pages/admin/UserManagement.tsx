import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  message,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { userService } from "../../services/userService";
import type { User, UserForm } from "../../services/userService";

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
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalRow, setTotalRow] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (
    page = pageIndex,
    size = pageSize,
    search = keyword
  ) => {
    try {
      setLoading(true);

      const res = await userService.getUsersPagination(
        page,
        size,
        search.trim()
      );

      const content = res.data.content;

      const listUser: User[] = Array.isArray(content)
        ? content
        : content?.data || [];

      setUsers(listUser);

      setTotalRow(
        Array.isArray(content)
          ? content.length
          : content?.totalRow || listUser.length
      );
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không tải được danh sách user"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialForm);
    fetchUsers(1, 100, "");
  }, []);

  const handleSubmit = async (values: UserForm) => {
    try {
      const payload: UserForm = {
        ...values,
        email: values.email.trim(),
        password: values.password?.trim() || "",
        name: values.name.trim(),
        phone: values.phone?.trim() || "",
      };

      if (editingId) {
        await userService.updateUser(editingId, {
          ...payload,
          id: editingId,
        });

        message.success("Cập nhật user thành công");
      } else {
        await userService.addUser({
          ...payload,
          id: 0,
        });

        message.success("Thêm user thành công");
      }

      handleReset();
      fetchUsers(pageIndex, pageSize, keyword);
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
      const res = await userService.getUserById(id);
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
        role: user.role,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      message.error("Không lấy được chi tiết user");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      message.success("Xóa user thành công");

      const nextUsers = users.filter((user) => user.id !== id);

      if (nextUsers.length === 0 && pageIndex > 1) {
        const previousPage = pageIndex - 1;
        setPageIndex(previousPage);
        fetchUsers(previousPage, pageSize, keyword);
      } else {
        fetchUsers(pageIndex, pageSize, keyword);
      }
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Xóa user thất bại"
      );
    }
  };

  const handleSearch = () => {
    const searchText = keyword.trim();

    setPageIndex(1);
    fetchUsers(1, pageSize, searchText);
  };

  const handleClearSearch = () => {
    setKeyword("");
    setPageIndex(1);
    fetchUsers(1, pageSize, "");
  };

  const handleReset = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue(initialForm);
  };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 90,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      render: (name: string) => name || "Chưa có",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email: string) => email || "Chưa có",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      render: (phone: string) => phone || "Chưa có",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      render: (birthday: string) => birthday?.slice(0, 10) || "Chưa có",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (gender: boolean) => (gender ? "Nam" : "Nữ"),
    },
    {
      title: "Role",
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
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record.id)}>
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa user này?"
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
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Nhập họ tên" autoComplete="off" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              placeholder="Nhập email"
              autoComplete="new-email"
              value={undefined}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={
              editingId
                ? []
                : [{ required: true, message: "Vui lòng nhập mật khẩu" }]
            }
          >
            <Input.Password
              placeholder={
                editingId
                  ? "Không nhập nếu không muốn đổi mật khẩu"
                  : "Nhập mật khẩu"
              }
              autoComplete="new-password"
              value={undefined}
            />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="Nhập số điện thoại" autoComplete="off" />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="birthday">
            <Input type="date" autoComplete="off" />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Select
              options={[
                { label: "Nam", value: true },
                { label: "Nữ", value: false },
              ]}
            />
          </Form.Item>

          <Form.Item label="Vai trò" name="role">
            <Select
              options={[
                { label: "USER", value: "USER" },
                { label: "ADMIN", value: "ADMIN" },
              ]}
            />
          </Form.Item>
        </div>

        <Space>
          <Button type="primary" htmlType="submit">
            {editingId ? "Cập nhật user" : "Thêm user"}
          </Button>

          <Button onClick={handleReset}>Làm mới</Button>
        </Space>
      </Form>

      <div className="flex justify-between items-center my-6">
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên hoặc email"
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

        <b>Tổng: {totalRow} user</b>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: pageIndex,
          pageSize,
          total: totalRow,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          onChange: (page, size) => {
            setPageIndex(page);
            setPageSize(size);
            fetchUsers(page, size, keyword);
          },
        }}
      />
    </Card>
  );
}