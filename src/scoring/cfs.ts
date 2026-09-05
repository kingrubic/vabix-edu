import type { CfsCode, EvidenceGrade, StandardCfsConnection, StandardThresholds } from "@/domain/types";
import { CFS_CODES, CRITICAL_CFS_CODES } from "@/domain/types";
import { cfsBandLabel } from "@/domain/labels";
import { round1, weightedMean } from "./math";

export type CfsScoreInput = {
  connectionCode: CfsCode;
  score: number | null;
  evidenceStatus: "VERIFIED" | "HYPOTHESIS";
  evidence: string;
};

export type CfsResult = {
  weightedAverage: number | null;
  weakest: number | null;
  weakestCode: CfsCode | null;
  cfs: number | null;
  appliedCriticalCap: boolean;
  provisional: boolean;
  band: string;
  missing: CfsCode[];
  insufficient: boolean;
  explanation: string[];
  weightDisclaimer: string;
};

export function computeCfs(
  scores: CfsScoreInput[],
  connections: StandardCfsConnection[],
  thresholds: StandardThresholds,
  evidenceGrade: EvidenceGrade | null,
): CfsResult {
  const explanation: string[] = [thresholds.cfsFormulaNote];
  const weightDisclaimer =
    connections[0]?.weightAssumptionNote ??
    "Technical default for development version 0.1 — pending VABIX academic approval.";
  explanation.push(weightDisclaimer);
  explanation.push("Trọng số đều nhau không được trình bày như quy tắc học thuật chính thức.");

  const byCode = new Map(scores.map((item) => [item.connectionCode, item]));
  const missing = CFS_CODES.filter((code) => byCode.get(code)?.score == null);
  const present = CFS_CODES.map((code) => byCode.get(code)).filter(
    (item): item is CfsScoreInput => item != null && item.score != null,
  );

  if (present.length === 0) {
    return {
      weightedAverage: null,
      weakest: null,
      weakestCode: null,
      cfs: null,
      appliedCriticalCap: false,
      provisional: evidenceGrade === "D",
      band: "Chưa đủ dữ liệu",
      missing,
      insufficient: true,
      explanation: ["Chưa đủ dữ liệu — chưa có liên kết CFS nào được chấm."],
      weightDisclaimer,
    };
  }

  const weightedItems = present.map((item) => {
    const meta = connections.find((connection) => connection.code === item.connectionCode);
    return { value: item.score as number, weight: meta?.weight ?? 1, code: item.connectionCode };
  });
  const weightedAverage = round1(weightedMean(weightedItems) ?? 0);
  const weakestItem = weightedItems.reduce((min, item) => (item.value < min.value ? item : min));
  const formula = round1(0.7 * weightedAverage + 0.3 * weakestItem.value);
  explanation.push(
    `CFS 0.1 = 0.70 × trung bình có trọng số (${weightedAverage.toFixed(1)}) + 0.30 × liên kết yếu nhất (${weakestItem.code}=${weakestItem.value.toFixed(1)}) = ${formula.toFixed(1)}.`,
  );

  const criticalBroken = present.filter(
    (item) =>
      CRITICAL_CFS_CODES.includes(item.connectionCode) &&
      (item.score as number) < thresholds.cfsCriticalConnectionFloor,
  );
  let cfs = formula;
  let appliedCriticalCap = false;
  if (criticalBroken.length > 0 && cfs > thresholds.cfsCriticalCap) {
    cfs = thresholds.cfsCriticalCap;
    appliedCriticalCap = true;
    explanation.push(
      `Khóa CFS: ${criticalBroken.map((item) => `${item.connectionCode}=${item.score}`).join(", ")} < ${thresholds.cfsCriticalConnectionFloor} → trần CFS = ${thresholds.cfsCriticalCap}.`,
    );
  }

  const provisional = evidenceGrade === "D";
  if (provisional) explanation.push("Cấp bằng chứng D: CFS được đánh dấu tạm tính.");
  if (missing.length > 0) {
    explanation.push(`Thiếu điểm liên kết: ${missing.join(", ")}. Không suy điểm 0 cho liên kết còn thiếu.`);
  }

  return {
    weightedAverage,
    weakest: weakestItem.value,
    weakestCode: weakestItem.code,
    cfs,
    appliedCriticalCap,
    provisional,
    band: cfsBandLabel(cfs),
    missing,
    insufficient: false,
    explanation,
    weightDisclaimer,
  };
}
