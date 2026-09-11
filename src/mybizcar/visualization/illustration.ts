import type { TireTensionState, WheelId } from "./tire-scenario";

const WHEEL_IDS: WheelId[] = ["value-wheel", "market-wheel", "people-wheel", "finance-wheel"];

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return Math.round((min + max) / 2);
  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampTension(value: number): number {
  if (!Number.isFinite(value)) return 50;
  return clampInt(value, 0, 100);
}

function squashFromTension(tension: number): number {
  return (50 - clampTension(tension)) / 50;
}

function emptyTensions(): TireTensionState {
  return { "value-wheel": 50, "market-wheel": 50, "people-wheel": 50, "finance-wheel": 50 };
}

function tensionsDirty(current: TireTensionState, baseline: TireTensionState): boolean {
  return WHEEL_IDS.some((id) => current[id] !== baseline[id]);
}

export const ILLUSTRATION_LABEL = "Kịch bản minh họa — chưa phải kết quả đánh giá doanh nghiệp";

export const WHEEL_SHORT: Record<WheelId, string> = {
  "value-wheel": "Giá trị",
  "market-wheel": "Thị trường",
  "people-wheel": "Con người",
  "finance-wheel": "Tài chính",
};

export type IllustrationField = "load" | "roughness" | "rhythm" | "steer";

export const ILLUSTRATION_FIELDS: Record<
  IllustrationField,
  { min: number; max: number; step: 1; neutral: number; label: string; note: string }
> = {
  load: {
    min: 0,
    max: 100,
    step: 1,
    neutral: 40,
    label: "Tải minh họa",
    note: "Thân xe hạ nhẹ so với bánh. Không phải doanh thu, nhân sự hay khối lượng kg.",
  },
  roughness: {
    min: 0,
    max: 100,
    step: 1,
    neutral: 0,
    label: "Độ gồ ghề mặt đường",
    note: "Dao động thân xe khi bật Chạy minh họa. Không phải điều kiện kinh doanh.",
  },
  rhythm: {
    min: 0,
    max: 100,
    step: 1,
    neutral: 40,
    label: "Nhịp vận hành minh họa",
    note: "Tốc độ animation khi bật Chạy minh họa. Không phải RPM, mã lực hay km/h.",
  },
  steer: {
    min: -25,
    max: 25,
    step: 1,
    neutral: 0,
    label: "Góc lái minh họa",
    note: "Xoay hai bánh trước quanh trục lái. Không gắn với chất lượng lãnh đạo.",
  },
};

export const MAX_BODY_DROP = 0.05;
export const PODIUM_TOP = 0.01;

export type IllustrationState = {
  tensions: TireTensionState;
  load: number;
  roughness: number;
  rhythm: number;
  steer: number;
};

export function emptyIllustration(): IllustrationState {
  return {
    tensions: emptyTensions(),
    load: ILLUSTRATION_FIELDS.load.neutral,
    roughness: ILLUSTRATION_FIELDS.roughness.neutral,
    rhythm: ILLUSTRATION_FIELDS.rhythm.neutral,
    steer: ILLUSTRATION_FIELDS.steer.neutral,
  };
}

export function clampIllustration(state: IllustrationState): IllustrationState {
  return {
    tensions: {
      "value-wheel": clampTension(state.tensions["value-wheel"]),
      "market-wheel": clampTension(state.tensions["market-wheel"]),
      "people-wheel": clampTension(state.tensions["people-wheel"]),
      "finance-wheel": clampTension(state.tensions["finance-wheel"]),
    },
    load: Number.isFinite(state.load) ? clampInt(state.load, ILLUSTRATION_FIELDS.load.min, ILLUSTRATION_FIELDS.load.max) : ILLUSTRATION_FIELDS.load.neutral,
    roughness: Number.isFinite(state.roughness) ? clampInt(state.roughness, ILLUSTRATION_FIELDS.roughness.min, ILLUSTRATION_FIELDS.roughness.max) : ILLUSTRATION_FIELDS.roughness.neutral,
    rhythm: Number.isFinite(state.rhythm) ? clampInt(state.rhythm, ILLUSTRATION_FIELDS.rhythm.min, ILLUSTRATION_FIELDS.rhythm.max) : ILLUSTRATION_FIELDS.rhythm.neutral,
    steer: Number.isFinite(state.steer) ? clampInt(state.steer, ILLUSTRATION_FIELDS.steer.min, ILLUSTRATION_FIELDS.steer.max) : ILLUSTRATION_FIELDS.steer.neutral,
  };
}

export function isIllustrationDirty(current: IllustrationState, baseline: IllustrationState): boolean {
  const a = clampIllustration(current);
  const b = clampIllustration(baseline);
  return (
    tensionsDirty(a.tensions, b.tensions) ||
    a.load !== b.load ||
    a.roughness !== b.roughness ||
    a.rhythm !== b.rhythm ||
    a.steer !== b.steer
  );
}

export type IllustrationPresetId = "balanced" | "soft-wheel" | "heavy-rough";

export const ILLUSTRATION_PRESETS: Record<IllustrationPresetId, { label: string; state: IllustrationState }> = {
  balanced: {
    label: "Cân bằng",
    state: emptyIllustration(),
  },
  "soft-wheel": {
    label: "Một bánh mềm",
    state: {
      ...emptyIllustration(),
      tensions: { ...emptyTensions(), "finance-wheel": 18 },
    },
  },
  "heavy-rough": {
    label: "Tải cao – đường gồ ghề",
    state: {
      ...emptyIllustration(),
      load: 82,
      roughness: 70,
      rhythm: 55,
    },
  },
};

export type IllustrationPose = {
  bodyY: number;
  bodyRotX: number;
  bodyRotZ: number;
  steerRad: number;
  spin: number;
  roadZ: number;
  squash: TireTensionState;
};

export function computeIllustrationPose(input: {
  state: IllustrationState;
  running: boolean;
  reducedMotion: boolean;
  time: number;
}): IllustrationPose {
  const state = clampIllustration(input.state);
  const squash = {
    "value-wheel": squashFromTension(state.tensions["value-wheel"]),
    "market-wheel": squashFromTension(state.tensions["market-wheel"]),
    "people-wheel": squashFromTension(state.tensions["people-wheel"]),
    "finance-wheel": squashFromTension(state.tensions["finance-wheel"]),
  };
  const avgSoft = WHEEL_IDS.reduce((s, id) => s + Math.max(0, squash[id]), 0) / 4;
  const loadDrop = (state.load / 100) * 0.038;
  const bodyY = -Math.min(MAX_BODY_DROP, loadDrop + avgSoft * 0.012);
  const steerRad = (state.steer * Math.PI) / 180;
  if (!input.running || input.reducedMotion) {
    return { bodyY, bodyRotX: 0, bodyRotZ: 0, steerRad, spin: 0, roadZ: 0, squash };
  }
  const amp = (state.roughness / 100) * 0.01;
  const freq = 1.15 + (state.rhythm / 100) * 2.2;
  const t = Number.isFinite(input.time) ? input.time : 0;
  return {
    bodyY,
    bodyRotX: Math.sin(t * freq) * amp,
    bodyRotZ: Math.cos(t * freq * 0.73) * amp * 0.42,
    steerRad,
    spin: 0.35 + (state.rhythm / 100) * 1.65,
    roadZ: ((t * (0.35 + (state.rhythm / 100) * 1.4)) % 6 + 6) % 6,
    squash,
  };
}

export function tensionImpactCopy(from: number, to: number, wheel: WheelId): string {
  const name = WHEEL_SHORT[wheel];
  if (to < from) return `Mức căng bánh ${name}: ${from} → ${to}. Lốp minh họa bẹt hơn tại điểm tiếp xúc.`;
  if (to > from) return `Mức căng bánh ${name}: ${from} → ${to}. Lốp minh họa tròn hơn, ít bẹt.`;
  return `Mức căng bánh ${name}: ${to}/100.`;
}

export function fieldImpactCopy(field: IllustrationField, from: number, to: number): string {
  const label = ILLUSTRATION_FIELDS[field].label;
  if (field === "load") {
    return to > from
      ? `${label}: ${from} → ${to}. Thân xe hạ nhẹ trên hệ treo minh họa.`
      : `${label}: ${from} → ${to}. Thân xe nhấc nhẹ so với bánh.`;
  }
  if (field === "roughness") {
    return `${label}: ${from} → ${to}. Chỉ dao động khi bật Chạy minh họa.`;
  }
  if (field === "rhythm") {
    return `${label}: ${from} → ${to}. Chỉ đổi tốc độ animation khi đang chạy minh họa.`;
  }
  return `${label}: ${from}° → ${to}°. Hai bánh trước xoay quanh trục lái.`;
}

export function liveImpactCopy(state: IllustrationState, threeD: boolean): string {
  const s = clampIllustration(state);
  if (!threeD) {
    return "Sơ đồ 2D đang phản ánh kịch bản minh họa. Không có hiệu ứng 3D.";
  }
  const soft = WHEEL_IDS.filter((id) => s.tensions[id] < 35).map((id) => WHEEL_SHORT[id]);
  const bits = [`Tải minh họa ${s.load}/100`];
  if (soft.length) bits.push(`lốp mềm: ${soft.join(", ")}`);
  if (s.steer !== 0) bits.push(`lái ${s.steer}°`);
  if (s.roughness > 0) bits.push(`đường ${s.roughness}/100`);
  return `Tác động đang hiển thị: ${bits.join(" · ")}.`;
}
