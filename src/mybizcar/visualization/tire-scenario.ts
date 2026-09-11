export const TIRE_TENSION_MIN = 0;
export const TIRE_TENSION_MAX = 100;
export const TIRE_TENSION_NEUTRAL = 50;
export const TIRE_ILLUSTRATION_LABEL = "Minh họa — chưa phải kết quả đánh giá";
export const MISSING_DATA_LABEL = "Chưa có dữ liệu";

export const WHEEL_IDS = ["value-wheel", "market-wheel", "people-wheel", "finance-wheel"] as const;
export type WheelId = (typeof WHEEL_IDS)[number];

export type TireTensionState = Record<WheelId, number>;

export const TIRE_MAPPING = {
  status: "illustration" as const,
  note: "Bánh xe Giá trị / Thị trường / Con người / Tài chính chưa có bộ tiêu chuẩn số hóa. Độ căng lốp là tham số hình ảnh minh họa, không phải MDS, tài chính hay áp suất vật lý.",
};

export function emptyTireTension(value = TIRE_TENSION_NEUTRAL): TireTensionState {
  return {
    "value-wheel": value,
    "market-wheel": value,
    "people-wheel": value,
    "finance-wheel": value,
  };
}

export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return Math.round((min + max) / 2);
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function clampTension(value: number): number {
  if (!Number.isFinite(value)) return TIRE_TENSION_NEUTRAL;
  return clampInt(value, TIRE_TENSION_MIN, TIRE_TENSION_MAX);
}

export type TensionDraftResult = {
  kind: "valid" | "empty" | "invalid" | "outOfRange";
  commit: number | null;
  sceneValue: number;
  error: string | null;
};

export function interpretIntDraft(raw: string, lastValid: number, min: number, max: number): TensionDraftResult {
  const fallback = Number.isFinite(lastValid) ? clampInt(lastValid, min, max) : clampInt((min + max) / 2, min, max);
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { kind: "empty", commit: null, sceneValue: fallback, error: `Nhập số nguyên từ ${min} đến ${max}.` };
  }
  if (/[.].*,/.test(trimmed) || /,.*[.]/.test(trimmed)) {
    return {
      kind: "invalid",
      commit: null,
      sceneValue: fallback,
      error: "Dùng dấu phẩy hoặc dấu chấm làm thập phân, không dùng cả hai.",
    };
  }
  const commas = (trimmed.match(/,/g) ?? []).length;
  const dots = (trimmed.match(/\./g) ?? []).length;
  if (commas > 1 || dots > 1) {
    return { kind: "invalid", commit: null, sceneValue: fallback, error: "Số không hợp lệ." };
  }
  if (!/^-?\d+$/.test(trimmed)) {
    if (/^-?\d+[.,]\d+$/.test(trimmed)) {
      return {
        kind: "invalid",
        commit: null,
        sceneValue: fallback,
        error: `Nhập số nguyên từ ${min} đến ${max}.`,
      };
    }
    return { kind: "invalid", commit: null, sceneValue: fallback, error: "Chỉ nhập số nguyên, không chứa chữ." };
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n)) {
    return { kind: "invalid", commit: null, sceneValue: fallback, error: "Chỉ nhập số, không chứa chữ." };
  }
  if (n < min || n > max) {
    return {
      kind: "outOfRange",
      commit: null,
      sceneValue: fallback,
      error: `Giá trị phải từ ${min} đến ${max}.`,
    };
  }
  const value = Math.round(n);
  return { kind: "valid", commit: value, sceneValue: value, error: null };
}

export function interpretTensionDraft(raw: string, lastValid: number): TensionDraftResult {
  const result = interpretIntDraft(raw, lastValid, TIRE_TENSION_MIN, TIRE_TENSION_MAX);
  if (!Number.isFinite(lastValid) && result.kind !== "valid") {
    return { ...result, sceneValue: TIRE_TENSION_NEUTRAL };
  }
  return result;
}

export function parseTensionInput(raw: string): number | null {
  return interpretTensionDraft(raw, TIRE_TENSION_NEUTRAL).commit;
}

export function tireVisualCopy(tension: number): string {
  const t = clampTension(tension);
  if (t < 35) return `Lốp minh họa mức ${t}/100: đáy bẹt, hông phình. Mâm không đổi.`;
  if (t > 65) return `Lốp minh họa mức ${t}/100: tròn hơn, ít bẹt. Mâm không đổi.`;
  return `Lốp minh họa mức ${t}/100 (trung bình). Mâm không đổi.`;
}

export function tensionFromAssessment(_score: number | null | undefined): number | null {
  if (_score == null || Number.isNaN(_score)) return null;
  return null;
}

export function applyWheelTension(
  state: TireTensionState,
  id: WheelId,
  value: number,
  linked: boolean,
): TireTensionState {
  const next = clampTension(value);
  if (linked) return emptyTireTension(next);
  return { ...state, [id]: next };
}

export function isTireStateDirty(current: TireTensionState, baseline: TireTensionState): boolean {
  return WHEEL_IDS.some((id) => current[id] !== baseline[id]);
}

export function scenarioChangeCopy(
  current: TireTensionState,
  baseline: TireTensionState,
  wheelId: WheelId,
): string | null {
  const thisDirty = current[wheelId] !== baseline[wheelId];
  const othersDirty = WHEEL_IDS.some((id) => id !== wheelId && current[id] !== baseline[id]);
  if (thisDirty) return "Bánh này đã thay đổi";
  if (othersDirty) return "Kịch bản có thay đổi ở bánh khác";
  return null;
}

export function squashFromTension(tension: number): number {
  const t = clampTension(tension);
  return (TIRE_TENSION_NEUTRAL - t) / TIRE_TENSION_NEUTRAL;
}

export function isWheelId(id: string): id is WheelId {
  return (WHEEL_IDS as readonly string[]).includes(id);
}

export function deformTireVertex(
  x: number,
  y: number,
  z: number,
  radius: number,
  tube: number,
  squash: number,
): [number, number, number] {
  const outer = radius + tube;
  const limited = Math.max(-0.72, Math.min(0.72, squash));
  const ring = Math.hypot(x, y);
  const inner = radius - tube * 0.2;
  const rimLock = ring <= inner ? 0 : Math.min(1, (ring - inner) / (tube * 1.15));
  const bottom = y < 0 ? Math.min(1, -y / outer) : 0;
  const contact = rimLock * bottom * bottom;
  const flatten = Math.max(0, limited) * contact;
  const round = Math.max(0, -limited) * rimLock * bottom;
  const ny = y + flatten * outer * 0.58 + round * y * 0.1;
  const bulge = 1 + Math.max(0, limited) * 0.55 * contact - Math.max(0, -limited) * 0.16 * rimLock * bottom;
  const nz = z * bulge;
  const minY = -outer + 0.012;
  return [x, Math.max(minY, ny), nz];
}
