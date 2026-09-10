import type { Pillar } from "./types";

export const pillars: Pillar[] = [
  {
    id: "dao-tao-huan-luyen",
    number: "01",
    en: "Training & Coaching",
    vi: "Đào tạo và huấn luyện",
    href: "/giai-phap/dao-tao-huan-luyen",
    problem:
      "Lãnh đạo và đội ngũ nhìn doanh nghiệp manh mún, thiếu ngôn ngữ chung và sản phẩm quản trị có thể áp dụng ngay vào công việc.",
    value:
      "Phát triển năng lực lãnh đạo, quản trị và thực thi thông qua chương trình thực chiến, huấn luyện và các sản phẩm có thể ứng dụng vào công việc.",
    summary:
      "Từ thao trường CEO đến huấn luyện 1:1 và đào tạo theo yêu cầu — học để nhìn rõ, thiết kế được và thực thi có bằng chứng.",
    services: [
      { label: "Đào tạo và huấn luyện CEO", href: "/giai-phap/dao-tao-huan-luyen#nhom-chuong-trinh" },
      { label: "Đào tạo theo yêu cầu doanh nghiệp", href: "/chuong-trinh/dao-tao-theo-yeu-cau" },
      { label: "Phát triển đội ngũ quản lý", href: "/giai-phap/dao-tao-huan-luyen#nhom-chuong-trinh" },
      { label: "Ứng dụng AI trong doanh nghiệp", href: "/giai-phap/dao-tao-huan-luyen#nhom-chuong-trinh" },
      { label: "Huấn luyện CEO 1:1", href: "/giai-phap/dao-tao-huan-luyen#nhom-chuong-trinh" },
    ],
    cta: { label: "Xem đào tạo & huấn luyện", href: "/giai-phap/dao-tao-huan-luyen" },
  },
  {
    id: "tu-van-chuyen-doi",
    number: "02",
    en: "Transformation",
    vi: "Tư vấn chuyển đổi",
    href: "/giai-phap/tu-van-chuyen-doi",
    problem:
      "Doanh nghiệp có nhiều sáng kiến nhưng thiếu chẩn đoán điểm nghẽn, thiết kế đồng bộ và đồng hành triển khai — dễ tạo thêm điểm gãy mới.",
    value:
      "Đồng hành đánh giá hiện trạng, xác định điểm nghẽn, thiết kế giải pháp, triển khai và đo lường cải tiến một cách đồng bộ.",
    summary:
      "Tư vấn chuyển đổi doanh nghiệp nhìn toàn diện chiến lược, thị trường, con người, tài chính, tổ chức, công nghệ và vận hành.",
    services: [
      { label: "Đánh giá và chẩn đoán doanh nghiệp", href: "/giai-phap/tu-van-chuyen-doi/danh-gia-toan-dien" },
      { label: "Tái cấu trúc và mô hình kinh doanh", href: "/giai-phap/tu-van-chuyen-doi/tai-cau-truc" },
      { label: "Tổ chức, quy trình và hiệu suất", href: "/giai-phap/tu-van-chuyen-doi" },
      { label: "Chuyển đổi số và ứng dụng AI", href: "/giai-phap/tu-van-chuyen-doi/chuyen-doi-so-ai" },
      { label: "Đồng hành triển khai", href: "/giai-phap/tu-van-chuyen-doi/dong-hanh-trien-khai" },
    ],
    cta: { label: "Xem tư vấn chuyển đổi", href: "/giai-phap/tu-van-chuyen-doi" },
  },
  {
    id: "trustworking",
    number: "03",
    en: "Trustworking",
    vi: "Kết nối kinh doanh dựa trên niềm tin",
    href: "/giai-phap/trustworking",
    problem:
      "Networking thông thường rộng nhưng nông: tốn thời gian gặp sai đối tác, thiếu sàng lọc năng lực và không đi đến hợp tác bền vững.",
    value:
      "Kết nối có chọn lọc giữa doanh chủ, chuyên gia, đối tác, nhà cung cấp và thị trường phù hợp trên nền tảng niềm tin, giá trị tương hỗ và hợp tác bền vững.",
    summary:
      "Kết nối đúng nhà cung cấp với đúng thị trường — sàng lọc hồ sơ, bằng chứng và mức độ cam kết trước khi giới thiệu.",
    services: [
      { label: "Kết nối chuyên gia", href: "/mang-luoi/chuyen-gia" },
      { label: "Kết nối đối tác", href: "/mang-luoi/doi-tac" },
      { label: "Nhà cung cấp & làng ngành", href: "/mang-luoi/lang-nganh" },
      { label: "Sự kiện cộng đồng", href: "/su-kien" },
      { label: "Làng Kết Nối VABIX", href: "/cong-cu-dan" },
    ],
    cta: { label: "Xem Trustworking", href: "/giai-phap/trustworking" },
  },
];

export const supportingLayers = [
  {
    title: "Sản phẩm tri thức",
    href: "/san-pham-tri-thuc",
    summary: "Sách, cẩm nang, biểu mẫu quản trị và học liệu số hỗ trợ chuyển kiến thức thành quyết định.",
  },
  {
    title: "Nhân lực mở & Nhân lực số",
    href: "/nhan-luc-mo-nhan-luc-so",
    summary: "Kết nối chuyên gia theo dự án và thiết kế AI Agent dưới sự giám sát của con người.",
  },
  {
    title: "Mô hình & phương pháp",
    href: "/mo-hinh-phuong-phap",
    summary: "BizCar, B2A, BABOSO, KORA, KLASS và chuẩn thành công 3W.",
  },
];

export function getPillar(id: string) {
  return pillars.find((p) => p.id === id);
}
