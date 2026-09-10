import type {
  AssessmentStatus,
  CfsCode,
  ComponentCode,
  EvidenceGrade,
  ForceDirection,
  Role,
} from "./types";

export const COMPONENT_LABELS: Record<
  ComponentCode,
  { en: string; vi: string; mnemonic: string; mnemonicMeaning: string }
> = {
  M: {
    en: "Meaningful Mission",
    vi: "Sứ mệnh có ý nghĩa",
    mnemonic: "NẠP",
    mnemonicMeaning: "Nạp năng lượng định hướng",
  },
  T: {
    en: "Targeted Aspiration",
    vi: "Khát vọng có đích",
    mnemonic: "NÉN",
    mnemonicMeaning: "Nén trọng tâm và kỳ vọng",
  },
  U: {
    en: "Unwavering Commitment",
    vi: "Cam kết không lay chuyển",
    mnemonic: "NỔ",
    mnemonicMeaning: "Nổ lực thực thi có chủ sở hữu",
  },
  A: {
    en: "Anchored Values",
    vi: "Giá trị được neo",
    mnemonic: "NEO",
    mnemonicMeaning: "Neo hành vi và giới hạn",
  },
};

export const CFS_LABELS: Record<CfsCode, { vi: string; from: ComponentCode; to: ComponentCode }> = {
  MT: { vi: "Sứ mệnh → Khát vọng", from: "M", to: "T" },
  MU: { vi: "Sứ mệnh → Cam kết", from: "M", to: "U" },
  MA: { vi: "Sứ mệnh → Giá trị", from: "M", to: "A" },
  TU: { vi: "Khát vọng → Cam kết", from: "T", to: "U" },
  TA: { vi: "Khát vọng → Giá trị", from: "T", to: "A" },
  UA: { vi: "Cam kết → Giá trị", from: "U", to: "A" },
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Quản trị nền tảng",
  ACADEMIC_ADMIN: "Quản trị học thuật",
  COACH_EVALUATOR: "Huấn luyện viên / Đánh giá viên",
  COMPANY_ADMIN: "Quản trị doanh nghiệp",
  COMPANY_MEMBER: "Thành viên doanh nghiệp",
  VIEWER: "Người xem",
};

export const STATUS_LABELS: Record<AssessmentStatus, string> = {
  DRAFT: "Nháp",
  DATA_COLLECTION: "Thu thập dữ liệu",
  SELF_ASSESSED: "Tự đánh giá",
  UNDER_REVIEW: "Đang thẩm định",
  CALIBRATION_REQUIRED: "Cần hiệu chuẩn",
  LOCKED: "Đã khóa",
  IMPROVEMENT: "Cải tiến",
  ARCHIVED: "Lưu trữ",
};

export const EVIDENCE_LABELS: Record<
  EvidenceGrade,
  { name: string; use: string; meaning: string }
> = {
  D: {
    name: "Cấp D",
    use: "Mở đầu chẩn đoán",
    meaning: "Tự đánh giá hoặc phán đoán, chưa có hồ sơ hỗ trợ",
  },
  C: {
    name: "Cấp C",
    use: "Thiết kế thử nghiệm",
    meaning: "Văn bản kèm một số tình huống minh họa",
  },
  B: {
    name: "Cấp B",
    use: "Cải tiến có kiểm soát",
    meaning: "Bằng chứng vận hành/quyết định và có phản biện độc lập",
  },
  A: {
    name: "Cấp A",
    use: "Chuẩn hóa trong phạm vi đã kiểm chứng",
    meaning: "Nhiều nguồn nhất quán, bằng chứng dài hạn, kể cả khi chịu áp lực",
  },
};

export const FORCE_LABELS: Record<ForceDirection, string> = {
  POSITIVE: "Lực thuận — hỗ trợ tập trung, phối hợp, bảo vệ giá trị",
  NEGATIVE: "Lực nghịch — gây phân tán, chậm trễ, xung đột hoặc giảm thích ứng",
  NEUTRAL: "Trung tính — chưa quan sát thấy lực có hướng",
};

export const CFS_BANDS = [
  { min: 1, max: 3.9, label: "LỆCH CẤU PHẦN" },
  { min: 4, max: 5.9, label: "ĐANG HÌNH THÀNH" },
  { min: 6, max: 7.4, label: "KHỚP CÓ ĐIỀU KIỆN" },
  { min: 7.5, max: 8.9, label: "KHỚP VỮNG" },
  { min: 9, max: 10, label: "KHỚP CAO" },
] as const;

export const MNEMONIC_DISCLAIMER =
  "Chu kỳ Nạp–Nén–Nổ–Neo là cấu trúc ghi nhớ BMDO, không phải mô tả quan hệ nhân quả cơ học.";

export const DEVELOPMENT_DISCLAIMER =
  "Phiên bản phát triển phục vụ hiệu chỉnh và kiểm chứng thực địa.";

export const CFS_WEIGHT_DISCLAIMER =
  "Technical default for development version 0.1 — pending VABIX academic approval.";

export const ACTIVATION_FORMULA_DISCLAIMER =
  "Chuẩn hiện hành định nghĩa khái niệm và thang 1–10 nhưng chưa ban hành công thức tự động. Điểm kích hoạt do đánh giá viên nhập, không được hệ thống suy ra.";

export const CONFIDENTIALITY_BANNER =
  "Không gian làm việc mật — dữ liệu chiến lược và quản trị chỉ hiển thị trong phạm vi tổ chức được cấp quyền.";

export function cfsBandLabel(score: number): string {
  const band = CFS_BANDS.find((b) => score >= b.min && score <= b.max);
  return band?.label ?? "Chưa đủ dữ liệu";
}
