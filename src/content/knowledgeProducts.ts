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
    summary:
      "Kết nối doanh nghiệp với chuyên gia, cộng tác viên và đội ngũ chuyên môn linh hoạt theo dự án, giai đoạn hoặc kết quả đã thỏa thuận.",
    services: [
      "Kết nối theo lĩnh vực.",
      "Bố trí nhân sự dự án.",
      "Hình thành đội ngũ linh hoạt.",
      "Dịch vụ chuyên môn theo kết quả.",
      "Theo dõi / đánh giá hiệu quả.",
    ],
  },
  digitalTalent: {
    title: "Nhân lực số",
    summary:
      "Thiết kế, triển khai và vận hành AI Agent / hệ thống tự động phù hợp từng công việc dưới sự giám sát và điều phối của con người.",
    services: [
      "Xác định use case.",
      "Thiết kế vai trò / nhiệm vụ.",
      "Xây dựng Agent.",
      "Phối hợp human–AI.",
      "Cung cấp / vận hành theo dịch vụ.",
      "Theo dõi / kiểm soát / cải tiến.",
    ],
    principles: [
      "Không tuyên bố AI thay thế hoàn toàn con người.",
      "Nhấn mạnh quyền hạn, dữ liệu, trách nhiệm, kiểm soát và cơ chế phê duyệt đối với tác vụ quan trọng.",
    ],
  },
};
