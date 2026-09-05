"use client";

import type { ChamberVisual, ConnectionVisual } from "@/visualization/encoding";
import { CHAMBER_HOME } from "@/visualization/encoding";

export function EngineFallback({
  chambers,
  connections,
  onSelectChamber,
  onSelectConnection,
}: {
  chambers: ChamberVisual[];
  connections: ConnectionVisual[];
  onSelectChamber: (code: ChamberVisual["code"]) => void;
  onSelectConnection: (code: ConnectionVisual["code"]) => void;
}) {
  const pos: Record<string, { x: number; y: number }> = {
    M: { x: 200, y: 70 },
    T: { x: 330, y: 200 },
    U: { x: 200, y: 330 },
    A: { x: 70, y: 200 },
  };
  return (
    <div className="bizcar-panel p-4">
      <p className="text-sm text-white/60">WebGL không khả dụng — sơ đồ 2D tương đương. Mọi trạng thái động cơ vẫn đọc được bằng chữ/bảng.</p>
      <svg viewBox="0 0 400 400" className="mt-4 w-full" role="img" aria-label="Sơ đồ động cơ MTUA 2D">
        <circle cx="200" cy="200" r="28" fill="#dea443" opacity="0.85" />
        <text x="200" y="205" textAnchor="middle" fill="#163c3e" fontSize="11" fontWeight="700">
          MTUA
        </text>
        {connections.map((connection) => {
          const from = pos[connection.from];
          const to = pos[connection.to];
          return (
            <line
              key={connection.code}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={connection.critical && (connection.score ?? 10) < 4 ? "#f97316" : "#67e8f9"}
              strokeWidth={2 + (connection.score ?? 1) / 3}
              strokeDasharray={connection.dashed ? "6 6" : undefined}
              opacity={0.7}
              onClick={() => onSelectConnection(connection.code)}
              style={{ cursor: "pointer" }}
            />
          );
        })}
        {chambers.map((chamber) => {
          const p = pos[chamber.code];
          const r = 22 * chamber.requiredScale;
          return (
            <g key={chamber.code} onClick={() => onSelectChamber(chamber.code)} style={{ cursor: "pointer" }}>
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill="none"
                stroke="#dea443"
                strokeDasharray="3 3"
                opacity={0.5}
              />
              <circle
                cx={p.x + (CHAMBER_HOME[chamber.code][0] > 0 ? 4 : 0)}
                cy={p.y}
                r={r * chamber.completeness}
                fill="#214f51"
                opacity={chamber.opacity}
                stroke={chamber.warning ? "#f97316" : "#f8f5ed"}
              />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fill="#fff" fontSize="12">
                {chamber.code}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
