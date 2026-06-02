import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { api } from "../../services/api";

type Location = {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
};

const initialForm: Location = {
  id: 0,
  tenViTri: "",
  tinhThanh: "",
  quocGia: "",
  hinhAnh: "",
};

export default function LocationManagement() {
  const [form] = Form.useForm<Location>();
  const [locations, setLocations] = useState<Location[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLocations = async (search = keyword) => {
    try {
      setLoading(true);

      if (search.trim()) {
        const res = await api.get("/api/vi-tri/phan-trang-tim-kiem", {
          params: {
            pageIndex: 1,
            pageSize: 100,
            keyword: search.trim(),
          },
        });

        setLocations(res.data.content?.data || []);
      } else {
        const res = await api.get("/api/vi-tri");
        setLocations(res.data.content || []);
      }
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không tải được danh sách vị trí"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialForm);
    fetchLocations("");
  }, []);

  const handleSubmit = async (values: Location) => {
    try {
      const payload: Location = {
        id: editingId || 0,
        tenViTri: values.tenViTri.trim(),
        tinhThanh: values.tinhThanh.trim(),
        quocGia: values.quocGia.trim(),
        hinhAnh: values.hinhAnh?.trim() || "",
      };

      if (editingId) {
        await api.put(`/api/vi-tri/${editingId}`, payload);
        message.success("Cập nhật vị trí thành công");
      } else {
        await api.post("/api/vi-tri", payload);
        message.success("Thêm vị trí thành công");
      }

      handleReset();
      fetchLocations(keyword);
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
      const res = await api.get(`/api/vi-tri/${id}`);
      const location: Location = res.data.content;

      setEditingId(location.id);

      form.setFieldsValue({
        id: location.id,
        tenViTri: location.tenViTri || "",
        tinhThanh: location.tinhThanh || "",
        quocGia: location.quocGia || "",
        hinhAnh: location.hinhAnh || "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Không lấy được chi tiết vị trí"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/vi-tri/${id}`);
      message.success("Xóa vị trí thành công");
      fetchLocations(keyword);
    } catch (error: any) {
      message.error(
        error.response?.data?.content ||
          error.response?.data?.message ||
          "Xóa vị trí thất bại"
      );
    }
  };

  const handleReset = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue(initialForm);
  };

  const handleSearch = () => {
    fetchLocations(keyword);
  };

  const handleClearSearch = () => {
    setKeyword("");
    fetchLocations("");
  };

  const columns: ColumnsType<Location> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhAnh",
      width: 140,
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
      title: "Tên vị trí",
      dataIndex: "tenViTri",
      render: (text: string) => text || "Chưa có",
    },
    {
      title: "Tỉnh thành",
      dataIndex: "tinhThanh",
      render: (text: string) => text || "Chưa có",
    },
    {
      title: "Quốc gia",
      dataIndex: "quocGia",
      render: (text: string) => text || "Chưa có",
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
            title="Bạn có chắc muốn xóa vị trí này?"
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
    <Card title="Quản lý vị trí">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialForm}
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Tên vị trí"
            name="tenViTri"
            rules={[{ required: true, message: "Vui lòng nhập tên vị trí" }]}
          >
            <Input placeholder="Nhập tên vị trí" />
          </Form.Item>

          <Form.Item
            label="Tỉnh thành"
            name="tinhThanh"
            rules={[{ required: true, message: "Vui lòng nhập tỉnh thành" }]}
          >
            <Input placeholder="Nhập tỉnh thành" />
          </Form.Item>

          <Form.Item
            label="Quốc gia"
            name="quocGia"
            rules={[{ required: true, message: "Vui lòng nhập quốc gia" }]}
          >
            <Input placeholder="Nhập quốc gia" />
          </Form.Item>

          <Form.Item label="Link hình ảnh" name="hinhAnh">
            <Input placeholder="Có thể để trống" />
          </Form.Item>
        </div>

        <Space>
          <Button type="primary" htmlType="submit">
            {editingId ? "Cập nhật vị trí" : "Thêm vị trí"}
          </Button>

          <Button onClick={handleReset}>Làm mới</Button>
        </Space>
      </Form>

      <div className="flex justify-between items-center my-6">
        <Space>
          <Input
            placeholder="Tìm kiếm vị trí"
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

        <b>Tổng: {locations.length} vị trí</b>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={locations}
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