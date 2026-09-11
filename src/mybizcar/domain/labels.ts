import type { ComponentCode } from "./types";

export const appCopy = {
  productName: "MyBizCar 3D",
  productTitle: "MyBizCar 3D — Động cơ doanh nghiệp MTUA",
  engineName: "Động cơ doanh nghiệp",
  mnemonicNote:
    "Chu kỳ Nạp–Nén–Nổ–Neo là cấu trúc ghi nhớ BMDO, không phải mô tả quan hệ nhân quả cơ học.",
  developmentBanner: "Phiên bản phát triển phục vụ hiệu chỉnh và kiểm chứng thực địa.",
  confidentiality: "Dữ liệu chiến lược và quản trị — chỉ dùng trong phạm vi tổ chức được cấp quyền.",
  demoLabel: "DEMO — DỮ LIỆU MINH HỌA",
} as const;

export const componentLabels: Record<
  ComponentCode,
  { code: ComponentCode; name: string; nameEn: string; mnemonic: string; question: string }
> = {
  M: {
    code: "M",
    name: "Meaningful Mission",
    nameEn: "Meaningful Mission",
    mnemonic: "NẠP",
    question: "Doanh nghiệp tồn tại để tạo thay đổi có ý nghĩa nào và cho ai?",
  },
  T: {
    code: "T",
    name: "Targeted Aspiration",
    nameEn: "Targeted Aspiration",
    mnemonic: "NÉN",
    question: "Doanh nghiệp chọn trạng thái tương lai nào trong thời hạn xác định?",
  },
  U: {
    code: "U",
    name: "Unwavering Commitment",
    nameEn: "Unwavering Commitment",
    mnemonic: "NỔ",
    question: "Lãnh đạo cam kết nguồn lực, lựa chọn và kỷ luật nào để theo đuổi đích?",
  },
  A: {
    code: "A",
    name: "Anchored Values",
    nameEn: "Anchored Values",
    mnemonic: "NEO",
    question: "Doanh nghiệp sẽ hành động theo nguyên tắc nào khi có áp lực và đánh đổi?",
  },
};

export const legendItems = [
  { key: "SIZE", title: "SIZE", meaning: "Mức yêu cầu / đóng góp mục tiêu — không mã hóa MDS" },
  { key: "COMPLETENESS", title: "COMPLETENESS", meaning: "MDS — độ hoàn chỉnh hình học của cấu kiện" },
  { key: "GAP", title: "GAP", meaning: "CFS — khe hở / lệch khớp cơ khí giữa các cấu kiện" },
  { key: "FLOW", title: "FLOW", meaning: "Lực tác động — hướng và mật độ dòng chảy" },
  { key: "WARNING", title: "WARNING", meaning: "Rủi ro / điểm nghẽn — không dùng màu cảnh báo để mã hóa điểm" },
  {
    key: "CLARITY",
    title: "CLARITY",
    meaning:
      "Độ tin cậy bằng chứng (độ trong suốt). Điểm cao + độ rõ thấp = chất lượng ước lượng cao nhưng bằng chứng yếu.",
  },
  { key: "SOLID", title: "SOLID LINE", meaning: "Mối nối đã xác minh (VERIFIED)" },
  { key: "DASHED", title: "DASHED LINE", meaning: "Mối nối giả thuyết (HYPOTHESIS)" },
] as const;
