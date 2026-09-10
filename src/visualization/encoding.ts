import type { CfsCode, ComponentCode, EvidenceGrade, ForceDirection } from "@/domain/types";
import { CFS_LABELS, COMPONENT_LABELS } from "@/domain/labels";

export const EVIDENCE_OPACITY: Record<EvidenceGrade, number> = {
  A: 1,
  B: 0.85,
  C: 0.65,
  D: 0.45,
};

export const ENGINE_LEGEND = [
  { key: "SIZE", title: "Kích thước", meaning: "Mức yêu cầu / đóng góp mục tiêu — không phải MDS" },
  { key: "COMPLETENESS", title: "Độ hoàn chỉnh", meaning: "MDS — chất lượng thiết kế" },
  { key: "GAP", title: "Khe hở", meaning: "CFS — mức khớp cấu phần" },
  { key: "FLOW", title: "Dòng chảy", meaning: "Lực tác động — hướng bằng chuyển động" },
  { key: "WARNING", title: "Cảnh báo", meaning: "Rủi ro / điểm nghẽn — không dùng làm màu điểm số" },
  { key: "CLARITY", title: "Độ trong", meaning: "Cấp bằng chứng. Điểm cao + độ trong thấp = ước lượng cao, bằng chứng yếu" },
  { key: "SOLID", title: "Nét liền", meaning: "Quan hệ đã kiểm chứng (VERIFIED)" },
  { key: "DASHED", title: "Nét đứt", meaning: "Giả thuyết (HYPOTHESIS)" },
] as const;

export type ChamberVisual = {
  code: ComponentCode;
  labelVi: string;
  labelEn: string;
  mnemonic: string;
  requiredScale: number;
  completeness: number;
  opacity: number;
  warning: boolean;
  forceDirection: ForceDirection | null;
  forceMagnitude: number;
  rawMds: number | null;
  finalMds: number | null;
  activation: number | null;
  evidenceGrade: EvidenceGrade | null;
};

export type ConnectionVisual = {
  code: CfsCode;
  from: ComponentCode;
  to: ComponentCode;
  labelVi: string;
  score: number | null;
  dashed: boolean;
  thickness: number;
  gap: number;
  critical: boolean;
};

export function requiredScale(requiredLevel: number): number {
  return 0.72 + (requiredLevel / 10) * 0.55;
}

export function completenessFromMds(rawMds: number | null): number {
  if (rawMds == null) return 0.18;
  return Math.max(0.16, Math.min(1, rawMds / 10));
}

export function opacityFromEvidence(grade: EvidenceGrade | null): number {
  if (!grade) return 0.35;
  return EVIDENCE_OPACITY[grade];
}

export function gapFromCfs(score: number | null): number {
  if (score == null) return 0.55;
  return Math.max(0, (6 - score) * 0.12);
}

export function thicknessFromScore(score: number | null): number {
  if (score == null) return 0.03;
  return 0.025 + (score / 10) * 0.08;
}

export function chamberVisual(input: {
  code: ComponentCode;
  requiredLevel: number;
  rawMds: number | null;
  finalMds: number | null;
  activation: number | null;
  evidenceGrade: EvidenceGrade | null;
  forceDirection: ForceDirection | null;
  forceMagnitude: number;
  warning: boolean;
}): ChamberVisual {
  const labels = COMPONENT_LABELS[input.code];
  return {
    code: input.code,
    labelVi: labels.vi,
    labelEn: labels.en,
    mnemonic: labels.mnemonic,
    requiredScale: requiredScale(input.requiredLevel),
    completeness: completenessFromMds(input.rawMds),
    opacity: opacityFromEvidence(input.evidenceGrade),
    warning: input.warning,
    forceDirection: input.forceDirection,
    forceMagnitude: input.forceMagnitude,
    rawMds: input.rawMds,
    finalMds: input.finalMds,
    activation: input.activation,
    evidenceGrade: input.evidenceGrade,
  };
}

export function connectionVisual(input: {
  code: CfsCode;
  score: number | null;
  hypothesis: boolean;
  critical: boolean;
}): ConnectionVisual {
  const meta = CFS_LABELS[input.code];
  return {
    code: input.code,
    from: meta.from,
    to: meta.to,
    labelVi: meta.vi,
    score: input.score,
    dashed: input.hypothesis,
    thickness: thicknessFromScore(input.score),
    gap: gapFromCfs(input.score),
    critical: input.critical,
  };
}

export const CHAMBER_HOME: Record<ComponentCode, [number, number, number]> = {
  M: [0, 0.15, 2.15],
  T: [2.15, 0.15, 0],
  U: [0, 0.15, -2.15],
  A: [-2.15, 0.15, 0],
};
