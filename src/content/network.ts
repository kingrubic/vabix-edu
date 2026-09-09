import type { Handbook, Book, Partner, Testimonial, Village, Program } from "./types";

export const partners: Partner[] = [
  { id: "vnpt", name: "VNPT", caption: "Tập đoàn Bưu chính Viễn thông Việt Nam", group: "enterprise" },
  { id: "asl", name: "ASL Logistics", caption: "ASL Logistics", group: "enterprise" },
  { id: "mb", name: "MB", caption: "Ngân hàng TMCP Quân đội", group: "enterprise" },
  { id: "suspro", name: "SUSPRO", caption: "Công ty Cổ phần SUSPRO", group: "enterprise" },
  { id: "sihub", name: "SIHUB", caption: "Trung tâm Khởi nghiệp Sáng tạo TP.HCM", group: "partner" },
  { id: "csed", name: "CSED", caption: "Trung tâm Hỗ trợ Doanh nghiệp và Phát triển Kinh tế", group: "partner" },
];

export const smeSegments = [
  { id: "startup", name: "Startup" },
  { id: "family", name: "Doanh nghiệp gia đình" },
  { id: "manufacturing", name: "Doanh nghiệp sản xuất" },
  { id: "service", name: "Doanh nghiệp dịch vụ" },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Từ khi gia nhập VABIX, chúng tôi không chỉ có thêm nhiều đơn hàng chất lượng mà còn được hỗ trợ về chiến lược marketing và quản trị.",
    author: "Anh Thuyền",
    role: "CEO Công ty T&M",
  },
  {
    id: "t2",
    quote:
      "Điều tôi tâm đắc nhất ở VABIX là tính cộng đồng. Chúng tôi được kết nối với nhiều đối tác trong cùng xóm nghề để học hỏi và cùng phát triển.",
    author: "Anh Tỵ",
    role: "CEO công ty nón bảo hiểm Lê Gia",
  },
  {
    id: "t3",
    quote:
      "Các cơ hội kinh doanh mà cư dân kết nối mang lại đều rất chất lượng và đúng tệp khách hàng, giúp tỷ lệ chuyển đổi thành đơn hàng cao hơn.",
    author: "Chị Vân",
    role: "CEO Công ty V.E.V",
  },
];

export const handbooks: Handbook[] = [
  { id: "h1", slug: "quan-ly-tai-chinh-ca-nhan", title: "Quản lý tài chính cá nhân", summary: "Cẩm nang giúp cư dân và học viên làm chủ dòng tiền cá nhân.", legacyPath: "/quan-ly-tai-chinh-ca-nhan" },
  { id: "h2", slug: "lua-chon-thiet-bi-truyen-thong", title: "Lựa chọn thiết bị truyền thông", summary: "Gợi ý lựa chọn thiết bị truyền thông phù hợp nhu cầu doanh nghiệp.", legacyPath: "/lua-chon-thiet-bi-truyen-thong" },
  { id: "h3", slug: "cam-nang-ve-gao", title: "Cẩm nang về gạo", summary: "Tri thức ngành cho làng thực phẩm và nhà cung cấp liên quan.", legacyPath: "/cam-nang-ve-gao" },
  { id: "h4", slug: "cam-nang-ve-gach", title: "Cẩm nang về gạch", summary: "Cẩm nang ngành vật liệu cho làng kiến trúc và xây dựng.", legacyPath: "/cam-nang-ve-gach" },
  { id: "h5", slug: "lua-chon-noi-that", title: "Lựa chọn nội thất", summary: "Định hướng lựa chọn nội thất cho không gian sống và làm việc.", legacyPath: "/lua-chon-noi-that" },
  { id: "h6", slug: "mua-san-pham-sach", title: "Mua sản phẩm sạch", summary: "Cẩm nang lựa chọn sản phẩm sạch, minh bạch nguồn gốc.", legacyPath: "/mua-san-pham-sach" },
  { id: "h7", slug: "cam-nang-du-lich", title: "Cẩm nang du lịch", summary: "Gợi ý trải nghiệm du lịch và lưu trú trong mạng lưới VABIX.", legacyPath: "/cam-nang-du-lich" },
];

export const books: Book[] = [
  {
    id: "b1",
    slug: "quan-tri-kinh-doanh-thuc-chien-b2a",
    title: "Quản trị kinh doanh thực chiến theo mô hình B2A",
    summary: "Nền tảng tri thức của mô hình B2A — từ địa chỉ, địa bàn đến chiến lược và kết quả thị trường.",
  },
  {
    id: "b2",
    slug: "bizcar-thiet-ke-van-hanh",
    title: "BizCar — Thiết kế và vận hành doanh nghiệp",
    summary: "Khung 12 khối chức năng giúp lãnh đạo nhìn doanh nghiệp như một hệ thống thống nhất.",
  },
];

export const villages: Village[] = [
  { id: "v1", slug: "tu-van-dao-tao", name: "Tư vấn & Đào tạo", summary: "Tập hợp chuyên gia tư vấn, đào tạo và huấn luyện doanh nghiệp." },
  { id: "v2", slug: "truyen-thong-tiep-thi", name: "Truyền thông và Tiếp thị", summary: "Giải pháp marketing 360 độ từ chiến lược đến nội dung và thương hiệu." },
  { id: "v3", slug: "thuc-pham-thuc-uong", name: "Thực phẩm & Thức uống", summary: "Nhà cung cấp được thẩm định về uy tín, chất lượng và an toàn." },
  { id: "v4", slug: "tai-chinh-bao-hiem", name: "Tài chính & Bảo hiểm", summary: "Dịch vụ tài chính, bảo hiểm và tư vấn nguồn lực." },
  { id: "v5", slug: "khoa-hoc-cong-nghe", name: "Khoa học & Công nghệ", summary: "Giải pháp công nghệ, chuyển đổi số và đổi mới." },
  { id: "v6", slug: "nong-lam-ngu", name: "Nông Lâm Ngư nghiệp", summary: "Xóm nghề và nhà cung cấp chuỗi nông – lâm – ngư." },
  { id: "v7", slug: "vien-thong", name: "Viễn thông & Truyền hình", summary: "Dịch vụ viễn thông, truyền hình và hạ tầng kết nối." },
  { id: "v8", slug: "kien-truc-xay-dung", name: "Kiến trúc & Xây dựng", summary: "Thiết kế, tư vấn và thi công công trình." },
  { id: "v9", slug: "vat-tu", name: "Vật tư & Nguyên liệu", summary: "Cung ứng vật tư, nguyên liệu cho thi công và sản xuất." },
  { id: "v10", slug: "noi-that", name: "Nội thất & Ngoại thất", summary: "Giải pháp không gian sống và thương mại." },
  { id: "v11", slug: "dien-tu", name: "Điện tử & Điện cơ", summary: "Thiết bị, giải pháp điện tử và điện cơ." },
  { id: "v12", slug: "giao-nhan", name: "Giao nhận & Vận tải", summary: "Logistics, giao nhận và vận tải." },
  { id: "v13", slug: "bat-dong-san", name: "Sàn bất động sản", summary: "Kết nối nhu cầu bất động sản trong mạng lưới." },
  { id: "v14", slug: "du-lich", name: "Du lịch & Lưu trú", summary: "Dịch vụ du lịch, lưu trú và trải nghiệm." },
  { id: "v15", slug: "bao-bi", name: "Bao bì & Nhãn mác", summary: "Thiết kế và sản xuất bao bì, nhận diện." },
  { id: "v16", slug: "an-pham", name: "Ấn phẩm & Quà tặng", summary: "Ấn phẩm doanh nghiệp và quà tặng thương hiệu." },
  { id: "v17", slug: "suc-khoe", name: "Sức khỏe & Sắc đẹp", summary: "Dịch vụ và sản phẩm chăm sóc sức khỏe, sắc đẹp." },
  { id: "v18", slug: "phap-ly", name: "Dịch vụ pháp lý", summary: "Tư vấn pháp lý doanh nghiệp và tuân thủ." },
  { id: "v19", slug: "ke-toan", name: "Kế toán & Kiểm toán", summary: "Dịch vụ kế toán, kiểm toán và quản trị tài chính." },
  { id: "v20", slug: "moi-truong", name: "Vệ sinh & Môi trường", summary: "Dịch vụ vệ sinh, môi trường và cảnh quan." },
];

export const collections = [
  { slug: "quyet-dinh-bo-nhiem", title: "Quyết định bổ nhiệm", summary: "Tư liệu bổ nhiệm và dấu ấn tổ chức của VABIX." },
  { slug: "hinh-anh-ky-ket", title: "Hình ảnh ký kết", summary: "Khoảnh khắc hợp tác, ký kết và đồng hành cùng đối tác." },
  { slug: "hinh-anh-dao-tao", title: "Hình ảnh đào tạo", summary: "Các khóa huấn luyện, workshop và lớp thực chiến." },
  { slug: "hinh-anh-ket-noi", title: "Hình ảnh kết nối", summary: "Sự kiện kết nối doanh nghiệp, chuyên gia và cư dân." },
  { slug: "mau-chung-nhan", title: "Mẫu chứng nhận", summary: "Chứng nhận nhà cung cấp và cư dân trong Làng VABIX." },
];

export const supportServices = [
  { slug: "ho-tro-doanh-nhan-viet-sach", title: "Hỗ trợ doanh nhân Việt viết sách", summary: "Đồng hành doanh nhân biến tri thức thực chiến thành sách." },
  { slug: "nhan-luc-thoi-vu", title: "Nhân lực thời vụ cho sự kiện", summary: "Cung ứng nhân lực cho sự kiện, chương trình và activation." },
  { slug: "nha-dien-thuyet", title: "Nhà diễn thuyết chuyên nghiệp", summary: "Kết nối diễn giả cho hội thảo, kick-off và chương trình nội bộ." },
  { slug: "ket-noi-kol", title: "Tư vấn và kết nối KOL", summary: "Kết nối KOL phù hợp định vị thương hiệu và ngành hàng." },
];

export const programs: Program[] = [
  { id: "p1", slug: "bmdo", title: "BMDO", summary: "Xưởng thiết kế vận hành doanh nghiệp.", audience: "CEO, founder, ban lãnh đạo" },
  { id: "p2", slug: "ai-first", title: "AI-First Enterprise", summary: "Đưa AI vào workflow, năng suất và quản trị.", audience: "Doanh nghiệp đang chuyển đổi số" },
  { id: "p3", slug: "bizcar-lab", title: "BizCar Lab", summary: "Chẩn đoán 12 khối và thiết kế lại hệ thống.", audience: "Lãnh đạo SME và tập đoàn" },
];

export const supplierBenefits = [
  { n: "01", title: "Tiếp cận đúng thị trường", body: "Trustworking sàng lọc nhu cầu trước khi giới thiệu, giảm thời gian gặp đối tác không phù hợp." },
  { n: "02", title: "Hồ sơ và bằng chứng năng lực", body: "Chuẩn hóa hồ sơ cung cấp để nâng độ tin cậy khi được kết nối." },
  { n: "03", title: "Phản hồi để hoàn thiện", body: "Nhận phản hồi từ quá trình kết nối để điều chỉnh sản phẩm, dịch vụ và cách tiếp cận." },
  { n: "04", title: "Mạng lưới chuyên gia", body: "Tiếp cận chuyên môn trong hệ sinh thái khi bài toán cần đồng hành." },
  { n: "05", title: "Sự kiện và làng ngành", body: "Tham gia hoạt động cộng đồng có chủ đích, không phải giao lưu danh thiếp." },
  { n: "06", title: "Hợp tác dài hạn", body: "Theo đuổi quan hệ bền vững. VABIX không bảo đảm doanh thu hay ký kết thành công." },
];
