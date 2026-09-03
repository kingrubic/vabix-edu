import type { Solution } from "./types";

export const solutions: Solution[] = [
  {
    id: "sol-01",
    slug: "tu-van-chien-luoc",
    pillar: "tri-thuc",
    number: "01",
    title: "Tư vấn chiến lược",
    shortTitle: "Tư vấn chiến lược",
    summary:
      "VABIX giúp lãnh đạo nhìn rõ hiện trạng, xác lập ưu tiên và chuyển chiến lược thành một lộ trình có thể thực thi.",
    whoFor: [
      "Chủ doanh nghiệp và Ban lãnh đạo cần định hướng lại chiến lược tăng trưởng",
      "Doanh nghiệp đang mở rộng nhưng chiến lược chưa thành kế hoạch hành động",
      "Tổ chức muốn thiết kế lại mô hình kinh doanh và kiến trúc doanh nghiệp",
    ],
    painPoints: [
      "Chiến lược thiếu rõ ràng hoặc chưa chuyển hóa thành kế hoạch hành động",
      "Ưu tiên phân tán, lãnh đạo xử lý tình thế hơn là dẫn dắt hệ thống",
      "Mô hình quản trị chưa phù hợp bối cảnh Việt Nam",
    ],
    outcomes: [
      "Bức tranh hiện trạng và ưu tiên chiến lược được làm rõ",
      "Lộ trình phát triển theo giai đoạn, gắn với nguồn lực thực tế",
      "Công cụ theo dõi và điều chỉnh để đội ngũ tự vận hành",
    ],
    scope: [
      "Định hướng và thiết kế chiến lược phát triển",
      "Thiết kế mô hình kinh doanh và kiến trúc doanh nghiệp",
      "Tái cấu trúc tổ chức và cơ chế phối hợp",
      "Chiến lược thị trường, thương hiệu và bán hàng",
      "Chiến lược nhân sự, tài chính và nguồn lực cốt lõi",
      "Chuẩn hóa quy trình và hệ thống vận hành",
    ],
    process: [
      { step: "01", title: "Khảo sát và chẩn đoán", body: "Thu thập thông tin, phân tích nội tại và bối cảnh thị trường, nhận diện SWOT." },
      { step: "02", title: "Xác lập mục tiêu", body: "Làm rõ tầm nhìn, mục tiêu chiến lược và các vấn đề cần ưu tiên." },
      { step: "03", title: "Thiết kế giải pháp", body: "Xây dựng giải pháp tổng thể và kế hoạch hành động theo giai đoạn." },
      { step: "04", title: "Đồng hành triển khai", body: "Hỗ trợ thực thi, theo dõi tiến độ, phản biện và điều chỉnh." },
      { step: "05", title: "Chuyển giao năng lực", body: "Đo lường kết quả và chuyển giao công cụ để doanh nghiệp tự vận hành." },
    ],
    deliverables: [
      "Báo cáo chẩn đoán hiện trạng",
      "Bản đồ ưu tiên chiến lược",
      "Lộ trình triển khai theo giai đoạn",
      "Bộ công cụ theo dõi và điều chỉnh",
    ],
    methodologies: ["bizcar", "bmdo", "kora"],
    faqs: [
      { question: "Tư vấn chiến lược của VABIX khác chương trình đào tạo như thế nào?", answer: "Tư vấn xuất phát từ bài toán cụ thể của doanh nghiệp: khảo sát, chẩn đoán, thiết kế lộ trình và đồng hành triển khai. Đào tạo tập trung nâng năng lực lãnh đạo và đội ngũ. Hai hình thức thường được kết hợp khi doanh nghiệp vừa cần định hướng vừa cần năng lực thực thi." },
      { question: "Doanh nghiệp quy mô vừa và nhỏ có phù hợp không?", answer: "Có. BizCar và quy trình tư vấn của VABIX được thiết kế để SME và startup nhìn thấy toàn hệ thống, ưu tiên đúng chỗ thay vì áp dụng mô hình quốc tế nguyên bản." },
    ],
  },
  {
    id: "sol-02",
    slug: "dao-tao-doanh-nhan",
    pillar: "tri-thuc",
    number: "02",
    title: "Đào tạo doanh nhân",
    shortTitle: "Đào tạo doanh nhân",
    summary:
      "Phát triển tư duy lãnh đạo, năng lực quản trị và khả năng thiết kế mô hình kinh doanh cho founder, CEO, thế hệ kế cận và đội ngũ quản lý.",
    whoFor: [
      "Founder, CEO và chủ doanh nghiệp",
      "Thế hệ kế cận trong doanh nghiệp gia đình",
      "Đội ngũ quản lý cần tư duy hệ thống",
    ],
    painPoints: [
      "Đội ngũ quản lý thiếu tư duy hệ thống và công cụ vận hành thực chiến",
      "Ra quyết định dựa trên kinh nghiệm cá nhân hơn là dữ liệu và hệ thống",
      "Thiếu thế hệ kế cận và văn hóa doanh nghiệp đủ mạnh",
    ],
    outcomes: [
      "Tư duy chiến lược và tầm nhìn dài hạn được củng cố",
      "Năng lực lãnh đạo bản thân và đội ngũ được nâng lên",
      "Biết thiết kế và vận hành mô hình kinh doanh hiệu quả",
    ],
    scope: [
      "Phát triển tư duy chiến lược và tầm nhìn dài hạn",
      "Nâng cao năng lực lãnh đạo và tự quản trị",
      "Thiết kế và vận hành mô hình kinh doanh",
      "Ra quyết định dựa trên dữ liệu và hệ thống",
      "Xây dựng đội ngũ kế cận và văn hóa doanh nghiệp",
    ],
    process: [
      { step: "01", title: "Nhận diện", body: "Xác định hồ sơ người học, bối cảnh doanh nghiệp và mục tiêu năng lực." },
      { step: "02", title: "Thiết kế", body: "Xây dựng chương trình theo tình huống thực, công cụ và bài tập áp dụng." },
      { step: "03", title: "Dẫn giảng", body: "Facilitation: câu hỏi – tình huống – công cụ – giải pháp cho doanh nghiệp." },
      { step: "04", title: "Áp dụng", body: "Học viên thiết kế giải pháp ngay trong chương trình, trên dữ liệu thật." },
      { step: "05", title: "Đo lường", body: "Phản biện kết quả, điều chỉnh và chuyển giao công cụ tự vận hành." },
    ],
    deliverables: [
      "Khung năng lực lãnh đạo áp dụng được",
      "Bản thiết kế mô hình / ưu tiên chiến lược của chính doanh nghiệp",
      "Bộ công cụ và mẫu biểu thực hành",
    ],
    methodologies: ["bizcar", "bmdo", "klass"],
    faqs: [
      { question: "Chương trình có dành cho người mới khởi nghiệp không?", answer: "Có. VABIX thiết kế theo giai đoạn doanh nghiệp. Startup và SME được tiếp cận ngôn ngữ chung để gắn chiến lược, thị trường, con người, tài chính và vận hành." },
    ],
  },
  {
    id: "sol-03",
    slug: "huan-luyen-doanh-nghiep",
    pillar: "tri-thuc",
    number: "03",
    title: "Huấn luyện doanh nghiệp",
    shortTitle: "Huấn luyện doanh nghiệp",
    summary:
      "Chương trình được thiết kế theo nhu cầu, ngành nghề và bài toán tổ chức, kết hợp tri thức, tình huống thực tế và coaching sau lớp.",
    whoFor: [
      "Doanh nghiệp cần nâng năng lực một khối chức năng cụ thể",
      "Đội ngũ bán hàng, marketing, nhân sự, tài chính, vận hành",
      "Tổ chức muốn gắn đào tạo với KPI và thay đổi hành vi",
    ],
    painPoints: [
      "Các bộ phận hoạt động rời rạc, thiếu cơ chế phối hợp",
      "Đào tạo nội bộ dừng ở lý thuyết, ít chuyển thành công cụ",
      "Doanh nghiệp tăng trưởng nhanh hơn năng lực vận hành",
    ],
    outcomes: [
      "Nâng cao năng lực lãnh đạo và quản trị của đội ngũ",
      "Cải thiện hiệu suất và hiệu quả vận hành",
      "Giải quyết đúng bài toán thực tế của doanh nghiệp",
      "Tạo sự đồng bộ và gắn kết trong tổ chức",
    ],
    scope: [
      "Quản trị chiến lược",
      "Quản trị dự án",
      "Quản trị nhân sự",
      "Quản trị tài chính doanh nghiệp",
      "Quản trị thương hiệu",
      "Digital marketing thực chiến",
      "Kỹ năng bán hàng",
      "Kỹ năng thuyết trình và gọi vốn",
    ],
    process: [
      { step: "01", title: "Khảo sát nhu cầu", body: "Làm rõ bài toán tổ chức, đối tượng học và kết quả mong muốn." },
      { step: "02", title: "Thiết kế chuyên đề", body: "Xây dựng nội dung, case và công cụ theo ngành và bối cảnh." },
      { step: "03", title: "Triển khai lớp", body: "Kết hợp lý thuyết – thực hành – tình huống thật của doanh nghiệp." },
      { step: "04", title: "Coaching sau lớp", body: "Đồng hành áp dụng, theo dõi thay đổi hành vi và kết quả." },
    ],
    deliverables: [
      "Chương trình tùy chỉnh theo doanh nghiệp",
      "Học liệu, mẫu biểu và công cụ áp dụng",
      "Báo cáo tiến bộ trước và sau chương trình",
    ],
    methodologies: ["bizcar", "baboso", "b2a", "klass"],
    faqs: [
      { question: "Có thể tổ chức in-house không?", answer: "Có. Các chương trình huấn luyện doanh nghiệp của VABIX được thiết kế theo nhu cầu, có thể triển khai tại doanh nghiệp, tại trung tâm đối tác hoặc kết hợp trực tuyến." },
    ],
  },
  {
    id: "sol-04",
    slug: "thiet-ke-van-hanh-doanh-nghiep",
    pillar: "tri-thuc",
    number: "04",
    title: "Thiết kế & vận hành doanh nghiệp",
    shortTitle: "Thiết kế & vận hành",
    summary:
      "Dùng khung BizCar để nhìn doanh nghiệp như một hệ thống 12 khối chức năng, chẩn đoán điểm nghẽn và thiết kế lại năng lực vận hành.",
    whoFor: [
      "Lãnh đạo cần một ngôn ngữ chung cho toàn hệ thống doanh nghiệp",
      "Doanh nghiệp đang chữa cháy cục bộ, thiếu bức tranh tổng thể",
      "Tổ chức muốn chuẩn hóa vận hành trước khi tăng trưởng tiếp",
    ],
    painPoints: [
      "Doanh nghiệp tăng trưởng nhanh hơn năng lực vận hành",
      "Đổi mới manh mún, không gắn với cấu phần then chốt",
      "Thiếu điểm đo cho từng khối chức năng",
    ],
    outcomes: [
      "Có bản thiết kế tổng thể cho doanh nghiệp",
      "Biết chẩn đoán điểm yếu trong 12 khối chức năng",
      "Ra quyết định dựa trên tư duy hệ thống thay vì xử lý tình thế",
    ],
    scope: [
      "Chẩn đoán 12 khối chức năng BizCar",
      "Thiết kế lại ưu tiên SEE – DESIGN – ALIGN – OPERATE",
      "Đồng hành triển khai và chuyển giao công cụ",
    ],
    process: [
      { step: "01", title: "SEE", body: "Nhìn rõ hiện trạng 12 khối chức năng và điểm nghẽn ưu tiên." },
      { step: "02", title: "DESIGN", body: "Thiết kế lại cấu trúc, quy trình và năng lực phù hợp giai đoạn." },
      { step: "03", title: "ALIGN", body: "Đồng bộ lãnh đạo, đội ngũ và nguồn lực quanh một ngôn ngữ chung." },
      { step: "04", title: "OPERATE", body: "Vận hành, đo lường, điều chỉnh và chuyển giao." },
    ],
    deliverables: [
      "Bản đồ BizCar của doanh nghiệp",
      "Ma trận điểm nghẽn và ưu tiên",
      "Lộ trình vận hành theo giai đoạn",
    ],
    methodologies: ["bizcar", "bmdo"],
    faqs: [
      { question: "BizCar khác các mô hình canvas thông thường?", answer: "BizCar không chỉ mô tả mô hình kinh doanh. Đây là khung 12 khối chức năng giúp lãnh đạo nhìn doanh nghiệp như một chiếc xe thống nhất — từ chiến lược, thị trường, nguồn lực, vận hành đến lãnh đạo, văn hóa và bối cảnh." },
    ],
  },
  {
    id: "sol-05",
    slug: "ket-noi-doanh-nghiep",
    pillar: "kinh-doanh",
    number: "05",
    title: "Kết nối doanh nghiệp",
    shortTitle: "Kết nối doanh nghiệp",
    summary:
      "Kết nối chủ doanh nghiệp, chuyên gia, đối tác và nguồn lực phù hợp để tạo nền tảng hợp tác bền vững.",
    whoFor: [
      "Doanh nghiệp cần đối tác, chuyên gia hoặc nguồn lực đúng bài toán",
      "Tổ chức muốn tham gia cộng đồng có tiêu chuẩn và sự thẩm định",
      "Lãnh đạo muốn rút ngắn thời gian tìm đúng người, đúng nhu cầu",
    ],
    painPoints: [
      "Doanh nghiệp khó tiếp cận đúng đối tác và thị trường",
      "Mạng lưới rộng nhưng thiếu chiều sâu và giá trị thực",
      "Tốn thời gian sàng lọc đối tác không phù hợp",
    ],
    outcomes: [
      "Gặp đúng đối tác vào đúng thời điểm",
      "Rút ngắn thời gian và chi phí tìm kiếm",
      "Tăng cơ hội hợp tác có chiều sâu",
    ],
    scope: [
      "Tiếp nhận nhu cầu và hồ sơ năng lực",
      "Sàng lọc mức độ phù hợp và mục tiêu kết nối",
      "Tổ chức gặp gỡ, diễn đàn ngành và chương trình kết nối",
      "Theo dõi cơ hội hợp tác và phát triển quan hệ dài hạn",
    ],
    process: [
      { step: "01", title: "Tiếp nhận", body: "Ghi nhận nhu cầu, năng lực và định hướng của doanh nghiệp." },
      { step: "02", title: "Sàng lọc", body: "Đánh giá sự phù hợp và xác định mục tiêu kết nối." },
      { step: "03", title: "Giới thiệu", body: "Tổ chức gặp gỡ, diễn đàn hoặc chương trình thương mại." },
      { step: "04", title: "Đồng hành", body: "Theo dõi cơ hội hợp tác và hỗ trợ trao đổi." },
      { step: "05", title: "Ghi nhận", body: "Ghi nhận kết quả và phát triển quan hệ dài hạn." },
    ],
    deliverables: [
      "Hồ sơ nhu cầu / năng lực được chuẩn hóa",
      "Đề xuất đối tác phù hợp",
      "Buổi kết nối hoặc chương trình chuyên đề",
    ],
    methodologies: ["b2a", "baboso"],
    faqs: [
      { question: "Kết nối doanh nghiệp có phải là sàn mua bán không?", answer: "Không. VABIX xây dựng môi trường kết nối dựa trên hiểu biết doanh nghiệp, uy tín thành viên và nguyên tắc cùng phát triển. Mục tiêu là hợp tác có chiều sâu, không phải giao dịch một lần." },
    ],
  },
  {
    id: "sol-06",
    slug: "xuc-tien-thuong-mai",
    pillar: "kinh-doanh",
    number: "06",
    title: "Xúc tiến thương mại",
    shortTitle: "Xúc tiến thương mại",
    summary:
      "Kết nối cung – cầu, hỗ trợ giới thiệu sản phẩm, mở rộng thị trường và thúc đẩy cơ hội thương mại hiệu quả.",
    whoFor: [
      "Doanh nghiệp cần mở rộng thị trường và kênh phân phối",
      "Nhà cung cấp muốn tiếp cận khách hàng đúng tệp",
      "Tổ chức, hiệp hội cần chương trình xúc tiến theo ngành hoặc địa bàn",
    ],
    painPoints: [
      "Sản phẩm tốt nhưng chưa đến đúng thị trường",
      "Chi phí tìm khách hàng cao, khó đo lường",
      "Thiếu hệ sinh thái hỗ trợ bán hàng và chăm sóc sau bán",
    ],
    outcomes: [
      "Tiếp cận đối tác và khách hàng phù hợp hơn",
      "Tăng cơ hội hợp tác và mở rộng thị trường bền vững",
      "Chia sẻ tri thức và nguồn lực để tạo giá trị",
    ],
    scope: [
      "Giới thiệu sản phẩm, dịch vụ đến mạng lưới phù hợp",
      "Kết nối cung – cầu theo ngành và địa bàn",
      "Chương trình thương mại, sự kiện và hỗ trợ truyền thông",
      "Đồng hành theo hành trình BABOSO từ nhận diện đến tái mua hàng",
    ],
    process: [
      { step: "01", title: "Hồ sơ", body: "Chuẩn hóa năng lực, sản phẩm và thị trường mục tiêu." },
      { step: "02", title: "Khớp nối", body: "Xác định cung – cầu và cơ hội phù hợp." },
      { step: "03", title: "Xúc tiến", body: "Tổ chức chương trình, giới thiệu và hỗ trợ trao đổi." },
      { step: "04", title: "Theo dõi", body: "Đồng hành cơ hội hợp tác và ghi nhận kết quả." },
    ],
    deliverables: [
      "Đề xuất kênh / đối tác thị trường",
      "Chương trình xúc tiến hoặc sự kiện kết nối",
      "Hỗ trợ truyền thông trong hệ sinh thái VABIX",
    ],
    methodologies: ["b2a", "baboso"],
    faqs: [
      { question: "Doanh nghiệp chưa phải nhà cung cấp của Làng có thể tham gia?", answer: "Có. VABIX tiếp nhận nhu cầu kết nối và xúc tiến. Việc trở thành nhà cung cấp trong Làng là một lộ trình có thẩm định riêng, được mô tả tại mục Trở thành đối tác." },
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
