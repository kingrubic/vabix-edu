import type { Article, ArticleCategory } from "./types";

export const articleCategories: { id: ArticleCategory; label: string }[] = [
  { id: "insights", label: "VABIX Insights" },
  { id: "chien-luoc", label: "Chiến lược" },
  { id: "quan-tri", label: "Quản trị" },
  { id: "bizcar", label: "BizCar" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "lanh-dao", label: "Lãnh đạo" },
  { id: "ai-chuyen-doi", label: "AI & Chuyển đổi" },
  { id: "case-study", label: "Case Study" },
  { id: "hoat-dong", label: "Hoạt động VABIX" },
];

export const articles: Article[] = [
  {
    id: "a1",
    slug: "thiet-ke-va-van-hanh-doanh-nghiep-toan-dien",
    title: "Thiết kế và vận hành doanh nghiệp toàn diện",
    excerpt:
      "Doanh nghiệp không phải tập hợp ngẫu nhiên các bộ phận, mà là một chiếc xe có tài xế, bánh xe, động cơ và nhiên liệu.",
    content: `Doanh nghiệp không phải là một tập hợp ngẫu nhiên các bộ phận, mà là một chiếc xe có tài xế, bánh xe, động cơ và nhiên liệu. Nếu một bánh quay lệch, cả hành trình sẽ chệch hướng. Nhiệm vụ của người dẫn dắt là thiết kế, điều chỉnh và giữ cho chiếc xe đó chạy bền, chạy nhanh và đến đích.

Đó là luận điểm cốt lõi của mô hình BizCar — khung tư duy giúp lãnh đạo nhìn doanh nghiệp như một hệ thống 12 khối chức năng. Khi bức tranh tổng thể chưa rõ, đổi mới dễ rơi vào manh mún. Khi nhìn thấy chiếc xe, lãnh đạo biết bộ phận nào đang yếu, bánh xe nào đang trượt, cấu phần nào cần siết trước.

VABIX đồng hành với doanh nghiệp trên hành trình SEE – DESIGN – ALIGN – OPERATE: nhìn rõ, thiết kế, đồng bộ và vận hành. Tri thức chỉ có ý nghĩa khi được ứng dụng. Kết nối chỉ có giá trị khi tạo ra hợp tác bền vững.`,
    category: "bizcar",
    categoryLabel: "BizCar",
    coverImage: "/images/covers/bizcar.jpg",
    author: "Nguyễn Chí Thành",
    publishedAt: "2025-08-12",
    featured: true,
    legacyPaths: ["/thiet-ke-va-van-hanh-doanh-nghiep-toan-dien_bm.html"],
  },
  {
    id: "a2",
    slug: "giai-ma-b2a-tu-ket-noi-den-doanh-thu",
    title: "Giải mã B2A — Từ kết nối đến doanh thu",
    excerpt: "B2A giúp đội ngũ kinh doanh đi từ địa chỉ, địa bàn đến chiến lược và kết quả, thay vì kết nối chung chung.",
    content: `B2A là mô hình VABIX dùng để biến kết nối thành doanh thu có địa chỉ. Thay vì nói “mở rộng thị trường” một cách chung, B2A buộc đội ngũ trả lời: địa chỉ nào, địa bàn nào, chiến lược tiếp cận ra sao, nguồn lực phân bổ thế nào.

Bốn bước Địa chỉ → Địa bàn → Chiến lược → Kết quả đã được triển khai thực chiến cùng các đơn vị VNPT. Khi mỗi địa bàn có một cách đọc riêng, việc phủ sóng và chăm sóc khách hàng trở thành hệ thống, không còn phụ thuộc hoàn toàn vào cá nhân xuất sắc.

B2A bổ sung cho BABOSO: một bên chuẩn hóa cách đánh thị trường theo không gian, một bên chuẩn hóa hành trình khách hàng theo thời gian.`,
    category: "sales",
    categoryLabel: "Sales",
    coverImage: "/images/covers/vnpt.jpg",
    author: "VABIX",
    publishedAt: "2025-07-20",
    featured: true,
    legacyPaths: ["/giai-ma-b2a-tu-ket-noi-den-doanh-thu_bm.html"],
  },
  {
    id: "a3",
    slug: "doi-moi-sang-tao-quan-tri-sme-startup",
    title: "Đổi mới sáng tạo trong quản trị SME & Startup: tư duy thiết kế và vận hành thực chiến",
    excerpt:
      "Đổi mới không dừng ở tuyên ngôn. Hội thảo cùng SIHUB đặt đổi mới vào từng cấu phần của doanh nghiệp.",
    content: `Hội thảo “Đổi mới sáng tạo trong quản trị SME và Startup: Tư duy thiết kế và vận hành doanh nghiệp thực chiến” do SIHUB và VABIX phối hợp tổ chức đã thu hút hơn 60 lãnh đạo startup và SME.

Đổi mới sáng tạo, dưới lăng kính quản trị, phải là quá trình biến ý tưởng thành giá trị thực — sản phẩm, dịch vụ, quy trình, marketing hoặc mô hình kinh doanh. Theo BizCar, khi doanh nghiệp nhìn thấy rõ chiếc xe của mình, họ biết bánh nào cần đổi trước, tránh “đổi mới sai bánh”.

SME và startup Việt Nam giống những chiếc xe nhỏ: cần bền, linh hoạt và tiết kiệm nhiên liệu. BizCar cung cấp ngôn ngữ chung để gắn chiến lược, thị trường, sản phẩm, con người, tài chính và vận hành.`,
    category: "chien-luoc",
    categoryLabel: "Chiến lược",
    coverImage: "/images/covers/sihub.jpg",
    author: "VABIX",
    publishedAt: "2025-10-01",
    featured: true,
    legacyPaths: [
      "/huong-toi-tuong-lai-xanh-hoi-thao-cua-vabix-va-sihub-dat-nen-cho-mo-hinh-phat-trien-ben-vung-b2a_bm.html",
    ],
  },
  {
    id: "a4",
    slug: "khai-giang-bmdo-tai-sihub",
    title: "Khai giảng BMDO tại SIHUB: mở xưởng thiết kế vận hành cho doanh nghiệp Việt",
    excerpt: "BMDO không phải lớp nghe giảng. Đây là xưởng để lãnh đạo thiết kế lại năng lực vận hành của chính doanh nghiệp.",
    content: `BMDO được VABIX triển khai như xưởng thiết kế vận hành. Người học mang bài toán thật, dữ liệu thật, và ra về với phiên bản thiết kế doanh nghiệp của chính mình.

Khai giảng tại SIHUB đánh dấu việc đưa phương pháp này đến gần hơn với cộng đồng startup và SME TP.HCM — những tổ chức cần công cụ vừa khoa học vừa đủ gọn để dùng ngay.`,
    category: "quan-tri",
    categoryLabel: "Quản trị",
    coverImage: "/images/covers/sihub.jpg",
    author: "VABIX",
    publishedAt: "2025-09-10",
    featured: false,
  },
  {
    id: "a5",
    slug: "quan-tri-niem-tin",
    title: "Quản trị niềm tin — Lý thuyết nền, vũ khí thực thi cho doanh nghiệp trong kỷ nguyên tăng tốc",
    excerpt: "Tăng tốc không bền nếu thiếu niềm tin bên trong tổ chức và với thị trường.",
    content: `Trong kỷ nguyên tăng tốc, doanh nghiệp dễ chạy theo công cụ và kênh mới trong khi bỏ quên nền tảng: niềm tin. Quản trị niềm tin không phải khẩu hiệu văn hóa. Đó là cách tổ chức giữ lời, vận hành minh bạch và tạo ra trải nghiệm nhất quán — những điều khách hàng, nhân sự và đối tác cảm nhận được hàng ngày.

VABIX đặt niềm tin trong sáu chữ vàng, đặc biệt là Thực tín: giữ lời, hành động đúng sự thật, công khai và đáng tin cậy.`,
    category: "lanh-dao",
    categoryLabel: "Lãnh đạo",
    coverImage: "/images/covers/experts.jpg",
    author: "VABIX",
    publishedAt: "2025-08-01",
    featured: false,
  },
  {
    id: "a6",
    slug: "hanh-trinh-van-dam-cung-mybizcar",
    title: "Hành trình vạn dặm cùng MyBizCar",
    excerpt: "BizCar không dừng ở infographic. MyBizCar là hành trình mỗi lãnh đạo tự lái doanh nghiệp của mình.",
    content: `MyBizCar là cách VABIX mời lãnh đạo biến khung 12 khối thành bản đồ sống của chính doanh nghiệp. Mỗi chặng đường là một lần nhìn lại: chiến lược còn khớp thị trường? Nguồn lực có nuôi được vận hành? Văn hóa có phải loại nhớt đúng cho hệ thống?

Hành trình vạn dặm không bắt đầu bằng tốc độ. Nó bắt đầu bằng việc nhìn đúng chiếc xe đang có.`,
    category: "bizcar",
    categoryLabel: "BizCar",
    coverImage: "/images/covers/bizcar.jpg",
    author: "VABIX",
    publishedAt: "2025-11-02",
    featured: false,
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function articlesByCategory(category?: ArticleCategory) {
  const list = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return category ? list.filter((a) => a.category === category) : list;
}
