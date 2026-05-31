import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "../../services/api";

type Booking = {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
};

type BookingForm = {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
};

const initialForm: BookingForm = {
  id: 0,
  maPhong: 0,
  ngayDen: "",
  ngayDi: "",
  soLuongKhach: 1,
  maNguoiDung: 0,
};

export default function BookingManagement() {
  const [form] = Form.useForm<BookingForm>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [keywordUserId, setKeywordUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const getAllBookings = () => api.get("/api/dat-phong");

  const getBookingById = (id: number) => {
    return api.get(`/api/dat-phong/${id}`);
  };

  const getBookingsByUserId = (maNguoiDung: number) => {
    return api.get(`/api/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`);
  };

  const addBooking = (data: BookingForm) => {
    return api.post("/api/dat-phong", data);
  };

  const updateBooking = (id: number, data: BookingForm) => {
    return api.put(`/api/dat-phong/${id}`, data);
  };

  const deleteBooking = (id: number) => {
    return api.delete(`/api/dat-phong/${id}`);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      setBookings(res.data.content || []);
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không tải được danh sách thuê phòng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialForm);
    fetchBookings();
  }, []);

  const handleSubmit = async (values: BookingForm) => {
    try {
      const payload: BookingForm = {
        id: editingId || 0,
        maPhong: Number(values.maPhong),
        ngayDen: values.ngayDen,
        ngayDi: values.ngayDi,
        soLuongKhach: Number(values.soLuongKhach),
        maNguoiDung: Number(values.maNguoiDung),
      };

      if (editingId) {
        await updateBooking(editingId, payload);
        message.success("Cập nhật thuê phòng thành công");
      } else {
        await addBooking(payload);
        message.success("Thêm thuê phòng thành công");
      }

      handleReset();
      fetchBookings();
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
      const res = await getBookingById(id);
      const booking: Booking = res.data.content;

      setEditingId(booking.id);

      form.setFieldsValue({
        id: booking.id,
        maPhong: booking.maPhong,
        ngayDen: booking.ngayDen?.slice(0, 10) || "",
        ngayDi: booking.ngayDi?.slice(0, 10) || "",
        soLuongKhach: booking.soLuongKhach,
        maNguoiDung: booking.maNguoiDung,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      message.error("Không lấy được chi tiết thuê phòng");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBooking(id);
      message.success("Xóa thuê phòng thành công");
      fetchBookings();
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Xóa thuê phòng thất bại"
      );
    }
  };

  const handleSearchByUser = async () => {
    if (!keywordUserId.trim()) {
      fetchBookings();
      return;
    }

    try {
      setLoading(true);
      const res = await getBookingsByUserId(Number(keywordUserId));
      setBookings(res.data.content || []);
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không tìm thấy dữ liệu thuê phòng"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setKeywordUserId("");
    fetchBookings();
  };

  const handleReset = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue(initialForm);
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Mã phòng",
      dataIndex: "maPhong",
    },
    {
      title: "Mã người dùng",
      dataIndex: "maNguoiDung",
    },
    {
      title: "Ngày đến",
      dataIndex: "ngayDen",
      render: (date: string) => date?.slice(0, 10) || "Chưa có",
    },
    {
      title: "Ngày đi",
      dataIndex: "ngayDi",
      render: (date: string) => date?.slice(0, 10) || "Chưa có",
    },
    {
      title: "Số khách",
      dataIndex: "soLuongKhach",
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
            title="Bạn có chắc muốn xóa lượt thuê phòng này?"
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
    <Card title="Quản lý thuê phòng">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialForm}
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Mã phòng"
            name="maPhong"
            rules={[{ required: true, message: "Vui lòng nhập mã phòng" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item
            label="Mã người dùng"
            name="maNguoiDung"
            rules={[{ required: true, message: "Vui lòng nhập mã người dùng" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item
            label="Ngày đến"
            name="ngayDen"
            rules={[{ required: true, message: "Vui lòng chọn ngày đến" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Ngày đi"
            name="ngayDi"
            rules={[{ required: true, message: "Vui lòng chọn ngày đi" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Số lượng khách"
            name="soLuongKhach"
            rules={[{ required: true, message: "Vui lòng nhập số khách" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
        </div>

        <Space>
          <Button type="primary" htmlType="submit">
            {editingId ? "Cập nhật thuê phòng" : "Thêm thuê phòng"}
          </Button>

          <Button onClick={handleReset}>Làm mới</Button>
        </Space>
      </Form>

      <div className="flex justify-between items-center my-6">
        <Space>
          <Input
            placeholder="Tìm theo mã người dùng"
            value={keywordUserId}
            onChange={(e) => setKeywordUserId(e.target.value)}
            onPressEnter={handleSearchByUser}
            style={{ width: 260 }}
            allowClear
          />

          <Button type="primary" onClick={handleSearchByUser}>
            Tìm kiếm
          </Button>

          <Button onClick={handleClearSearch}>Xóa tìm kiếm</Button>
        </Space>

        <b>Tổng: {bookings.length} lượt thuê</b>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={bookings}
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