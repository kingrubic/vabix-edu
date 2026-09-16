import type { KnowledgeProduct } from "./types";

export const knowledgeProductCategories = [
  {
    id: "sach",
    title: "Sách VABIX",
    summary: "Ấn phẩm tri thức giúp doanh chủ và đội ngũ học, làm và truyền lại phương pháp thực chiến.",
    href: "/tri-thuc/sach",
  },
  {
    id: "cam-nang",
    title: "Cẩm nang và tài liệu hướng dẫn",
    summary: "Tài liệu hướng dẫn theo chuyên đề, hỗ trợ quyết định và hành động.",
    href: "/tri-thuc/cam-nang",
  },
  {
    id: "bieu-mau",
    title: "Bộ biểu mẫu quản trị doanh nghiệp",
    summary: "Biểu mẫu phục vụ đánh giá hiện trạng, xác định vấn đề, thiết kế giải pháp, lập kế hoạch và theo dõi cải tiến.",
    href: "/san-pham-tri-thuc/bo-bieu-mau-quan-tri",
  },
  {
    id: "hoc-lieu",
    title: "Học liệu số",
    summary: "Tài liệu, video, bài giảng và nội dung học trực tuyến — chỉ mở truy cập khi sản phẩm và quy trình đã sẵn sàng.",
    href: "/san-pham-tri-thuc/hoc-lieu-so",
  },
];

export const knowledgeProducts: KnowledgeProduct[] = [
  {
    id: "kp-b2a",
    slug: "quan-tri-kinh-doanh-thuc-chien-b2a",
    category: "sach",
    title: "Quản trị kinh doanh thực chiến theo mô hình B2A",
    summary: "Nền tảng tri thức của mô hình B2A — từ địa chỉ, địa bàn đến chiến lược và kết quả thị trường.",
    status: "published",
    href: "/tri-thuc/sach/quan-tri-kinh-doanh-thuc-chien-b2a",
  },
  {
    id: "kp-bizcar",
    slug: "bizcar-thiet-ke-van-hanh",
    category: "sach",
    title: "BizCar — Thiết kế và vận hành doanh nghiệp",
    summary: "Khung 12 khối chức năng giúp lãnh đạo nhìn doanh nghiệp như một hệ thống thống nhất.",
    status: "published",
    href: "/tri-thuc/sach/bizcar-thiet-ke-van-hanh",
  },
  {
    id: "kp-lifecar",
    slug: "chiec-xe-cuoc-doi-the-lifecar",
    category: "sach",
    title: "Chiếc Xe Cuộc Đời — The LifeCar",
    summary: "Mô hình chiếc xe cuộc đời — The LifeCar.",
    status: "published",
    href: "/tri-thuc/sach/chiec-xe-cuoc-doi-the-lifecar",
  },
  {
    id: "kp-happiness",
    slug: "nang-luong-hanh-phuc-gia-dinh-so-xa-hoi-xanh",
    category: "sach",
    title: "Năng lượng hạnh phúc trong gia đình số và xã hội xanh",
    summary: "Công trình tri thức về năng lượng hạnh phúc trong bối cảnh gia đình số và xã hội xanh.",
    status: "published",
    href: "/tri-thuc/sach/nang-luong-hanh-phuc-gia-dinh-so-xa-hoi-xanh",
  },
  {
    id: "kp-templates",
    slug: "bo-bieu-mau-quan-tri",
    category: "bieu-mau",
    title: "Bộ biểu mẫu quản trị doanh nghiệp",
    summary:
      "Hỗ trợ đánh giá hiện trạng, xác định vấn đề, thiết kế giải pháp, lập kế hoạch và theo dõi cải tiến. Chưa mở bán / tải công khai cho đến khi sản phẩm và quyền truy cập được phê duyệt.",
    status: "coming",
  },
  {
    id: "kp-digital",
    slug: "hoc-lieu-so",
    category: "hoc-lieu",
    title: "Học liệu số",
    summary:
      "Tài liệu, video, bài giảng và nội dung học trực tuyến. Truy cập sẽ được mở khi có sản phẩm, quyền sử dụng và quy trình kinh doanh thật.",
    status: "coming",
  },
];

export function getKnowledgeProduct(slug: string) {
  return knowledgeProducts.find((p) => p.slug === slug);
}

export function knowledgeProductPagePath(product: KnowledgeProduct) {
  return `/san-pham-tri-thuc/${product.slug}`;
}

export function knowledgeProductCanonicalPath(product: KnowledgeProduct) {
  return product.href ?? knowledgeProductPagePath(product);
}

export function knowledgeProductsOnOwnRoute() {
  return knowledgeProducts.filter(
    (product) => knowledgeProductCanonicalPath(product) === knowledgeProductPagePath(product),
  );
}

export function knowledgeProductRedirects() {
  return knowledgeProducts
    .filter((product) => knowledgeProductCanonicalPath(product) !== knowledgeProductPagePath(product))
    .map((product) => ({
      source: knowledgeProductPagePath(product),
      destination: knowledgeProductCanonicalPath(product),
      permanent: true as const,
    }));
}

export const workforce = {
  positioning:
    "Nhân lực mở và nhân lực số là lớp năng lực hỗ trợ xuyên suốt hệ sinh thái — không phải trụ cột ngang hàng 3T.",
  openTalent: {
    title: "Nhân lực mở",
    tagline: "Bổ sung chuyên môn. Linh hoạt nguồn lực. Phối hợp theo mục tiêu.",
    summary:
      "Kết nối doanh nghiệp với chuyên gia, nhân sự dự án và đội ngũ linh hoạt theo mục tiêu, công việc theo output và theo dõi chất lượng.",
    services: [
      "Kết nối chuyên gia.",
      "Nhân sự dự án.",
      "Đội ngũ linh hoạt.",
      "Công việc theo output.",
      "Theo dõi chất lượng.",
    ],
  },
  digitalTalent: {
    title: "Nhân lực số",
    tagline: "Rõ nhiệm vụ. Đúng quyền hạn. Vận hành có kiểm soát.",
    summary:
      "Thiết kế, triển khai và vận hành trợ lý AI, AI Agent và automation với human-in-the-loop, phê duyệt, phân quyền dữ liệu và giám sát.",
    services: [
      "Trợ lý AI.",
      "AI Agent.",
      "Automation.",
      "Human-in-the-loop.",
      "Approval / phê duyệt.",
      "Data access.",
      "Monitoring.",
    ],
    principles: [
      "AI hỗ trợ thực hiện. Con người giữ quyền quyết định và trách nhiệm quản trị.",
      "Không marketing theo kiểu AI thay hoàn toàn con người.",
    ],
  },
};
