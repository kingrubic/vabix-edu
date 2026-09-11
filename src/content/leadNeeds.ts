import type { LeadType } from "@/lib/leads";

/** Contact / consult form — official 3T architecture plus supporting layers. */
export const consultNeeds = [
  "Training & Coaching",
  "Transformation",
  "Trustworking",
  "Sản phẩm tri thức",
  "Nhân lực mở & Nhân lực số",
  "Khác",
] as const;

export const needByType: Partial<Record<LeadType, readonly string[]>> = {
  "trust-buyer": ["Tìm nhà cung cấp", "Tìm đối tác hợp tác", "Tìm giải pháp theo ngành", "Khác"],
  "trust-supplier": ["Giới thiệu sản phẩm / dịch vụ", "Mở rộng thị trường", "Tham gia làng ngành", "Khác"],
  "trust-expert": ["Tư vấn chuyên môn", "Đồng hành dự án", "Giảng dạy / huấn luyện", "Khác"],
  partnership: ["Hợp tác chương trình", "Hợp tác truyền thông", "Hợp tác mạng lưới", "Khác"],
  program: ["Đăng ký chương trình", "Tư vấn chương trình theo yêu cầu", "Khảo sát nội bộ", "Khác"],
};

export function needsForLeadType(type: LeadType): readonly string[] {
  return needByType[type] ?? consultNeeds;
}
