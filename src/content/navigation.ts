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
        label: "Kết nối Tri thức",
        href: "/giai-phap#tri-thuc",
        children: [
          {
            label: "Tư vấn chiến lược",
            href: "/giai-phap/tu-van-chien-luoc",
            description: "Chẩn đoán hiện trạng và thiết kế lộ trình phát triển.",
          },
          {
            label: "Đào tạo doanh nhân",
            href: "/giai-phap/dao-tao-doanh-nhan",
            description: "Tư duy hệ thống, lãnh đạo và vận hành thực chiến.",
          },
          {
            label: "Huấn luyện doanh nghiệp",
            href: "/giai-phap/huan-luyen-doanh-nghiep",
            description: "Chương trình thiết kế theo bài toán tổ chức.",
          },
          {
            label: "Thiết kế & vận hành doanh nghiệp",
            href: "/giai-phap/thiet-ke-van-hanh-doanh-nghiep",
            description: "Nhìn doanh nghiệp như một hệ thống thống nhất.",
          },
        ],
      },
      {
        label: "Kết nối Kinh doanh",
        href: "/giai-phap#kinh-doanh",
        children: [
          {
            label: "Kết nối doanh nghiệp",
            href: "/giai-phap/ket-noi-doanh-nghiep",
            description: "Gặp đúng đối tác, nguồn lực và cộng đồng.",
          },
          {
            label: "Xúc tiến thương mại",
            href: "/giai-phap/xuc-tien-thuong-mai",
            description: "Kết cung – cầu và mở rộng thị trường.",
          },
        ],
      },
    ],
  },
  {
    label: "Chương trình & Mô hình",
    href: "/mo-hinh-phuong-phap",
    children: [
      { label: "BizCar", href: "/mo-hinh-phuong-phap/bizcar", description: "Thiết kế và vận hành doanh nghiệp toàn diện." },
      { label: "BMDO", href: "/mo-hinh-phuong-phap/bmdo", description: "Xưởng thiết kế vận hành cho lãnh đạo." },
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
      { label: "Đối tác & khách hàng", href: "/mang-luoi/doi-tac" },
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
      { label: "Cẩm nang", href: "/tri-thuc/cam-nang" },
      { label: "Sách VABIX", href: "/tri-thuc/sach" },
    ],
  },
  { label: "Sự kiện", href: "/su-kien" },
  { label: "Liên hệ", href: "/lien-he" },
];
