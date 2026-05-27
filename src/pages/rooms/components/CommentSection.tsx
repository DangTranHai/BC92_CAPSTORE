import { useEffect, useState } from "react";
import { Button, Input, Rate, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type{ BinhLuan } from "../../../types/booking.type";
import {
  layBinhLuanTheoPhong,
  themBinhLuan,
} from "../../../services/comment.service";
import dayjs from "dayjs";

interface Props {
  maPhong: number;
}
// Component riêng cho từng bình luận
const CommentItem = ({ bl }: { bl: BinhLuan }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 150; // Số ký tự tối đa trước khi thu gọn
  const isLong = bl.noiDung.length > MAX_LENGTH;

  return (
    <div className="flex gap-4">
      {bl.avatar ? (
        <img
          src={bl.avatar}
          alt={bl.tenNguoiBinhLuan}
          className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
          <UserOutlined />
        </div>
      )}

      <div>
        <p className="font-semibold">{bl.tenNguoiBinhLuan}</p>
        <p className="text-sm text-gray-400">
          {dayjs(bl.ngayBinhLuan).format("MM/YYYY")}
        </p>

        <p className="mt-1 text-sm text-gray-700">
          {isLong && !expanded
            ? `${bl.noiDung.slice(0, MAX_LENGTH)}...`
            : bl.noiDung}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-sm font-semibold underline hover:text-gray-500"
          >
            {expanded ? "Thu gọn" : "Hiện thêm"}
          </button>
        )}
      </div>
    </div>
  );
};
const CommentSection = ({ maPhong }: Props) => {
  const [binhLuans, setBinhLuans] = useState<BinhLuan[]>([]);
  const [noiDung, setNoiDung] = useState<string>("");
  const [sao, setSao] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);

  const ITEM_PER_PAGE = 4; //số bình luận hiển thị ban đầu tối đa 4
  const visibleComments = showAll ? binhLuans : binhLuans.slice(0, ITEM_PER_PAGE); 


  useEffect(() => {
    const fetchBinhLuan = async () => {
      try {
        const data = await layBinhLuanTheoPhong(maPhong);
        setBinhLuans(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBinhLuan();
  }, [maPhong]);

  const handleGuiBinhLuan = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      message.warning("Vui lòng đăng nhập để bình luận!");
      return;
    }
    if (!noiDung.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(userStr);
      await themBinhLuan({
        maCongViec: maPhong,
        maNguoiBinhLuan: user.id,
        ngayBinhLuan: new Date().toISOString(),
        noiDung,
        saoBinhLuan: sao,
      });
      message.success("Bình luận thành công!");
      setNoiDung("");
      // Reload bình luận
      const data = await layBinhLuanTheoPhong(maPhong);
      setBinhLuans(data);
    } catch (error) {
      message.error("Gửi bình luận thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="mb-6 text-2xl font-bold">
        Bình luận ({binhLuans.length})
      </h2>

      {/* Danh sách bình luận */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {visibleComments.map((bl) => (
          <CommentItem key={bl.id} bl={bl} />
        ))}
      </div>

      {/* Nút xem thêm/thu gọn toàn bộ danh sách */}
      {binhLuans.length > ITEM_PER_PAGE && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 rounded-xl border border-gray-800 px-6 py-3 text-sm font-semibold hover:bg-gray-100"
        >
          {showAll
            ? "Thu gọn"
            : `Hiện tất cả ${binhLuans.length} bình luận`}
        </button>
      )}

      {/* Form thêm bình luận */}
      <div className="mt-8 border-t pt-6">
        <h3 className="mb-4 text-lg font-semibold">Thêm bình luận</h3>
        <Rate value={sao} onChange={(val) => setSao(val)} className="mb-3" />
        <Input.TextArea
          rows={4}
          placeholder="Nhập bình luận của bạn..."
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          className="mb-3"
        />
        <Button
          type="primary"
          loading={loading}
          onClick={handleGuiBinhLuan}
          className="bg-rose-500 mt-2"
        >
          Gửi bình luận
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;