"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { CfsCode, ComponentCode } from "@/domain/types";
import { COMPONENT_CODES } from "@/domain/types";
import { CFS_LABELS, COMPONENT_LABELS, MNEMONIC_DISCLAIMER } from "@/domain/labels";
import { ENGINE_LEGEND, type ChamberVisual, type ConnectionVisual } from "@/visualization/encoding";
import { EvidenceBadge, Panel, ScoreBox } from "@/components/bizcar/Ui";
import { EngineFallback } from "./EngineFallback";
import type { EngineModel } from "@/scoring/assemble";

const EngineCanvas = dynamic(() => import("./EngineCanvas").then((mod) => mod.EngineCanvas), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-white/50">Đang tải động cơ 3D…</div>,
});

export function EngineWorkbench({
  model,
  inspectorExtra,
}: {
  model: EngineModel;
  inspectorExtra?: React.ReactNode;
}) {
  const [webgl, setWebgl] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [paused, setPaused] = useState(false);
  const [selectedChamber, setSelectedChamber] = useState<ComponentCode | null>("M");
  const [selectedConnection, setSelectedConnection] = useState<CfsCode | null>(null);
  const [cyclePhase, setCyclePhase] = useState(0);
  const [controlsKey, setControlsKey] = useState(0);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      setWebgl(ok);
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPaused(true);
      return;
    }
    if (paused) return;
    const id = window.setInterval(() => setCyclePhase((value) => (value + 1) % 4), 2200);
    return () => window.clearInterval(id);
  }, [paused]);

  const chamber = model.chambers.find((item) => item.code === selectedChamber) ?? null;
  const connection = model.connections.find((item) => item.code === selectedConnection) ?? null;
  const profile = selectedChamber ? model.profiles[selectedChamber] : null;
  const mds = selectedChamber ? model.mds[selectedChamber] : null;

  const tableRows = useMemo(() => model.chambers, [model.chambers]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
      <div className="space-y-3">
        <div className="relative h-[420px] overflow-hidden border border-white/10 bg-[#07141a] md:h-[560px]">
          {webgl ? (
            <EngineCanvas
              key={controlsKey}
              chambers={model.chambers}
              connections={model.connections}
              exploded={exploded}
              showLabels={showLabels}
              showConnections={showConnections}
              paused={paused}
              selectedChamber={selectedChamber}
              selectedConnection={selectedConnection}
              onSelectChamber={(code) => {
                setSelectedChamber(code);
                setSelectedConnection(null);
              }}
              onSelectConnection={(code) => {
                setSelectedConnection(code);
                setSelectedChamber(null);
              }}
              cyclePhase={cyclePhase}
            />
          ) : (
            <EngineFallback
              chambers={model.chambers}
              connections={model.connections}
              onSelectChamber={(code) => {
                setSelectedChamber(code);
                setSelectedConnection(null);
              }}
              onSelectConnection={(code) => {
                setSelectedConnection(code);
                setSelectedChamber(null);
              }}
            />
          )}
        </div>
        <p className="text-xs text-amber-100/80">{MNEMONIC_DISCLAIMER}</p>
        <div className="flex flex-wrap gap-2">
          <Toggle pressed={exploded} onClick={() => setExploded((v) => !v)}>
            {exploded ? "Tổng quan" : "Tách khối"}
          </Toggle>
          <Toggle pressed={showLabels} onClick={() => setShowLabels((v) => !v)}>
            Nhãn
          </Toggle>
          <Toggle pressed={showConnections} onClick={() => setShowConnections((v) => !v)}>
            Liên kết
          </Toggle>
          <Toggle pressed={paused} onClick={() => setPaused((v) => !v)}>
            {paused ? "Chạy chu kỳ" : "Tạm dừng"}
          </Toggle>
          <button type="button" className="min-h-11 border border-white/20 px-3 text-sm" onClick={() => setControlsKey((v) => v + 1)}>
            Đặt lại camera
          </button>
        </div>
        <div className="flex flex-wrap gap-2 md:hidden">
          {COMPONENT_CODES.map((code) => (
            <button
              key={code}
              type="button"
              className={`min-h-11 min-w-11 border px-3 ${selectedChamber === code ? "border-vabix-gold text-vabix-gold" : "border-white/20"}`}
              onClick={() => {
                setSelectedChamber(code);
                setSelectedConnection(null);
              }}
            >
              {code}
            </button>
          ))}
        </div>
        <Legend />
        <AccessibilityTable chambers={tableRows} connections={model.connections} />
      </div>
      <aside className="space-y-3 lg:sticky lg:top-4">
        {chamber && profile && mds ? (
          <Panel>
            <p className="eyebrow">
              {chamber.code} · {chamber.mnemonic}
            </p>
            <h2 className="mt-1 text-2xl font-semibold">{COMPONENT_LABELS[chamber.code].vi}</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ScoreBox label="MDS cuối" value={chamber.finalMds} hint={mds.provisional ? "Điểm tạm tính" : "Không phải bằng chứng triển khai"} />
              <ScoreBox label="MDS thô" value={chamber.rawMds} />
              <ScoreBox label="Mức kích hoạt" value={chamber.activation} hint="Do đánh giá viên nhập" />
              <ScoreBox label="Lực tác động" value={profile.force.force} hint={profile.force.unsupported ? "Chưa đủ bằng chứng để xác định lực" : undefined} />
            </div>
            <div className="mt-3">
              <EvidenceBadge grade={chamber.evidenceGrade} />
            </div>
            {mds.weakestCriteria.length > 0 ? (
              <ul className="mt-4 text-sm text-white/70">
                {mds.weakestCriteria.map((item) => (
                  <li key={item.code}>
                    {item.code} {item.nameVi}: {item.score}
                  </li>
                ))}
              </ul>
            ) : null}
            {mds.appliedCriticalCap ? <p className="mt-3 text-amber-200">Điểm khóa: trần MDS {mds.criticalCap}</p> : null}
            {inspectorExtra}
          </Panel>
        ) : null}
        {connection ? (
          <Panel>
            <p className="eyebrow">Liên kết CFS</p>
            <h2 className="mt-1 text-2xl font-semibold">{connection.code}</h2>
            <p className="text-white/70">{CFS_LABELS[connection.code].vi}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ScoreBox label="Điểm khớp" value={connection.score} />
              <ScoreBox label="Trạng thái" value={connection.dashed ? "Giả thuyết" : "Đã kiểm chứng"} />
            </div>
            <p className="mt-3 text-sm text-white/65">
              {connection.critical ? "Liên kết tới hạn. " : ""}
              {connection.gap > 0.2 ? "Khe hở hình học đang được phóng lớn có chủ đích." : "Khớp cơ khí tương đối khít."}
            </p>
            <p className="mt-2 text-sm text-white/50">Bước kiểm tra tiếp: đối chiếu bằng chứng quyết định giữa hai cấu kiện.</p>
          </Panel>
        ) : null}
      </aside>
    </div>
  );
}

function Toggle({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 px-3 text-sm ${pressed ? "bg-vabix-gold text-vabix-deep-teal" : "border border-white/20 text-white"}`}
    >
      {children}
    </button>
  );
}

function Legend() {
  return (
    <Panel>
      <h3 className="font-semibold">Chú giải động cơ</h3>
      <ul className="mt-3 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
        {ENGINE_LEGEND.map((item) => (
          <li key={item.key}>
            <strong className="text-vabix-gold">{item.title}.</strong> {item.meaning}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-white/50">
        Điểm cao + độ trong thấp = chất lượng ước lượng cao nhưng bằng chứng yếu.
      </p>
    </Panel>
  );
}

function AccessibilityTable({
  chambers,
  connections,
}: {
  chambers: ChamberVisual[];
  connections: ConnectionVisual[];
}) {
  return (
    <Panel>
      <h3 className="font-semibold">Bảng trạng thái (không phụ thuộc 3D)</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-vabix-gold">
              <th className="py-2">Cấu kiện</th>
              <th>MDS thô</th>
              <th>MDS cuối</th>
              <th>Kích hoạt</th>
              <th>Lực</th>
              <th>Bằng chứng</th>
            </tr>
          </thead>
          <tbody>
            {chambers.map((row) => (
              <tr key={row.code} className="border-t border-white/10">
                <td className="py-2">
                  {row.code} {row.labelVi}
                </td>
                <td>{row.rawMds ?? "Chưa đủ dữ liệu"}</td>
                <td>{row.finalMds ?? "Chưa đủ dữ liệu"}</td>
                <td>{row.activation ?? "Chưa đủ dữ liệu"}</td>
                <td>{row.forceDirection ?? "—"} {row.forceMagnitude || ""}</td>
                <td>{row.evidenceGrade ?? "Thiếu bằng chứng"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 text-sm text-white/65">
        {connections.map((row) => (
          <li key={row.code}>
            {row.code} {row.labelVi}: {row.score ?? "Chưa đủ dữ liệu"} · {row.dashed ? "Giả thuyết" : "Đã kiểm chứng"}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
