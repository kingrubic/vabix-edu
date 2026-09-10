"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EngineScene } from "./EngineScene";
import type { ChamberVisual, ConnectionVisual } from "@/visualization/encoding";
import type { CfsCode, ComponentCode } from "@/domain/types";

export function EngineCanvas({
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
  return (
    <Canvas
      camera={{ position: [5.2, 3.2, 5.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "default" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#07141a");
      }}
    >
      <EngineScene
        chambers={chambers}
        connections={connections}
        exploded={exploded}
        showLabels={showLabels}
        showConnections={showConnections}
        paused={paused}
        selectedChamber={selectedChamber}
        selectedConnection={selectedConnection}
        onSelectChamber={onSelectChamber}
        onSelectConnection={onSelectConnection}
        cyclePhase={cyclePhase}
      />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={12} makeDefault />
    </Canvas>
  );
}
