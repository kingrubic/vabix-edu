import type { Pillar } from "./types";

export const pillars: Pillar[] = [
  {
    id: "dao-tao-huan-luyen",
    number: "01",
    en: "Training & Coaching",
    vi: "Đào tạo và huấn luyện",
    href: "/dao-tao",
    problem:
      "Người học cần nhìn rõ vấn đề, thiết kế giải pháp, ứng dụng vào công việc và đo lường kết quả — không chỉ nghe thêm một khóa lý thuyết.",
    value:
      "Từ Thao trường CEO, huấn luyện 1:1 đến đào tạo theo nhu cầu doanh nghiệp — giúp người học nhìn rõ vấn đề, thiết kế giải pháp, ứng dụng vào công việc và đo lường kết quả.",
    summary:
      "Từ Thao trường CEO, huấn luyện 1:1 đến đào tạo theo nhu cầu doanh nghiệp — giúp người học nhìn rõ vấn đề, thiết kế giải pháp, ứng dụng vào công việc và đo lường kết quả.",
    services: [
      { label: "Dành cho Doanh chủ & CEO", href: "/dao-tao#doanh-chu" },
      { label: "Dành cho Quản lý & Nhân viên", href: "/dao-tao#quan-ly" },
      { label: "Đào tạo theo yêu cầu doanh nghiệp", href: "/dao-tao/theo-yeu-cau-doanh-nghiep" },
      { label: "Lịch học / lớp đang mở", href: "/dao-tao/lich" },
    ],
    cta: { label: "Khám phá đào tạo và huấn luyện", href: "/dao-tao" },
  },
  {
    id: "tu-van-chuyen-doi",
    number: "02",
    en: "Transformation",
    vi: "Tư vấn chuyển đổi",
    href: "/tu-van-chuyen-doi",
    problem:
      "Doanh nghiệp có nhiều sáng kiến nhưng thiếu chẩn đoán điểm nghẽn, thiết kế đồng bộ và đồng hành triển khai.",
    value:
      "Nhìn toàn diện doanh nghiệp để xác định đúng ưu tiên, thiết kế phương án và đồng hành triển khai thay đổi — kết nối chiến lược, thị trường, con người, tài chính, công nghệ và vận hành.",
    summary:
      "Nhìn toàn diện doanh nghiệp để xác định đúng ưu tiên, thiết kế phương án và đồng hành triển khai thay đổi — kết nối chiến lược, thị trường, con người, tài chính, công nghệ và vận hành.",
    services: [
      { label: "Đánh giá toàn diện và chẩn đoán", href: "/tu-van-chuyen-doi/danh-gia-toan-dien" },
      { label: "Tái cấu trúc doanh nghiệp", href: "/tu-van-chuyen-doi/tai-cau-truc" },
      { label: "Chuyển đổi số và ứng dụng AI", href: "/tu-van-chuyen-doi/chuyen-doi-so-ai" },
      { label: "Đồng hành triển khai", href: "/tu-van-chuyen-doi/dong-hanh-trien-khai" },
    ],
    cta: { label: "Khám phá tư vấn chuyển đổi", href: "/tu-van-chuyen-doi" },
  },
  {
    id: "trustworking",
    number: "03",
    en: "Trustworking",
    vi: "Kết nối kinh doanh dựa trên niềm tin",
    href: "/trustworking",
    problem:
      "Networking thông thường rộng nhưng nông: dễ gặp sai đối tác, thiếu sàng lọc và không đi đến hợp tác bền vững.",
    value:
      "Kết nối doanh nghiệp, chuyên gia và đối tác theo nhu cầu và khả lực phù hợp. Chú trọng tìm hiểu, đối chiếu thông tin và làm rõ kỳ vọng trước khi giới thiệu, hướng đến hợp tác có trách nhiệm và giá trị lâu dài.",
    summary:
      "Kết nối doanh nghiệp, chuyên gia và đối tác theo nhu cầu và khả lực phù hợp. Chú trọng tìm hiểu, đối chiếu thông tin và làm rõ kỳ vọng trước khi giới thiệu.",
    services: [
      { label: "Dành cho nhà cung cấp", href: "/trustworking#nha-cung-cap" },
      { label: "Dành cho khách hàng / đối tác", href: "/trustworking#khach-hang" },
      { label: "Quy trình Trustworking", href: "/trustworking#quy-trinh" },
      { label: "Gửi nhu cầu kết nối", href: "/trustworking#ket-noi" },
    ],
    cta: { label: "Khám phá Trustworking", href: "/trustworking" },
  },
];

export const supportingLayers = [
  {
    title: "Sách",
    href: "/sach",
    summary: "Ấn phẩm tri thức giúp doanh chủ và đội ngũ học, làm và truyền lại phương pháp thực chiến.",
  },
  {
    title: "Cẩm nang",
    href: "/cam-nang",
    summary: "Tài liệu hướng dẫn theo chuyên đề, hỗ trợ quyết định và hành động.",
  },
  {
    title: "Học liệu",
    href: "/tri-thuc#hoc-lieu",
    summary: "Học liệu số phục vụ chương trình và quá trình ứng dụng.",
  },
  {
    title: "Nhân lực mở",
    href: "/nhan-luc-mo-nhan-luc-so#nhan-luc-mo",
    summary: "Bổ sung chuyên môn. Linh hoạt nguồn lực. Phối hợp theo mục tiêu.",
  },
  {
    title: "Nhân lực số",
    href: "/nhan-luc-mo-nhan-luc-so#nhan-luc-so",
    summary: "Rõ nhiệm vụ. Đúng quyền hạn. Vận hành có kiểm soát.",
  },
];

export function getPillar(id: string) {
  return pillars.find((p) => p.id === id);
}
