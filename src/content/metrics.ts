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

/** @deprecated Unverified public stats — CMS/draft only. Do not render until Founder confirms source and scope. */
export const unverifiedMetricsDraft: Metric[] = [
  { id: "years", value: "20+", label: "Năm nghiên cứu & triển khai — chưa phân biệt Founder / đội ngũ / pháp nhân VABIX (thành lập 2025)" },
  { id: "programs", value: "100+", label: "Chương trình đào tạo — chưa có nguồn đếm" },
  { id: "learners", value: "1.000+", label: "Học viên — chưa có nguồn đếm" },
  { id: "enterprises", value: "100+", label: "Doanh nghiệp đồng hành — chưa có phạm vi tư vấn / đào tạo / sự kiện" },
];

/** @deprecated Empty on purpose. Use unverifiedMetricsDraft internally. */
export const metrics: Metric[] = [];
