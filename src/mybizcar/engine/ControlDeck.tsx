"use client";

import { useEffect, useRef, useState } from "react";
import {
  ILLUSTRATION_FIELDS,
  ILLUSTRATION_LABEL,
  ILLUSTRATION_PRESETS,
  liveImpactCopy,
  WHEEL_SHORT,
  type IllustrationField,
  type IllustrationPresetId,
  type IllustrationState,
} from "@/mybizcar/visualization/illustration";
import {
  interpretIntDraft,
  interpretTensionDraft,
  isWheelId,
  TIRE_TENSION_MAX,
  TIRE_TENSION_MIN,
  WHEEL_IDS,
  type WheelId,
} from "@/mybizcar/visualization/tire-scenario";
import type { InspectorTarget } from "./vehicle-types";

type Mode = "profile" | "scenario";

export function ControlDeck({
  mode,
  compare,
  linked,
  autoFocus,
  playing,
  threeD,
  selectedWheel,
  profile,
  scenario,
  visual,
  impactLine,
  onMode,
  onCompare,
  onLinked,
  onAutoFocus,
  onPlaying,
  onSelectWheel,
  onTension,
  onField,
  onResetWheel,
  onResetAll,
  onPreset,
}: {
  mode: Mode;
  compare: "before" | "after";
  linked: boolean;
  autoFocus: boolean;
  playing: boolean;
  threeD: boolean;
  selectedWheel: WheelId;
  profile: IllustrationState;
  scenario: IllustrationState;
  visual: IllustrationState;
  impactLine: string | null;
  onMode: (mode: Mode) => void;
  onCompare: (compare: "before" | "after") => void;
  onLinked: (linked: boolean) => void;
  onAutoFocus: (value: boolean) => void;
  onPlaying: (value: boolean) => void;
  onSelectWheel: (id: WheelId) => void;
  onTension: (id: WheelId, value: number) => void;
  onField: (field: IllustrationField, value: number) => void;
  onResetWheel: (id: WheelId) => void;
  onResetAll: () => void;
  onPreset: (id: IllustrationPresetId) => void;
}) {
  const disabled = mode !== "scenario" || compare === "before";
  const shown = visual.tensions[selectedWheel];
  const baseline = profile.tensions[selectedWheel];
  return (
    <div className="space-y-4 text-sm">
      <p className="text-[11px] tracking-[0.12em] text-[#B49A67] uppercase">{ILLUSTRATION_LABEL}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={tabBtn(mode === "profile")} onClick={() => onMode("profile")}>
          Hồ sơ hiện tại
        </button>
        <button type="button" className={tabBtn(mode === "scenario")} onClick={() => onMode("scenario")}>
          Thử kịch bản
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {WHEEL_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`min-h-11 border px-3 py-2 text-left ${selectedWheel === id ? "border-[#B49A67] bg-[#B49A67]/10" : "border-[#D9E2DC]"}`}
            onClick={() => onSelectWheel(id)}
          >
            <span className="block text-[11px] tracking-[0.1em] text-[#64736B] uppercase">{WHEEL_SHORT[id]}</span>
            <span className="font-semibold text-[#163D38]">{visual.tensions[id]}</span>
          </button>
        ))}
      </div>
      <p className="font-semibold text-[#163D38]">Bánh xe {WHEEL_SHORT[selectedWheel]}</p>
      <IntField
        label="Mức căng lốp"
        value={shown}
        min={TIRE_TENSION_MIN}
        max={TIRE_TENSION_MAX}
        disabled={disabled}
        onCommit={(v) => onTension(selectedWheel, v)}
      />
      <p className="text-[#64736B]">
        Hồ sơ {baseline} → đang thử {shown}
      </p>
      <p className="text-[#163D38]">{threeD ? (impactLine ?? liveImpactCopy(visual, true)) : liveImpactCopy(visual, false)}</p>
      {mode === "scenario" ? (
        <>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={tabBtn(compare === "before")} onClick={() => onCompare("before")}>Trước</button>
            <button type="button" className={tabBtn(compare === "after")} onClick={() => onCompare("after")}>Sau</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="min-h-11 border border-[#D9E2DC] px-3 text-[#163D38]" disabled={disabled} onClick={() => onResetWheel(selectedWheel)}>
              Đặt lại bộ phận
            </button>
            <button type="button" className="min-h-11 border border-[#D9E2DC] px-3 text-[#163D38]" disabled={disabled} onClick={onResetAll}>
              Đặt lại toàn bộ
            </button>
          </div>
          <label className="flex items-center gap-2 normal-case tracking-normal text-[#64736B]">
            <input type="checkbox" checked={linked} disabled={disabled} onChange={(e) => onLinked(e.target.checked)} />
            Liên kết bốn bánh
          </label>
          <label className="flex items-center gap-2 normal-case tracking-normal text-[#64736B]">
            <input type="checkbox" checked={autoFocus} onChange={(e) => onAutoFocus(e.target.checked)} />
            Tự chuyển góc nhìn
          </label>
          <div className="space-y-3 border border-[#D9E2DC] bg-[#F3F2ED] p-3">
            <p className="text-[11px] tracking-[0.12em] text-[#B49A67] uppercase">Preset thử nhanh</p>
            {(Object.keys(ILLUSTRATION_PRESETS) as IllustrationPresetId[]).map((id) => (
              <button key={id} type="button" className="min-h-11 w-full border border-[#D9E2DC] bg-[#FFFEFA] px-3 text-left text-[#163D38]" disabled={disabled} onClick={() => onPreset(id)}>
                {ILLUSTRATION_PRESETS[id].label}
              </button>
            ))}
          </div>
          <FieldSlider field="load" value={visual.load} baseline={profile.load} disabled={disabled} onCommit={(v) => onField("load", v)} />
          <FieldSlider field="roughness" value={visual.roughness} baseline={profile.roughness} disabled={disabled} onCommit={(v) => onField("roughness", v)} />
          <FieldSlider field="rhythm" value={visual.rhythm} baseline={profile.rhythm} disabled={disabled} onCommit={(v) => onField("rhythm", v)} />
          <FieldSlider field="steer" value={visual.steer} baseline={profile.steer} disabled={disabled} onCommit={(v) => onField("steer", v)} />
          <button type="button" className="min-h-11 w-full bg-[#163c3e] px-3 font-semibold text-[#F3F2ED]" onClick={() => onPlaying(!playing)}>
            {playing ? "Dừng minh họa" : "Chạy minh họa"}
          </button>
        </>
      ) : (
        <p className="text-[#64736B]">Chuyển sang Thử kịch bản để chỉnh thông số minh họa. Hồ sơ đánh giá không bị ghi.</p>
      )}
    </div>
  );
}

function tabBtn(active: boolean) {
  return `min-h-11 px-3 ${active ? "bg-[#163c3e] text-[#F3F2ED]" : "border border-[#D9E2DC] text-[#163D38]"}`;
}

function FieldSlider({
  field,
  value,
  baseline,
  disabled,
  onCommit,
}: {
  field: IllustrationField;
  value: number;
  baseline: number;
  disabled: boolean;
  onCommit: (value: number) => void;
}) {
  const meta = ILLUSTRATION_FIELDS[field];
  return (
    <div className="space-y-2">
      <IntField label={meta.label} value={value} min={meta.min} max={meta.max} disabled={disabled} onCommit={onCommit} />
      <p className="text-[12px] text-[#64736B]">{meta.note} Hồ sơ {baseline} → đang thử {value}.</p>
    </div>
  );
}

function IntField({
  label,
  value,
  min,
  max,
  disabled,
  onCommit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  onCommit: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));
  const [error, setError] = useState<string | null>(null);
  const focused = useRef(false);
  const lastValue = useRef(value);

  useEffect(() => {
    lastValue.current = value;
    setText(String(value));
    if (!focused.current) setError(null);
  }, [value]);

  function onDraft(raw: string) {
    setText(raw);
    const result = min === TIRE_TENSION_MIN && max === TIRE_TENSION_MAX
      ? interpretTensionDraft(raw, value)
      : interpretIntDraft(raw, value, min, max);
    setError(result.error);
    if (result.commit != null) onCommit(result.commit);
  }

  return (
    <div className="space-y-2">
      <label>
        {label}
        <input type="range" min={min} max={max} step={1} value={value} disabled={disabled} aria-label={label} onChange={(e) => {
          const next = Number(e.target.value);
          setText(String(next));
          setError(null);
          onCommit(next);
        }} />
      </label>
      <label>
        Nhập số nguyên {min}–{max}
          <input
          type="text"
          inputMode="numeric"
          className="scroll-mb-40"
          value={text}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          onFocus={() => { focused.current = true; }}
          onBlur={() => {
            focused.current = false;
            if (!error) setText(String(value));
          }}
          onChange={(e) => onDraft(e.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-[#9a3f32]" role="alert">{error} Mô hình đang giữ mức hợp lệ {value}.</p> : null}
    </div>
  );
}

export function selectedWheelFrom(target: InspectorTarget, fallback: WheelId): WheelId {
  if (target.type === "system" && isWheelId(target.id)) return target.id;
  return fallback;
}
