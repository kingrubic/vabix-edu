"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Line } from "@react-three/drei";
import { Color, type Group, type Mesh } from "three";
import type { ChamberVisual, ConnectionVisual } from "@/visualization/encoding";
import { CHAMBER_HOME } from "@/visualization/encoding";
import type { CfsCode, ComponentCode } from "@/domain/types";

function Core({ paused }: { paused: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current || paused) return;
    ref.current.rotation.y += delta * 0.35;
    ref.current.rotation.x += delta * 0.08;
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.38, 0.09, 80, 12]} />
      <meshStandardMaterial color="#dea443" metalness={0.7} roughness={0.28} emissive="#8a5a12" emissiveIntensity={0.25} />
    </mesh>
  );
}

function Chamber({
  visual,
  exploded,
  selected,
  onSelect,
  showLabel,
}: {
  visual: ChamberVisual;
  exploded: boolean;
  selected: boolean;
  onSelect: () => void;
  showLabel: boolean;
}) {
  const home = CHAMBER_HOME[visual.code];
  const explodeMul = exploded ? 1.45 : 1;
  const segments = Math.max(5, Math.round(6 + visual.completeness * 18));
  const roughness = 0.22 + (1 - visual.completeness) * 0.55;
  const color = new Color(visual.warning ? "#c26b2b" : "#1f6b6d");
  return (
    <group position={[home[0] * explodeMul, home[1], home[2] * explodeMul]}>
      <mesh>
        <sphereGeometry args={[0.72 * visual.requiredScale, 16, 16]} />
        <meshBasicMaterial color="#dea443" wireframe transparent opacity={0.22} />
      </mesh>
      <Float speed={visual.forceMagnitude > 0 ? 1.2 : 0.4} floatIntensity={0.08}>
        <mesh onClick={(event) => { event.stopPropagation(); onSelect(); }}>
          <sphereGeometry args={[0.55 * visual.requiredScale * (0.55 + visual.completeness * 0.45), segments, segments]} />
          <meshStandardMaterial
            color={color}
            roughness={roughness}
            metalness={0.35}
            transparent
            opacity={visual.opacity}
            emissive={selected ? "#dea443" : "#0e3a3c"}
            emissiveIntensity={selected ? 0.35 : 0.12}
            wireframe={visual.completeness < 0.45}
          />
        </mesh>
      </Float>
      {visual.completeness < 0.75 ? (
        <mesh rotation={[0.6, 0.2, 0.1]}>
          <torusGeometry args={[0.42 * visual.requiredScale, 0.03, 8, 18, Math.PI * visual.completeness]} />
          <meshStandardMaterial color="#f8f5ed" transparent opacity={0.4} />
        </mesh>
      ) : null}
      {showLabel ? (
        <Html distanceFactor={8} position={[0, 0.95, 0]}>
          <button
            type="button"
            onClick={onSelect}
            className="rounded-sm border border-white/20 bg-black/50 px-2 py-1 text-[11px] tracking-wide text-white"
          >
            {visual.code} · {visual.mnemonic}
          </button>
        </Html>
      ) : null}
    </group>
  );
}

function FlowParticles({
  from,
  to,
  direction,
  magnitude,
  paused,
}: {
  from: [number, number, number];
  to: [number, number, number];
  direction: number;
  magnitude: number;
  paused: boolean;
}) {
  const group = useRef<Group>(null);
  const count = Math.max(2, Math.round(magnitude * 1.6));
  useFrame(({ clock }) => {
    if (!group.current || paused || direction === 0) return;
    const t = clock.getElapsedTime() * (0.25 + magnitude * 0.12) * direction;
    group.current.children.forEach((child, index) => {
      const u = ((t + index / count) % 1 + 1) % 1;
      child.position.set(
        from[0] + (to[0] - from[0]) * u,
        from[1] + 0.15 + Math.sin(u * Math.PI) * 0.15,
        from[2] + (to[2] - from[2]) * u,
      );
    });
  });
  if (direction === 0 || magnitude <= 0) return null;
  return (
    <group ref={group}>
      {Array.from({ length: count }).map((_, index) => (
        <mesh key={index}>
          <sphereGeometry args={[0.035 + magnitude * 0.004, 8, 8]} />
          <meshBasicMaterial color={direction < 0 ? "#f59e0b" : "#67e8f9"} />
        </mesh>
      ))}
    </group>
  );
}

export function EngineScene({
  chambers,
  connections,
  exploded,
  showLabels,
  showConnections,
  paused,
  selectedChamber,
  selectedConnection,
  onSelectChamber,
  onSelectConnection,
  cyclePhase,
}: {
  chambers: ChamberVisual[];
  connections: ConnectionVisual[];
  exploded: boolean;
  showLabels: boolean;
  showConnections: boolean;
  paused: boolean;
  selectedChamber: ComponentCode | null;
  selectedConnection: CfsCode | null;
  onSelectChamber: (code: ComponentCode) => void;
  onSelectConnection: (code: CfsCode) => void;
  cyclePhase: number;
}) {
  const chamberMap = useMemo(() => Object.fromEntries(chambers.map((item) => [item.code, item])), [chambers]);

  return (
    <>
      <color attach="background" args={["#07141a"]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} color="#f8f5ed" />
      <pointLight position={[-3, 2, -2]} intensity={0.55} color="#dea443" />
      <pointLight position={[2, -1, 3]} intensity={0.4} color="#67e8f9" />
      <fog attach="fog" args={["#07141a", 8, 18]} />
      <Core paused={paused} />
      {chambers.map((chamber, index) => (
        <group key={chamber.code} scale={cyclePhase === index && !paused ? 1.08 : 1}>
          <Chamber
            visual={chamber}
            exploded={exploded}
            selected={selectedChamber === chamber.code}
            onSelect={() => onSelectChamber(chamber.code)}
            showLabel={showLabels}
          />
        </group>
      ))}
      {showConnections
        ? connections.map((connection) => {
            const from = CHAMBER_HOME[connection.from].map((n) => n * (exploded ? 1.45 : 1)) as [number, number, number];
            const to = CHAMBER_HOME[connection.to].map((n) => n * (exploded ? 1.45 : 1)) as [number, number, number];
            const mid: [number, number, number] = [
              (from[0] + to[0]) / 2,
              (from[1] + to[1]) / 2 + connection.gap,
              (from[2] + to[2]) / 2,
            ];
            const points: [number, number, number][] = [from, mid, to];
            const fromChamber = chamberMap[connection.from];
            const flowDir =
              fromChamber?.forceDirection === "NEGATIVE" ? -1 : fromChamber?.forceDirection === "POSITIVE" ? 1 : 0;
            return (
              <group key={connection.code}>
                <Line
                  points={points}
                  color={selectedConnection === connection.code ? "#dea443" : connection.critical && (connection.score ?? 10) < 4 ? "#f59e0b" : "#67e8f9"}
                  lineWidth={connection.thickness * 40}
                  dashed={connection.dashed}
                  dashScale={8}
                  dashSize={0.18}
                  gapSize={0.12}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectConnection(connection.code);
                  }}
                />
                <FlowParticles
                  from={from}
                  to={to}
                  direction={flowDir}
                  magnitude={fromChamber?.forceMagnitude ?? 0}
                  paused={paused}
                />
              </group>
            );
          })
        : null}
    </>
  );
}
