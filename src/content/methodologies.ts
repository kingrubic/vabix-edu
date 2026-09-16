import type { Methodology } from "./types";

export const methodologies: Methodology[] = [
  {
    id: "bizcar",
    slug: "bizcar",
    name: "The BizCar",
    shortName: "BizCar",
    eyebrow: "VABIX Signature Model",
    headline: "Thiết kế và vận hành doanh nghiệp toàn diện",
    summary:
      "BizCar là khung tư duy giúp lãnh đạo nhìn doanh nghiệp như một hệ thống thống nhất, nhận diện đúng điểm nghẽn và thiết kế lại năng lực vận hành phù hợp với từng giai đoạn.",
    description:
      "Một doanh nghiệp không phải tập hợp ngẫu nhiên các bộ phận, mà là một chiếc xe có tài xế, bánh xe, động cơ và nhiên liệu. Nếu một bánh quay lệch, cả hành trình sẽ chệch hướng. BizCar chia doanh nghiệp thành 12 khối chức năng thuộc ba nhóm: Định hướng & Thị trường, Nguồn lực & Vận hành, Lãnh đạo & Tổ chức.",
    whoFor: ["CEO, founder và Ban lãnh đạo", "Đội ngũ quản lý cần ngôn ngữ chung", "SME và startup cần công cụ đo được"],
    outcomes: [
      "Có bản thiết kế tổng thể cho doanh nghiệp",
      "Biết chẩn đoán điểm yếu trong 12 khối chức năng",
      "Ra quyết định dựa trên tư duy hệ thống thay vì xử lý tình thế",
    ],
    process: [
      { step: "SEE", title: "Nhìn rõ", body: "Chẩn đoán 12 khối, xác định bánh xe nào đang trượt." },
      { step: "DESIGN", title: "Thiết kế", body: "Thiết kế lại cấu phần ưu tiên theo giai đoạn." },
      { step: "ALIGN", title: "Đồng bộ", body: "Gắn chiến lược, đội ngũ và nguồn lực quanh một bức tranh." },
      { step: "OPERATE", title: "Vận hành", body: "Triển khai, đo lường và cải tiến liên tục." },
    ],
    related: ["karot", "3w", "applier", "mybizcar"],
  },
  {
    id: "applier",
    slug: "applier",
    name: "APPLIER",
    shortName: "APPLIER",
    eyebrow: "Phương pháp đào tạo",
    headline: "Học để nhìn rõ. Thiết kế để làm được. Triển khai để tạo kết quả.",
    summary:
      "APPLIER là phương pháp đào tạo và huấn luyện của VABIX: cùng khởi động, nắm mô thức, thực hành thiết kế, soi lăng kính đa chiều, cải tiến, đúc kết và triển khai ra kết quả.",
    description:
      "APPLIER không phải khóa học lý thuyết. Người học làm trên bài toán thật, phản biện đa chiều rồi cam kết ứng dụng. Kết quả được mô tả là hướng đến và được đo lường — không phải cam kết tăng doanh thu hay lợi nhuận.",
    whoFor: ["Học viên BMDO và MBM", "Lớp đào tạo theo yêu cầu doanh nghiệp", "Huấn luyện 1:1"],
    outcomes: [
      "Người học nhìn rõ bài toán của chính mình",
      "Có sản phẩm thiết kế có thể áp dụng",
      "Có cam kết triển khai và cách đo lường",
    ],
    process: [
      { step: "A", title: "ACTIVATE — Cùng khởi động", body: "Mở không gian học, làm rõ mục tiêu và bài toán đang mang theo." },
      { step: "P1", title: "PARADIGM — Mô thức thực chiến", body: "Tiếp nhận khung tư duy và ngôn ngữ chung để nhìn doanh nghiệp." },
      { step: "P2", title: "PRACTICE — Thực hành thiết kế", body: "Làm trên dữ liệu và bài toán thật của người học." },
      { step: "L", title: "LENS — Lăng kính đa chiều", body: "Phản biện giả định, phương án và rủi ro trước khi chốt." },
      { step: "I", title: "IMPROVE — Cải tiến", body: "Điều chỉnh sản phẩm quản trị sau phản biện." },
      { step: "E", title: "EXTRACT — Đúc kết bài học", body: "Rút ra điều đã kiểm chứng để dùng lại." },
      { step: "R", title: "RESOLVE — Triển khai ra kết quả", body: "Cam kết người làm, thời hạn và cách theo dõi." },
    ],
    related: ["3w", "mais", "bizcar"],
  },
  {
    id: "mais",
    slug: "mais",
    name: "MAIS",
    shortName: "MAIS",
    eyebrow: "Đo lường và chuẩn hóa",
    headline: "Đo lường → Phân tích → Cải tiến → Chuẩn hóa",
    summary:
      "MAIS là vòng cải tiến VABIX dùng để biến thiết kế thành thói quen vận hành: đo, đọc, chỉnh, rồi chuẩn hóa những gì đã hiệu quả.",
    description:
      "MAIS bổ sung cho APPLIER và 3W ở bước sau lớp học: kết quả không dừng ở nhận thức hay bản thiết kế, mà được theo dõi, phân tích, cải tiến và chuẩn hóa. Không dùng MAIS để tuyên bố bảo đảm hiệu suất kinh doanh.",
    whoFor: ["CEO đang triển khai sau BMDO", "Đội ngũ tư vấn chuyển đổi", "Quản lý vận hành cần vòng cải tiến"],
    outcomes: [
      "Có chỉ số và bằng chứng để đọc hiện trạng",
      "Phân tích được điểm nghẽn thay vì xử lý cảm tính",
      "Chuẩn hóa được việc đã làm tốt",
    ],
    process: [
      { step: "01", title: "Đo lường", body: "Xác định dữ liệu, chỉ số và bằng chứng cần theo dõi." },
      { step: "02", title: "Phân tích", body: "Đọc nguyên nhân, không chỉ biểu hiện." },
      { step: "03", title: "Cải tiến", body: "Điều chỉnh phương án theo bằng chứng." },
      { step: "04", title: "Chuẩn hóa", body: "Giữ lại cách làm đã hiệu quả thành thói quen / quy trình." },
    ],
    related: ["3w", "applier", "bizcar"],
  },
  {
    id: "3w",
    slug: "3w",
    name: "3W — WOW · WELL · WIN",
    shortName: "3W",
    eyebrow: "Chuẩn thành công",
    headline: "WOW trong nhận thức • WELL trong thiết kế • WIN trong thực tiễn.",
    summary:
      "3W là khung đánh giá đầu ra của quá trình học tập và thực thi — không phải cam kết kết quả kinh doanh tuyệt đối.",
    description:
      "WOW: nhận thức có ý nghĩa / nhận thức bừng sáng. WELL: thiết kế và thực hiện tốt hơn. WIN: tiến bộ / kết quả trong thực tiễn. Đầu ra minh họa gồm nhận diện điểm nghẽn, bản thiết kế quản trị, kế hoạch hành động, chỉ số theo dõi và bằng chứng cải tiến. Phân biệt: BizCar là mô hình quản trị; BMDO là chương trình; MBM là chương trình chuyên sâu; 3W là chuẩn thành công.",
    whoFor: ["Học viên BMDO và MBM", "CEO đang thiết kế lại doanh nghiệp", "Đội ngũ đồng hành chuyển đổi"],
    outcomes: [
      "Nhận thức bừng sáng về điểm nghẽn",
      "Sản phẩm quản trị được thiết kế tốt hơn",
      "Tiến bộ trong thực tiễn được đo lường / kiểm chứng",
    ],
    process: [
      { step: "WOW", title: "Nhận thức có ý nghĩa", body: "Nhìn thấy điều trước đây chưa nhìn thấy trong doanh nghiệp." },
      { step: "WELL", title: "Thiết kế và thực hiện tốt hơn", body: "Tạo sản phẩm quản trị có thể áp dụng." },
      { step: "WIN", title: "Tiến bộ trong thực tiễn", body: "Chuyển thiết kế thành hành động và bằng chứng cải tiến." },
    ],
    related: ["bizcar", "applier", "mais"],
  },
  {
    id: "karot",
    slug: "karot",
    name: "KAROT",
    shortName: "KAROT",
    eyebrow: "Trọng tâm và ưu tiên",
    headline: "Rõ đích đến. Đúng vấn đề. Tập trung nguồn lực.",
    summary:
      "KAROT hỗ trợ lãnh đạo làm rõ mục tiêu, phạm vi và thứ tự ưu tiên trước khi thiết kế hoặc triển khai thay đổi.",
    description:
      "KAROT xác lập trọng tâm và ưu tiên thay đổi. Trước khi thiết kế lại hệ thống, doanh nghiệp cần một cách xác lập mục tiêu, phạm vi và thứ tự ưu tiên — để đội ngũ không lan man giữa quá nhiều sáng kiến. KAROT được dùng trong tư vấn chuyển đổi và các xưởng BMDO.",
    whoFor: ["Ban lãnh đạo đang có quá nhiều sáng kiến", "Doanh nghiệp chuẩn bị chương trình chuyển đổi", "Nhóm dự án cần thống nhất trọng tâm"],
    outcomes: [
      "Trọng tâm chiến lược được làm rõ",
      "Danh mục ưu tiên ngắn, gắn trách nhiệm",
      "Đội ngũ thống nhất ngôn ngữ trước khi triển khai",
    ],
    process: [
      { step: "01", title: "Định hướng", body: "Làm rõ đích đến và phạm vi." },
      { step: "02", title: "Chẩn đoán", body: "Nhận diện điểm nghẽn then chốt." },
      { step: "03", title: "Ưu tiên", body: "Chọn cấu phần cần xử lý trước." },
      { step: "04", title: "Cam kết", body: "Thống nhất chỉ số và trách nhiệm." },
    ],
    related: ["bizcar", "mais"],
  },
  {
    id: "klass",
    slug: "klass",
    name: "KLASS",
    shortName: "KLASS",
    eyebrow: "Tháp năng lực",
    headline: "Xây nền vững. Thực hành có hướng dẫn. Phát triển bằng bằng chứng.",
    summary:
      "KLASS là tháp năng lực và lộ trình phát triển — từ nền tảng đến thực hành, chuyên nghiệp và hướng đến toàn cầu.",
    description:
      "KLASS giúp gắn phát triển con người với các tầng năng lực có thể quan sát, huấn luyện và đo lường. Bốn tầng được dùng như lộ trình: nền tảng, thực hành, chuyên nghiệp, hướng đến toàn cầu. Ý nghĩa từng chữ cái của tên gọi chưa được công bố chính thức trên website.",
    whoFor: ["Đội ngũ học viên VABIX", "Doanh nghiệp muốn chuẩn hóa năng lực theo tầng", "Người thiết kế lộ trình phát triển"],
    outcomes: [
      "Lộ trình năng lực rõ ràng theo từng tầng",
      "Chương trình học gắn với việc làm",
      "Phát triển dựa trên bằng chứng, không chỉ cảm tính",
    ],
    process: [
      { step: "01", title: "Nền tảng", body: "Xây kỹ năng và thói quen gốc." },
      { step: "02", title: "Thực hành", body: "Làm có hướng dẫn trên việc thật." },
      { step: "03", title: "Chuyên nghiệp", body: "Chuẩn hóa năng lực có thể quan sát và huấn luyện." },
      { step: "04", title: "Hướng đến toàn cầu", body: "Mở rộng năng lực kết nối và dẫn dắt ở quy mô rộng hơn." },
    ],
    related: ["applier", "3w"],
  },
  {
    id: "baboso",
    slug: "baboso",
    name: "BABOSO",
    shortName: "BABOSO",
    eyebrow: "Hành trình thị trường",
    headline: "Được biết đến. Được cân nhắc. Được lựa chọn.",
    summary:
      "BABOSO chuẩn hóa hành trình từ nhận biết thương hiệu đến cơ hội kinh doanh và đơn hàng.",
    description:
      "BABOSO dùng cấu trúc chính thức BA — Brand Awareness (nhận biết thương hiệu), BO — Business Opportunity (cơ hội kinh doanh), SO — Sales Order (đơn hàng). Sau đơn hàng, việc chăm sóc được trình bày như tiếp nối bằng phục vụ và phát triển quan hệ — không phải một chữ cái mới trong acronym.",
    whoFor: ["Đội ngũ bán hàng và chăm sóc khách hàng", "Nhà cung cấp trong mạng lưới VABIX", "Doanh nghiệp muốn chuẩn hóa hành trình khách hàng"],
    outcomes: [
      "Hành trình khách hàng được chuẩn hóa theo BA · BO · SO",
      "Đội ngũ phân biệt nhận biết, cơ hội và đơn hàng",
      "Phục vụ sau bán được nhìn như phát triển quan hệ, không tách thành bước riêng của acronym",
    ],
    process: [
      { step: "BA", title: "Brand Awareness — Nhận biết thương hiệu", body: "Được biết đến: khách hàng nhận ra và hiểu giá trị." },
      { step: "BO", title: "Business Opportunity — Cơ hội kinh doanh", body: "Được cân nhắc: hình thành cơ hội phù hợp nhu cầu." },
      { step: "SO", title: "Sales Order — Đơn hàng", body: "Được lựa chọn: đi đến đơn hàng." },
      { step: "→", title: "Tiếp nối", body: "Phục vụ và phát triển quan hệ sau đơn hàng — không phải thành phần mới của acronym." },
    ],
    related: ["b2a", "klass"],
  },
  {
    id: "dgh",
    slug: "dgh",
    name: "DGH",
    shortName: "DGH",
    eyebrow: "Định hướng chuyển đổi",
    headline: "DGH — Khung định hướng chuyển đổi Số – Xanh – Hạnh phúc",
    summary:
      "DGH định hướng chuyển đổi trên ba trục: Digital, Green và Happy — chuyển đổi số, chuyển đổi xanh và chuyển đổi hướng đến hạnh phúc.",
    description:
      "D: Digital Transformation — Chuyển đổi số. G: Green Transformation — Chuyển đổi xanh. H: Happy Transformation — Chuyển đổi hướng đến hạnh phúc. Website dùng nhãn khung định hướng; chưa mô tả DGH như một kiến trúc chuyển đổi đầy đủ khi chưa có đủ mô hình trách nhiệm, tương tác, chỉ số và quản trị.",
    whoFor: ["Ban lãnh đạo đang định hướng chuyển đổi", "Doanh nghiệp cần ngôn ngữ chung cho số – xanh – hạnh phúc"],
    outcomes: [
      "Ba trục chuyển đổi được nhìn cùng lúc, không tách rời",
      "Ưu tiên được thảo luận trước khi triển khai",
      "Tránh biến DGH thành khẩu hiệu không có phạm vi",
    ],
    process: [
      { step: "D", title: "Digital Transformation", body: "Chuyển đổi số — dữ liệu, quy trình, công nghệ và trách nhiệm con người." },
      { step: "G", title: "Green Transformation", body: "Chuyển đổi xanh — trách nhiệm môi trường gắn với vận hành thật." },
      { step: "H", title: "Happy Transformation", body: "Chuyển đổi hướng đến hạnh phúc — con người, văn hóa và môi trường làm việc." },
    ],
    related: ["bizcar", "karot"],
  },
  {
    id: "b2a",
    slug: "b2a",
    name: "B2A",
    shortName: "B2A",
    eyebrow: "Từ địa bàn đến kết quả",
    headline: "Phân tích thị trường theo địa chỉ, địa bàn",
    summary:
      "B2A là mô hình giúp đội ngũ kinh doanh phân tích từng địa chỉ, đánh giá tiềm năng địa bàn, chọn chiến lược tiếp cận và tối ưu nguồn lực để mở rộng phủ sóng.",
    description:
      "B2A đi từ Địa chỉ (phân tích chi tiết từng điểm), Địa bàn (đánh giá tiềm năng khu vực), Chiến lược (chọn cách tiếp cận hiệu quả) đến Kết quả (tối ưu nguồn lực và mở rộng phủ sóng). Đây cũng là nền tảng của cuốn sách Quản trị kinh doanh thực chiến theo mô hình B2A.",
    whoFor: ["Đội ngũ bán hàng và phát triển thị trường", "Tổ chức có mạng lưới nhiều địa bàn", "Doanh nghiệp cần chuẩn hóa cách đánh địa phương"],
    outcomes: [
      "Bản đồ địa bàn và địa chỉ được làm rõ",
      "Chiến lược tiếp cận theo từng vùng",
      "Nguồn lực được phân bổ đúng chỗ",
    ],
    process: [
      { step: "01", title: "Địa chỉ", body: "Phân tích chi tiết từng địa chỉ / điểm tiếp xúc." },
      { step: "02", title: "Địa bàn", body: "Đánh giá tiềm năng khu vực và nguồn lực hiện có." },
      { step: "03", title: "Chiến lược", body: "Chọn cách tiếp cận phù hợp từng địa bàn." },
      { step: "04", title: "Kết quả", body: "Tối ưu nguồn lực và mở rộng phủ sóng." },
    ],
    related: ["baboso", "bizcar"],
  },
  {
    id: "mybizcar",
    slug: "mybizcar",
    name: "MyBizCar",
    shortName: "MyBizCar",
    eyebrow: "Hồ sơ thiết kế doanh nghiệp",
    headline: "Đưa mô hình BizCar vào bản đồ sống của doanh nghiệp",
    summary:
      "MyBizCar là hồ sơ thiết kế và công cụ giúp lãnh đạo biến khung 12 khối thành bản đánh giá, thiết kế và theo dõi của chính doanh nghiệp.",
    description:
      "Trong BMDO, doanh nghiệp là nơi thực hành; MyBizCar là hồ sơ thiết kế; bằng chứng là căn cứ đánh giá kết quả. MyBizCar không thay thế BizCar hay BMDO. Giao diện có thể được tinh chỉnh theo brand; ý nghĩa chỉ số, dữ liệu demo, đánh giá và quyền truy cập của MyBizCar 3D không thay đổi trong đợt này.",
    whoFor: ["CEO đang học BMDO / MBM", "Đội ngũ tư vấn dùng chung ngôn ngữ BizCar", "Doanh nghiệp muốn theo dõi 12 khối theo thời gian"],
    outcomes: [
      "Có nơi đặt bản đánh giá 12 khối",
      "Theo dõi ưu tiên cải tiến",
      "Gắn công cụ với chương trình và tư vấn, không tách rời",
    ],
    process: [
      { step: "01", title: "BizCar", body: "Nhìn doanh nghiệp trên 12 khối." },
      { step: "02", title: "Đánh giá", body: "Ghi nhận hiện trạng từng khối." },
      { step: "03", title: "Ưu tiên", body: "Chọn cấu phần cần xử lý trước." },
      { step: "04", title: "Theo dõi", body: "Quay lại đo sau khi thực thi." },
    ],
    related: ["bizcar", "3w", "applier"],
  },
];

export const bizCarBlocks = [
  {
    group: "Định hướng và thị trường",
    groupId: "direction",
    items: [
      { n: "01", name: "Định hướng chiến lược", icon: "target" },
      { n: "02", name: "Quản trị giá trị", icon: "diamond" },
      { n: "03", name: "Quản trị thị trường", icon: "chart" },
      { n: "04", name: "Quản trị thương hiệu", icon: "tag" },
    ],
  },
  {
    group: "Nguồn lực và vận hành",
    groupId: "operations",
    items: [
      { n: "05", name: "Quản trị nhân sự", icon: "people" },
      { n: "06", name: "Quản trị tài chính", icon: "finance" },
      { n: "07", name: "Quản trị nguồn lực cốt lõi", icon: "nodes" },
      { n: "08", name: "Quản trị vận hành", icon: "gear" },
    ],
  },
  {
    group: "Lãnh đạo và tổ chức",
    groupId: "leadership",
    items: [
      { n: "09", name: "Lãnh đạo – Điều hành", icon: "lead" },
      { n: "10", name: "Quản trị tổ chức", icon: "org" },
      { n: "11", name: "Văn hóa doanh nghiệp", icon: "heart" },
      { n: "12", name: "Môi trường kinh doanh", icon: "globe" },
    ],
  },
];

export function getMethodology(slug: string) {
  return methodologies.find((m) => m.slug === slug);
}
