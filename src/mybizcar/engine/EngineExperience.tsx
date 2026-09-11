"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EngineViewModel } from "@/mybizcar/visualization/view-model";
import { BIZCAR_SYSTEM_BY_ID, type BizcarSystemId } from "@/mybizcar/domain";
import { applyWheelTension, isWheelId, type WheelId } from "@/mybizcar/visualization/tire-scenario";
import {
  emptyIllustration,
  fieldImpactCopy,
  ILLUSTRATION_PRESETS,
  isIllustrationDirty,
  liveImpactCopy,
  tensionImpactCopy,
  type IllustrationField,
  type IllustrationPresetId,
  type IllustrationState,
} from "@/mybizcar/visualization/illustration";
import { EngineFallback, EngineTable } from "./EngineFallback";
import { InspectorPanel } from "./InspectorPanel";
import { ControlDeck, selectedWheelFrom } from "./ControlDeck";
import { focusForSelection, VIEW_ANGLES, type FocusId } from "./component-registry";
import type { InspectorTarget } from "./vehicle-types";
import { TOUR, tourBody, tourViewForStep, type TourBackup } from "./tour";
import { MODEL_RECORD, STUDIO } from "./studio";

const EngineCanvas = dynamic(() => import("./EngineCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center text-[#64736B]" role="status">
      Đang tải mô hình 3D…
    </div>
  ),
});

type SceneStatus = "loading" | "ready" | "unsupported" | "lost" | "diagram" | "failed";
type PanelTab = "control" | "analysis" | "evidence";

export function EngineExperience({ model }: { model: EngineViewModel }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const tourBackup = useRef<TourBackup | null>(null);
  const lastWheel = useRef<WheelId>("finance-wheel");

  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [status, setStatus] = useState<SceneStatus>("loading");
  const [sceneKey, setSceneKey] = useState(0);
  const [focus, setFocus] = useState<FocusId>("whole");
  const [resetToken, setResetToken] = useState(0);
  const [xray, setXray] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [showForce, setShowForce] = useState(false);
  const [labels, setLabels] = useState(false);
  const [connections, setConnections] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [selected, setSelected] = useState<InspectorTarget>({ type: "overview" });
  const [hoveredId, setHoveredId] = useState<BizcarSystemId | null>(null);
  const [flashId, setFlashId] = useState<BizcarSystemId | null>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [introOpen, setIntroOpen] = useState(false);
  const [systemsOpen, setSystemsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [tab, setTab] = useState<PanelTab>("control");
  const [wide, setWide] = useState(false);
  const [mode, setMode] = useState<"profile" | "scenario">("profile");
  const [compare, setCompare] = useState<"before" | "after">("after");
  const [linked, setLinked] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  const [playing, setPlaying] = useState(false);
  const profile = useMemo(() => emptyIllustration(), []);
  const [scenario, setScenario] = useState<IllustrationState>(() => emptyIllustration());
  const [reduced, setReduced] = useState(false);
  const [impactLine, setImpactLine] = useState<string | null>(null);
  const tourScenarioSeeded = useRef(false);

  const visual = mode === "profile" || compare === "before" ? profile : scenario;
  const dirty = isIllustrationDirty(scenario, profile);
  const engineContext =
    selected.type === "chamber" || selected.type === "connection" || (selected.type === "system" && selected.id === "engine");
  const threeD = webgl && status !== "unsupported" && status !== "diagram" && status !== "failed";
  const activeWheel = selectedWheelFrom(selected, lastWheel.current);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const attrs = { failIfMajorPerformanceCaveat: false };
      const gl2 = canvas.getContext("webgl2", attrs);
      const gl1 = gl2 ?? canvas.getContext("webgl", attrs) ?? canvas.getContext("experimental-webgl", attrs);
      const ok = Boolean(gl1);
      (window as Window & { __bizcarEngineDiag?: object }).__bizcarEngineDiag = { webgl: ok, webgl2: Boolean(gl2) };
      setWebgl(ok);
      if (!ok) setStatus("unsupported");
    } catch {
      setWebgl(false);
      setStatus("unsupported");
    }
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px)");
    const applyWide = () => setWide(mq.matches);
    applyWide();
    mq.addEventListener("change", applyWide);
    return () => mq.removeEventListener("change", applyWide);
  }, []);

  useEffect(() => {
    (window as Window & { __bizcarView?: object }).__bizcarView = {
      xray,
      exploded,
      labels,
      focus,
      selected,
      status,
      threeD,
      load: visual.load,
      playing,
    };
  }, [xray, exploded, labels, focus, selected, status, threeD, visual.load, playing]);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setInterval(() => setCycle((c) => (c + 1) % 4), 2200);
    return () => window.clearInterval(id);
  }, [paused, reduced]);

  const flash = useCallback((id: BizcarSystemId) => {
    setFlashId(id);
    window.setTimeout(() => setFlashId((cur) => (cur === id ? null : cur)), 700);
  }, []);

  const applyWhole = useCallback(() => {
    setFocus("whole");
    setExploded(false);
    setXray(false);
    setShowForce(false);
    setLabels(false);
    setPlaying(false);
    setSelected({ type: "overview" });
    setResetToken((n) => n + 1);
  }, []);

  const applyView = useCallback((id: FocusId) => {
    setExploded(false);
    setXray(false);
    setLabels(false);
    setFocus(id);
    if (id === "whole" || id === "front" || id === "side" || id === "rear") {
      setSelected({ type: "overview" });
      setResetToken((n) => n + 1);
    }
  }, []);

  const onSelect = useCallback((target: InspectorTarget) => {
    setSelected(target);
    if (target.type === "system" && isWheelId(target.id)) lastWheel.current = target.id;
    if (target.type === "overview") {
      setExploded(false);
      setXray(false);
      setLabels(false);
      if (autoFocus) {
        setFocus("whole");
        setResetToken((n) => n + 1);
      }
      return;
    }
    if (autoFocus) setFocus(focusForSelection(target));
    if (target.type === "system" && BIZCAR_SYSTEM_BY_ID[target.id].status === "developing") setSheetOpen(true);
    if (target.type === "chamber" || target.type === "connection") {
      setSheetOpen(true);
      setXray(true);
      setTab("analysis");
    }
  }, [autoFocus]);

  const applyTourView = useCallback((index: number) => {
    const view = tourViewForStep(index);
    setExploded(view.exploded);
    setXray(view.xray);
    setLabels(false);
    setShowForce(false);
    setSelected(view.selected);
    setFocus(view.focus);
    setResetToken((n) => n + 1);
    setMode(view.mode);
    setCompare(view.compare);
    setTab(view.scenario ? "control" : index === 1 ? "analysis" : "control");
    if (view.scenario && !tourScenarioSeeded.current) {
      setScenario(view.scenario);
      tourScenarioSeeded.current = true;
    }
  }, []);

  function startTour() {
    tourBackup.current = {
      mode,
      scenario,
      selected,
      focus,
      xray,
      exploded,
      labels,
      compare,
      linked,
      showForce,
      connections,
      playing,
      autoFocus,
    };
    tourScenarioSeeded.current = false;
    setPlaying(false);
    setTourStep(0);
    applyTourView(0);
  }

  const endTour = useCallback(() => {
    const snap = tourBackup.current;
    setTourStep(null);
    tourBackup.current = null;
    tourScenarioSeeded.current = false;
    if (!snap) {
      applyWhole();
      return;
    }
    setMode(snap.mode);
    setScenario(snap.scenario);
    setSelected(snap.selected);
    setFocus(snap.focus);
    setXray(snap.xray);
    setExploded(snap.exploded);
    setLabels(snap.labels);
    setCompare(snap.compare);
    setLinked(snap.linked);
    setShowForce(snap.showForce);
    setConnections(snap.connections);
    setPlaying(snap.playing);
    setAutoFocus(snap.autoFocus);
    setResetToken((n) => n + 1);
  }, [applyWhole]);

  useEffect(() => {
    if (tourStep == null) return;
    applyTourView(tourStep);
  }, [tourStep, applyTourView]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, "M" | "T" | "U" | "A"> = { Digit1: "M", Digit2: "T", Digit3: "U", Digit4: "A" };
      if (map[e.code] && engineContext) setSelected({ type: "chamber", code: map[e.code] });
      if (e.code === "Escape") {
        if (tourStep != null) endTour();
        else applyWhole();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [engineContext, tourStep, applyWhole, endTour]);

  function setTension(id: WheelId, value: number) {
    if (mode !== "scenario" || compare === "before") return;
    const from = scenario.tensions[id];
    setScenario((prev) => ({ ...prev, tensions: applyWheelTension(prev.tensions, id, value, linked) }));
    setImpactLine(tensionImpactCopy(from, value, id));
    flash(id);
  }

  function setField(field: IllustrationField, value: number) {
    if (mode !== "scenario" || compare === "before") return;
    const from = scenario[field];
    setScenario((prev) => ({ ...prev, [field]: value }));
    setImpactLine(fieldImpactCopy(field, from, value));
    flash(field === "steer" ? "value-wheel" : "shell");
  }

  const hoverCopy = hoveredId ? BIZCAR_SYSTEM_BY_ID[hoveredId].hover : null;
  const tourCopy = tourStep != null ? tourBody(tourStep, threeD) : null;
  const btn = (active: boolean) =>
    `min-h-11 px-3 text-[11px] tracking-[0.12em] uppercase border ${active ? "border-[#B49A67] bg-[#B49A67]/15 text-[#163D38]" : "border-[#D9E2DC] text-[#64736B]"}`;

  const control = (
    <ControlDeck
      mode={mode}
      compare={compare}
      linked={linked}
      autoFocus={autoFocus}
      playing={playing}
      threeD={threeD}
      selectedWheel={activeWheel}
      profile={profile}
      scenario={scenario}
      visual={visual}
      impactLine={impactLine}
      onMode={(next) => { setMode(next); setCompare("after"); setTab("control"); }}
      onCompare={setCompare}
      onLinked={setLinked}
      onAutoFocus={setAutoFocus}
      onPlaying={setPlaying}
      onSelectWheel={(id) => onSelect({ type: "system", id })}
      onTension={setTension}
      onField={setField}
      onResetWheel={(id) => setScenario((prev) => ({ ...prev, tensions: { ...prev.tensions, [id]: profile.tensions[id] } }))}
      onResetAll={() => { setScenario(emptyIllustration()); setImpactLine("Đã đặt lại toàn bộ kịch bản minh họa."); setPlaying(false); }}
      onPreset={(id: IllustrationPresetId) => {
        setScenario(ILLUSTRATION_PRESETS[id].state);
        setImpactLine(`${ILLUSTRATION_PRESETS[id].label}. ${liveImpactCopy(ILLUSTRATION_PRESETS[id].state, threeD)}`);
        setMode("scenario");
        setCompare("after");
      }}
    />
  );

  const inspector = (
    <InspectorPanel
      model={model}
      selected={selected}
      mode={mode}
      compare={compare}
      linked={linked}
      systemsOpen={systemsOpen}
      profileTensions={profile.tensions}
      scenarioTensions={scenario.tensions}
      dirty={dirty}
      onSelect={onSelect}
      onMode={(next) => { setMode(next); setCompare("after"); }}
      onCompare={setCompare}
      onLinked={setLinked}
      onSystemsOpen={setSystemsOpen}
      onTension={setTension}
      onResetPart={(id) => setScenario((prev) => ({ ...prev, tensions: { ...prev.tensions, [id]: profile.tensions[id] } }))}
      onResetAll={() => setScenario(emptyIllustration())}
    />
  );

  const panelBody =
    tab === "control" ? control : tab === "evidence" ? <EvidencePanel model={model} /> : inspector;

  return (
    <div className="flex min-h-[calc(100dvh-8rem)] flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-[#163D38]">MyBizCar 3D</h2>
          <p className="text-sm text-[#64736B]">Sedan quản trị — dữ liệu minh họa, tách biệt hồ sơ đánh giá.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tourStep == null ? (
            <button type="button" className="min-h-11 bg-[#163c3e] px-4 font-semibold text-[#F3F2ED]" onClick={startTour}>
              Khám phá có hướng dẫn
            </button>
          ) : null}
          <button type="button" className="min-h-11 border border-[#D9E2DC] px-4 text-[#163D38]" onClick={() => setIntroOpen((v) => !v)}>
            Giới thiệu mô hình
          </button>
        </div>
      </div>

      {introOpen ? (
        <div className="space-y-2 border border-[#D9E2DC] bg-[#FFFEFA] p-4 text-sm text-[#64736B]">
          <p>{model.disclaimer}</p>
          <p>Chỉ Động cơ MTUA đã số hóa. {MODEL_RECORD.claimedAs}. Không phải Mercedes-Benz E300.</p>
        </div>
      ) : null}

      {tourStep != null ? (
        <div className="flex flex-wrap items-center gap-3 border border-[#B49A67]/40 bg-[#FFFEFA] p-3">
          <div>
            <p className="text-[11px] tracking-[0.14em] text-[#B49A67] uppercase">Bước {tourStep + 1} / {TOUR.length}</p>
            <p className="font-semibold text-[#163D38]">{tourCopy?.title}</p>
            <p className="text-sm text-[#64736B]">{tourCopy?.body}</p>
          </div>
          <button type="button" className="min-h-11 bg-[#163c3e] px-4 text-[#F3F2ED]" onClick={() => (tourStep >= TOUR.length - 1 ? endTour() : setTourStep(tourStep + 1))}>
            {tourStep >= TOUR.length - 1 ? "Kết thúc" : "Tiếp"}
          </button>
          <button type="button" className="min-h-11 border border-[#D9E2DC] px-4 text-[#163D38]" onClick={endTour}>Thoát</button>
        </div>
      ) : null}

      <div className="grid min-h-0 flex-1 gap-3 min-[1100px]:grid-cols-[minmax(0,67fr)_minmax(340px,33fr)]">
        <div className="flex min-h-0 flex-col">
          <div
            ref={viewportRef}
            className="engine-viewport relative min-h-[38vh] w-full flex-1 overflow-hidden border border-[#D9E2DC] min-[1100px]:min-h-0"
            style={{ background: `linear-gradient(180deg, ${STUDIO.viewportTop} 0%, ${STUDIO.viewportBottom} 100%)` }}
          >
            {!mounted ? (
              <div className="flex h-full items-center justify-center text-[#64736B]" role="status">Đang tải mô hình 3D…</div>
            ) : threeD ? (
              <EngineCanvas
                key={sceneKey}
                model={model}
                focus={focus}
                resetToken={resetToken}
                xray={xray}
                exploded={exploded}
                showForce={showForce}
                showLabels={labels}
                showConnections={connections}
                paused={paused || reduced}
                cycleIndex={cycle}
                selected={selected}
                hoveredId={hoveredId}
                flashId={flashId}
                illustration={visual}
                running={playing && !reduced}
                onHover={setHoveredId}
                onSelect={onSelect}
                onReady={() => setStatus("ready")}
                onContextLost={() => setStatus((s) => (s === "diagram" ? s : "lost"))}
                onSceneError={() => setStatus("failed")}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <EngineFallback model={model} selected={selected} onSelect={onSelect} illustration={visual} threeD={false} />
                <p className="text-sm text-[#64736B]">{userStatusCopy(status)}</p>
                {status === "lost" || status === "unsupported" || status === "failed" ? (
                  <button type="button" className="min-h-11 border border-[#D9E2DC] px-4 text-[#163D38]" onClick={() => { setStatus("loading"); setWebgl(true); setSceneKey((k) => k + 1); }}>
                    Thử lại 3D
                  </button>
                ) : null}
              </div>
            )}
            <p className="pointer-events-none absolute bottom-3 left-3 text-[10px] tracking-[0.28em] text-[#163D38]/30 uppercase">MYBIZCAR</p>
            {hoverCopy && threeD && status !== "lost" ? (
              <div className="pointer-events-none absolute left-4 top-4 border border-[#B49A67]/50 bg-[#FFFEFA]/90 px-3 py-2 text-[11px] tracking-[0.14em] text-[#163D38] uppercase">
                {hoverCopy}
              </div>
            ) : null}
            {mounted && status === "loading" && threeD ? (
              <p className="pointer-events-none absolute bottom-16 left-4 text-sm text-[#64736B]" role="status">Đang tải mô hình…</p>
            ) : null}
            {mounted && status === "ready" && threeD ? <p className="sr-only" role="status">3D sẵn sàng</p> : null}
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <span className="self-center pr-1 text-[10px] tracking-[0.14em] text-[#64736B] uppercase">Góc nhìn</span>
              {VIEW_ANGLES.map((angle) => (
                <button key={angle.id} type="button" className={btn(focus === angle.id && !exploded && selected.type === "overview")} onClick={() => applyView(angle.id)} disabled={!threeD}>
                  {angle.label}
                </button>
              ))}
              <button type="button" className={btn(false)} onClick={applyWhole} disabled={!threeD}>Trở về toàn xe</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="self-center pr-1 text-[10px] tracking-[0.14em] text-[#64736B] uppercase">Khám phá</span>
              <button type="button" className={btn(xray)} disabled={!threeD} onClick={() => setXray((v) => !v)}>Xuyên thấu</button>
              <button
                type="button"
                className={btn(exploded)}
                disabled={!threeD}
                onClick={() => {
                  setExploded((v) => {
                    const next = !v;
                    setFocus(next ? "exploded" : selected.type === "overview" ? "whole" : focusForSelection(selected));
                    return next;
                  });
                }}
              >
                Tách bộ phận
              </button>
              <button type="button" className={btn(status === "diagram")} onClick={() => setStatus((s) => (s === "diagram" ? (webgl ? "ready" : "unsupported") : "diagram"))}>Sơ đồ 2D</button>
              <span className="self-center pr-1 pl-2 text-[10px] tracking-[0.14em] text-[#64736B] uppercase">Hiển thị</span>
              <button type="button" className={btn(labels)} disabled={!threeD} onClick={() => setLabels((v) => !v)}>Nhãn</button>
              <button type="button" className={btn(moreOpen)} onClick={() => setMoreOpen((v) => !v)}>Thêm</button>
            </div>
            {moreOpen ? (
              <div className="flex flex-wrap gap-1.5">
                <button type="button" className={btn(false)} disabled={!threeD} onClick={() => setResetToken((n) => n + 1)}>Đặt lại góc nhìn</button>
                <button type="button" className={btn(false)} onClick={() => { const el = viewportRef.current; if (!el) return; if (document.fullscreenElement) void document.exitFullscreen(); else void el.requestFullscreen(); }}>Toàn màn hình</button>
                {engineContext ? (
                  <>
                    <button type="button" className={btn(showForce)} disabled={!threeD} onClick={() => setShowForce((v) => !v)}>Dòng lực</button>
                    <button type="button" className={btn(connections)} disabled={!threeD} onClick={() => setConnections((v) => !v)}>Mối nối MTUA</button>
                    <button type="button" className={btn(paused)} onClick={() => setPaused((v) => !v)}>{paused ? "Chạy" : "Tạm dừng"}</button>
                  </>
                ) : null}
                <button type="button" className={btn(systemsOpen)} onClick={() => { setSystemsOpen(true); setTab("analysis"); setSheetOpen(true); }}>12 cấu phần</button>
              </div>
            ) : null}
          </div>
        </div>

        {wide ? (
        <aside className="flex min-h-0 flex-col border border-[#D9E2DC] bg-[#FFFEFA] min-[1100px]:sticky min-[1100px]:top-20 min-[1100px]:max-h-[calc(100dvh-6.5rem)]">
          <div className="flex border-b border-[#D9E2DC]">
            {(["control", "analysis", "evidence"] as const).map((id) => (
              <button key={id} type="button" className={`min-h-11 flex-1 px-2 text-[11px] tracking-[0.12em] uppercase ${tab === id ? "bg-[#163c3e] text-[#F3F2ED]" : "text-[#64736B]"}`} onClick={() => setTab(id)}>
                {id === "control" ? "Điều khiển" : id === "analysis" ? "Phân tích" : "Bằng chứng"}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">{panelBody}</div>
        </aside>
        ) : null}
      </div>

      {!wide && sheetOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-30 max-h-[min(46vh,calc(100dvh-10rem))] overflow-y-auto border-t border-[#D9E2DC] bg-[#FFFEFA] pb-[max(env(safe-area-inset-bottom),0.75rem)]">
          <div className="flex border-b border-[#D9E2DC]">
            {(["control", "analysis", "evidence"] as const).map((id) => (
              <button key={id} type="button" className={`min-h-11 flex-1 px-2 text-[11px] tracking-[0.12em] uppercase ${tab === id ? "bg-[#163c3e] text-[#F3F2ED]" : "text-[#64736B]"}`} onClick={() => setTab(id)}>
                {id === "control" ? "Điều khiển" : id === "analysis" ? "Phân tích" : "Bằng chứng"}
              </button>
            ))}
            <button type="button" className="min-h-11 px-3 text-[11px] tracking-[0.12em] text-[#64736B] uppercase" onClick={() => setSheetOpen(false)}>Thu</button>
          </div>
          <div className="p-4">{panelBody}</div>
        </div>
      ) : null}
      {!wide && !sheetOpen ? (
        <button type="button" className="min-h-11 w-full border border-[#D9E2DC] bg-[#FFFEFA] text-[11px] tracking-[0.16em] text-[#64736B] uppercase" onClick={() => setSheetOpen(true)}>
          Mở bảng điều khiển
        </button>
      ) : null}

      {!threeD ? <EngineTable model={model} /> : (
        <details className="border border-[#D9E2DC] bg-[#FFFEFA] p-3">
          <summary className="cursor-pointer text-[11px] tracking-[0.14em] text-[#64736B] uppercase">Bảng dữ liệu tương đương</summary>
          <div className="mt-3"><EngineTable model={model} /></div>
        </details>
      )}
    </div>
  );
}

function EvidencePanel({ model }: { model: EngineViewModel }) {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-[11px] tracking-[0.12em] text-[#B49A67] uppercase">Bằng chứng hồ sơ đánh giá</p>
      {model.chambers.map((c) => (
        <p key={c.code} className="border-b border-[#D9E2DC] pb-2">
          <strong className="text-[#163D38]">{c.code} {c.mnemonic}</strong>
          <span className="mt-1 block text-[#64736B]">Cấp {c.evidence ?? "Thiếu bằng chứng"} · MDS {c.mdsFinal ?? "—"} · {c.forceEvidenceNote || "Chưa có ghi chú bằng chứng lực."}</span>
        </p>
      ))}
      <p className="text-[#64736B]">Kịch bản minh họa trên xe không được ghi vào hồ sơ này.</p>
    </div>
  );
}

function userStatusCopy(status: SceneStatus) {
  if (status === "diagram") return "Đang xem sơ đồ 2D.";
  if (status === "lost") return "Mất kết nối đồ họa 3D. Bấm thử lại.";
  if (status === "unsupported") return "Trình duyệt này không chạy được mô hình 3D.";
  if (status === "failed") return "Không khởi tạo được mô hình 3D.";
  return "Không hiển thị được mô hình 3D.";
}
