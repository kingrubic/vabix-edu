import type { EvidenceGrade, ForceDirection } from "@/domain/types";
import { round1 } from "./math";

export type ForceInput = {
  direction: ForceDirection | null;
  scope: number | null;
  intensity: number | null;
  duration: number | null;
  bottleneckProximity: number | null;
  evidenceGrade: EvidenceGrade | null;
};

export type ForceResult = {
  force: number | null;
  magnitude: number | null;
  direction: ForceDirection | null;
  insufficient: boolean;
  unsupported: boolean;
  explanation: string[];
};

export function computeForce(input: ForceInput): ForceResult {
  const explanation: string[] = [];
  if (!input.direction) {
    return {
      force: null,
      magnitude: null,
      direction: null,
      insufficient: true,
      unsupported: false,
      explanation: ["Chưa đủ dữ liệu — chưa chọn hướng lực."],
    };
  }

  if (input.direction === "NEUTRAL") {
    explanation.push("Hướng trung tính → lực = 0. Không suy ra chắc chắn nhân quả chỉ từ lực.");
    return {
      force: 0,
      magnitude: 0,
      direction: "NEUTRAL",
      insufficient: false,
      unsupported: false,
      explanation,
    };
  }

  const parts = [input.scope, input.intensity, input.duration, input.bottleneckProximity];
  if (parts.some((part) => part == null)) {
    return {
      force: null,
      magnitude: null,
      direction: input.direction,
      insufficient: true,
      unsupported: false,
      explanation: ["Chưa đủ dữ liệu — cần đủ phạm vi, cường độ, thời lượng và độ gần điểm nghẽn (1–10)."],
    };
  }

  const magnitude = round1(
    ((input.scope as number) +
      (input.intensity as number) +
      (input.duration as number) +
      (input.bottleneckProximity as number)) /
      4,
  );
  const force = input.direction === "NEGATIVE" ? round1(-magnitude) : magnitude;
  explanation.push(
    `Độ lớn = (phạm vi + cường độ + thời lượng + độ gần điểm nghẽn) / 4 = ${magnitude.toFixed(1)}.`,
  );
  explanation.push(
    input.direction === "POSITIVE"
      ? `Hướng thuận → lực = +${magnitude.toFixed(1)}.`
      : `Hướng nghịch → lực = −${magnitude.toFixed(1)}.`,
  );
  explanation.push("Lực mô tả tín hiệu quan sát được, không chứng minh quan hệ nhân quả.");

  const unsupported = input.evidenceGrade === "D" || input.evidenceGrade == null;
  if (unsupported) {
    explanation.push("Chưa đủ bằng chứng để xác định lực như một kết luận vận hành.");
  }

  return {
    force,
    magnitude,
    direction: input.direction,
    insufficient: false,
    unsupported,
    explanation,
  };
}
