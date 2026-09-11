"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { VehicleScene } from "./VehicleScene";
import type { EngineViewModel } from "@/mybizcar/visualization/view-model";
import type { BizcarSystemId } from "@/mybizcar/domain/bizcar-systems";
import type { IllustrationState } from "@/mybizcar/visualization/illustration";
import type { InspectorTarget } from "./vehicle-types";
import type { FocusId } from "./component-registry";
import { CAMERA_FOCUS } from "./component-registry";
import { SceneBoundary } from "./SceneBoundary";

function SizeSync({ onReady }: { onReady: () => void }) {
  const setSize = useThree((s) => s.setSize);
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const signaled = useRef(false);

  useLayoutEffect(() => {
    const host = gl.domElement.parentElement;
    if (!host) return;

    const apply = () => {
      const w = Math.round(host.clientWidth);
      const h = Math.round(host.clientHeight);
      if (w <= 1 || h <= 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      gl.setPixelRatio(dpr);
      gl.setSize(w, h, false);
      setSize(w, h);
      invalidate();
      const diag = (window as Window & { __bizcarEngineDiag?: Record<string, unknown> }).__bizcarEngineDiag ?? {};
      (window as Window & { __bizcarEngineDiag?: Record<string, unknown> }).__bizcarEngineDiag = {
        ...diag,
        canvasBuffer: { w: gl.domElement.width, h: gl.domElement.height, cssW: w, cssH: h, dpr },
      };
      if (!signaled.current && gl.domElement.width > 2 && gl.domElement.height > 2) {
        signaled.current = true;
        onReady();
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(host);
    const poll = window.setInterval(apply, 250);
    const stop = window.setTimeout(() => window.clearInterval(poll), 4000);
    return () => {
      ro.disconnect();
      window.clearInterval(poll);
      window.clearTimeout(stop);
    };
  }, [setSize, gl, invalidate, onReady]);
  return null;
}

export default function EngineCanvas(props: {
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
  onReady: () => void;
  onContextLost: () => void;
  onSceneError: () => void;
}) {
  const lostRef = useRef(props.onContextLost);
  lostRef.current = props.onContextLost;
  const readyRef = useRef(props.onReady);
  readyRef.current = props.onReady;
  const hostRef = useRef<HTMLDivElement>(null);
  const [readyHost, setReadyHost] = useState(false);
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const apply = () => {
      if (el.clientWidth > 1 && el.clientHeight > 1) setReadyHost(true);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const cam = CAMERA_FOCUS.whole;

  return (
    <div ref={hostRef} className="engine-viewport absolute inset-0 h-full w-full">
      {readyHost ? (
        <Canvas
          shadows
          style={{ width: "100%", height: "100%" }}
          resize={{ scroll: false, debounce: 0, offsetSize: true }}
          dpr={[1, 1.5]}
          frameloop={visible ? "always" : "demand"}
          camera={{ position: cam.position, fov: 32, near: 0.1, far: 80 }}
          gl={{ antialias: true, powerPreference: "default", preserveDrawingBuffer: true, failIfMajorPerformanceCaveat: false }}
          onCreated={({ gl }) => {
            readyRef.current();
            gl.domElement.addEventListener("webglcontextlost", (ev) => {
              ev.preventDefault();
              requestAnimationFrame(() => {
                if (!gl.domElement.isConnected) return;
                lostRef.current();
              });
            });
            gl.domElement.addEventListener("webglcontextrestored", () => {
              readyRef.current();
            });
          }}
          onPointerMissed={() => props.onSelect({ type: "overview" })}
        >
          <SizeSync onReady={() => readyRef.current()} />
          <SceneBoundary onError={() => props.onSceneError()}>
            <VehicleScene
              model={props.model}
              focus={props.focus}
              resetToken={props.resetToken}
              xray={props.xray}
              exploded={props.exploded}
              showForce={props.showForce}
              showLabels={props.showLabels}
              showConnections={props.showConnections}
              paused={props.paused}
              cycleIndex={props.cycleIndex}
              selected={props.selected}
              hoveredId={props.hoveredId}
              flashId={props.flashId}
              illustration={props.illustration}
              running={props.running}
              onHover={props.onHover}
              onSelect={props.onSelect}
            />
          </SceneBoundary>
        </Canvas>
      ) : null}
    </div>
  );
}
