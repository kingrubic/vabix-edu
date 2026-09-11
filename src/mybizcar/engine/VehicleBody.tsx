"use client";

import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { MeshStandardMaterial, DoubleSide, type Group } from "three";
import type { BizcarSystemId } from "@/mybizcar/domain/bizcar-systems";
import { BIZCAR_SYSTEM_BY_ID } from "@/mybizcar/domain/bizcar-systems";
import { isWheelId, type WheelId } from "@/mybizcar/visualization/tire-scenario";
import { computeIllustrationPose, type IllustrationState } from "@/mybizcar/visualization/illustration";
import { EXPLODE_OFFSET, SEDAN, WHEEL_LAYOUT } from "./component-registry";
import { wheelMeshFor } from "./mesh-registry";
import { createCabinGlassGeometry, createRoofGeometry, createSedanBodyGeometry } from "./sedan-geometry";
import { DeformableTire, Rim } from "./DeformableTire";
import { isClickGesture } from "./pointer";

import { STUDIO } from "./studio";

const GOLD = STUDIO.gold;
const PAINT = STUDIO.paint;
const CHROME = STUDIO.chrome;

function Explode({ id, exploded, children }: { id: BizcarSystemId; exploded: boolean; children: ReactNode }) {
  const ref = useRef<Group>(null);
  const [ox, oy, oz] = EXPLODE_OFFSET[id];
  useFrame(() => {
    if (!ref.current) return;
    if (!exploded) {
      ref.current.position.set(0, 0, 0);
      return;
    }
    const k = 1;
    const a = 0.18;
    ref.current.position.x += (ox * k - ref.current.position.x) * a;
    ref.current.position.y += (oy * k - ref.current.position.y) * a;
    ref.current.position.z += (oz * k - ref.current.position.z) * a;
  });
  return <group ref={ref}>{children}</group>;
}

export function VehicleBody({
  xray,
  exploded,
  hoodOpen,
  selectedId,
  hoveredId,
  flashId,
  showLabels,
  illustration,
  running,
  reducedMotion,
  onHover,
  onSelect,
  children,
}: {
  xray: boolean;
  exploded: boolean;
  hoodOpen: boolean;
  selectedId: BizcarSystemId | null;
  hoveredId: BizcarSystemId | null;
  flashId: BizcarSystemId | null;
  showLabels: boolean;
  illustration: IllustrationState;
  running: boolean;
  reducedMotion: boolean;
  onHover: (id: BizcarSystemId | null) => void;
  onSelect: (id: BizcarSystemId) => void;
  children?: ReactNode;
}) {
  const bodyGeo = useMemo(() => createSedanBodyGeometry(), []);
  const roofGeo = useMemo(() => createRoofGeometry(), []);
  const glassGeo = useMemo(() => createCabinGlassGeometry(), []);
  const pointerStart = useRef({ clientX: 0, clientY: 0 });
  const bodyRef = useRef<Group>(null);
  const steerLeft = useRef<Group>(null);
  const steerRight = useRef<Group>(null);
  const mark = (id: BizcarSystemId) => selectedId === id || hoveredId === id || flashId === id;
  const shellGhost = xray;
  const internalsVisible = xray || exploded;

  const bodyMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: mark("shell") ? "#2a6468" : PAINT,
        metalness: 0.28,
        roughness: 0.38,
        transparent: shellGhost,
        opacity: shellGhost ? 0.22 : 1,
        depthWrite: !shellGhost,
        envMapIntensity: 0.55,
        emissive: mark("shell") ? GOLD : "#0c2428",
        emissiveIntensity: mark("shell") ? 0.14 : 0.02,
      }),
    [shellGhost, selectedId, hoveredId, flashId],
  );
  const engineMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: mark("engine") ? "#2a6468" : PAINT,
        metalness: 0.3,
        roughness: 0.4,
        transparent: xray,
        opacity: xray ? 0.22 : 1,
        emissive: mark("engine") ? GOLD : "#102e32",
        emissiveIntensity: mark("engine") ? 0.18 : 0.06,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xray, selectedId, hoveredId, flashId],
  );

  useEffect(() => () => {
    bodyGeo.dispose();
    roofGeo.dispose();
    glassGeo.dispose();
  }, [bodyGeo, roofGeo, glassGeo]);
  useEffect(() => () => bodyMat.dispose(), [bodyMat]);
  useEffect(() => () => engineMat.dispose(), [engineMat]);

  useFrame(({ clock }) => {
    const pose = computeIllustrationPose({
      state: illustration,
      running,
      reducedMotion,
      time: clock.elapsedTime,
    });
    if (bodyRef.current) {
      bodyRef.current.position.y = pose.bodyY;
      bodyRef.current.rotation.x = pose.bodyRotX;
      bodyRef.current.rotation.z = pose.bodyRotZ;
    }
    if (steerLeft.current) steerLeft.current.rotation.y = pose.steerRad;
    if (steerRight.current) steerRight.current.rotation.y = pose.steerRad;
  });

  function bind(id: BizcarSystemId) {
    return {
      onPointerDown: (e: ThreeEvent<PointerEvent>) => {
        pointerStart.current = { clientX: e.nativeEvent.clientX, clientY: e.nativeEvent.clientY };
      },
      onPointerUp: (e: ThreeEvent<PointerEvent>) => {
        if (!isClickGesture(pointerStart.current, e.nativeEvent)) return;
        e.stopPropagation();
        onSelect(id);
      },
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover(id);
      },
      onPointerOut: () => {
        document.body.style.cursor = "auto";
        onHover(null);
      },
    };
  }

  function labelFor(id: BizcarSystemId) {
    if (hoveredId === id || selectedId === id) return true;
    if (!showLabels) return false;
    return id === "shell" || id === "engine" || id === "chassis" || id === "cockpit" || isWheelId(id);
  }

  return (
    <group>
      {internalsVisible ? (
        <Explode id="chassis" exploded={exploded}>
          <mesh position={[0, 0.2, 0]} {...bind("chassis")}>
            <boxGeometry args={[1.12, 0.07, 3.85]} />
            <meshStandardMaterial
              color="#1b2226"
              metalness={0.7}
              roughness={0.4}
              transparent={xray}
              opacity={xray ? 0.45 : 1}
              emissive={mark("chassis") ? GOLD : "#000000"}
              emissiveIntensity={mark("chassis") ? 0.2 : 0}
            />
          </mesh>
        </Explode>
      ) : null}

      <group ref={bodyRef}>
      <Explode id="shell" exploded={exploded}>
        <mesh geometry={bodyGeo} castShadow receiveShadow {...bind("shell")} material={bodyMat} />
        <mesh geometry={roofGeo} castShadow {...bind("shell")} material={bodyMat} />
        <CabinPillars material={bodyMat} />
        {!internalsVisible ? (
          <group {...bind("cockpit")}>
            <AssembledCabin />
          </group>
        ) : (
          <mesh position={[0, 0.74, -0.28]} {...bind("cockpit")}>
            <boxGeometry args={[1.42, 0.42, 2.35]} />
            <meshStandardMaterial color="#12181b" roughness={0.92} metalness={0.04} />
          </mesh>
        )}
        <mesh geometry={glassGeo} {...bind("shell")}>
          <meshPhysicalMaterial
            color="#3d5358"
            metalness={0.08}
            roughness={0.12}
            transparent
            opacity={xray ? 0.1 : 0.78}
            transmission={0}
            thickness={0.018}
            depthWrite
            side={DoubleSide}
            envMapIntensity={0.35}
          />
        </mesh>
        <SedanDetails xray={xray} />
        {labelFor("shell") ? <PartTag id="shell" position={[0, 1.55, 0]} occlude={showLabels} /> : null}
      </Explode>

      <Explode id="engine" exploded={exploded}>
        <group position={[0, 0.55, 1.72]}>
          {hoodOpen || internalsVisible ? (
            <mesh position={[0, -0.08, 0.05]} {...bind("engine")} material={engineMat}>
              <boxGeometry args={[1.05, 0.12, 1.15]} />
            </mesh>
          ) : null}
          <group position={[0, 0.08, 0]}>{hoodOpen || internalsVisible ? children : null}</group>
        </group>
        {labelFor("engine") ? <PartTag id="engine" position={[0, 1.35, 1.7]} occlude={showLabels} /> : null}
      </Explode>

      {internalsVisible ? (
        <>
          <Explode id="oil" exploded={exploded}>
            <mesh position={[0, 0.22, 1.55]} {...bind("oil")}>
              <cylinderGeometry args={[0.16, 0.18, 0.12, 12]} />
              <meshStandardMaterial
                color="#3d4a28"
                metalness={0.4}
                roughness={0.45}
                emissive={mark("oil") ? GOLD : "#000000"}
                emissiveIntensity={mark("oil") ? 0.2 : 0}
              />
            </mesh>
          </Explode>
          <Explode id="gearbox" exploded={exploded}>
            <mesh position={[0, 0.28, 0.35]} {...bind("gearbox")}>
              <boxGeometry args={[0.28, 0.16, 1.7]} />
              <meshStandardMaterial
                color="#2a2622"
                metalness={0.65}
                roughness={0.35}
                emissive={mark("gearbox") ? GOLD : "#000000"}
                emissiveIntensity={mark("gearbox") ? 0.18 : 0}
              />
            </mesh>
          </Explode>
          <Explode id="fuel" exploded={exploded}>
            <mesh position={[0, 0.38, -2.05]} {...bind("fuel")}>
              <cylinderGeometry args={[0.22, 0.22, 0.48, 16]} />
              <meshStandardMaterial
                color="#1d3336"
                metalness={0.5}
                roughness={0.35}
                emissive={mark("fuel") ? "#8fd4d6" : "#0a181c"}
                emissiveIntensity={mark("fuel") ? 0.28 : 0.06}
              />
            </mesh>
          </Explode>
          <Explode id="cockpit" exploded={exploded}>
            <group position={[0, 0.92, 0.08]} {...bind("cockpit")}>
              <mesh position={[0.22, 0.02, 0.22]}>
                <boxGeometry args={[0.32, 0.12, 0.32]} />
                <meshStandardMaterial
                  color="#1a2226"
                  emissive={mark("cockpit") ? GOLD : "#000000"}
                  emissiveIntensity={mark("cockpit") ? 0.16 : 0}
                />
              </mesh>
              <mesh position={[0.22, 0.14, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.1, 0.012, 8, 18]} />
                <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.22} />
              </mesh>
            </group>
          </Explode>
        </>
      ) : null}
      </group>

      {(Object.keys(WHEEL_LAYOUT) as WheelId[]).map((id) => (
        <WheelAssembly
          key={id}
          id={id}
          tension={illustration.tensions[id]}
          highlighted={mark(id)}
          exploded={exploded}
          running={running}
          illustration={illustration}
          reducedMotion={reducedMotion}
          steerRef={id === "value-wheel" ? steerLeft : id === "market-wheel" ? steerRight : undefined}
          bind={bind}
          showLabel={labelFor(id)}
        />
      ))}
    </group>
  );
}

function PartTag({
  id,
  position,
  occlude,
}: {
  id: BizcarSystemId;
  position: [number, number, number];
  occlude?: boolean;
}) {
  return (
    <Html position={position} center occlude={occlude ? "raycast" : undefined} style={{ pointerEvents: "none" }}>
      <div className="bizcar-hotspot">{BIZCAR_SYSTEM_BY_ID[id].name}</div>
    </Html>
  );
}

function AssembledCabin() {
  return (
    <group>
      <mesh position={[0, 1.22, -0.42]} name="cabin-volume">
        <boxGeometry args={[1.42, 0.42, 2.12]} />
        <meshStandardMaterial color={PAINT} metalness={0.22} roughness={0.5} />
      </mesh>
    </group>
  );
}

function CabinPillars({ material }: { material: MeshStandardMaterial }) {
  const posts = [
    { z: 0.98, y: 1.04, h: 0.52 },
    { z: 0.08, y: 1.08, h: 0.56 },
    { z: -1.72, y: 1.04, h: 0.52 },
  ];
  return (
    <group>
      {posts.flatMap((p) =>
        [-1, 1].map((side) => (
          <mesh key={`${p.z}-${side}`} position={[side * 0.88, p.y, p.z]} material={material} castShadow>
            <boxGeometry args={[0.045, p.h, 0.06]} />
          </mesh>
        )),
      )}
    </group>
  );
}

function SedanDetails({ xray }: { xray: boolean }) {
  const fade = xray ? 0.22 : 1;
  return (
    <group>
      <mesh position={[0, 0.78, 0.08]}>
        <boxGeometry args={[1.86, 0.008, 0.01]} />
        <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.22} transparent opacity={fade} />
      </mesh>
      {[-0.55, 0.62].map((z) =>
        [-1, 1].map((side) => (
          <mesh key={`gap-${side}-${z}`} position={[side * 0.955, 0.58, z]}>
            <boxGeometry args={[0.012, 0.52, 0.01]} />
            <meshStandardMaterial color="#0e1618" metalness={0.2} roughness={0.6} transparent opacity={fade} />
          </mesh>
        )),
      )}
      {[0.38, -0.72].map((z) =>
        [-1, 1].map((side) => (
          <mesh key={`handle-${side}-${z}`} position={[side * 0.97, 0.7, z]}>
            <boxGeometry args={[0.03, 0.03, 0.14]} />
            <meshStandardMaterial color={CHROME} metalness={0.88} roughness={0.24} transparent opacity={fade} />
          </mesh>
        )),
      )}
      {[-1, 1].map((side) => (
        <group key={`mirror-${side}`} position={[side * 0.98, 0.94, 0.78]}>
          <mesh rotation={[0, side * 0.18, 0]}>
            <boxGeometry args={[0.09, 0.08, 0.2]} />
            <meshStandardMaterial color={PAINT} metalness={0.32} roughness={0.34} transparent opacity={fade} />
          </mesh>
          <mesh position={[side * 0.04, 0, 0.01]} rotation={[0, side * 0.18, 0]}>
            <boxGeometry args={[0.02, 0.06, 0.14]} />
            <meshStandardMaterial color="#9aa7aa" metalness={0.7} roughness={0.12} transparent opacity={fade} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.48, 2.74]}>
        <boxGeometry args={[0.78, 0.3, 0.05]} />
        <meshStandardMaterial color="#12181c" metalness={0.55} roughness={0.35} transparent opacity={fade} />
      </mesh>
      <mesh position={[0, 0.48, 2.77]}>
        <boxGeometry args={[0.82, 0.34, 0.02]} />
        <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} transparent opacity={fade} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={`bar-${i}`} position={[-0.27 + i * 0.09, 0.48, 2.79]}>
          <boxGeometry args={[0.018, 0.24, 0.02]} />
          <meshStandardMaterial color={CHROME} metalness={0.92} roughness={0.18} transparent opacity={fade} />
        </mesh>
      ))}
      <mesh position={[0, 0.27, 2.62]}>
        <boxGeometry args={[1.62, 0.12, 0.22]} />
        <meshStandardMaterial color={PAINT} metalness={0.3} roughness={0.36} transparent opacity={fade} />
      </mesh>
      <mesh position={[0, 0.34, 2.78]}>
        <boxGeometry args={[0.28, 0.08, 0.02]} />
        <meshStandardMaterial color="#1a2226" metalness={0.4} roughness={0.4} transparent opacity={fade} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`hl-${side}`} position={[side * 0.62, 0.5, 2.62]}>
          <boxGeometry args={[0.42, 0.07, 0.06]} />
          <meshStandardMaterial color="#f4efe4" emissive="#efe4c8" emissiveIntensity={0.32} transparent opacity={fade} />
        </mesh>
      ))}
      <mesh position={[0, 0.28, -2.62]}>
        <boxGeometry args={[1.58, 0.14, 0.2]} />
        <meshStandardMaterial color={PAINT} metalness={0.3} roughness={0.36} transparent opacity={fade} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`tl-${side}`} position={[side * 0.58, 0.62, -2.58]}>
          <boxGeometry args={[0.36, 0.055, 0.04]} />
          <meshStandardMaterial color="#6a322e" emissive="#a85a4c" emissiveIntensity={0.22} transparent opacity={fade} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={`ex-${side}`} position={[side * 0.28, 0.18, -2.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
          <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.2} transparent opacity={fade} />
        </mesh>
      ))}
    </group>
  );
}

function WheelAssembly({
  id,
  tension,
  highlighted,
  exploded,
  running,
  illustration,
  showLabel,
  reducedMotion,
  steerRef,
  bind,
}: {
  id: WheelId;
  tension: number;
  highlighted: boolean;
  exploded: boolean;
  running: boolean;
  illustration: IllustrationState;
  showLabel: boolean;
  reducedMotion: boolean;
  steerRef?: RefObject<Group | null>;
  bind: (id: BizcarSystemId) => object;
}) {
  const { x, z, axle } = WHEEL_LAYOUT[id];
  const names = wheelMeshFor(id);
  const y = SEDAN.wheelY;
  const rotor = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!rotor.current || reducedMotion) return;
    const pose = computeIllustrationPose({ state: illustration, running, reducedMotion, time: clock.elapsedTime });
    rotor.current.rotation.x += pose.spin * 0.016;
  });
  const wheel = (
    <group position={[x, y, z]} ref={axle === "front" ? steerRef : undefined} {...bind(id)}>
      <group ref={rotor}>
        <group name={names.tire}>
          <DeformableTire tension={tension} reducedMotion={reducedMotion} />
        </group>
        <group name={names.rim}>
          <Rim />
        </group>
      </group>
      {highlighted ? (
        <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0.02, 0]}>
          <torusGeometry args={[0.5, 0.012, 8, 28]} />
          <meshBasicMaterial color={GOLD} />
        </mesh>
      ) : null}
      {showLabel ? <PartTag id={id} position={[0, 0.72, 0]} occlude /> : null}
    </group>
  );
  return <Explode id={id} exploded={exploded}>{wheel}</Explode>;
}
