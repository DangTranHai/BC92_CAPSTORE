import { Button, Form, Input, Modal, Popconfirm, Radio, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import type { StoredUser } from "../../types/auth.type";

const USERS_KEY = "AUTH_USERS";

const UserManagement = () => {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StoredUser | null>(null);
  const [form] = Form.useForm();

  const getUsers = () => {
    const rawUsers = localStorage.getItem(USERS_KEY);
    const data: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];
    setUsers(data);
  };

  const saveUsers = (nextUsers: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    setUsers(nextUsers);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({
      gender: true,
      role: "USER",
      avatar: "",
    });
    setOpen(true);
  };

  const handleOpenEdit = (user: StoredUser) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (editingUser) {
      const nextUsers = users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              ...values,
            }
          : user
      );

      saveUsers(nextUsers);
      message.success("Cập nhật người dùng thành công");
      setOpen(false);
      return;
    }

    const existedEmail = users.some(
      (user) => user.email.toLowerCase() === values.email.toLowerCase()
    );

    if (existedEmail) {
      message.error("Email đã tồn tại");
      return;
    }

    const newUser: StoredUser = {
      id: Date.now(),
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      birthday: values.birthday,
      avatar: values.avatar || "",
      gender: values.gender,
      role: values.role,
    };

    saveUsers([...users, newUser]);
    message.success("Thêm người dùng thành công");
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    const nextUsers = users.filter((user) => user.id !== id);
    saveUsers(nextUsers);
    message.success("Xóa người dùng thành công");
  };

  const columns: ColumnsType<StoredUser> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
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
        role === "ADMIN" ? <Tag color="red">ADMIN</Tag> : <Tag color="blue">USER</Tag>,
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleOpenEdit(record)}>
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
          <p className="text-gray-500">
            Thêm, sửa, xóa và phân quyền người dùng.
          </p>
        </div>

        <Button type="primary" onClick={handleOpenCreate}>
          Thêm người dùng
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingUser ? "Cập nhật người dùng" : "Thêm người dùng"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText={editingUser ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="birthday"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Avatar" name="avatar">
            <Input />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Radio.Group>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Vai trò" name="role">
            <Radio.Group>
              <Radio value="USER">USER</Radio>
              <Radio value="ADMIN">ADMIN</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;