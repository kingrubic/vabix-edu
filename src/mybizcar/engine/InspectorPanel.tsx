"use client";

import { BIZCAR_SYSTEMS, BIZCAR_SYSTEM_BY_ID, DEVELOPING_COPY } from "@/mybizcar/domain";
import { useEffect, useRef, useState } from "react";
import type { EngineViewModel } from "@/mybizcar/visualization/view-model";
import {
  MISSING_DATA_LABEL,
  TIRE_ILLUSTRATION_LABEL,
  scenarioChangeCopy,
  TIRE_MAPPING,
  TIRE_TENSION_MAX,
  TIRE_TENSION_MIN,
  interpretTensionDraft,
  isWheelId,
  tireVisualCopy,
  type TireTensionState,
  type WheelId,
} from "@/mybizcar/visualization/tire-scenario";
import { WHEEL_LAYOUT_NOTE } from "./component-registry";
import type { InspectorTarget } from "./vehicle-types";

type Mode = "profile" | "scenario";

export function InspectorPanel({
  model,
  selected,
  mode,
  compare,
  linked,
  systemsOpen,
  profileTensions,
  scenarioTensions,
  dirty,
  onSelect,
  onMode,
  onCompare,
  onLinked,
  onSystemsOpen,
  onTension,
  onResetPart,
  onResetAll,
}: {
  model: EngineViewModel;
  selected: InspectorTarget;
  mode: Mode;
  compare: "before" | "after";
  linked: boolean;
  systemsOpen: boolean;
  profileTensions: TireTensionState;
  scenarioTensions: TireTensionState;
  dirty: boolean;
  onSelect: (target: InspectorTarget) => void;
  onMode: (mode: Mode) => void;
  onCompare: (compare: "before" | "after") => void;
  onLinked: (linked: boolean) => void;
  onSystemsOpen: (open: boolean) => void;
  onTension: (id: WheelId, value: number) => void;
  onResetPart: (id: WheelId) => void;
  onResetAll: () => void;
}) {
  return (
    <div className="space-y-4 text-sm">
      <p className="text-[11px] tracking-[0.14em] text-vabix-gold uppercase">{breadcrumbFor(selected)}</p>
      {selected.type !== "overview" ? (
        <button type="button" className="min-h-11 border border-white/20 px-3" onClick={() => onSelect({ type: "overview" })}>
          Trở về toàn xe
        </button>
      ) : null}
      {selected.type === "connection" ? <ConnectionBody model={model} selected={selected} onSelect={onSelect} /> : null}
      {selected.type === "chamber" ? <ChamberBody model={model} selected={selected} onSelect={onSelect} /> : null}
      {selected.type === "system" ? (
        <SystemBody
          model={model}
          selected={selected}
          mode={mode}
          compare={compare}
          linked={linked}
          profileTensions={profileTensions}
          scenarioTensions={scenarioTensions}
          dirty={dirty}
          onSelect={onSelect}
          onMode={onMode}
          onCompare={onCompare}
          onLinked={onLinked}
          onTension={onTension}
          onResetPart={onResetPart}
          onResetAll={onResetAll}
        />
      ) : null}
      {selected.type === "overview" ? <OverviewBody onSelect={onSelect} /> : null}
      <details
        className="border border-white/10 p-3"
        open={systemsOpen}
        onToggle={(e) => onSystemsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer text-[11px] tracking-[0.14em] text-white/60 uppercase">12 cấu phần</summary>
        {systemsOpen ? (
        <ul className="mt-3 space-y-1">
          {BIZCAR_SYSTEMS.filter((s) => s.status === "active").map((s) => (
            <li key={s.id}>
              <button type="button" className="w-full border border-white/10 px-3 py-2 text-left" onClick={() => onSelect({ type: "system", id: s.id })}>
                <span className="text-vabix-gold">{s.n}</span> {s.name}
                <span className="mt-0.5 block text-[11px] text-white/45">Đã số hóa</span>
              </button>
            </li>
          ))}
        </ul>
        ) : null}
        {systemsOpen ? (
          <details className="mt-3 border border-white/10 p-2">
            <summary className="cursor-pointer text-[11px] tracking-[0.12em] text-white/45 uppercase">Module đang phát triển</summary>
            <ul className="mt-2 space-y-1">
              {BIZCAR_SYSTEMS.filter((s) => s.status === "developing").map((s) => (
                <li key={s.id}>
                  <button type="button" className="w-full border border-white/10 px-3 py-2 text-left" onClick={() => onSelect({ type: "system", id: s.id })}>
                    <span className="text-vabix-gold">{s.n}</span> {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </details>
    </div>
  );
}

function breadcrumbFor(selected: InspectorTarget) {
  if (selected.type === "overview") return "Toàn xe";
  if (selected.type === "system") return `Toàn xe / ${BIZCAR_SYSTEM_BY_ID[selected.id].name}`;
  if (selected.type === "chamber") return `Toàn xe / Động cơ doanh nghiệp / ${selected.code}`;
  return `Toàn xe / Động cơ doanh nghiệp / Mối nối ${selected.code}`;
}

function OverviewBody({ onSelect }: { onSelect: (target: InspectorTarget) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">Toàn xe — doanh nghiệp như một hệ thống</h3>
      <p className="text-white/70">Chọn một bánh xe hoặc Động cơ doanh nghiệp trên mô hình. Bảng này luôn đọc được cùng dữ liệu, không phụ thuộc thao tác 3D.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="min-h-11 border border-white/20 px-3" onClick={() => onSelect({ type: "system", id: "engine" })}>
          Động cơ MTUA
        </button>
        <button type="button" className="min-h-11 border border-white/20 px-3" onClick={() => onSelect({ type: "system", id: "finance-wheel" })}>
          Bánh xe Tài chính
        </button>
      </div>
    </div>
  );
}

function ConnectionBody({
  model,
  selected,
  onSelect,
}: {
  model: EngineViewModel;
  selected: Extract<InspectorTarget, { type: "connection" }>;
  onSelect: (target: InspectorTarget) => void;
}) {
  const conn = model.connections.find((c) => c.code === selected.code);
  if (!conn) return <OverviewBody onSelect={onSelect} />;
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">Mối nối {conn.code}</h3>
      <Qa title="Đại diện cho điều gì?" body={`Mối nối CFS ${conn.code}: chuẩn khớp ${conn.fitStandard}.`} />
      <Qa title="Dữ liệu hiện tại là gì?" body={`Điểm: ${conn.score ?? MISSING_DATA_LABEL}. Tín hiệu lệch: ${conn.deviation || "—"}.`} />
      <Qa title="Hình ảnh đang thể hiện điều gì?" body={conn.dashed ? "Đường đứt — mối nối đang là giả thuyết trên sơ đồ động cơ." : "Đường liền — mối nối đã xác minh trên sơ đồ động cơ."} />
      <Qa title="Bằng chứng nào hỗ trợ?" body={`${conn.evidenceStatus}. ${conn.note || "Chưa có ghi chú bằng chứng thêm."}`} />
      <Qa title="Việc nào cần kiểm tra tiếp?" body={conn.recommendedCheck || "Chưa có việc cần làm được ghi trong hồ sơ."} />
    </div>
  );
}

function ChamberBody({
  model,
  selected,
  onSelect,
}: {
  model: EngineViewModel;
  selected: Extract<InspectorTarget, { type: "chamber" }>;
  onSelect: (target: InspectorTarget) => void;
}) {
  const chamber = model.chambers.find((c) => c.code === selected.code);
  if (!chamber) return <OverviewBody onSelect={onSelect} />;
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">{chamber.code} — {chamber.name}</h3>
      <Qa title="Đại diện cho điều gì?" body={`${chamber.mnemonic}: ${chamber.name}. ${chamber.statement || "Cấu kiện MTUA trong Động cơ doanh nghiệp."}`} />
      <Qa
        title="Dữ liệu hiện tại là gì?"
        body={`MDS cuối: ${fmt(chamber.mdsFinal)}. Mức kích hoạt: ${fmt(chamber.activation)}. Lực: ${chamber.force ?? MISSING_DATA_LABEL}. Cấp bằng chứng: ${chamber.evidence ?? "Thiếu bằng chứng"}.`}
      />
      <Qa title="Hình ảnh đang thể hiện điều gì?" body="Buồng động cơ trên mô hình 3D phản ánh cấu kiện MTUA đã số hóa, không phải hình dáng lốp." />
      <Qa title="Bằng chứng nào hỗ trợ?" body={forceExplanation(chamber)} />
      <Qa
        title="Việc nào cần kiểm tra tiếp?"
        body={chamber.nextChecks[0] || (chamber.weakest ? `Rà soát tiêu chí yếu: ${chamber.weakest}.` : "Chưa có việc cần làm được ghi trong hồ sơ.")}
      />
      <div className="flex flex-wrap gap-2">
        {model.chambers.map((c) => (
          <button key={c.code} type="button" className="min-h-11 border border-white/20 px-3" onClick={() => onSelect({ type: "chamber", code: c.code })}>
            {c.code}
          </button>
        ))}
      </div>
      <details className="border border-white/10 p-3">
        <summary className="cursor-pointer text-[11px] tracking-[0.14em] text-white/55 uppercase">Công thức và trọng số</summary>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-white/55">
          {chamber.why.map((w) => <li key={w}>{w}</li>)}
          {chamber.forceWhy.map((w) => <li key={w}>{w}</li>)}
        </ul>
      </details>
    </div>
  );
}

function SystemBody({
  model,
  selected,
  mode,
  compare,
  linked,
  profileTensions,
  scenarioTensions,
  dirty,
  onSelect,
  onMode,
  onCompare,
  onLinked,
  onTension,
  onResetPart,
  onResetAll,
}: {
  model: EngineViewModel;
  selected: Extract<InspectorTarget, { type: "system" }>;
  mode: Mode;
  compare: "before" | "after";
  linked: boolean;
  profileTensions: TireTensionState;
  scenarioTensions: TireTensionState;
  dirty: boolean;
  onSelect: (target: InspectorTarget) => void;
  onMode: (mode: Mode) => void;
  onCompare: (compare: "before" | "after") => void;
  onLinked: (linked: boolean) => void;
  onTension: (id: WheelId, value: number) => void;
  onResetPart: (id: WheelId) => void;
  onResetAll: () => void;
}) {
  const sys = BIZCAR_SYSTEM_BY_ID[selected.id];
  if (sys.id === "engine") {
    return (
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">{sys.name}</h3>
        <Qa title="Đại diện cho điều gì?" body={sys.function} />
        <Qa title="Dữ liệu hiện tại là gì?" body="Module đã số hóa theo MTUA: MDS, mức kích hoạt, CFS, lực tác động và cấp bằng chứng." />
        <Qa title="Hình ảnh đang thể hiện điều gì?" body="Nắp capo mở hoặc xuyên thấu để thấy bốn buồng MTUA. Không gắn điểm số vào hình dáng thân xe." />
        <Qa title="Bằng chứng nào hỗ trợ?" body="Chọn từng cấu kiện M / T / U / A để đọc điểm, bằng chứng và việc cần làm tiếp." />
        <Qa title="Việc nào cần kiểm tra tiếp?" body="Đi vào từng buồng động cơ. Không suy diễn module đang phát triển thành điểm số." />
        <ul className="space-y-2">
          {model.chambers.map((c) => (
            <li key={c.code}>
              <button type="button" className="w-full border border-white/10 px-3 py-2 text-left" onClick={() => onSelect({ type: "chamber", code: c.code })}>
                <strong>{c.code} {c.mnemonic}</strong>
                <span className="mt-1 block text-white/55">MDS {fmt(c.mdsFinal)} · Kích hoạt {fmt(c.activation)} · Lực {c.force ?? MISSING_DATA_LABEL}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (isWheelId(sys.id)) {
    const shown = mode === "profile" || compare === "before" ? profileTensions[sys.id] : scenarioTensions[sys.id];
    return (
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">{sys.name}</h3>
        <p className="text-white/55">{sys.function}</p>
        <p className="text-xs text-vabix-gold">{TIRE_ILLUSTRATION_LABEL}</p>
        <p className="text-white/80">Mức đang xem: {shown}/100</p>
        <ModeSwitch
          mode={mode}
          dirty={dirty}
          wheelId={sys.id}
          profileTensions={profileTensions}
          scenarioTensions={scenarioTensions}
          onMode={onMode}
          onCompare={onCompare}
          compare={compare}
        />
        <TireControls
          id={sys.id}
          value={shown}
          baseline={profileTensions[sys.id]}
          disabled={mode !== "scenario" || compare === "before"}
          linked={linked}
          onLinked={onLinked}
          onTension={onTension}
          onResetPart={onResetPart}
          onResetAll={onResetAll}
        />
        <p className="text-white/70">{tireVisualCopy(shown)}</p>
        <details className="border border-white/10 p-3">
          <summary className="cursor-pointer text-[11px] tracking-[0.12em] text-white/55 uppercase">Diễn giải</summary>
          <div className="mt-2 space-y-2">
            <Qa title="Việc nào cần kiểm tra tiếp?" body={DEVELOPING_COPY} />
          </div>
        </details>
        <details className="border border-white/10 p-3">
          <summary className="cursor-pointer text-[11px] tracking-[0.12em] text-white/55 uppercase">Phương pháp mô phỏng</summary>
          <div className="mt-2 space-y-2 text-white/60">
            <p>{WHEEL_LAYOUT_NOTE}</p>
            <p>{TIRE_MAPPING.note}</p>
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold">{sys.name}</h3>
      <p className="text-white/50" title={sys.nameEn}>{sys.nameEn}</p>
      <Qa title="Đại diện cho điều gì?" body={`${sys.function} Miền: ${sys.domain}.`} />
      <Qa title="Dữ liệu hiện tại là gì?" body="Đang phát triển — chưa có hồ sơ số hóa." />
      <Qa title="Hình ảnh đang thể hiện điều gì?" body="Module đang phát triển: hình ảnh chỉ để định vị trên xe, chưa gắn dữ liệu hồ sơ." />
      <Qa title="Bằng chứng nào hỗ trợ?" body={MISSING_DATA_LABEL} />
      <Qa title="Việc nào cần kiểm tra tiếp?" body={DEVELOPING_COPY} />
    </div>
  );
}

function ModeSwitch({
  mode,
  compare,
  wheelId,
  profileTensions,
  scenarioTensions,
  onMode,
  onCompare,
}: {
  mode: Mode;
  dirty?: boolean;
  compare: "before" | "after";
  wheelId: WheelId;
  profileTensions: TireTensionState;
  scenarioTensions: TireTensionState;
  onMode: (mode: Mode) => void;
  onCompare: (compare: "before" | "after") => void;
}) {
  const changeCopy = scenarioChangeCopy(scenarioTensions, profileTensions, wheelId);
  return (
    <div className="space-y-2 border border-[#DDE3DE] bg-[#F6F5F1] p-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`min-h-11 px-3 ${mode === "profile" ? "bg-[#163c3e] text-[#F6F5F1]" : "border border-[#DDE3DE] text-[#163D38]"}`} onClick={() => onMode("profile")}>
          Hồ sơ hiện tại
        </button>
        <button type="button" className={`min-h-11 px-3 ${mode === "scenario" ? "bg-[#163c3e] text-[#F6F5F1]" : "border border-[#DDE3DE] text-[#163D38]"}`} onClick={() => onMode("scenario")}>
          Thử kịch bản
        </button>
      </div>
      {mode === "scenario" ? (
        <>
          {changeCopy ? <p className="text-[#163D38]">{changeCopy}</p> : null}
          <p className="text-[#626D68]">Kịch bản chỉ được giữ trong phiên này.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`min-h-11 px-3 ${compare === "before" ? "border border-[#B79A63] text-[#163D38]" : "border border-[#DDE3DE]"}`} onClick={() => onCompare("before")}>
              Trước
            </button>
            <button type="button" className={`min-h-11 px-3 ${compare === "after" ? "border border-[#B79A63] text-[#163D38]" : "border border-[#DDE3DE]"}`} onClick={() => onCompare("after")}>
              Sau
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function TireControls({
  id,
  value,
  baseline,
  disabled,
  linked,
  onLinked,
  onTension,
  onResetPart,
  onResetAll,
}: {
  id: WheelId;
  value: number;
  baseline: number;
  disabled: boolean;
  linked: boolean;
  onLinked: (linked: boolean) => void;
  onTension: (id: WheelId, value: number) => void;
  onResetPart: (id: WheelId) => void;
  onResetAll: () => void;
}) {
  const [text, setText] = useState(String(value));
  const [error, setError] = useState<string | null>(null);
  const focused = useRef(false);
  const lastValue = useRef(value);

  useEffect(() => {
    focused.current = false;
    setText(String(value));
    setError(null);
    lastValue.current = value;
  }, [id]);

  useEffect(() => {
    const external = lastValue.current !== value;
    lastValue.current = value;
    if (!external) return;
    const draft = interpretTensionDraft(text, value);
    if (focused.current && draft.commit == null && draft.kind !== "empty") {
      setText(String(value));
      setError(null);
      return;
    }
    if (!focused.current) {
      setText(String(value));
      setError(null);
    }
  }, [value, text]);

  function onDraftChange(raw: string) {
    setText(raw);
    const result = interpretTensionDraft(raw, value);
    setError(result.error);
    if (result.commit != null) onTension(id, result.commit);
  }

  const errorId = `tire-tension-error-${id}`;

  return (
    <div className="space-y-3 border border-vabix-gold/25 bg-vabix-gold/5 p-3">
      <p className="text-[11px] tracking-[0.12em] text-vabix-gold uppercase">Mức căng lốp minh họa</p>
      <p className="text-[#626D68]">Hồ sơ: {baseline} · Đang xem: {value}</p>
      <label>
        Thanh trượt
        <input
          type="range"
          min={TIRE_TENSION_MIN}
          max={TIRE_TENSION_MAX}
          step={1}
          value={value}
          disabled={disabled}
          aria-label="Mức căng lốp minh họa"
          onChange={(e) => {
            const next = Number(e.target.value);
            setText(String(next));
            setError(null);
            onTension(id, next);
          }}
        />
      </label>
      <label>
        Nhập số nguyên từ 0–100
        <input
          type="text"
          inputMode="numeric"
          value={text}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          aria-label="Nhập số nguyên mức căng lốp minh họa từ 0 đến 100"
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={() => {
            focused.current = false;
            if (!error) setText(String(value));
          }}
          onChange={(e) => onDraftChange(e.target.value)}
        />
      </label>
      {error ? (
        <p id={errorId} className="text-sm text-[#9a3f32]" role="alert">
          {error} Mô hình đang giữ mức hợp lệ {value}.
        </p>
      ) : null}
      <label className="flex items-center gap-2 normal-case tracking-normal">
        <input type="checkbox" checked={linked} disabled={disabled} onChange={(e) => onLinked(e.target.checked)} />
        Liên kết cả bốn bánh
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="min-h-11 border border-[#DDE3DE] px-3 text-[#163D38]" disabled={disabled} onClick={() => onResetPart(id)}>
          Đặt lại bánh này
        </button>
        <button type="button" className="min-h-11 border border-[#DDE3DE] px-3 text-[#163D38]" disabled={disabled} onClick={onResetAll}>
          Đặt lại toàn bộ
        </button>
      </div>
    </div>
  );
}

function Qa({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h4 className="text-[11px] tracking-[0.12em] text-[#B79A63] uppercase">{title}</h4>
      <p className="mt-1 text-[#626D68]">{body}</p>
    </section>
  );
}

function fmt(value: number | null | undefined) {
  return value == null ? MISSING_DATA_LABEL : String(value);
}

function forceExplanation(chamber: EngineViewModel["chambers"][number]) {
  const bits: string[] = [];
  if (chamber.force == null) bits.push("Lực: chưa đủ bằng chứng để xác định lực.");
  else if (chamber.force < 0) {
    if (chamber.forceEvidenceNote.trim()) bits.push(`Lực ${chamber.force}. Bằng chứng ghi nhận: ${chamber.forceEvidenceNote}`);
    else bits.push("Chưa có giải thích/bằng chứng cho giá trị lực này.");
  } else if (chamber.forceEvidenceNote.trim()) bits.push(`Lực ${chamber.force}. ${chamber.forceEvidenceNote}`);
  else bits.push(`Lực ${chamber.force}. ${chamber.forceWhy[0] ?? "Chưa có giải thích/bằng chứng cho giá trị lực này."}`);
  if (chamber.statement) bits.push(chamber.statement);
  return bits.join(" ");
}
