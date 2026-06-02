import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "../../services/api";

type Room = {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh: string;
};

const initialForm: Room = {
  id: 0,
  tenPhong: "",
  khach: 1,
  phongNgu: 1,
  giuong: 1,
  phongTam: 1,
  moTa: "",
  giaTien: 0,
  mayGiat: false,
  banLa: false,
  tivi: false,
  dieuHoa: false,
  wifi: false,
  bep: false,
  doXe: false,
  hoBoi: false,
  banUi: false,
  maViTri: 1,
  hinhAnh: "",
};

export default function RoomManagement() {
  const [form] = Form.useForm<Room>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRooms = async (search = keyword) => {
    try {
      setLoading(true);

      if (search.trim()) {
        const res = await api.get("/api/phong-thue/phan-trang-tim-kiem", {
          params: {
            pageIndex: 1,
            pageSize: 100,
            keyword: search.trim(),
          },
        });

        setRooms(res.data.content?.data || []);
      } else {
        const res = await api.get("/api/phong-thue");
        setRooms(res.data.content || []);
      }
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không tải được danh sách phòng thuê"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialForm);
    fetchRooms("");
  }, []);

  const handleSubmit = async (values: Room) => {
    try {
      const payload: Room = {
        ...values,
        id: editingId || 0,
        tenPhong: values.tenPhong.trim(),
        khach: Number(values.khach),
        phongNgu: Number(values.phongNgu),
        giuong: Number(values.giuong),
        phongTam: Number(values.phongTam),
        giaTien: Number(values.giaTien),
        maViTri: Number(values.maViTri),
        moTa: values.moTa?.trim() || "",
        hinhAnh: values.hinhAnh?.trim() || "",
      };

      if (editingId) {
        await api.put(`/api/phong-thue/${editingId}`, payload);
        message.success("Cập nhật phòng thuê thành công");
      } else {
        await api.post("/api/phong-thue", payload);
        message.success("Thêm phòng thuê thành công");
      }

      handleReset();
      fetchRooms(keyword);
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
      const res = await api.get(`/api/phong-thue/${id}`);
      const room: Room = res.data.content;

      setEditingId(room.id);
      form.setFieldsValue({
        ...room,
        hinhAnh: room.hinhAnh || "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không lấy được chi tiết phòng thuê"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/phong-thue/${id}`);
      message.success("Xóa phòng thuê thành công");
      fetchRooms(keyword);
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Xóa phòng thuê thất bại"
      );
    }
  };

  const handleReset = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue(initialForm);
  };

  const handleSearch = () => {
    fetchRooms(keyword);
  };

  const handleClearSearch = () => {
    setKeyword("");
    fetchRooms("");
  };

  const columns: ColumnsType<Room> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 70,
    },
    {
      title: "Hình",
      dataIndex: "hinhAnh",
      width: 120,
      render: (hinhAnh: string) =>
        hinhAnh ? (
          <Image
            src={hinhAnh}
            width={90}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          "Chưa có"
        ),
    },
    {
      title: "Tên phòng",
      dataIndex: "tenPhong",
      render: (text: string) => text || "Chưa có",
    },
    {
      title: "Khách",
      dataIndex: "khach",
      width: 80,
    },
    {
      title: "Phòng ngủ",
      dataIndex: "phongNgu",
      width: 100,
    },
    {
      title: "Giá tiền",
      dataIndex: "giaTien",
      width: 130,
      render: (price: number) => `${Number(price || 0).toLocaleString()} VND`,
    },
    {
      title: "Mã vị trí",
      dataIndex: "maViTri",
      width: 100,
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
            title="Bạn có chắc muốn xóa phòng này?"
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
    <Card title="Quản lý phòng thuê">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialForm}
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Tên phòng"
            name="tenPhong"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng" }]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>

          <Form.Item
            label="Mã vị trí"
            name="maViTri"
            rules={[{ required: true, message: "Vui lòng nhập mã vị trí" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item label="Khách" name="khach">
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item label="Phòng ngủ" name="phongNgu">
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item label="Giường" name="giuong">
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item label="Phòng tắm" name="phongTam">
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item label="Giá tiền" name="giaTien">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item label="Link hình ảnh" name="hinhAnh">
            <Input placeholder="Có thể để trống" />
          </Form.Item>

          <Form.Item label="Mô tả" name="moTa" className="md:col-span-2">
            <Input.TextArea rows={3} placeholder="Nhập mô tả phòng" />
          </Form.Item>

          <Form.Item label="Tiện ích" className="md:col-span-2">
            <Space wrap>
              <Form.Item name="mayGiat" valuePropName="checked" noStyle>
                <Checkbox>Máy giặt</Checkbox>
              </Form.Item>

              <Form.Item name="banLa" valuePropName="checked" noStyle>
                <Checkbox>Bàn là</Checkbox>
              </Form.Item>

              <Form.Item name="tivi" valuePropName="checked" noStyle>
                <Checkbox>Tivi</Checkbox>
              </Form.Item>

              <Form.Item name="dieuHoa" valuePropName="checked" noStyle>
                <Checkbox>Điều hòa</Checkbox>
              </Form.Item>

              <Form.Item name="wifi" valuePropName="checked" noStyle>
                <Checkbox>Wifi</Checkbox>
              </Form.Item>

              <Form.Item name="bep" valuePropName="checked" noStyle>
                <Checkbox>Bếp</Checkbox>
              </Form.Item>

              <Form.Item name="doXe" valuePropName="checked" noStyle>
                <Checkbox>Đỗ xe</Checkbox>
              </Form.Item>

              <Form.Item name="hoBoi" valuePropName="checked" noStyle>
                <Checkbox>Hồ bơi</Checkbox>
              </Form.Item>

              <Form.Item name="banUi" valuePropName="checked" noStyle>
                <Checkbox>Bàn ủi</Checkbox>
              </Form.Item>
            </Space>
          </Form.Item>
        </div>

        <Space>
          <Button type="primary" htmlType="submit">
            {editingId ? "Cập nhật phòng" : "Thêm phòng"}
          </Button>

          <Button onClick={handleReset}>Làm mới</Button>
        </Space>
      </Form>

      <div className="flex justify-between items-center my-6">
        <Space>
          <Input
            placeholder="Tìm kiếm phòng thuê"
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

        <b>Tổng: {rooms.length} phòng</b>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={rooms}
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