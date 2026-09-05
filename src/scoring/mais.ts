import type { ComponentCode } from "@/domain/types";
import type { ComponentProfile } from "./diagnosis";
import type { CfsResult } from "./cfs";

export type MaisPriority = {
  componentCode: ComponentCode | null;
  connectionCode: string | null;
  title: string;
  reason: string;
  score: number;
  factors: string[];
};

export function rankMaisPriorities(
  profiles: Record<ComponentCode, ComponentProfile>,
  cfs: CfsResult,
): MaisPriority[] {
  const items: MaisPriority[] = [];

  for (const profile of Object.values(profiles)) {
    let score = 0;
    const factors: string[] = [];
    if (profile.criticalLocks.length > 0) {
      score += 40;
      factors.push(`Điểm khóa: ${profile.criticalLocks.join("; ")}`);
    }
    if ((profile.force.force ?? 0) < 0) {
      const mag = Math.abs(profile.force.force ?? 0);
      score += mag * 4;
      factors.push(`Lực nghịch ${profile.force.force}`);
    }
    if (profile.evidenceGrade === "D") {
      score += 12;
      factors.push("Bằng chứng D — độ tin cậy thấp");
    } else if (profile.evidenceGrade === "C") {
      score += 6;
      factors.push("Bằng chứng C — chưa đủ để chuẩn hóa");
    }
    if (profile.activation != null && profile.rawMds != null && profile.rawMds >= 7 && profile.activation <= 3) {
      score += 18;
      factors.push("Khoảng trống thiết kế–kích hoạt");
    }
    if (profile.rawMds != null) {
      score += (10 - profile.rawMds) * 1.2;
      factors.push(`MDS thô ${profile.rawMds} chỉ là một tín hiệu, không phải lý do ưu tiên duy nhất`);
    }
    items.push({
      componentCode: profile.code,
      connectionCode: null,
      title: `Can thiệp cấu kiện ${profile.code}`,
      reason: factors.join(" · ") || "Chưa đủ dữ liệu",
      score,
      factors,
    });
  }

  if (cfs.weakestCode && cfs.weakest != null) {
    items.push({
      componentCode: null,
      connectionCode: cfs.weakestCode,
      title: `Khớp lại liên kết ${cfs.weakestCode}`,
      reason: `Liên kết yếu nhất ${cfs.weakestCode}=${cfs.weakest}${cfs.appliedCriticalCap ? " · đang khóa trần CFS" : ""}`,
      score: (10 - cfs.weakest) * 5 + (cfs.appliedCriticalCap ? 20 : 0),
      factors: [`CFS yếu nhất ${cfs.weakestCode}`, cfs.appliedCriticalCap ? "Khóa CFS" : ""],
    });
  }

  return items.sort((a, b) => b.score - a.score);
}
