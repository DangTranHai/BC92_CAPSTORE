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
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
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
  maViTri: 0,
  hinhAnh: "",
};

export default function RoomManagement() {
  const [form] = Form.useForm<Room>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getAllRooms = () => api.get("/api/phong-thue");

  const getRoomsPagination = (pageIndex: number, pageSize: number, keyword: string) => {
    return api.get("/api/phong-thue/phan-trang-tim-kiem", {
      params: { pageIndex, pageSize, keyword },
    });
  };

  const getRoomById = (id: number) => api.get(`/api/phong-thue/${id}`);

  const addRoom = (data: Room) => api.post("/api/phong-thue", data);

  const updateRoom = (id: number, data: Room) => {
    return api.put(`/api/phong-thue/${id}`, data);
  };

  const deleteRoom = (id: number) => api.delete(`/api/phong-thue/${id}`);

  const uploadRoomImage = (maPhong: number, file: File) => {
    const formData = new FormData();
    formData.append("formFile", file);

    return api.post("/api/phong-thue/upload-hinh-phong", formData, {
      params: { maPhong },
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const fetchRooms = async (search = keyword) => {
    try {
      setLoading(true);

      if (search.trim()) {
        const res = await getRoomsPagination(1, 100, search.trim());
        setRooms(res.data.content?.data || []);
      } else {
        const res = await getAllRooms();
        setRooms(res.data.content || []);
      }
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không tải được danh sách phòng"
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
        khach: Number(values.khach),
        phongNgu: Number(values.phongNgu),
        giuong: Number(values.giuong),
        phongTam: Number(values.phongTam),
        giaTien: Number(values.giaTien),
        maViTri: Number(values.maViTri),
        hinhAnh: values.hinhAnh || "",
      };

      let roomId = editingId;

      if (editingId) {
        await updateRoom(editingId, payload);
        message.success("Cập nhật phòng thành công");
      } else {
        const res = await addRoom(payload);
        roomId = res.data.content.id;
        message.success("Thêm phòng thành công");
      }

      const file = fileList[0]?.originFileObj;

      if (roomId && file) {
        await uploadRoomImage(roomId, file);
        message.success("Upload hình phòng thành công");
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
      const res = await getRoomById(id);
      const room: Room = res.data.content;

      setEditingId(room.id);
      form.setFieldsValue({
        ...room,
        hinhAnh: room.hinhAnh || "",
      });

      setFileList([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      message.error("Không lấy được chi tiết phòng");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRoom(id);
      message.success("Xóa phòng thành công");
      fetchRooms(keyword);
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Xóa phòng thất bại"
      );
    }
  };

  const handleSearch = () => fetchRooms(keyword);

  const handleClearSearch = () => {
    setKeyword("");
    fetchRooms("");
  };

  const handleReset = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue(initialForm);
    setFileList([]);
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
      title: "Giá",
      dataIndex: "giaTien",
      width: 120,
      render: (price: number) => `${price?.toLocaleString()}$`,
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
            <Input placeholder="Có thể để trống nếu upload hình" />
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

          <Form.Item label="Upload hình phòng" className="md:col-span-2">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              maxCount={1}
              listType="picture"
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn hình</Button>
            </Upload>
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
            placeholder="Tìm kiếm theo tên phòng"
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