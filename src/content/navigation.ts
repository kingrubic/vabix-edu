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
  { label: "Về VABIX", href: "/ve-vabix" },
  {
    label: "Giải pháp",
    href: "/giai-phap",
    groups: [
      {
        label: "Ba mũi nhọn 3T",
        href: "/giai-phap",
        children: [
          {
            label: "Đào tạo & huấn luyện",
            href: "/giai-phap/dao-tao-huan-luyen",
            description: "Training & Coaching — năng lực lãnh đạo, quản trị và thực thi.",
          },
          {
            label: "Tư vấn chuyển đổi",
            href: "/giai-phap/tu-van-chuyen-doi",
            description: "Transformation — chẩn đoán, thiết kế, triển khai và đo lường.",
          },
          {
            label: "Trustworking",
            href: "/giai-phap/trustworking",
            description: "Kết nối kinh doanh dựa trên niềm tin — đúng nhà cung cấp với đúng thị trường.",
          },
        ],
      },
      {
        label: "Lớp năng lực hỗ trợ",
        href: "/giai-phap",
        children: [
          {
            label: "Sản phẩm tri thức",
            href: "/san-pham-tri-thuc",
            description: "Sách, cẩm nang, biểu mẫu và học liệu số.",
          },
          {
            label: "Nhân lực mở & nhân lực số",
            href: "/nhan-luc-mo-nhan-luc-so",
            description: "Chuyên gia theo dự án và AI Agent dưới sự giám sát của con người.",
          },
          {
            label: "Danh mục chương trình",
            href: "/chuong-trinh",
            description: "BMDO, MBM và các khóa phát triển năng lực.",
          },
        ],
      },
    ],
  },
  {
    label: "Chương trình & Mô hình",
    href: "/chuong-trinh",
    children: [
      { label: "Danh mục chương trình", href: "/chuong-trinh", description: "17 chương trình và đào tạo theo yêu cầu." },
      { label: "BMDO", href: "/chuong-trinh/bmdo", description: "Thao trường 30 buổi thiết kế và vận hành doanh nghiệp." },
      { label: "MBM", href: "/chuong-trinh/mbm", description: "Làm chủ mô hình BizCar — 12 tháng." },
      { label: "BizCar", href: "/mo-hinh-phuong-phap/bizcar", description: "Mô hình quản trị 12 khối chức năng." },
      { label: "3W", href: "/mo-hinh-phuong-phap/3w", description: "Chuẩn thành công WOW–WELL–WIN." },
      { label: "B2A", href: "/mo-hinh-phuong-phap/b2a", description: "Từ địa chỉ, địa bàn đến kết quả thị trường." },
      { label: "BABOSO", href: "/mo-hinh-phuong-phap/baboso", description: "Hành trình từ thương hiệu đến tái mua hàng." },
      { label: "KORA", href: "/mo-hinh-phuong-phap/kora", description: "Định hướng và chẩn đoán ưu tiên." },
      { label: "KLASS", href: "/mo-hinh-phuong-phap/klass", description: "Tháp năng lực của cư dân và đội ngũ." },
    ],
  },
  {
    label: "Mạng lưới",
    href: "/mang-luoi",
    children: [
      { label: "Đội ngũ chuyên gia", href: "/mang-luoi/chuyen-gia" },
      { label: "Đối tác", href: "/mang-luoi/doi-tac" },
      { label: "Làng ngành", href: "/mang-luoi/lang-nganh" },
      { label: "Nhà cung cấp", href: "/mang-luoi/nha-cung-cap" },
      { label: "Trở thành đối tác", href: "/mang-luoi/tro-thanh-doi-tac" },
    ],
  },
  {
    label: "Tri thức",
    href: "/tri-thuc",
    children: [
      { label: "Bài viết", href: "/tri-thuc" },
      { label: "Case Study", href: "/tri-thuc/case-study" },
      { label: "Sản phẩm tri thức", href: "/san-pham-tri-thuc" },
      { label: "Cẩm nang", href: "/tri-thuc/cam-nang" },
      { label: "Sách VABIX", href: "/tri-thuc/sach" },
    ],
  },
  { label: "Sự kiện", href: "/su-kien" },
  { label: "Liên hệ", href: "/lien-he" },
];
