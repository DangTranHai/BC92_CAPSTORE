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
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { api } from "../../services/api";

type Location = {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
};

type LocationForm = {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
};

const initialForm: LocationForm = {
  id: 0,
  tenViTri: "",
  tinhThanh: "",
  quocGia: "",
  hinhAnh: "",
};

export default function LocationManagement() {
  const [form] = Form.useForm<LocationForm>();
  const [locations, setLocations] = useState<Location[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getAllLocations = () => api.get("/api/vi-tri");

  const getLocationsPagination = (
    pageIndex: number,
    pageSize: number,
    keyword: string
  ) => {
    return api.get("/api/vi-tri/phan-trang-tim-kiem", {
      params: { pageIndex, pageSize, keyword },
    });
  };

  const getLocationById = (id: number) => {
    return api.get(`/api/vi-tri/${id}`);
  };

  const addLocation = (data: LocationForm) => {
    return api.post("/api/vi-tri", data);
  };

  const updateLocation = (id: number, data: LocationForm) => {
    return api.put(`/api/vi-tri/${id}`, data);
  };

  const deleteLocation = (id: number) => {
    return api.delete(`/api/vi-tri/${id}`);
  };

  const uploadLocationImage = (maViTri: number, file: File) => {
    const formData = new FormData();
    formData.append("formFile", file);

    return api.post("/api/vi-tri/upload-hinh-vitri", formData, {
      params: { maViTri },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const fetchLocations = async (search = keyword) => {
    try {
      setLoading(true);

      if (search.trim()) {
        const res = await getLocationsPagination(1, 100, search.trim());
        setLocations(res.data.content?.data || []);
      } else {
        const res = await getAllLocations();
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

  const handleSubmit = async (values: LocationForm) => {
    try {
      const payload: LocationForm = {
        id: editingId || 0,
        tenViTri: values.tenViTri.trim(),
        tinhThanh: values.tinhThanh.trim(),
        quocGia: values.quocGia.trim(),
        hinhAnh: values.hinhAnh || "",
      };

      let locationId = editingId;

      if (editingId) {
        await updateLocation(editingId, payload);
        message.success("Cập nhật vị trí thành công");
      } else {
        const res = await addLocation(payload);
        locationId = res.data.content.id;
        message.success("Thêm vị trí thành công");
      }

      const file = fileList[0]?.originFileObj;

      if (locationId && file) {
        await uploadLocationImage(locationId, file);
        message.success("Upload hình vị trí thành công");
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
      const res = await getLocationById(id);
      const location: Location = res.data.content;

      setEditingId(location.id);

      form.setFieldsValue({
        id: location.id,
        tenViTri: location.tenViTri || "",
        tinhThanh: location.tinhThanh || "",
        quocGia: location.quocGia || "",
        hinhAnh: location.hinhAnh || "",
      });

      setFileList([]);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      message.error("Không lấy được chi tiết vị trí");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLocation(id);
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

  const handleSearch = () => {
    fetchLocations(keyword);
  };

  const handleClearSearch = () => {
    setKeyword("");
    fetchLocations("");
  };

  const handleReset = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue(initialForm);
    setFileList([]);
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
            <Input placeholder="Có thể để trống nếu upload hình" />
          </Form.Item>

          <Form.Item label="Upload hình vị trí">
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
            {editingId ? "Cập nhật vị trí" : "Thêm vị trí"}
          </Button>

          <Button onClick={handleReset}>Làm mới</Button>
        </Space>
      </Form>

      <div className="flex justify-between items-center my-6">
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên vị trí"
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