import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [
  {
    id: "cs-vnpt-b2a",
    slug: "vnpt-b2a-baboso",
    organization: "VNPT",
    industry: "Viễn thông",
    challenge:
      "Đội ngũ kinh doanh trên nhiều địa bàn cần một ngôn ngữ chung để phân tích thị trường theo địa chỉ, địa bàn và chuẩn hóa hành trình khách hàng, thay vì phụ thuộc vào kinh nghiệm cá nhân.",
    solution:
      "VABIX thiết kế chương trình thực chiến kết hợp mô hình B2A (địa chỉ – địa bàn – chiến lược – kết quả) và triết lý bán hàng BABOSO, giúp chuyển tư duy thành quy trình và công cụ áp dụng được tại từng đơn vị.",
    methodologies: ["b2a", "baboso"],
    implementation:
      "Chương trình được triển khai theo đơn vị và địa bàn, với các lớp thực chiến tại VNPT Thái Bình, VNPT Bình Phước và nhiều tỉnh thành. Học viên làm trên dữ liệu và địa bàn thật, sau đó chuẩn hóa quy trình tiếp cận và chăm sóc khách hàng.",
    results:
      "Đội ngũ có khung phân tích địa bàn thống nhất, hành trình khách hàng được chuẩn hóa từ nhận diện thương hiệu đến dịch vụ và tái mua hàng. Mô hình triển khai được lặp lại trên nhiều địa điểm.",
    quote: {
      text: "Hơn 15 năm đồng hành cùng VNPT được ghi trong hồ sơ năng lực — cần xác nhận đây là thành tích Founder / đội ngũ hay pháp nhân VABIX (thành lập 2025).",
      author: "VABIX",
      role: "Hồ sơ năng lực 2026",
    },
    coverImage: "/images/covers/vnpt.jpg",
    gallery: ["/images/covers/vnpt.jpg"],
    relatedExperts: ["nguyen-chi-thanh"],
    context:
      "VNPT là tập đoàn bưu chính viễn thông với mạng lưới rộng. Việc nâng năng lực thực chiến cho đội ngũ kinh doanh đòi hỏi phương pháp vừa khoa học vừa đủ sát địa bàn.",
    lesson:
      "Với tổ chức nhiều chi nhánh, giá trị nằm ở việc chuyển tri thức thành quy trình có thể sao chép — không phải một buổi truyền cảm hứng.",
    featured: true,
  },
  {
    id: "cs-sihub",
    slug: "sihub-startup-sme",
    organization: "SIHUB",
    industry: "Khởi nghiệp & đổi mới sáng tạo",
    challenge:
      "Cộng đồng startup và SME cần tri thức quản trị thực chiến, phù hợp bối cảnh Việt Nam, chứ không phải mô hình quốc tế nguyên bản khó áp dụng.",
    solution:
      "VABIX phối hợp SIHUB (TP.HCM) triển khai chuỗi chương trình lan tỏa tri thức: quản trị dự án, nhân sự, thương hiệu, digital marketing, thuyết trình, bán hàng, chiến lược và tài chính doanh nghiệp.",
    methodologies: ["bizcar", "bmdo"],
    implementation:
      "Các lớp và hội thảo được tổ chức tại SIHUB, hướng tới ba nhóm: dự án khởi nghiệp đang tìm mô hình vận hành, startup giai đoạn định hình – tăng trưởng, và SME cần đổi mới để bứt phá. Hồ sơ ghi hội thảo đổi mới sáng tạo đã thu hút hơn 60 lãnh đạo doanh nghiệp — số liệu chờ Founder xác nhận.",
    results:
      "Hồ sơ ghi hàng trăm founder và quản lý được tiếp cận công cụ quản trị thực chiến, kết nối chuyên gia và cộng đồng. Phạm vi và số liệu chờ Founder xác nhận trước khi dùng như thành tích pháp nhân.",
    coverImage: "/images/covers/sihub.jpg",
    gallery: ["/images/covers/sihub.jpg"],
    relatedExperts: ["nguyen-chi-thanh", "tran-van-lieng"],
    context:
      "SIHUB là Trung tâm Khởi nghiệp Sáng tạo TP.HCM. Việc đưa tri thức quản trị sát thực tiễn giúp startup và SME rút ngắn khoảng cách từ ý tưởng đến vận hành.",
    lesson:
      "Lan tỏa tri thức chỉ có giá trị khi đi kèm công cụ, tình huống thật và môi trường kết nối — không dừng ở bài giảng.",
    featured: true,
  },
  {
    id: "cs-suspro",
    slug: "suspro-ai-first",
    organization: "SUSPRO",
    industry: "Doanh nghiệp sản xuất / dịch vụ",
    challenge:
      "Doanh nghiệp cần nâng năng suất marketing, bán hàng và quản trị, đồng thời chuẩn hóa quy trình thay vì số hóa manh mún.",
    solution:
      "VABIX triển khai chương trình AI-First Enterprise™, tập trung vào marketing, sales, quản trị và tự động hóa — gắn AI vào workflow thay vì khẩu hiệu.",
    methodologies: ["bizcar", "bmdo"],
    implementation:
      "Chương trình kết hợp tư duy hệ thống BizCar với các công cụ AI cho năng suất, giúp đội ngũ chuẩn hóa quy trình then chốt và đo lường thay đổi.",
    results:
      "Tư duy AI-First được hình thành trong đội ngũ then chốt, quy trình được chuẩn hóa hơn, năng suất các khâu marketing – bán hàng – quản trị được cải thiện.",
    coverImage: "/images/covers/sihub.jpg",
    gallery: ["/images/covers/sihub.jpg"],
    relatedExperts: ["nguyen-chi-thanh", "nguyen-tran-doan-khoa"],
    context:
      "SUSPRO là doanh nghiệp đồng hành trong hồ sơ năng lực VABIX 2026, đại diện cho nhóm doanh nghiệp cần chuyển đổi gắn với vận hành thật.",
    lesson:
      "AI chỉ tạo giá trị khi được gắn vào quy trình và chỉ số — không khi đứng riêng như một dự án công nghệ.",
    featured: true,
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
