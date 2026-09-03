import type { Expert } from "./types";

export const experts: Expert[] = [
  {
    id: "exp-01",
    slug: "nguyen-chi-thanh",
    name: "Nguyễn Chí Thành",
    title: "Nhà sáng lập mô hình BizCar",
    organizationRole: "Nhà sáng lập VABIX · Chủ tịch HĐQT kiêm Tổng Giám đốc",
    expertise: ["BizCar", "BMDO", "B2A", "Chiến lược", "Thiết kế vận hành"],
    shortBio:
      "Nhà sáng lập VABIX và mô hình BizCar. Tác giả các khung BMDO, MTA Engine, B2A — đồng hành cùng doanh nghiệp Việt trong tư duy thiết kế và vận hành thực chiến.",
    fullBio:
      "Ông Nguyễn Chí Thành là Nhà sáng lập VABIX, Chủ tịch HĐQT kiêm Tổng Giám đốc Công ty Cổ phần VABIX, đồng thời là tác giả mô hình BizCar. Ông đã nghiên cứu và triển khai các khung tư duy quản trị thực chiến — trong đó có BMDO, MTA Engine và B2A — nhằm giúp lãnh đạo nhìn doanh nghiệp như một hệ thống thống nhất, nhận diện điểm nghẽn và thiết kế lại năng lực vận hành phù hợp từng giai đoạn. Ông thường xuyên đồng hành cùng các tổ chức lớn như VNPT, cộng đồng startup và SME tại SIHUB, cũng như nhiều doanh nghiệp Việt Nam trên hành trình kiến tạo nội lực và mở rộng kết nối.",
    portrait: "/images/portraits/nguyen-chi-thanh.png",
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
    title: "Chuyên gia quản trị chiến lược",
    organizationRole: "Cố vấn cao cấp · Chủ tịch Hội Chất lượng TP.HCM",
    expertise: ["Quản trị chiến lược", "Chất lượng", "Hệ thống quản trị"],
    shortBio:
      "Cố vấn cao cấp của VABIX, Chủ tịch Hội Chất lượng TP.HCM, chuyên gia quản trị chiến lược với kinh nghiệm đồng hành cùng doanh nghiệp Việt.",
    fullBio:
      "Tiến sĩ Trần Văn Liêng là cố vấn cao cấp của VABIX, Chủ tịch Hội Chất lượng TP.HCM. Ông đóng góp tư duy hệ thống và chuẩn mực chất lượng vào các chương trình tư vấn, đào tạo của VABIX, giúp doanh nghiệp gắn chiến lược với vận hành và đo lường hiệu quả thực tế.",
    portrait: "/images/portraits/expert-02.png",
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
    title: "Chuyên gia Marketing & Facilitation TOT",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Marketing", "Facilitation", "Training of Trainers"],
    shortBio:
      "Chuyên gia marketing và facilitation TOT, đồng hành cùng VABIX trong thiết kế học liệu và dẫn giảng theo phương pháp học để làm.",
    fullBio:
      "Thạc sĩ Đặng Minh Nguyên chuyên về marketing và facilitation TOT. Ông hỗ trợ VABIX chuyển tri thức thành công cụ thực hành, giúp học viên tự phân tích tình huống và xây dựng giải pháp cho chính doanh nghiệp của mình.",
    portrait: "/images/portraits/expert-03.png",
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
    title: "Chuyên gia đối ngoại và hợp tác",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Đối ngoại", "Hợp tác đối tác", "Kết nối mạng lưới"],
    shortBio:
      "Chuyên gia đối ngoại và phát triển đối tác, kết nối VABIX với các tổ chức, hiệp hội và cộng đồng doanh nghiệp.",
    fullBio:
      "Thạc sĩ Nguyễn Thị Thanh Thùy phụ trách đối ngoại và hợp tác đối tác tại mạng lưới VABIX. Bà hỗ trợ thiết kế các mô hình hợp tác với doanh nghiệp, trường đại học, viện đào tạo và tổ chức hỗ trợ doanh nghiệp.",
    portrait: "/images/portraits/expert-04.png",
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
    title: "Chuyên gia quản trị nhân sự",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Quản trị nhân sự", "Tổ chức", "Phát triển đội ngũ"],
    shortBio:
      "Chuyên gia quản trị nhân sự, hỗ trợ doanh nghiệp thiết kế cơ cấu, cơ chế phối hợp và phát triển năng lực đội ngũ.",
    fullBio:
      "Thạc sĩ Hồ Xuân Vinh đồng hành cùng VABIX trong các chương trình quản trị nhân sự và tổ chức. Ông giúp doanh nghiệp gắn con người với hệ thống vận hành, thay vì xử lý nhân sự như một bộ phận tách rời.",
    portrait: "/images/portraits/expert-05.png",
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
    title: "Chuyên gia marketing & hệ thống truyền thông",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Marketing", "Truyền thông", "Hệ thống thương hiệu"],
    shortBio:
      "Chuyên gia marketing và hệ thống truyền thông, hỗ trợ doanh nghiệp chuẩn hóa thương hiệu và thông điệp thị trường.",
    fullBio:
      "Thạc sĩ Kiều Tấn Vũ chuyên về marketing và hệ thống truyền thông. Ông tham gia các chương trình huấn luyện thương hiệu, digital marketing và chuẩn hóa thông điệp cho doanh nghiệp trong mạng lưới VABIX.",
    portrait: "/images/portraits/expert-06.png",
    featured: true,
    order: 6,
    programs: ["baboso"],
    caseStudies: ["sihub-startup-sme"],
    articles: [],
  },
  {
    id: "exp-07",
    slug: "dang-thi-cam-hiep",
    name: "ThS., NCS. Đặng Thị Cẩm Hiệp",
    title: "Chuyên gia Marketing & Thương mại điện tử",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Marketing", "Thương mại điện tử", "Chuyển đổi số"],
    shortBio:
      "Chuyên gia marketing và thương mại điện tử, đồng hành cùng doanh nghiệp trên hành trình số hóa kênh bán và trải nghiệm khách hàng.",
    fullBio:
      "Thạc sĩ, nghiên cứu sinh Đặng Thị Cẩm Hiệp chuyên sâu marketing và thương mại điện tử. Bà hỗ trợ các chương trình thực chiến giúp doanh nghiệp kết nối thị trường số với vận hành nội bộ.",
    portrait: "/images/portraits/expert-07.png",
    featured: false,
    order: 7,
    programs: ["baboso"],
    caseStudies: [],
    articles: [],
  },
  {
    id: "exp-08",
    slug: "le-anh-tu",
    name: "Lê Anh Tú",
    title: "Chuyên gia tài chính",
    organizationRole: "Chuyên gia VABIX · Kinh nghiệm PwC",
    expertise: ["Tài chính doanh nghiệp", "Kiểm toán", "Quản trị hiệu quả"],
    shortBio:
      "Chuyên gia tài chính với kinh nghiệm tại PwC, hỗ trợ doanh nghiệp đọc đúng sức khỏe tài chính và thiết kế công cụ quản trị.",
    fullBio:
      "Ông Lê Anh Tú mang kinh nghiệm tài chính và kiểm toán từ môi trường PwC vào các chương trình VABIX. Ông giúp lãnh đạo nhìn rõ dòng tiền, cấu trúc chi phí và các chỉ số cần theo dõi khi thiết kế lại vận hành.",
    portrait: "/images/portraits/expert-02.png",
    featured: false,
    order: 8,
    programs: ["bizcar"],
    caseStudies: [],
    articles: [],
  },
  {
    id: "exp-09",
    slug: "pham-kim-phuong",
    name: "ThS. Phạm Kim Phượng",
    title: "Chuyên gia tài chính & thương mại điện tử",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Tài chính", "Thương mại điện tử"],
    shortBio:
      "Chuyên gia tài chính và thương mại điện tử, kết nối quản trị dòng tiền với mô hình kinh doanh số.",
    fullBio:
      "Thạc sĩ Phạm Kim Phượng đồng hành cùng VABIX trong các chuyên đề tài chính doanh nghiệp và thương mại điện tử, giúp học viên chuyển số liệu thành quyết định.",
    portrait: "/images/portraits/expert-04.png",
    featured: false,
    order: 9,
    programs: [],
    caseStudies: [],
    articles: [],
  },
  {
    id: "exp-10",
    slug: "vu-thi-huyen",
    name: "Luật sư Vũ Thị Huyền",
    title: "Chuyên gia pháp lý & sở hữu trí tuệ",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Pháp lý doanh nghiệp", "Sở hữu trí tuệ"],
    shortBio:
      "Luật sư chuyên về pháp lý doanh nghiệp và sở hữu trí tuệ, hỗ trợ doanh nghiệp vận hành đúng khung pháp luật.",
    fullBio:
      "Luật sư Vũ Thị Huyền tư vấn pháp lý và sở hữu trí tuệ trong hệ sinh thái VABIX, giúp doanh nghiệp bảo vệ tài sản tri thức và tuân thủ khi mở rộng kết nối.",
    portrait: "/images/portraits/expert-07.png",
    featured: false,
    order: 10,
    programs: [],
    caseStudies: [],
    articles: [],
  },
  {
    id: "exp-11",
    slug: "nguyen-tran-doan-khoa",
    name: "Nguyễn Trần Đoan Khoa",
    title: "Chuyên gia chuyển đổi số & AI",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Chuyển đổi số", "AI", "Năng suất"],
    shortBio:
      "Chuyên gia chuyển đổi số và AI, hỗ trợ doanh nghiệp đưa công nghệ vào quy trình thay vì dừng ở khẩu hiệu.",
    fullBio:
      "Ông Nguyễn Trần Đoan Khoa đồng hành cùng các chương trình AI-First Enterprise của VABIX, giúp lãnh đạo và đội ngũ đưa AI vào workflow, năng suất và ra quyết định.",
    portrait: "/images/portraits/expert-06.png",
    featured: false,
    order: 11,
    programs: ["bmdo"],
    caseStudies: ["vnpt-ai-first", "suspro-ai-first"],
    articles: [],
  },
  {
    id: "exp-12",
    slug: "nguyen-van-quyet",
    name: "Nguyễn Văn Quyết",
    title: "Chuyên gia đào tạo & khởi nghiệp sáng tạo",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Đào tạo", "Khởi nghiệp", "Sáng tạo"],
    shortBio:
      "Chuyên gia đào tạo và khởi nghiệp sáng tạo, đồng hành cùng startup và SME trong việc định hình mô hình vận hành.",
    fullBio:
      "Ông Nguyễn Văn Quyết tham gia các chương trình lan tỏa tri thức cùng SIHUB và cộng đồng khởi nghiệp, giúp founder tiếp cận công cụ quản trị thực chiến.",
    portrait: "/images/portraits/expert-03.png",
    featured: false,
    order: 12,
    programs: ["klass"],
    caseStudies: ["sihub-startup-sme"],
    articles: [],
  },
  {
    id: "exp-13",
    slug: "nguyen-dang-khoa",
    name: "ThS/NCS Nguyễn Đăng Khoa",
    title: "Chuyên gia tài chính & AI trong tài chính",
    organizationRole: "Chuyên gia VABIX",
    expertise: ["Tài chính", "AI trong tài chính"],
    shortBio:
      "Chuyên gia tài chính và ứng dụng AI trong tài chính, hỗ trợ doanh nghiệp đo lường và ra quyết định dựa trên dữ liệu.",
    fullBio:
      "Thạc sĩ, nghiên cứu sinh Nguyễn Đăng Khoa chuyên về tài chính và AI trong tài chính. Ông đóng góp vào các chương trình giúp doanh nghiệp gắn dữ liệu với quản trị hiệu quả.",
    portrait: "/images/portraits/expert-05.png",
    featured: false,
    order: 13,
    programs: [],
    caseStudies: ["sihub-startup-sme"],
    articles: [],
  },
];

export const featuredExperts = experts.filter((e) => e.featured).sort((a, b) => a.order - b.order);

export function getExpert(slug: string) {
  return experts.find((e) => e.slug === slug);
}
