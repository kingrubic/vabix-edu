"use client";

import type { EngineProfile } from "@/mybizcar/domain";
import type { EngineViewModel } from "@/mybizcar/visualization/view-model";
import { componentLabels } from "@/mybizcar/domain";
import { isWheelId, type WheelId } from "@/mybizcar/visualization/tire-scenario";
import type { InspectorTarget } from "./vehicle-types";
import { liveImpactCopy, type IllustrationState } from "@/mybizcar/visualization/illustration";

const WHEEL_SVG: Record<WheelId, { cx: number; cy: number; label: string }> = {
  "value-wheel": { cx: 78, cy: 78, label: "Giá trị" },
  "market-wheel": { cx: 322, cy: 78, label: "Thị trường" },
  "people-wheel": { cx: 78, cy: 242, label: "Con người" },
  "finance-wheel": { cx: 322, cy: 242, label: "Tài chính" },
};

export function EngineFallback({
  profile,
  model,
  selected,
  onSelect,
  illustration,
  threeD = false,
}: {
  profile?: EngineProfile;
  model?: EngineViewModel;
  selected?: InspectorTarget;
  onSelect?: (target: InspectorTarget) => void;
  illustration?: IllustrationState;
  threeD?: boolean;
}) {
  const selectedWheel = selected?.type === "system" && isWheelId(selected.id) ? selected.id : null;
  const showCar = !selected || selected.type === "overview" || selectedWheel != null;
  const loadDrop = illustration ? illustration.load * 0.12 : 0;
  const steer = illustration?.steer ?? 0;

  if (showCar) {
    return (
      <div className="w-full">
        <svg viewBox="0 0 400 320" className="h-auto w-full max-h-[360px] bg-[#E7EEEA]" role="img" aria-label="Sơ đồ 2D toàn xe">
        <rect x="70" y={110 + loadDrop} width="260" height="100" rx="18" fill="#163c3e" />
        <rect x="118" y={118 + loadDrop} width="164" height="44" rx="8" fill="#7D9196" fillOpacity="0.7" />
        {(Object.keys(WHEEL_SVG) as WheelId[]).map((id) => {
          const w = WHEEL_SVG[id];
          const active = selectedWheel === id;
          const tension = illustration?.tensions[id] ?? 50;
          const r = tension < 35 ? 24 : tension > 65 ? 30 : 28;
          const front = id === "value-wheel" || id === "market-wheel";
          return (
            <g key={id} transform={front ? `rotate(${steer} ${w.cx} ${w.cy})` : undefined}>
              <circle
                cx={w.cx}
                cy={w.cy}
                r={active ? r + 4 : r}
                fill={active ? "#B49A67" : "#2A2C2B"}
                stroke={active ? "#163D38" : "#C4B7A0"}
                strokeWidth={active ? 3 : 2}
                style={{ cursor: onSelect ? "pointer" : "default" }}
                onClick={() => onSelect?.({ type: "system", id })}
              />
                <text x={w.cx} y={w.cy + 4} textAnchor="middle" fontSize="9" fill={active ? "#163D38" : "#F3F2ED"}>
                {w.label}
              </text>
            </g>
          );
        })}
      </svg>
      {illustration ? <p className="mt-2 text-sm text-[#64736B]">{liveImpactCopy(illustration, threeD)}</p> : null}
      </div>
    );
  }

  const chambers =
    model?.chambers ??
    (["M", "T", "U", "A"] as const).map((code) => ({
      code,
      opacity: 0.8,
      completeness: 0.7,
      size: 0.7,
      warning: false,
      mdsFinal: profile?.mds?.[code]?.finalMds ?? null,
    }));
  const connections = model?.connections ?? [];
  return (
    <svg viewBox="0 0 400 320" className="h-auto w-full max-h-[360px] bg-[#E7EEEA]" role="img" aria-label="Sơ đồ 2D Động cơ doanh nghiệp">
      <circle cx="200" cy="160" r="28" fill="#B79A63" fillOpacity="0.9" />
      <text x="200" y="164" textAnchor="middle" fontSize="11" fill="#163D38">MTUA</text>
      {chambers.map((ch, i) => {
        const pos = [
          [200, 48],
          [332, 160],
          [200, 272],
          [68, 160],
        ][i];
        const w = 70 * (ch.size ?? 0.7);
        return (
          <g key={ch.code}>
            <rect x={pos[0] - w / 2} y={pos[1] - 22} width={w} height={44} rx="4" fill="#163c3e" fillOpacity={ch.opacity ?? 0.7} stroke={ch.warning ? "#c45c4a" : "#B79A63"} />
            <text x={pos[0]} y={pos[1] + 4} textAnchor="middle" fontSize="12" fill="#F6F5F1">{ch.code}</text>
          </g>
        );
      })}
      {connections.slice(0, 1).map((c) => (
        <text key={c.code} x="200" y="310" fontSize="9" fill="#626D68" textAnchor="middle">
          {connections.map((x) => `${x.code}:${x.score ?? "—"}`).join("  ")}
        </text>
      ))}
    </svg>
  );
}

export function EngineTable({ model }: { model: EngineViewModel }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">Bảng trạng thái Động cơ doanh nghiệp — cùng dữ liệu với bản 3D</caption>
        <thead>
          <tr className="border-b border-[#DDE3DE] text-xs tracking-[0.12em] text-[#626D68] uppercase">
            <th className="py-2">Cấu kiện</th>
            <th>MDS cuối</th>
            <th>MDS thô</th>
            <th>Kích hoạt</th>
            <th>Lực</th>
            <th>Bằng chứng</th>
            <th>SIZE</th>
          </tr>
        </thead>
        <tbody>
          {model.chambers.map((c) => (
            <tr key={c.code} className="border-b border-[#DDE3DE]">
              <td className="py-2">{c.code} {componentLabels[c.code].mnemonic}</td>
              <td>{c.mdsFinal ?? "Chưa đủ dữ liệu"}</td>
              <td>{c.mdsRaw ?? "—"}</td>
              <td>{c.activation ?? "Chưa đủ dữ liệu"}</td>
              <td>{c.force ?? "Chưa đủ bằng chứng để xác định lực"}</td>
              <td>{c.evidence ?? "Thiếu bằng chứng"}</td>
              <td>{Math.round(c.size * 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
