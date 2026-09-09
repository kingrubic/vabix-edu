import type { ConsultingService } from "./types";

export const consultingProcess = [
  { step: "01", title: "Đánh giá hiện trạng", body: "Thu thập thông tin, nhìn toàn diện chiến lược, thị trường, con người, tài chính, tổ chức, công nghệ và vận hành." },
  { step: "02", title: "Xác định điểm nghẽn", body: "Phân biệt biểu hiện và nguyên nhân, chọn điểm nghẽn ưu tiên thay vì xử lý lan man." },
  { step: "03", title: "Thiết kế giải pháp", body: "Thiết kế giải pháp phù hợp bối cảnh và nguồn lực, bảo đảm các cấu phần phối hợp với nhau." },
  { step: "04", title: "Đồng hành triển khai", body: "Chuyển giải pháp thành kế hoạch, người chịu trách nhiệm, thời hạn và milestone." },
  { step: "05", title: "Đo lường và cải tiến", body: "Đánh giá bằng dữ liệu và bằng chứng, điều chỉnh và chuẩn hóa những gì đã hiệu quả." },
];

export const consultingOutcomes = [
  "Hiện trạng và ưu tiên rõ.",
  "Giải pháp phù hợp bối cảnh.",
  "Trách nhiệm và kế hoạch xác định.",
  "Kết quả theo dõi bằng dữ liệu / bằng chứng.",
  "Tăng khả năng tự vận hành và cải tiến.",
];

export const consultingPositioning =
  "VABIX đồng hành cùng doanh chủ và đội ngũ lãnh đạo trong đánh giá hiện trạng, xác định điểm nghẽn, thiết kế giải pháp và triển khai những thay đổi cần thiết để nâng cao hiệu quả và năng lực phát triển doanh nghiệp.";

export const consultingNote =
  "Giải pháp xem xét toàn diện chiến lược, thị trường, con người, tài chính, tổ chức, công nghệ và vận hành, bảo đảm sự phối hợp, không tạo thêm những điểm gãy mới. VABIX không cam kết ROI, doanh thu hay tỷ lệ cải thiện định lượng khi chưa có căn cứ đo lường.";

export const consultingServices: ConsultingService[] = [
  {
    id: "cs-01",
    slug: "danh-gia-toan-dien",
    number: "01",
    title: "Đánh giá toàn diện và chẩn đoán doanh nghiệp",
    summary: "Làm rõ hiện trạng, vấn đề cản trở, biểu hiện và nguyên nhân, điểm nghẽn ưu tiên và lộ trình cải tiến.",
    scope: ["Hiện trạng doanh nghiệp", "Vấn đề cản trở", "Biểu hiện / nguyên nhân", "Điểm nghẽn ưu tiên", "Lộ trình cải tiến"],
    deliverables: ["Báo cáo hiện trạng", "Ma trận điểm nghẽn ưu tiên", "Đề xuất lộ trình cải tiến"],
    outcomes: ["Ban lãnh đạo thống nhất bức tranh hiện trạng và thứ tự ưu tiên."],
  },
  {
    id: "cs-02",
    slug: "tai-cau-truc",
    number: "02",
    title: "Tái cấu trúc doanh nghiệp",
    summary: "Rà soát chiến lược và mô hình, cấu trúc tổ chức, trách nhiệm, quy trình phối hợp, phân bổ nguồn lực và lộ trình chuyển đổi.",
    scope: ["Chiến lược / mô hình", "Cấu trúc tổ chức", "Trách nhiệm / quyền quyết định", "Quy trình / phối hợp", "Phân bổ nguồn lực", "Lộ trình chuyển đổi"],
    deliverables: ["Phương án tái cấu trúc", "Lộ trình chuyển đổi theo giai đoạn"],
    outcomes: ["Tổ chức có hướng tái cấu trúc gắn với nguồn lực thật, không chỉ sơ đồ mới."],
  },
  {
    id: "cs-03",
    slug: "chien-luoc-mo-hinh",
    number: "03",
    title: "Tư vấn chiến lược và mô hình kinh doanh",
    summary: "Định hướng, mục tiêu và ưu tiên, thị trường / đối thủ / khách hàng, giá trị cung cấp, mô hình doanh thu và kế hoạch triển khai.",
    scope: ["Định hướng", "Mục tiêu / ưu tiên", "Thị trường / đối thủ / khách hàng", "Giá trị cung cấp", "Mô hình doanh thu", "Kế hoạch triển khai"],
    deliverables: ["Bản định hướng chiến lược", "Phác thảo mô hình kinh doanh", "Kế hoạch triển khai theo giai đoạn"],
    outcomes: ["Chiến lược được viết để thực thi, không dừng ở khẩu hiệu."],
  },
  {
    id: "cs-04",
    slug: "co-cau-to-chuc",
    number: "04",
    title: "Tư vấn cơ cấu tổ chức và quản trị",
    summary: "Cơ cấu, chức năng nhiệm vụ, trách nhiệm và quyền quyết định, cơ chế quản trị / báo cáo, giảm phụ thuộc quá mức vào CEO, phát triển kế thừa.",
    scope: ["Cơ cấu", "Chức năng / nhiệm vụ", "Trách nhiệm / quyền quyết định", "Cơ chế quản trị / báo cáo", "Giảm phụ thuộc CEO", "Phát triển kế thừa"],
    deliverables: ["Sơ đồ và mô tả chức năng", "Cơ chế báo cáo và quyền quyết định"],
    outcomes: ["Tổ chức vận hành bớt phụ thuộc vào một người."],
  },
  {
    id: "cs-05",
    slug: "quy-trinh-van-hanh",
    number: "05",
    title: "Tư vấn quy trình và quản trị vận hành",
    summary: "Dòng công việc, điểm nghẽn / chờ đợi / sai sót / làm lại, thiết kế quy trình, tiêu chuẩn đầu vào / đầu ra, trách nhiệm, phối hợp, kiểm soát / cải tiến.",
    scope: ["Dòng công việc", "Điểm nghẽn / chờ đợi / sai sót / làm lại", "Thiết kế quy trình", "Tiêu chuẩn đầu vào / đầu ra", "Trách nhiệm", "Phối hợp", "Kiểm soát / cải tiến"],
    deliverables: ["Bản đồ quy trình ưu tiên", "Tiêu chuẩn đầu vào / đầu ra", "Cơ chế kiểm soát"],
    outcomes: ["Vận hành có điểm đo và trách nhiệm rõ hơn."],
  },
  {
    id: "cs-06",
    slug: "thi-truong-ban-hang",
    number: "06",
    title: "Tư vấn thị trường, bán hàng và khách hàng",
    summary: "Khách hàng mục tiêu, giá trị / gói giải pháp, kênh tiếp cận, quy trình sales, conversion / doanh thu, trải nghiệm và duy trì khách hàng.",
    scope: ["Khách hàng mục tiêu", "Giá trị / gói giải pháp", "Kênh tiếp cận", "Quy trình sales", "Conversion / doanh thu", "Trải nghiệm và duy trì khách hàng"],
    deliverables: ["Hồ sơ khách hàng mục tiêu", "Quy trình sales", "Khung trải nghiệm khách hàng"],
    outcomes: ["Thị trường và bán hàng được thiết kế trên nhu cầu thật, không chỉ tăng hoạt động."],
  },
  {
    id: "cs-07",
    slug: "tai-chinh-hieu-qua",
    number: "07",
    title: "Tư vấn tài chính và hiệu quả kinh doanh",
    summary: "Sức khỏe tài chính, doanh thu / chi phí / lợi nhuận, dòng tiền / vốn lưu động, hiệu quả sản phẩm / khách hàng / kênh, ngân sách, phân bổ nguồn lực, báo cáo.",
    scope: ["Sức khỏe tài chính", "Doanh thu / chi phí / lợi nhuận", "Dòng tiền / vốn lưu động", "Hiệu quả sản phẩm / khách hàng / kênh", "Ngân sách", "Phân bổ nguồn lực", "Báo cáo"],
    deliverables: ["Khung đọc sức khỏe tài chính", "Nguyên tắc phân bổ nguồn lực", "Bộ báo cáo quản trị đề xuất"],
    outcomes: ["Lãnh đạo dùng dữ liệu tài chính để ưu tiên, không chỉ để ghi nhận."],
  },
  {
    id: "cs-08",
    slug: "nhan-luc-van-hoa",
    number: "08",
    title: "Tư vấn nhân lực và văn hóa doanh nghiệp",
    summary: "Nhu cầu / cơ cấu nhân lực, vai trò / năng lực, tuyển dụng / đánh giá / phát triển, ghi nhận / giữ chân, quản lý, văn hóa hợp tác / trách nhiệm / thực thi.",
    scope: ["Nhu cầu / cơ cấu nhân lực", "Vai trò / năng lực", "Tuyển dụng / đánh giá / phát triển", "Ghi nhận / giữ chân", "Quản lý", "Văn hóa hợp tác / trách nhiệm / thực thi"],
    deliverables: ["Khung vai trò và năng lực", "Định hướng văn hóa thực thi"],
    outcomes: ["Con người và văn hóa được gắn với năng lực thực thi, không chỉ khẩu hiệu."],
  },
  {
    id: "cs-09",
    slug: "thuong-hieu-niem-tin",
    number: "09",
    title: "Tư vấn thương hiệu và xây dựng niềm tin thị trường",
    summary: "Định vị / lời hứa, đồng bộ hình ảnh / thông điệp / trải nghiệm, bằng chứng tạo niềm tin, sự nhất quán giữa truyền thông và năng lực cung cấp, uy tín.",
    scope: ["Định vị / lời hứa", "Đồng bộ hình ảnh / thông điệp / trải nghiệm", "Bằng chứng tạo niềm tin", "Nhất quán truyền thông và năng lực cung cấp", "Uy tín"],
    deliverables: ["Định vị và lời hứa", "Nguyên tắc đồng bộ trải nghiệm", "Khung bằng chứng niềm tin"],
    outcomes: ["Thương hiệu dựa trên năng lực thật, không chạy theo hình thức."],
  },
  {
    id: "cs-10",
    slug: "chuyen-doi-so-ai",
    number: "10",
    title: "Tư vấn chuyển đổi số và ứng dụng AI",
    summary: "Đánh giá sẵn sàng công nghệ / dữ liệu, ưu tiên use case, roadmap, lựa chọn giải pháp, human–AI workflow, xây dựng / triển khai / quản trị nhân lực số.",
    scope: ["Sẵn sàng công nghệ / dữ liệu", "Ưu tiên use case", "Roadmap", "Lựa chọn giải pháp", "Human–AI workflow", "Xây dựng / triển khai / quản trị nhân lực số"],
    deliverables: ["Đánh giá sẵn sàng", "Danh mục use case ưu tiên", "Roadmap human–AI"],
    outcomes: ["AI được đặt trong quy trình, dữ liệu và trách nhiệm con người — không thay thế hoàn toàn người."],
  },
  {
    id: "cs-11",
    slug: "quan-tri-hieu-suat",
    number: "11",
    title: "Tư vấn quản trị hiệu suất và chuẩn hóa",
    summary: "Mục tiêu / kết quả, hệ thống chỉ số, dữ liệu / trách nhiệm báo cáo, ngưỡng cảnh báo / hành động, đo cải tiến, chuẩn hóa thực hành hiệu quả.",
    scope: ["Mục tiêu / kết quả", "Hệ thống chỉ số", "Dữ liệu / trách nhiệm báo cáo", "Ngưỡng cảnh báo / hành động", "Đo cải tiến", "Chuẩn hóa thực hành hiệu quả"],
    deliverables: ["Bộ chỉ số đề xuất", "Cơ chế báo cáo và cảnh báo", "Hướng chuẩn hóa thực hành"],
    outcomes: ["Hiệu suất được theo dõi để cải tiến, không chỉ để báo cáo."],
  },
  {
    id: "cs-12",
    slug: "dong-hanh-trien-khai",
    number: "12",
    title: "Đồng hành triển khai chuyển đổi",
    summary: "Chuyển giải pháp thành kế hoạch, người chịu trách nhiệm / thời hạn, milestone, tháo gỡ điểm vướng, đánh giá bằng chứng và điều chỉnh.",
    scope: ["Kế hoạch triển khai", "Người chịu trách nhiệm / thời hạn", "Milestone", "Tháo gỡ điểm vướng", "Đánh giá bằng chứng", "Điều chỉnh"],
    deliverables: ["Kế hoạch triển khai", "Cơ chế review milestone", "Ghi nhận bằng chứng cải tiến"],
    outcomes: ["Chuyển đổi đi vào hành động có người làm và có bằng chứng, không dừng ở báo cáo tư vấn."],
  },
];

export function getConsultingService(slug: string) {
  return consultingServices.find((s) => s.slug === slug);
}
