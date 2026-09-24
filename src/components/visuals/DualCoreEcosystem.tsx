"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Orbit = "teal" | "gold";

type NodeInfo = {
  orbit: Orbit;
  title: string;
  detail: string;
};

const NODES: NodeInfo[] = [
  { orbit: "teal", title: "Tư vấn chiến lược", detail: "Xác định ưu tiên phát triển" },
  { orbit: "teal", title: "Đào tạo CEO", detail: "Rèn tư duy điều hành" },
  { orbit: "teal", title: "Đào tạo đội ngũ", detail: "Đồng hành và đo kết quả" },
  { orbit: "gold", title: "Kết nối đối tác", detail: "Mở rộng cơ hội hợp tác" },
  { orbit: "gold", title: "Kết nối khách hàng", detail: "Tiếp cận đúng khách hàng" },
  { orbit: "gold", title: "Kết nối nhân lực", detail: "Đúng người cho từng giai đoạn" },
];

const CX = 200;
const CY = 200;

function orbitPath(rx: number, ry: number) {
  const left = CX - rx;
  const right = CX + rx;
  return `M ${left} ${CY} A ${rx} ${ry} 0 0 1 ${right} ${CY} A ${rx} ${ry} 0 0 1 ${left} ${CY}`;
}

function arcPoint(rx: number, ry: number, deg: number) {
  const t = (deg * Math.PI) / 180;
  return [CX + rx * Math.cos(t), CY + ry * Math.sin(t)] as const;
}

function nearArc(rx: number, ry: number) {
  const [x0, y0] = arcPoint(rx, ry, 68);
  const [x1, y1] = arcPoint(rx, ry, 112);
  return `M ${x0} ${y0} A ${rx} ${ry} 0 0 1 ${x1} ${y1}`;
}

function farArc(rx: number, ry: number) {
  const [x0, y0] = arcPoint(rx, ry, 112);
  const [x1, y1] = arcPoint(rx, ry, 68);
  return `M ${x0} ${y0} A ${rx} ${ry} 0 1 1 ${x1} ${y1}`;
}

function onEllipse(rx: number, ry: number, deg: number) {
  const t = (deg * Math.PI) / 180;
  return [CX + rx * Math.cos(t), CY + ry * Math.sin(t)] as const;
}

const RINGS = [
  { id: "teal", orbit: "teal" as const, rx: 162, ry: 148, tilt: -6, dur: 18, start: 0, count: 3 },
  { id: "lane", orbit: "lane" as const, rx: 180, ry: 166, tilt: -6, dur: 0, start: 0, count: 0 },
  { id: "gold", orbit: "gold" as const, rx: 196, ry: 184, tilt: 12, dur: 20, start: 3, count: 3 },
];

function Satellite({
  index,
  pathId,
  dur,
  face,
  still,
  shown,
  reduced,
  onEnter,
  onLeave,
  onTap,
  nodes,
}: {
  nodes: NodeInfo[];
  index: number;
  pathId: string;
  dur: number;
  face: "front" | "back";
  still: readonly [number, number];
  shown: number;
  reduced: boolean;
  onEnter: (index: number) => void;
  onLeave: () => void;
  onTap: (index: number) => void;
}) {
  const info = nodes[index];
  const active = shown === index;
  const offset = index % 3;
  const begin = `${-offset * (dur / 3)}s`;

  return (
    <>
      {face === "front" && (
        <g
          className={active ? "vabix-dual-mover vabix-dual-node-still is-active" : "vabix-dual-mover vabix-dual-node-still"}
          transform={`translate(${still[0]} ${still[1]})`}
          tabIndex={reduced ? 0 : -1}
          role="button"
          aria-label={`${info.title}. ${info.detail}`}
          onPointerEnter={() => onEnter(index)}
          onPointerLeave={onLeave}
          onFocus={() => onEnter(index)}
          onBlur={onLeave}
          onClick={() => onTap(index)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onTap(index);
            }
          }}
        >
          <g className="vabix-dual-node">
            <circle className="vabix-dual-hit" r="13" />
            <circle className="vabix-dual-halo" r="6.5" />
            <circle className="vabix-dual-dot" r="3.6" />
          </g>
        </g>
      )}
      <g
        className={active ? "vabix-dual-mover vabix-dual-node-move is-active" : "vabix-dual-mover vabix-dual-node-move"}
        tabIndex={!reduced && face === "front" ? 0 : -1}
        role={face === "front" ? "button" : undefined}
        aria-hidden={face === "back" ? true : undefined}
        aria-label={face === "front" ? `${info.title}. ${info.detail}` : undefined}
        onPointerEnter={() => onEnter(index)}
        onPointerLeave={onLeave}
        onFocus={() => onEnter(index)}
        onBlur={onLeave}
        onClick={() => onTap(index)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onTap(index);
          }
        }}
      >
        {!reduced && (
          <>
            <animateMotion dur={`${dur}s`} begin={begin} repeatCount="indefinite" calcMode="linear">
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </>
        )}
        <g className="vabix-dual-node">
          <circle className="vabix-dual-hit" r="13" />
          <circle className="vabix-dual-halo" r="6.5" />
          <circle className="vabix-dual-dot" r="3.6" />
        </g>
      </g>
    </>
  );
}

function RingLayer({
  face,
  shown,
  reduced,
  onEnter,
  onLeave,
  onTap,
  nodes,
}: {
  nodes: NodeInfo[];
  face: "front" | "back";
  shown: number;
  reduced: boolean;
  onEnter: (index: number) => void;
  onLeave: () => void;
  onTap: (index: number) => void;
}) {
  return (
    <>
      {RINGS.map((ring) => {
        const still = [36, 90, 144].map((deg) => onEllipse(ring.rx, ring.ry, deg));
        return (
          <g key={ring.id} className={`vabix-dual-orbit vabix-dual-orbit-${ring.orbit}`} transform={`rotate(${ring.tilt} ${CX} ${CY})`}>
            <path d={face === "front" ? nearArc(ring.rx, ring.ry) : farArc(ring.rx, ring.ry)} className={face === "front" ? "vabix-dual-arc-front" : "vabix-dual-arc-back"} />
            {face === "front" && ring.count > 0 && (
              <path id={`vabix-orbit-${ring.id}-front`} d={orbitPath(ring.rx, ring.ry)} className="vabix-dual-arc-path" />
            )}
            {face === "front" &&
              still.slice(0, ring.count).map((point, offset) => (
                <Satellite
                  key={nodes[ring.start + offset].title}
                  nodes={nodes}
                  index={ring.start + offset}
                  pathId={`vabix-orbit-${ring.id}-front`}
                  dur={ring.dur}
                  face={face}
                  still={point}
                  shown={shown}
                  reduced={reduced}
                  onEnter={onEnter}
                  onLeave={onLeave}
                  onTap={onTap}
                />
              ))}
          </g>
        );
      })}
    </>
  );
}

const NODES_EN: NodeInfo[] = [
  { orbit: "teal", title: "Strategy consulting", detail: "Set the right growth priorities" },
  { orbit: "teal", title: "CEO training", detail: "Sharpen how leaders decide" },
  { orbit: "teal", title: "Team training", detail: "Practice together and measure results" },
  { orbit: "gold", title: "Partner connections", detail: "Open the right collaborations" },
  { orbit: "gold", title: "Customer connections", detail: "Reach the customers who fit" },
  { orbit: "gold", title: "Talent connections", detail: "The right people for each stage" },
];

export function DualCoreEcosystem({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [linked, setLinked] = useState<Orbit | null>(null);
  const [coarse, setCoarse] = useState(false);
  const nodes = locale === "en" ? NODES_EN : NODES;
  const shown = hover ?? active;
  const info = nodes[shown];
  const en = locale === "en";

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(pointer: coarse)");
    const sync = () => {
      setReduced(motion.matches);
      setCoarse(pointer.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    pointer.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      pointer.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % nodes.length);
    }, 3600);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  useEffect(() => {
    if (!coarse || hover === null) return;
    const id = window.setTimeout(() => {
      setHover(null);
      setPaused(false);
    }, 6400);
    return () => window.clearTimeout(id);
  }, [coarse, hover]);

  useEffect(() => {
    const enter = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("#tru-cot-01")) setLinked("teal");
      else if (target.closest("#tru-cot-02")) setLinked("gold");
    };
    const leave = (event: MouseEvent) => {
      const target = event.target;
      const next = event.relatedTarget;
      if (!(target instanceof Element)) return;
      const pillar = target.closest("#tru-cot-01, #tru-cot-02");
      if (!pillar) return;
      if (next instanceof Element && pillar.contains(next)) return;
      setLinked(null);
    };
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    return () => {
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
    };
  }, []);

  const enterNode = (index: number) => {
    if (coarse) return;
    setHover(index);
    setPaused(true);
  };

  const leaveNode = () => {
    if (coarse) return;
    setHover(null);
    setPaused(false);
  };

  const tapNode = (index: number) => {
    if (!coarse) return;
    setHover((current) => (current === index ? null : index));
    setPaused(true);
  };

  const figureClass = ["vabix-dual", linked ? `is-linked-${linked}` : "", `is-live-${info.orbit}`].filter(Boolean).join(" ");

  return (
    <figure className={figureClass} aria-label={en ? "VABIX ecosystem: a core with Knowledge and Business orbits" : "Mô hình hệ sinh thái VABIX: lõi VABIX với hai quỹ đạo Kết nối tri thức và Kết nối kinh doanh"}>
      <div className="vabix-dual-stage">
        <span className="vabix-dual-aura" aria-hidden="true" />

        <a className="vabix-dual-pole vabix-dual-pole-teal" href="#tru-cot-01">
          <span className="vabix-dual-pole-name">{en ? "Knowledge" : "Kết nối tri thức"}</span>
        </a>

        <div className="vabix-dual-scene">
          <svg className="vabix-dual-svg vabix-dual-svg-back" viewBox="0 0 400 400" aria-hidden="true">
            <RingLayer nodes={nodes} face="back" shown={shown} reduced={reduced} onEnter={enterNode} onLeave={leaveNode} onTap={tapNode} />
          </svg>

          <div className="vabix-dual-core">
            <span className="vabix-dual-shadow" aria-hidden="true" />
            <Image src="/brand/hero-dual-core.png" alt="" width={1024} height={1024} priority className="vabix-dual-mark" />
          </div>

          <svg className="vabix-dual-svg vabix-dual-svg-front" viewBox="0 0 400 400">
            <RingLayer nodes={nodes} face="front" shown={shown} reduced={reduced} onEnter={enterNode} onLeave={leaveNode} onTap={tapNode} />
          </svg>
        </div>

        <p className="vabix-dual-motto">{en ? "Knowledge · Connection · Growth" : "Tri thức · Kết nối · Phát triển"}</p>

        <a className="vabix-dual-pole vabix-dual-pole-gold" href="#tru-cot-02">
          <span className="vabix-dual-pole-name">{en ? "Business" : "Kết nối kinh doanh"}</span>
        </a>
      </div>

      <div className={`vabix-dual-info is-${info.orbit}`}>
        <strong>{info.title}</strong>
        <span>{info.detail}</span>
      </div>
    </figure>
  );
}
