import type { Expert } from "./types";

// Order, names, titles and portraits follow the owner's reference layout (2026-10-08):
// left column top to bottom, then right column top to bottom.
export const experts: Expert[] = [
  {
    id: "exp-01",
    slug: "nguyen-chi-thanh",
    name: "Nguyễn Chí Thành",
    title: "Nhà sáng lập VABIX, người kiến tạo các học thuyết và mô hình trí thức Việt.",
    organizationRole: "Nhà sáng lập VABIX · Chủ tịch HĐQT kiêm Tổng Giám đốc",
    expertise: ["BizCar", "BMDO", "B2A", "Chiến lược", "Thiết kế vận hành"],
    shortBio:
      "Nhà sáng lập VABIX và mô hình BizCar. Tác giả các khung BMDO, MTA Engine, B2A — đồng hành cùng doanh nghiệp Việt trong tư duy thiết kế và vận hành thực chiến.",
    fullBio:
      "Ông Nguyễn Chí Thành là Nhà sáng lập VABIX, Chủ tịch HĐQT kiêm Tổng Giám đốc Công ty Cổ phần VABIX, đồng thời là tác giả mô hình BizCar. Ông đã nghiên cứu và triển khai các khung tư duy quản trị thực chiến — trong đó có BMDO, MTA Engine và B2A — nhằm giúp lãnh đạo nhìn doanh nghiệp như một hệ thống thống nhất, nhận diện điểm nghẽn và thiết kế lại năng lực vận hành phù hợp từng giai đoạn. Ông đồng hành cùng cộng đồng doanh nghiệp Việt Nam trên hành trình kiến tạo nội lực và mở rộng kết nối.",
    portrait: "/images/portraits/nguyen-chi-thanh.webp",
    featured: true,
    order: 1,
    programs: ["bizcar", "bmdo", "b2a"],
    caseStudies: ["vnpt-b2a-baboso", "sihub-startup-sme", "suspro-ai-first"],
    articles: ["thiet-ke-va-van-hanh-doanh-nghiep-toan-dien", "giai-ma-b2a-tu-ket-noi-den-doanh-thu"],
  },
  {
    id: "exp-02",
    slug: "tran-van-lieng",
    name: "TS. Trần Văn Liêng",
    title: "Cố vấn cấp cao; Chủ tịch Hội chất lượng TPHCM, Chuyên gia quản trị chiến lược",
    organizationRole: "Cố vấn cấp cao · Chủ tịch Hội chất lượng TPHCM",
    expertise: ["Quản trị chiến lược", "Chất lượng", "Hệ thống quản trị"],
    shortBio:
      "Cố vấn cấp cao của VABIX, Chủ tịch Hội chất lượng TPHCM, chuyên gia quản trị chiến lược với kinh nghiệm đồng hành cùng doanh nghiệp Việt.",
    fullBio:
      "Tiến sĩ Trần Văn Liêng là cố vấn cấp cao của VABIX, Chủ tịch Hội chất lượng TPHCM và chuyên gia quản trị chiến lược. Ông đóng góp tư duy hệ thống và chuẩn mực chất lượng vào các chương trình tư vấn, đào tạo của VABIX, giúp doanh nghiệp gắn chiến lược với vận hành và đo lường hiệu quả thực tế.",
    portrait: "/images/portraits/tran-van-lieng.webp",
    featured: true,
    order: 2,
    programs: ["bmdo"],
    caseStudies: ["sihub-startup-sme"],
    articles: [],
  },
  {
    id: "exp-03",
    slug: "dang-minh-nguyen",
    name: "ThS. Đặng Minh Nguyên",
    title: "Chuyên gia Marketing và Facilitation TOT",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Marketing", "Facilitation", "Training of Trainers"],
    shortBio:
      "Chuyên gia marketing và facilitation TOT, đồng hành cùng VABIX trong thiết kế học liệu và dẫn giảng theo phương pháp học để làm.",
    fullBio:
      "Thạc sĩ Đặng Minh Nguyên chuyên về marketing và facilitation TOT. Ông hỗ trợ VABIX chuyển tri thức thành công cụ thực hành, giúp học viên tự phân tích tình huống và xây dựng giải pháp cho chính doanh nghiệp của mình.",
    portrait: "/images/portraits/dang-minh-nguyen.webp",
    featured: true,
    order: 3,
    programs: ["klass"],
    caseStudies: ["sihub-startup-sme"],
    articles: [],
  },
  {
    id: "exp-04",
    slug: "nguyen-thi-thanh-thuy",
    name: "ThS. Nguyễn Thị Thanh Thùy",
    title: "Chuyên gia quan hệ và đối ngoại; phụ trách Partnership.",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Đối ngoại", "Hợp tác đối tác", "Kết nối mạng lưới"],
    shortBio:
      "Chuyên gia quan hệ và đối ngoại, phụ trách Partnership — kết nối VABIX với các tổ chức, hiệp hội và cộng đồng doanh nghiệp.",
    fullBio:
      "Thạc sĩ Nguyễn Thị Thanh Thùy là chuyên gia quan hệ và đối ngoại, phụ trách Partnership tại mạng lưới VABIX. Bà hỗ trợ thiết kế các mô hình hợp tác với doanh nghiệp, trường đại học, viện đào tạo và tổ chức hỗ trợ doanh nghiệp.",
    portrait: "/images/portraits/nguyen-thi-thanh-thuy.webp",
    featured: true,
    order: 4,
    programs: [],
    caseStudies: [],
    articles: [],
  },
  {
    id: "exp-05",
    slug: "ho-xuan-vinh",
    name: "ThS. Hồ Xuân Vinh",
    title: "Chuyên gia Quản trị nguồn nhân lực",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Quản trị nguồn nhân lực", "Tổ chức", "Phát triển đội ngũ"],
    shortBio:
      "Chuyên gia quản trị nguồn nhân lực, hỗ trợ doanh nghiệp thiết kế cơ cấu, cơ chế phối hợp và phát triển năng lực đội ngũ.",
    fullBio:
      "Thạc sĩ Hồ Xuân Vinh đồng hành cùng VABIX trong các chương trình quản trị nguồn nhân lực và tổ chức. Ông giúp doanh nghiệp gắn con người với hệ thống vận hành, thay vì xử lý nhân sự như một bộ phận tách rời.",
    portrait: "/images/portraits/ho-xuan-vinh.webp",
    featured: true,
    order: 5,
    programs: ["bizcar"],
    caseStudies: ["suspro-ai-first"],
    articles: [],
  },
  {
    id: "exp-06",
    slug: "kieu-tan-vu",
    name: "ThS. Kiều Tấn Vũ",
    title: "Chuyên gia Marketing và hệ thống truyền thông.",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Marketing", "Truyền thông", "Hệ thống thương hiệu"],
    shortBio:
      "Chuyên gia marketing và hệ thống truyền thông, hỗ trợ doanh nghiệp chuẩn hóa thương hiệu và thông điệp thị trường.",
    fullBio:
      "Thạc sĩ Kiều Tấn Vũ chuyên về marketing và hệ thống truyền thông. Ông tham gia các chương trình huấn luyện thương hiệu, digital marketing và chuẩn hóa thông điệp cho doanh nghiệp trong mạng lưới VABIX.",
    portrait: "/images/portraits/kieu-tan-vu.webp",
    featured: true,
    order: 6,
    programs: ["baboso"],
    caseStudies: ["sihub-startup-sme"],
    articles: [],
  },
  {
    id: "exp-08",
    slug: "le-anh-tu",
    name: "Lê Anh Tú",
    title: "Chuyên gia tài chính, Kinh nghiệm nhiều năm tại PWC",
    organizationRole: "Chuyên gia VABIX · Kinh nghiệm nhiều năm tại PwC",
    expertise: ["Tài chính doanh nghiệp", "Kiểm toán", "Quản trị hiệu quả"],
    shortBio:
      "Chuyên gia tài chính với nhiều năm kinh nghiệm tại PwC, hỗ trợ doanh nghiệp đọc đúng sức khỏe tài chính và thiết kế công cụ quản trị.",
    fullBio:
      "Ông Lê Anh Tú là chuyên gia tài chính, mang nhiều năm kinh nghiệm tài chính và kiểm toán tại PwC vào các chương trình VABIX. Ông giúp lãnh đạo nhìn rõ dòng tiền, cấu trúc chi phí và các chỉ số cần theo dõi khi thiết kế lại vận hành.",
    portrait: "/images/portraits/le-anh-tu.webp",
    featured: true,
    order: 7,
    programs: ["bizcar"],
    caseStudies: [],
    articles: [],
  },
  {
    id: "exp-09",
    slug: "pham-kim-phuong",
    name: "ThS. Phạm Kim Phượng",
    title: "Chuyên gia tài chính & TMĐT",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Tài chính", "Thương mại điện tử"],
    shortBio:
      "Chuyên gia tài chính và thương mại điện tử, kết nối quản trị dòng tiền với mô hình kinh doanh số.",
    fullBio:
      "Thạc sĩ Phạm Kim Phượng đồng hành cùng VABIX trong các chuyên đề tài chính doanh nghiệp và thương mại điện tử, giúp học viên chuyển số liệu thành quyết định.",
    portrait: "/images/portraits/pham-kim-phuong.webp",
    featured: true,
    order: 8,
    programs: [],
    caseStudies: [],
    articles: [],
  },
  {
    id: "exp-10",
    slug: "vu-thi-huyen",
    name: "Luật sư Vũ Thị Huyền",
    title: "Chuyên gia pháp lý và sở hữu trí tuệ.",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Pháp lý doanh nghiệp", "Sở hữu trí tuệ"],
    shortBio:
      "Luật sư chuyên về pháp lý doanh nghiệp và sở hữu trí tuệ, hỗ trợ doanh nghiệp vận hành đúng khung pháp luật.",
    fullBio:
      "Luật sư Vũ Thị Huyền tư vấn pháp lý và sở hữu trí tuệ trong hệ sinh thái VABIX, giúp doanh nghiệp bảo vệ tài sản tri thức và tuân thủ khi mở rộng kết nối.",
    portrait: "/images/portraits/vu-thi-huyen.webp",
    featured: true,
    order: 9,
    programs: [],
    caseStudies: [],
    articles: [],
  },
  {
    id: "exp-11",
    slug: "nguyen-tran-doan-khoa",
    name: "Nguyễn Trần Đoan Khoa",
    title: "Chuyên gia chuyển đổi số và AI",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Chuyển đổi số", "AI", "Năng suất"],
    shortBio:
      "Chuyên gia chuyển đổi số và AI, hỗ trợ doanh nghiệp đưa công nghệ vào quy trình thay vì dừng ở khẩu hiệu.",
    fullBio:
      "Ông Nguyễn Trần Đoan Khoa đồng hành cùng các chương trình AI-First Enterprise của VABIX, giúp lãnh đạo và đội ngũ đưa AI vào workflow, năng suất và ra quyết định.",
    portrait: "/images/portraits/nguyen-tran-doan-khoa-2026.webp",
    featured: true,
    order: 10,
    programs: ["bmdo"],
    caseStudies: ["vnpt-ai-first", "suspro-ai-first"],
    articles: [],
  },
  {
    id: "exp-12",
    slug: "nguyen-van-quyet",
    name: "Nguyễn Văn Quyết",
    title: "Chuyên gia đào tạo Khởi nghiệp sáng tạo",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Đào tạo", "Khởi nghiệp", "Sáng tạo"],
    shortBio:
      "Chuyên gia đào tạo khởi nghiệp sáng tạo, đồng hành cùng startup và SME trong việc định hình mô hình vận hành.",
    fullBio:
      "Ông Nguyễn Văn Quyết tham gia các chương trình lan tỏa tri thức cùng SIHUB và cộng đồng khởi nghiệp, giúp founder tiếp cận công cụ quản trị thực chiến.",
    portrait: "/images/portraits/nguyen-van-quyet.webp",
    featured: true,
    order: 11,
    programs: ["klass"],
    caseStudies: ["sihub-startup-sme"],
    articles: [],
  },
  {
    id: "exp-14",
    slug: "tran-anh-vu",
    name: "NCS Trần Anh Vũ",
    title: "Chuyên gia AI Marketing & Đạo diễn",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["AI hệ thống", "Marketing"],
    shortBio:
      "Chuyên gia AI Marketing và đạo diễn, đồng hành cùng doanh nghiệp đưa AI vào vận hành có kiểm soát, gắn marketing với hệ thống thay vì công cụ rời rạc.",
    fullBio:
      "Nghiên cứu sinh Trần Anh Vũ là chuyên gia AI Marketing và đạo diễn. Ông đồng hành cùng VABIX trong các chương trình giúp doanh nghiệp thiết kế năng lực số, ứng dụng AI có kiểm soát và chuẩn hóa hoạt động marketing trên một hệ thống thống nhất. AI hỗ trợ thực hiện; con người giữ quyền quyết định và trách nhiệm quản trị.",
    portrait: "/images/portraits/tran-anh-vu.webp",
    featured: true,
    order: 12,
    programs: ["ung-dung-ai-hieu-suat"],
    caseStudies: [],
    articles: [],
  },
];

export const featuredExperts = experts.filter((e) => e.featured).sort((a, b) => a.order - b.order);

export function getExpert(slug: string) {
  return experts.find((e) => e.slug === slug);
}
