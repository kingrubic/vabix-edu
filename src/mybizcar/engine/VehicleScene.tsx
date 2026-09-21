"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  BackSide,
  BoxGeometry,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  Scene,
  Vector3,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { BizcarSystemId } from "@/mybizcar/domain/bizcar-systems";
import type { EngineViewModel } from "@/mybizcar/visualization/view-model";
import { computeIllustrationPose, type IllustrationState } from "@/mybizcar/visualization/illustration";
import { CAMERA_FOCUS, fitCameraPosition, isViewAngle, type FocusId } from "./component-registry";
import type { InspectorTarget } from "./vehicle-types";
import { VehicleModel } from "./VehicleModel";
import { MtuaEngine } from "./MtuaEngine";
import { STUDIO } from "./studio";

function CameraRig({ focus, resetToken, reducedMotion }: { focus: FocusId; resetToken: number; reducedMotion: boolean }) {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  const anim = useRef({
    t: 1,
    duration: 1,
    fromPos: new Vector3(),
    fromTarget: new Vector3(),
    toPos: new Vector3(),
    toTarget: new Vector3(),
    minDistance: 4.2,
  });

  useEffect(() => {
    const preset = CAMERA_FOCUS[focus];
    const a = anim.current;
    a.fromPos.copy(camera.position);
    a.fromTarget.copy(controls.current?.target ?? new Vector3(0, 0.55, 0));
    const aspect = size.width / Math.max(1, size.height);
    const fov = "fov" in camera ? camera.fov : 32;
    const pos = isViewAngle(focus)
      ? fitCameraPosition(preset.position, preset.target, aspect, fov)
      : preset.position;
    a.toPos.set(...pos);
    a.toTarget.set(...preset.target);
    a.minDistance = preset.minDistance;
    a.duration = reducedMotion ? 0.01 : 0.85;
    a.t = 0;
  }, [focus, resetToken, camera, reducedMotion, size.width, size.height]);

  useFrame((_, dt) => {
    const ctrl = controls.current;
    if (!ctrl) return;
    const a = anim.current;
    if (a.t < 1) {
      a.t = Math.min(1, a.t + dt / a.duration);
      const k = 1 - (1 - a.t) ** 3;
      camera.position.lerpVectors(a.fromPos, a.toPos, k);
      camera.position.y = Math.max(0.42, camera.position.y);
      ctrl.target.lerpVectors(a.fromTarget, a.toTarget, k);
      ctrl.target.y = Math.max(0.14, ctrl.target.y);
      ctrl.minDistance = a.minDistance;
      ctrl.update();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      target={[0, 0.52, 0.06]}
      enablePan
      enableRotate
      enableZoom
      minDistance={CAMERA_FOCUS[focus].minDistance}
      maxDistance={18}
      minPolarAngle={0.28}
      maxPolarAngle={Math.PI / 2 - 0.14}
      dampingFactor={0.08}
      enableDamping
    />
  );
}

function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.98;
    const pmrem = new PMREMGenerator(gl);
    const room = new Scene();
    const box = new Mesh(
      new BoxGeometry(20, 14, 20),
      new MeshStandardMaterial({ color: STUDIO.viewportTop, roughness: 0.9, metalness: 0.02, side: BackSide }),
    );
    room.add(box);
    room.add(new HemisphereLight("#f4f7f4", "#c5d0ca", 1.05));
    const tex = pmrem.fromScene(room, 0.08).texture;
    scene.environment = tex;
    scene.environmentIntensity = 0.62;
    box.geometry.dispose();
    (box.material as MeshStandardMaterial).dispose();
    return () => {
      scene.environment = null;
      tex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function StudioSet({
  illustration,
  running,
  reducedMotion,
}: {
  illustration: IllustrationState;
  running: boolean;
  reducedMotion: boolean;
}) {
  const road = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!road.current) return;
    const pose = computeIllustrationPose({
      state: illustration,
      running,
      reducedMotion,
      time: clock.elapsedTime,
    });
    road.current.position.z = pose.roadZ * 0.08;
  });
  return (
    <group>
      <color attach="background" args={[STUDIO.sceneBg]} />
      <fog attach="fog" args={[STUDIO.fog, 18, 48]} />
      <mesh position={[0, 6.8, -15]} scale={[58, 32, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={STUDIO.viewportTop} depthWrite={false} />
      </mesh>
      <mesh position={[0, 3.4, -9.2]}>
        <sphereGeometry args={[3.8, 32, 16]} />
        <meshBasicMaterial color="#E7EEEA" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh position={[0, 2.6, -11]} rotation={[0.08, 0, 0]}>
        <cylinderGeometry args={[11, 11, 7.2, 48, 1, true, Math.PI * 0.18, Math.PI * 0.64]} />
        <meshStandardMaterial color={STUDIO.wall} roughness={0.92} metalness={0.04} side={BackSide} />
      </mesh>
      <mesh position={[-7.4, 2.2, -6.2]} rotation={[0, 0.55, 0]}>
        <cylinderGeometry args={[8, 8, 6.4, 40, 1, true, 0, Math.PI * 0.42]} />
        <meshStandardMaterial color="#D5E0DA" roughness={0.94} metalness={0.03} side={BackSide} />
      </mesh>
      <mesh position={[7.6, 2.1, -6]} rotation={[0, -0.55, 0]}>
        <cylinderGeometry args={[8, 8, 6.2, 40, 1, true, Math.PI - Math.PI * 0.42, Math.PI * 0.42]} />
        <meshStandardMaterial color="#D8E2DC" roughness={0.94} metalness={0.03} side={BackSide} />
      </mesh>
      {[8.4, 9.2, 10].map((r, i) => (
        <mesh key={r} position={[0, 3.1 + i * 0.35, -10.6]} rotation={[0.12, 0, 0]}>
          <torusGeometry args={[r, 0.008, 8, 64, Math.PI * 0.7]} />
          <meshBasicMaterial color={STUDIO.line} transparent opacity={0.22} />
        </mesh>
      ))}
      {[4.8, 6.2, 7.6].map((r) => (
        <mesh key={r} position={[0, 0.018, -3.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r, r + 0.01, 80]} />
          <meshBasicMaterial color={STUDIO.gold} transparent opacity={0.1} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[12, 80]} />
        <meshStandardMaterial color={STUDIO.floor} roughness={0.58} metalness={0.1} envMapIntensity={0.26} />
      </mesh>
      <mesh ref={road} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} scale={[1, 1.48, 1]} receiveShadow>
        <circleGeometry args={[2.62, 72]} />
        <meshStandardMaterial color={STUDIO.podium} roughness={0.42} metalness={0.16} envMapIntensity={0.32} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[1, 1.48, 1]}>
        <ringGeometry args={[2.54, 2.62, 80]} />
        <meshStandardMaterial color={STUDIO.gold} roughness={0.32} metalness={0.46} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]} scale={[1, 1.48, 1]}>
        <circleGeometry args={[2.12, 48]} />
        <meshStandardMaterial color="#ECEEE8" roughness={0.4} metalness={0.18} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-9.6, 4.8, -8.4]}>
        <sphereGeometry args={[2.4, 24, 16]} />
        <meshBasicMaterial color="#E7EEEA" transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function VehicleScene({
  model,
  focus,
  resetToken,
  xray,
  exploded,
  showForce,
  showLabels,
  showConnections,
  paused,
  cycleIndex,
  selected,
  hoveredId,
  flashId,
  illustration,
  running,
  onHover,
  onSelect,
}: {
  model: EngineViewModel;
  focus: FocusId;
  resetToken: number;
  xray: boolean;
  exploded: boolean;
  showForce: boolean;
  showLabels: boolean;
  showConnections: boolean;
  paused: boolean;
  cycleIndex: number;
  selected: InspectorTarget;
  hoveredId: BizcarSystemId | null;
  flashId: BizcarSystemId | null;
  illustration: IllustrationState;
  running: boolean;
  onHover: (id: BizcarSystemId | null) => void;
  onSelect: (target: InspectorTarget) => void;
}) {
  const reduced =
    paused || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const selectedSystem = selected.type === "system" ? selected.id : selected.type === "chamber" ? "engine" : null;
  const selectedChamber = selected.type === "chamber" ? selected.code : null;
  const hoodOpen = exploded || xray;
  const engineFocus = focus === "engine" || selected.type === "chamber" || selected.type === "connection";
  const key = useMemo(() => new Vector3(5.8, 6.4, 4.6), []);

  return (
    <>
      <StudioSet illustration={illustration} running={running && !reduced} reducedMotion={reduced} />
      <StudioEnvironment />
      <hemisphereLight color="#eef3ef" groundColor="#b7c4bd" intensity={1.05} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={key.toArray()}
        intensity={1.22}
        color="#fff6ec"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={24}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <directionalLight position={[-5.4, 3.2, 3.4]} intensity={1.05} color="#e7eeea" />
      <directionalLight position={[3.2, 2.1, -3.6]} intensity={0.55} color="#d4dfd8" />
      <pointLight position={[0, 1.15, 2.4]} intensity={hoodOpen ? 0.4 : 0.1} color={STUDIO.gold} distance={5.5} />
      <CameraRig focus={focus} resetToken={resetToken} reducedMotion={reduced} />
      <VehicleModel
        xray={xray}
        exploded={exploded}
        hoodOpen={hoodOpen}
        selectedId={selectedSystem}
        hoveredId={hoveredId}
        flashId={flashId}
        showLabels={showLabels}
        illustration={illustration}
        running={running && !reduced}
        reducedMotion={reduced}
        onHover={onHover}
        onSelect={(id) => onSelect({ type: "system", id })}
      >
        <MtuaEngine
          model={model}
          exploded={engineFocus && exploded}
          showLabels={showLabels && engineFocus}
          showConnections={showConnections && engineFocus}
          paused={paused}
          cycleIndex={cycleIndex}
          selectedComponent={selectedChamber}
          onSelectComponent={(code) => onSelect({ type: "chamber", code })}
          onSelectConnection={(code) => onSelect({ type: "connection", code })}
          compact
        />
      </VehicleModel>
      {showForce ? (
        <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.28, 32]} />
          <meshBasicMaterial color="#3d6e6a" transparent opacity={0.28} />
        </mesh>
      ) : null}
      <ContactShadows position={[0, 0.016, 0]} opacity={0.28} scale={10} blur={3.4} far={6} color="#8a938c" />
    </>
  );
}
