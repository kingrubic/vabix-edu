"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TorusGeometry, type Mesh } from "three";
import { deformTireVertex, squashFromTension } from "@/mybizcar/visualization/tire-scenario";
import { SEDAN } from "./component-registry";
import { STUDIO } from "./studio";

export function DeformableTire({
  tension,
  reducedMotion,
}: {
  tension: number;
  reducedMotion: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const geo = useMemo(() => new TorusGeometry(SEDAN.tireRadius, SEDAN.tireTube, 28, 64), []);
  const original = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  const currentSquash = useRef(0);
  const lastWritten = useRef(Number.NaN);

  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((_, dt) => {
    const target = squashFromTension(tension);
    const rate = reducedMotion ? 1 : Math.min(1, dt * 7);
    currentSquash.current += (target - currentSquash.current) * rate;
    const squash = currentSquash.current;
    if (Math.abs(squash - lastWritten.current) < 0.0004) return;
    lastWritten.current = squash;
    const attr = geo.attributes.position;
    for (let i = 0; i < attr.count; i++) {
      const ix = i * 3;
      const [x, y, z] = deformTireVertex(
        original[ix],
        original[ix + 1],
        original[ix + 2],
        SEDAN.tireRadius,
        SEDAN.tireTube,
        squash,
      );
      attr.setXYZ(i, x, y, z);
    }
    attr.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={mesh} geometry={geo} rotation={[0, Math.PI / 2, 0]} castShadow>
      <meshStandardMaterial color={STUDIO.tire} roughness={0.86} metalness={0.04} />
    </mesh>
  );
}

export function Rim() {
  const spokes = 7;
  return (
    <group>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[SEDAN.rimRadius, 0.022, 12, 48]} />
        <meshStandardMaterial color={STUDIO.chrome} metalness={0.78} roughness={0.32} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[SEDAN.rimRadius * 0.38, 0.014, 10, 32]} />
        <meshStandardMaterial color={STUDIO.chrome} metalness={0.76} roughness={0.34} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.042, 0.042, 0.08, 24]} />
        <meshStandardMaterial color="#8f8a82" metalness={0.86} roughness={0.24} />
      </mesh>
      {Array.from({ length: spokes }, (_, i) => (
        <mesh key={i} rotation={[(i * Math.PI * 2) / spokes, 0, 0]}>
          <boxGeometry args={[0.018, SEDAN.rimRadius * 1.05, 0.024]} />
          <meshStandardMaterial color={STUDIO.chrome} metalness={0.78} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}
