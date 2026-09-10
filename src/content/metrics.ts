import type { Metric } from "./types";

/**
 * Quantitative homepage metrics are withheld pending Founder verification.
 * See CONTENT_APPROVAL.md. Public strip uses verified qualitative signals only.
 */
export const proofSignals: Metric[] = [
  { id: "legal", value: "VABIX", label: "Công ty Cổ phần · MST 0318798694" },
  { id: "pillars", value: "3T", label: "Đào tạo · Chuyển đổi · Trustworking" },
  { id: "bizcar", value: "12", label: "Khối chức năng mô hình BizCar" },
  { id: "origin", value: "VN", label: "Tri thức thực chiến có nguồn gốc Việt Nam" },
];

/** @deprecated Unverified public stats — kept for CMS/internal reference only. */
export const metrics: Metric[] = [];
