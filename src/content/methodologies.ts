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
    related: ["bmdo", "b2a", "kora"],
  },
  {
    id: "bmdo",
    slug: "bmdo",
    name: "BMDO",
    shortName: "BMDO",
    eyebrow: "Xưởng thiết kế vận hành",
    headline: "Từ mô hình đến năng lực vận hành",
    summary:
      "BMDO là chương trình thực chiến giúp lãnh đạo thiết kế và vận hành doanh nghiệp — một xưởng làm việc trên dữ liệu thật, không phải lớp lý thuyết.",
    description:
      "BMDO được triển khai như xưởng thiết kế vận hành cho doanh nghiệp Việt. Người học không chỉ nghe mô hình mà trực tiếp phác thảo phiên bản BizCar của chính mình, nhận diện bánh xe ưu tiên và xây dựng chỉ số đo lường. Chương trình đã được khai giảng tại SIHUB và đồng hành cùng cộng đồng SME, startup.",
    whoFor: ["Lãnh đạo SME và startup", "Đội ngũ quản lý cần công cụ thiết kế vận hành", "Tổ chức muốn chuẩn hóa trước khi tăng tốc"],
    outcomes: [
      "Phiên bản BizCar của chính doanh nghiệp",
      "Ưu tiên đổi mới đúng cấu phần",
      "Nhóm chỉ số theo dõi được sau chương trình",
    ],
    process: [
      { step: "01", title: "Chẩn đoán", body: "Nhìn hệ thống hiện tại qua 12 khối chức năng." },
      { step: "02", title: "Thiết kế", body: "Phác thảo mô hình vận hành tinh gọn, phù hợp nguồn lực." },
      { step: "03", title: "Thực hành", body: "Làm trên dữ liệu và tình huống thật của doanh nghiệp." },
      { step: "04", title: "Chuyển giao", body: "Công cụ, lộ trình và cơ chế phản biện sau chương trình." },
    ],
    related: ["bizcar", "klass"],
  },
  {
    id: "b2a",
    slug: "b2a",
    name: "B2A",
    shortName: "B2A",
    eyebrow: "Từ địa bàn đến doanh thu",
    headline: "Phân tích và chinh phục thị trường theo địa chỉ, địa bàn",
    summary:
      "B2A là mô hình giúp đội ngũ kinh doanh phân tích từng địa chỉ, đánh giá tiềm năng địa bàn, chọn chiến lược tiếp cận và tối ưu nguồn lực để mở rộng phủ sóng.",
    description:
      "B2A — từ kết nối đến doanh thu — được VABIX triển khai thực chiến cùng các đơn vị như VNPT. Mô hình đi từ Địa chỉ (phân tích chi tiết từng điểm), Địa bàn (đánh giá tiềm năng khu vực), Chiến lược (chọn cách tiếp cận hiệu quả) đến Kết quả (tối ưu nguồn lực và mở rộng phủ sóng). Đây cũng là nền tảng của cuốn sách Quản trị kinh doanh thực chiến theo mô hình B2A.",
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
    id: "baboso",
    slug: "baboso",
    name: "BABOSO",
    shortName: "BABOSO",
    eyebrow: "Triết lý bán hàng",
    headline: "Từ nhận diện thương hiệu đến tái mua hàng",
    summary:
      "BABOSO chuẩn hóa hành trình khách hàng: Brand – Awareness – Business Opportunity – Order – Service & Re-order.",
    description:
      "BABOSO là triết lý bán hàng VABIX dùng để chuẩn hóa hành trình từ nhận diện thương hiệu đến dịch vụ và đặt hàng lại. Với nhà cung cấp trong Làng, BABOSO là lời hứa kết nối giá trị: không dừng ở nhận diện, mà đi đến cơ hội kinh doanh thực chất, đơn hàng và chăm sóc. Mô hình đã được triển khai cùng đội ngũ kinh doanh VNPT.",
    whoFor: ["Đội ngũ bán hàng và chăm sóc khách hàng", "Nhà cung cấp trong mạng lưới VABIX", "Doanh nghiệp muốn chuẩn hóa hành trình khách hàng"],
    outcomes: [
      "Hành trình khách hàng được chuẩn hóa",
      "Tăng tỷ lệ chuyển từ cơ hội (BO) sang đơn hàng (SO)",
      "Chăm sóc và tái mua hàng trở thành một phần của hệ thống",
    ],
    process: [
      { step: "B", title: "Brand", body: "Xây dựng nhận diện thương hiệu." },
      { step: "A", title: "Awareness", body: "Tạo sự chú ý và quan tâm." },
      { step: "BO", title: "Business Opportunity", body: "Hình thành cơ hội kinh doanh đúng nhu cầu." },
      { step: "O", title: "Order", body: "Chốt đơn hàng." },
      { step: "SO", title: "Service & Re-order", body: "Dịch vụ và tái mua hàng." },
    ],
    related: ["b2a", "klass"],
  },
  {
    id: "kora",
    slug: "kora",
    name: "KORA",
    shortName: "KORA",
    eyebrow: "Định hướng & chẩn đoán",
    headline: "Nhìn đúng ưu tiên trước khi thiết kế giải pháp",
    summary:
      "KORA là khung định hướng của VABIX, giúp lãnh đạo xác lập trọng tâm, chẩn đoán ưu tiên và tránh đổi mới sai cấu phần.",
    description:
      "KORA bổ sung cho BizCar ở bước nhìn rõ: trước khi thiết kế lại hệ thống, doanh nghiệp cần một cách xác lập mục tiêu, phạm vi và thứ tự ưu tiên. KORA được dùng trong tư vấn chiến lược và các xưởng BMDO để đội ngũ không lan man giữa quá nhiều sáng kiến.",
    whoFor: ["Ban lãnh đạo đang có quá nhiều sáng kiến", "Doanh nghiệp chuẩn bị chương trình chuyển đổi", "Nhóm dự án cần thống nhất trọng tâm"],
    outcomes: [
      "Trọng tâm chiến lược được chốt",
      "Danh mục ưu tiên ngắn, đo được",
      "Đội ngũ thống nhất ngôn ngữ trước khi triển khai",
    ],
    process: [
      { step: "01", title: "Định hướng", body: "Làm rõ đích đến và phạm vi." },
      { step: "02", title: "Chẩn đoán", body: "Nhận diện điểm nghẽn then chốt." },
      { step: "03", title: "Ưu tiên", body: "Chọn cấu phần cần xử lý trước." },
      { step: "04", title: "Cam kết", body: "Thống nhất chỉ số và trách nhiệm." },
    ],
    related: ["bizcar", "bmdo"],
  },
  {
    id: "klass",
    slug: "klass",
    name: "KLASS",
    shortName: "KLASS",
    eyebrow: "Tháp năng lực",
    headline: "Năng lực con người được nhìn thấy và phát triển có tầng",
    summary:
      "KLASS là tháp năng lực VABIX dùng để phát triển cư dân, đội ngũ và năng lực thực thi — từ kỹ năng nền đến năng lực kết nối chuyên nghiệp.",
    description:
      "Trong Cổng Cư dân, KLASS xuất hiện như tháp năng lực của cư dân: một lộ trình học và thực hành bắt buộc trước khi trở thành Cư dân Kết nối Chuyên nghiệp và hướng tới Cư dân Kết nối Toàn cầu. Trong doanh nghiệp, KLASS giúp gắn phát triển con người với các tầng năng lực có thể quan sát, huấn luyện và đo lường.",
    whoFor: ["Cư dân VABIX", "Đội ngũ bán hàng và kết nối", "Doanh nghiệp muốn chuẩn hóa năng lực theo tầng"],
    outcomes: [
      "Lộ trình năng lực rõ ràng theo từng tầng",
      "Chương trình học gắn với việc làm",
      "Đội ngũ được huấn luyện trước khi mở rộng kết nối",
    ],
    process: [
      { step: "01", title: "Nền tảng", body: "Kỹ năng giao tiếp, quan hệ và văn hóa Làng." },
      { step: "02", title: "Thực hành", body: "Chăm sóc khách hàng, lập kế hoạch, sử dụng công cụ." },
      { step: "03", title: "Chuyên nghiệp", body: "B2A, nhân hiệu địa bàn, kiến tạo cơ hội." },
      { step: "04", title: "Toàn cầu", body: "Năng lực kết nối và dẫn dắt ở quy mô rộng hơn." },
    ],
    related: ["b2a", "baboso", "bmdo"],
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
