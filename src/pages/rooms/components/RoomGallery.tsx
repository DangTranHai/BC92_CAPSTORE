interface Props {
  hinhAnh: string;
  tenPhong: string;
}

const RoomGallery = ({ hinhAnh, tenPhong }: Props) => {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <img
        src={hinhAnh}
        alt={tenPhong}
        className="h-96 w-full object-cover"
      />
      <button className="absolute bottom-4 right-4 rounded-xl border border-gray-800 bg-white px-4 py-2 text-sm font-semibold shadow hover:bg-gray-100">
        Hiện tất cả ảnh
      </button>
    </div>
  );
};

export default RoomGallery;