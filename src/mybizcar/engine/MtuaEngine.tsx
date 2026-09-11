"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import type { Group, Points } from "three";
import type { ChamberView, EngineViewModel } from "@/mybizcar/visualization/view-model";

const BASE: Record<ChamberView["code"], [number, number, number]> = {
  M: [0, 0.06, -0.78],
  T: [0.78, 0.06, 0],
  U: [0, 0.06, 0.78],
  A: [-0.78, 0.06, 0],
};

function scaledPos(code: ChamberView["code"], gap: number, exploded: boolean): [number, number, number] {
  const [x, y, z] = BASE[code];
  const k = (exploded ? 1.28 : 1) + gap * 0.9;
  return [x * k, y, z * k];
}

function ChamberAssembly({
  chamber,
  exploded,
  selected,
  highlighted,
  showLabels,
  onSelect,
  reducedMotion,
}: {
  chamber: ChamberView;
  exploded: boolean;
  selected: boolean;
  highlighted: boolean;
  showLabels: boolean;
  onSelect: (code: ChamberView["code"]) => void;
  reducedMotion: boolean;
}) {
  const ref = useRef<Group>(null);
  const pos = scaledPos(chamber.code, chamber.gap, exploded);
  const housing = 0.26 + chamber.size * 0.16;
  const fill = housing * (0.28 + chamber.completeness * 0.7);
  const color = chamber.warning ? "#c45c4a" : "#1c5559";

  useFrame((_, delta) => {
    if (!ref.current || reducedMotion) return;
    const spin = (chamber.activation ?? 0) / 10;
    ref.current.rotation.y += delta * (highlighted ? 0.55 : 0.12 + spin * 0.35);
  });

  return (
    <group ref={ref} position={pos}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(chamber.code);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[fill, 22, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.62}
          roughness={0.22 + (1 - chamber.completeness) * 0.5}
          transparent
          opacity={Math.max(0.28, chamber.opacity)}
          emissive={highlighted || selected ? "#dea443" : chamber.warning ? "#5a2018" : "#0b2a30"}
          emissiveIntensity={highlighted ? 0.5 : selected ? 0.28 : chamber.warning ? 0.22 : 0.06}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[housing, 0.028, 10, 36]} />
        <meshStandardMaterial color="#dea443" metalness={0.85} roughness={0.22} transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
        <torusGeometry args={[housing * 0.72, 0.016, 8, 24]} />
        <meshStandardMaterial color="#8fd4d6" metalness={0.7} roughness={0.25} transparent opacity={0.55} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[housing * 0.42, housing * 0.5, 0.14, 10]} />
        <meshStandardMaterial color="#24383c" metalness={0.78} roughness={0.3} />
      </mesh>
      {chamber.completeness < 0.82 ? (
        <mesh rotation={[0, Math.PI * chamber.completeness, Math.PI / 5]}>
          <torusGeometry args={[housing * 1.04, 0.012, 6, 18, Math.PI * (1 - chamber.completeness)]} />
          <meshStandardMaterial color="#8fd4d6" transparent opacity={0.45} />
        </mesh>
      ) : null}
      {showLabels ? (
        <Html center distanceFactor={6.5} zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
          <div className="bizcar-hotspot">
            {chamber.code} {chamber.mnemonic}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Rod({ from, to, dashed, thickness, onClick }: { from: [number, number, number]; to: [number, number, number]; dashed: boolean; thickness: number; onClick: () => void }) {
  return (
    <group onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <Line
        points={[from, [0, 0.08, 0], to]}
        color="#dea443"
        lineWidth={Math.max(1.2, thickness * 0.7)}
        dashed={dashed}
        dashSize={0.08}
        gapSize={0.07}
        transparent
        opacity={0.88}
      />
    </group>
  );
}

function ChamberFlow({ chamber, exploded, reducedMotion }: { chamber: ChamberView; exploded: boolean; reducedMotion: boolean }) {
  const ref = useRef<Points>(null);
  const count = Math.round(5 + Math.abs(chamber.flow) * 8);
  const origin = scaledPos(chamber.code, chamber.gap, exploded);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const f = i / count;
      arr[i * 3] = origin[0] * f;
      arr[i * 3 + 1] = 0.1 + Math.sin(i) * 0.05;
      arr[i * 3 + 2] = origin[2] * f;
    }
    return arr;
  }, [count, origin]);

  useFrame((state) => {
    if (!ref.current || reducedMotion || chamber.flowDir === 0) return;
    const t = state.clock.elapsedTime * chamber.flow * chamber.flowDir;
    const geo = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const f = ((i / count) + t * 0.08) % 1;
      geo.setXYZ(i, origin[0] * f, 0.12 + Math.sin(f * 8) * 0.05, origin[2] * f);
    }
    geo.needsUpdate = true;
  });

  if (chamber.flowDir === 0) return null;
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={chamber.flowDir < 0 ? "#e08a4a" : "#8fd4d6"} size={0.045} transparent opacity={0.85} />
    </points>
  );
}

export function MtuaEngine({
  model,
  exploded,
  showLabels,
  showConnections,
  paused,
  cycleIndex,
  selectedComponent,
  onSelectComponent,
  onSelectConnection,
  compact = false,
}: {
  model: EngineViewModel;
  exploded: boolean;
  showLabels: boolean;
  showConnections: boolean;
  paused: boolean;
  cycleIndex: number;
  selectedComponent: ChamberView["code"] | null;
  onSelectComponent: (code: ChamberView["code"]) => void;
  onSelectConnection: (code: string) => void;
  compact?: boolean;
}) {
  const shaft = useRef<Group>(null);
  const reduced = paused || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const order: ChamberView["code"][] = ["M", "T", "U", "A"];
  const avgAct = model.chambers.reduce((s, c) => s + (c.activation ?? 0), 0) / 4;

  useFrame((_, delta) => {
    if (!shaft.current || reduced) return;
    shaft.current.rotation.y += delta * (0.25 + avgAct * 0.12);
  });

  return (
    <group scale={compact ? 0.62 : 1}>
      <group ref={shaft}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.55, 12]} />
          <meshStandardMaterial color="#c9a24a" metalness={0.88} roughness={0.18} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.2, 0.035, 10, 28]} />
          <meshStandardMaterial color="#dea443" metalness={0.82} roughness={0.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.09, 16, 12]} />
          <meshStandardMaterial color="#8fd4d6" metalness={0.7} roughness={0.22} emissive="#8fd4d6" emissiveIntensity={0.2} />
        </mesh>
      </group>
      {model.chambers.map((chamber) => (
        <ChamberAssembly
          key={chamber.code}
          chamber={chamber}
          exploded={exploded}
          selected={selectedComponent === chamber.code}
          highlighted={!reduced && order[cycleIndex] === chamber.code}
          showLabels={showLabels}
          onSelect={onSelectComponent}
          reducedMotion={reduced}
        />
      ))}
      {!compact
        ? model.chambers.map((chamber) => (
            <ChamberFlow key={`flow-${chamber.code}`} chamber={chamber} exploded={exploded} reducedMotion={reduced} />
          ))
        : null}
      {showConnections
        ? model.connections.map((c) => {
            const from = model.chambers.find((ch) => ch.code === c.from);
            const to = model.chambers.find((ch) => ch.code === c.to);
            if (!from || !to) return null;
            return (
              <Rod
                key={c.code}
                from={scaledPos(from.code, from.gap, exploded)}
                to={scaledPos(to.code, to.gap, exploded)}
                dashed={c.dashed}
                thickness={c.thickness}
                onClick={() => onSelectConnection(c.code)}
              />
            );
          })
        : null}
    </group>
  );
}

