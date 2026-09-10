import type {
  CalibrationStatus,
  EvidenceGrade,
  StandardCriterion,
  StandardThresholds,
} from "@/domain/types";
import { round1 } from "./math";

export type CriterionScoreInput = {
  criterionId: string;
  criterionCode: string;
  nameVi: string;
  weight: number;
  critical: boolean;
  primaryScore: number | null;
  secondaryScore: number | null;
  evidenceNote: string;
  calibrationStatus: CalibrationStatus;
};

export type MdsBreakdown = {
  rawMds: number | null;
  finalMds: number | null;
  criticalCap: number | null;
  evidenceCap: number | null;
  appliedCriticalCap: boolean;
  appliedEvidenceCap: boolean;
  provisional: boolean;
  missingScores: string[];
  weakestCriteria: { code: string; nameVi: string; score: number; critical: boolean }[];
  missingEvidence: string[];
  calibrationRequired: boolean;
  calibrationWarnings: string[];
  explanation: string[];
  scoredCount: number;
  totalCount: number;
  insufficient: boolean;
};

const ANCHOR_SCORES = [1, 3, 5, 7, 9, 10] as const;

export function nearestAnchor(score: number): (typeof ANCHOR_SCORES)[number] {
  return ANCHOR_SCORES.reduce((best, current) =>
    Math.abs(current - score) < Math.abs(best - score) ? current : best,
  );
}

export function computeMds(
  scores: CriterionScoreInput[],
  evidenceGrade: EvidenceGrade | null,
  thresholds: StandardThresholds,
): MdsBreakdown {
  const explanation: string[] = [];
  const missingScores = scores
    .filter((item) => item.primaryScore == null)
    .map((item) => item.criterionCode);
  const scored = scores.filter((item) => item.primaryScore != null);

  if (scored.length === 0) {
    return {
      rawMds: null,
      finalMds: null,
      criticalCap: null,
      evidenceCap: null,
      appliedCriticalCap: false,
      appliedEvidenceCap: false,
      provisional: false,
      missingScores,
      weakestCriteria: [],
      missingEvidence: scores
        .filter((item) => !item.evidenceNote.trim())
        .map((item) => item.criterionCode),
      calibrationRequired: false,
      calibrationWarnings: [],
      explanation: ["Chưa đủ dữ liệu — chưa có tiêu chí nào được chấm điểm."],
      scoredCount: 0,
      totalCount: scores.length,
      insufficient: true,
    };
  }

  if (scored.length < scores.length) {
    explanation.push(
      `Chưa đủ dữ liệu cho ${missingScores.length} tiêu chí: ${missingScores.join(", ")}. Điểm MDS chỉ tính trên các tiêu chí đã chấm — không suy điểm 0 cho phần còn thiếu.`,
    );
  }

  const raw =
    scored.reduce((sum, item) => sum + (item.primaryScore as number) * item.weight, 0) / 100;
  const rawMds = round1(raw);
  explanation.push(
    `MDS thô = Σ(điểm × trọng số) / 100 = ${rawMds.toFixed(1)}. Đây là chất lượng thiết kế, không phải bằng chứng đã triển khai thành công.`,
  );

  const criticalLow2 = scored.filter((item) => item.critical && (item.primaryScore as number) <= 2);
  const criticalLow4 = scored.filter((item) => item.critical && (item.primaryScore as number) <= 4);

  let criticalCap: number | null = null;
  if (criticalLow2.length > 0) {
    criticalCap = thresholds.criticalScoreCap2;
    explanation.push(
      `Khóa tới hạn: ${criticalLow2.map((item) => `${item.criterionCode}=${item.primaryScore}`).join(", ")} ≤ 2 → trần MDS = ${criticalCap.toFixed(1)}.`,
    );
  } else if (criticalLow4.length > 0) {
    criticalCap = thresholds.criticalScoreCap4;
    explanation.push(
      `Khóa tới hạn: ${criticalLow4.map((item) => `${item.criterionCode}=${item.primaryScore}`).join(", ")} ≤ 4 → trần MDS = ${criticalCap.toFixed(1)}.`,
    );
  }

  let evidenceCap: number | null = null;
  let provisional = false;
  if (evidenceGrade === "D") {
    evidenceCap = thresholds.evidenceCapD;
    provisional = true;
    explanation.push(
      `Cấp bằng chứng D: điểm tạm tính, trần MDS = ${evidenceCap.toFixed(1)}.`,
    );
  } else if (evidenceGrade === "C") {
    evidenceCap = thresholds.evidenceCapC;
    explanation.push(
      `Cấp bằng chứng C: trần MDS được công nhận = ${evidenceCap.toFixed(1)}.`,
    );
  } else if (evidenceGrade === "B" || evidenceGrade === "A") {
    explanation.push(`Cấp bằng chứng ${evidenceGrade}: không áp trần bằng chứng D/C.`);
  } else {
    explanation.push("Chưa gắn cấp bằng chứng cho cấu kiện — chưa áp trần bằng chứng.");
  }

  let finalMds = rawMds;
  const appliedCriticalCap = criticalCap != null && finalMds > criticalCap;
  if (appliedCriticalCap && criticalCap != null) finalMds = criticalCap;
  const appliedEvidenceCap = evidenceCap != null && finalMds > evidenceCap;
  if (appliedEvidenceCap && evidenceCap != null) finalMds = evidenceCap;
  finalMds = round1(finalMds);

  if (appliedCriticalCap) explanation.push(`Đã áp trần khóa tới hạn. MDS cuối = ${finalMds.toFixed(1)}.`);
  if (appliedEvidenceCap) explanation.push(`Đã áp trần bằng chứng. MDS cuối = ${finalMds.toFixed(1)}.`);
  if (!appliedCriticalCap && !appliedEvidenceCap) {
    explanation.push(`Không có trần nào cắt điểm. MDS cuối = ${finalMds.toFixed(1)}.`);
  }

  const calibrationWarnings: string[] = [];
  let calibrationRequired = false;
  for (const item of scores) {
    if (item.primaryScore != null && item.secondaryScore != null) {
      const delta = Math.abs(item.primaryScore - item.secondaryScore);
      if (delta > thresholds.calibrationScoreDelta) {
        calibrationRequired = true;
        calibrationWarnings.push(
          `${item.criterionCode}: lệch ${delta.toFixed(1)} điểm giữa hai đánh giá viên (> ${thresholds.calibrationScoreDelta}).`,
        );
      }
    }
    if (item.calibrationStatus === "PENDING") {
      calibrationRequired = true;
      calibrationWarnings.push(`${item.criterionCode}: đang chờ hiệu chuẩn.`);
    }
  }
  if (calibrationRequired) {
    explanation.push("Cần hiệu chuẩn — không được khóa đánh giá khi lệch điểm > ngưỡng hoặc còn pending.");
  }

  const weakestCriteria = [...scored]
    .sort((a, b) => (a.primaryScore as number) - (b.primaryScore as number))
    .slice(0, 3)
    .map((item) => ({
      code: item.criterionCode,
      nameVi: item.nameVi,
      score: item.primaryScore as number,
      critical: item.critical,
    }));

  const missingEvidence = scores
    .filter((item) => item.primaryScore != null && !item.evidenceNote.trim())
    .map((item) => item.criterionCode);

  return {
    rawMds,
    finalMds,
    criticalCap,
    evidenceCap,
    appliedCriticalCap,
    appliedEvidenceCap,
    provisional,
    missingScores,
    weakestCriteria,
    missingEvidence,
    calibrationRequired,
    calibrationWarnings,
    explanation,
    scoredCount: scored.length,
    totalCount: scores.length,
    insufficient: scored.length === 0,
  };
}

export function attachCriteriaMeta(
  scores: CriterionScoreInput[],
  criteria: StandardCriterion[],
): CriterionScoreInput[] {
  return scores.map((score) => {
    const meta = criteria.find((item) => item.id === score.criterionId || item.code === score.criterionCode);
    return {
      ...score,
      nameVi: meta?.nameVi ?? score.nameVi,
      weight: meta?.weight ?? score.weight,
      critical: meta?.critical ?? score.critical,
    };
  });
}
