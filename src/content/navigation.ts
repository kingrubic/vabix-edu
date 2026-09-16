export type NavChild = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  children: NavChild[];
};

export type NavItem = {
  label: string;
  href: string;
  groups?: NavGroup[];
  children?: NavChild[];
};

export const primaryNav: NavItem[] = [
  {
    label: "Về VABIX",
    href: "/ve-vabix",
    children: [
      { label: "VABIX là ai", href: "/ve-vabix#ve-vabix" },
      { label: "Sứ mệnh", href: "/ve-vabix#su-menh" },
      { label: "Khát vọng 2031", href: "/ve-vabix#khat-vong" },
      { label: "Cam kết", href: "/ve-vabix#cam-ket" },
      { label: "Giá trị cốt lõi", href: "/ve-vabix#gia-tri" },
      { label: "Ba mũi nhọn 3T", href: "/ve-vabix#ba-mui-nhon" },
      { label: "Thông điệp Nhà sáng lập", href: "/ve-vabix#nha-sang-lap" },
      { label: "Hành trình VABIX", href: "/ve-vabix#hanh-trinh" },
    ],
  },
  {
    label: "Đào tạo & huấn luyện",
    href: "/dao-tao",
    children: [
      { label: "Tổng quan", href: "/dao-tao", description: "Học để nhìn rõ. Thiết kế để làm được. Triển khai để tạo kết quả." },
      { label: "Doanh chủ & CEO", href: "/dao-tao#doanh-chu", description: "BMDO, MBM và các chương trình lãnh đạo." },
      { label: "Quản lý & Nhân viên", href: "/dao-tao#quan-ly", description: "Bán hàng, vận hành, AI và hiệu suất." },
      { label: "Đào tạo theo yêu cầu", href: "/dao-tao/theo-yeu-cau-doanh-nghiep", description: "Thiết kế sau khảo sát hiện trạng." },
      { label: "Lịch học / Lớp đang mở", href: "/dao-tao/lich", description: "Các lớp và sự kiện đào tạo." },
      { label: "BMDO", href: "/dao-tao/bmdo", description: "Thao trường thiết kế và vận hành doanh nghiệp toàn diện." },
      { label: "MBM", href: "/dao-tao/mbm", description: "Mastery of the BizCar Model — chương trình chuyên sâu." },
    ],
  },
  {
    label: "Tư vấn chuyển đổi",
    href: "/tu-van-chuyen-doi",
    children: [
      { label: "Tổng quan", href: "/tu-van-chuyen-doi" },
      { label: "Các nhóm dịch vụ", href: "/tu-van-chuyen-doi#nhom-dich-vu" },
      { label: "Phương pháp tiếp cận", href: "/tu-van-chuyen-doi#quy-trinh" },
      { label: "Đăng ký đánh giá nhu cầu", href: "/tu-van-chuyen-doi#danh-gia" },
    ],
  },
  {
    label: "Trustworking",
    href: "/trustworking",
    children: [
      { label: "Tổng quan", href: "/trustworking" },
      { label: "Dành cho nhà cung cấp", href: "/trustworking#nha-cung-cap" },
      { label: "Dành cho khách hàng / đối tác", href: "/trustworking#khach-hang" },
      { label: "Quy trình Trustworking", href: "/trustworking#quy-trinh" },
      { label: "Nguyên tắc Trustworking", href: "/trustworking#nguyen-tac" },
      { label: "Gửi nhu cầu kết nối", href: "/trustworking#ket-noi" },
    ],
  },
  {
    label: "Mô hình & phương pháp",
    href: "/mo-hinh-phuong-phap",
    children: [
      { label: "The BizCar", href: "/mo-hinh-phuong-phap/bizcar", description: "Mô hình quản trị 12 khối chức năng." },
      { label: "APPLIER", href: "/mo-hinh-phuong-phap/applier", description: "Phương pháp đào tạo và huấn luyện." },
      { label: "MAIS", href: "/mo-hinh-phuong-phap/mais", description: "Đo lường → Phân tích → Cải tiến → Chuẩn hóa." },
      { label: "3W", href: "/mo-hinh-phuong-phap/3w", description: "WOW · WELL · WIN." },
      { label: "KAROT", href: "/mo-hinh-phuong-phap/karot", description: "Xác lập trọng tâm và ưu tiên thay đổi." },
      { label: "KLASS", href: "/mo-hinh-phuong-phap/klass", description: "Tháp năng lực và lộ trình phát triển." },
      { label: "BABOSO", href: "/mo-hinh-phuong-phap/baboso", description: "BA · BO · SO." },
      { label: "DGH", href: "/mo-hinh-phuong-phap/dgh", description: "Khung định hướng chuyển đổi Số – Xanh – Hạnh phúc." },
    ],
  },
  {
    label: "Hệ sinh thái tri thức",
    href: "/tri-thuc",
    children: [
      { label: "Tổng quan", href: "/tri-thuc" },
      { label: "Sách", href: "/sach" },
      { label: "Cẩm nang", href: "/cam-nang" },
      { label: "Học liệu số", href: "/tri-thuc#hoc-lieu" },
      { label: "Nhân lực mở", href: "/nhan-luc-mo-nhan-luc-so#nhan-luc-mo" },
      { label: "Nhân lực số", href: "/nhan-luc-mo-nhan-luc-so#nhan-luc-so" },
      { label: "Dịch vụ hỗ trợ", href: "/tri-thuc#dich-vu-ho-tro" },
    ],
  },
  {
    label: "Góc chia sẻ",
    href: "/goc-chia-se",
    children: [
      { label: "Bài viết", href: "/goc-chia-se" },
      { label: "Case / hoạt động", href: "/tri-thuc/case-study" },
      { label: "Tin tức / sự kiện", href: "/su-kien" },
      { label: "Nội dung chuyên môn", href: "/goc-chia-se?chuyen-muc=insights" },
    ],
  },
  { label: "Đội ngũ", href: "/mang-luoi/chuyen-gia" },
  { label: "Liên hệ", href: "/lien-he" },
];
