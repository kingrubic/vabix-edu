/**
 * MyBizCar executive sedan — original lofted hull.
 * Inspired by long-wheelbase executive sedan proportions, not a copy of any OEM
 * and not a Mercedes-Benz E300. No third-party GLB is bundled: the repo has no
 * licensed glTF/GLB, and this project does not purchase or scrape unclear-rights
 * models. License: original work for VABIX / MyBizCar.
 */
import { BufferGeometry, Float32BufferAttribute } from "three";

type Key = {
  z: number;
  sill: number;
  belt: number;
  roof: number;
  wSill: number;
  wBelt: number;
  wRoof: number;
};

const AXLES = [1.49, -1.49] as const;
const WELL_RADIUS = 0.46;
const WELL_LIFT = 0.74;

const KEYS: Key[] = [
  { z: -2.68, sill: 0.24, belt: 0.5, roof: 0.56, wSill: 0.7, wBelt: 0.76, wRoof: 0.38 },
  { z: -2.48, sill: 0.2, belt: 0.62, roof: 0.74, wSill: 0.86, wBelt: 0.9, wRoof: 0.52 },
  { z: -2.22, sill: 0.18, belt: 0.78, roof: 1.18, wSill: 0.9, wBelt: 0.93, wRoof: 0.78 },
  { z: -1.95, sill: 0.18, belt: 0.84, roof: 1.34, wSill: 0.92, wBelt: 0.945, wRoof: 0.84 },
  { z: -1.49, sill: 0.18, belt: 0.86, roof: 1.38, wSill: 0.93, wBelt: 0.95, wRoof: 0.86 },
  { z: -1.08, sill: 0.18, belt: 0.86, roof: 1.4, wSill: 0.94, wBelt: 0.96, wRoof: 0.87 },
  { z: -0.35, sill: 0.18, belt: 0.86, roof: 1.41, wSill: 0.94, wBelt: 0.96, wRoof: 0.87 },
  { z: 0.35, sill: 0.18, belt: 0.86, roof: 1.4, wSill: 0.94, wBelt: 0.96, wRoof: 0.86 },
  { z: 0.88, sill: 0.18, belt: 0.84, roof: 1.32, wSill: 0.93, wBelt: 0.95, wRoof: 0.82 },
  { z: 1.12, sill: 0.19, belt: 0.78, roof: 1.08, wSill: 0.92, wBelt: 0.94, wRoof: 0.7 },
  { z: 1.49, sill: 0.2, belt: 0.7, roof: 0.86, wSill: 0.91, wBelt: 0.93, wRoof: 0.42 },
  { z: 1.88, sill: 0.22, belt: 0.66, roof: 0.76, wSill: 0.89, wBelt: 0.9, wRoof: 0.36 },
  { z: 2.22, sill: 0.24, belt: 0.62, roof: 0.68, wSill: 0.84, wBelt: 0.85, wRoof: 0.32 },
  { z: 2.52, sill: 0.28, belt: 0.54, roof: 0.58, wSill: 0.74, wBelt: 0.76, wRoof: 0.28 },
  { z: 2.76, sill: 0.32, belt: 0.48, roof: 0.5, wSill: 0.58, wBelt: 0.6, wRoof: 0.24 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sampleKey(z: number): Key {
  if (z <= KEYS[0].z) return { ...KEYS[0], z };
  if (z >= KEYS[KEYS.length - 1].z) return { ...KEYS[KEYS.length - 1], z };
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1].z < z) i += 1;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = (z - a.z) / (b.z - a.z);
  const ease = t * t * (3 - 2 * t);
  return {
    z,
    sill: lerp(a.sill, b.sill, ease),
    belt: lerp(a.belt, b.belt, ease),
    roof: lerp(a.roof, b.roof, ease),
    wSill: lerp(a.wSill, b.wSill, ease),
    wBelt: lerp(a.wBelt, b.wBelt, ease),
    wRoof: lerp(a.wRoof, b.wRoof, ease),
  };
}

function wellAmount(z: number): number {
  let peak = 0;
  for (const axle of AXLES) {
    const dz = Math.abs(z - axle);
    if (dz < WELL_RADIUS) {
      peak = Math.max(peak, Math.sqrt(WELL_RADIUS * WELL_RADIUS - dz * dz) / WELL_RADIUS);
    }
  }
  return peak;
}

function halfWidthAt(k: Key, y: number, well: number): number {
  const pinch = 1 - 0.1 * well * Math.max(0, 1 - (y - k.sill) / Math.max(0.08, k.belt - k.sill));
  if (y <= k.sill) return k.wSill * 0.58 * pinch;
  if (y < k.belt) {
    const t = (y - k.sill) / Math.max(0.04, k.belt - k.sill);
    const bulge = 1 + 0.04 * Math.sin(t * Math.PI);
    return lerp(k.wSill, k.wBelt, t) * bulge * pinch;
  }
  const t = (y - k.belt) / Math.max(0.04, k.roof - k.belt);
  const roofEase = t * t * (3 - 2 * t);
  return lerp(k.wBelt, k.wRoof, Math.min(1, roofEase));
}

function ringAt(z: number, steps: number, yTop?: number): number[][] {
  const k = sampleKey(z);
  const well = wellAmount(z);
  const top = yTop ?? k.roof;
  const pts: number[][] = [];
  const ys: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    ys.push(lerp(k.sill, top, t * t * (3 - 2 * t) * 0.12 + t * 0.88));
  }

  const push = (x: number, y: number) => {
    const side = Math.min(1, Math.abs(x) / Math.max(0.2, k.wSill));
    const lower = Math.max(0, 1 - (y - k.sill) / Math.max(0.14, k.belt - k.sill + 0.1));
    const lift = WELL_LIFT * well * side * side * lower * lower;
    pts.push([x, y + lift, z]);
  };

  push(0, k.sill);
  for (let i = 1; i < ys.length; i++) {
    push(halfWidthAt(k, ys[i], well), ys[i]);
  }
  push(0, top);
  for (let i = ys.length - 1; i >= 1; i--) {
    push(-halfWidthAt(k, ys[i], well), ys[i]);
  }
  return pts;
}

function loftStrip(rings: number[][][]): BufferGeometry {
  const ns = rings.length;
  const nr = rings[0].length;
  const pos: number[] = [];
  const idx: number[] = [];
  for (const ring of rings) {
    for (const p of ring) pos.push(p[0], p[1], p[2]);
  }
  for (let i = 0; i < ns - 1; i++) {
    for (let j = 0; j < nr - 1; j++) {
      const a = i * nr + j;
      const b = i * nr + j + 1;
      const c = (i + 1) * nr + j;
      const d = (i + 1) * nr + j + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function mergeGeos(geos: BufferGeometry[]): BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  let offset = 0;
  for (const geo of geos) {
    const attr = geo.getAttribute("position") as Float32BufferAttribute;
    for (let i = 0; i < attr.count; i++) pos.push(attr.getX(i), attr.getY(i), attr.getZ(i));
    const index = geo.getIndex();
    if (index) {
      for (let i = 0; i < index.count; i++) idx.push(index.getX(i) + offset);
    }
    offset += attr.count;
    geo.dispose();
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function loftClosed(rings: number[][][]): BufferGeometry {
  const ns = rings.length;
  const nr = rings[0].length;
  const pos: number[] = [];
  const idx: number[] = [];
  for (const ring of rings) {
    for (const p of ring) pos.push(p[0], p[1], p[2]);
  }

  const frontCenter = centroid(rings[ns - 1]);
  const rearCenter = centroid(rings[0]);
  const frontIndex = ns * nr;
  const rearIndex = ns * nr + 1;
  pos.push(frontCenter[0], frontCenter[1], frontCenter[2]);
  pos.push(rearCenter[0], rearCenter[1], rearCenter[2]);

  for (let i = 0; i < ns - 1; i++) {
    for (let j = 0; j < nr; j++) {
      const j2 = (j + 1) % nr;
      const a = i * nr + j;
      const b = i * nr + j2;
      const c = (i + 1) * nr + j;
      const d = (i + 1) * nr + j2;
      idx.push(a, c, b, b, c, d);
    }
  }
  for (let j = 0; j < nr; j++) {
    const j2 = (j + 1) % nr;
    idx.push(frontIndex, (ns - 1) * nr + j, (ns - 1) * nr + j2);
    idx.push(rearIndex, j2, j);
  }

  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function centroid(ring: number[][]): [number, number, number] {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const p of ring) {
    x += p[0];
    y += p[1];
    z += p[2];
  }
  const n = ring.length;
  return [x / n, y / n, z / n];
}

function isGreenhouse(z: number, k: Key) {
  return z < 1.14 && z > -2.08 && k.roof > k.belt + 0.22;
}

export function createSedanBodyGeometry(): BufferGeometry {
  const stations = 48;
  const z0 = KEYS[0].z;
  const z1 = KEYS[KEYS.length - 1].z;
  const rings = Array.from({ length: stations }, (_, i) => {
    const z = lerp(z0, z1, i / (stations - 1));
    const k = sampleKey(z);
    return ringAt(z, 16, isGreenhouse(z, k) ? k.belt : undefined);
  });
  return loftClosed(rings);
}

export function createRoofGeometry(): BufferGeometry {
  const z0 = -2.06;
  const z1 = 1.1;
  const stations = 24;
  const rings: number[][][] = [];
  for (let i = 0; i < stations; i++) {
    const z = lerp(z0, z1, i / (stations - 1));
    const k = sampleKey(z);
    const y = k.roof;
    const w = Math.max(k.wRoof, k.wBelt * 0.88);
    rings.push([
      [w, y - 0.14, z],
      [w * 0.72, y + 0.03, z],
      [0, y + 0.07, z],
      [-(w * 0.72), y + 0.03, z],
      [-w, y - 0.14, z],
    ]);
  }
  return loftStrip(rings);
}

function sideGlass(z0: number, z1: number, side: 1 | -1, stations: number): BufferGeometry {
  const rings: number[][][] = [];
  for (let i = 0; i < stations; i++) {
    const z = lerp(z0, z1, i / (stations - 1));
    const k = sampleKey(z);
    const y0 = k.belt + 0.035;
    const y1 = k.roof - 0.07;
    const inset = 0.045;
    rings.push([
      [side * (k.wBelt - inset), y0, z],
      [side * (k.wRoof - inset * 0.35), y1, z],
    ]);
  }
  return loftStrip(rings);
}

function endGlass(z0: number, z1: number, stations: number): BufferGeometry {
  const rings: number[][][] = [];
  for (let i = 0; i < stations; i++) {
    const z = lerp(z0, z1, i / (stations - 1));
    const k = sampleKey(z);
    const y0 = k.belt + 0.04;
    const y1 = k.roof - 0.05;
    const inset = 0.08;
    rings.push([
      [-(k.wBelt - inset), y0, z],
      [-(k.wRoof - inset * 0.4), y1, z],
      [0, y1 + 0.01, z],
      [k.wRoof - inset * 0.4, y1, z],
      [k.wBelt - inset, y0, z],
    ]);
  }
  return loftStrip(rings);
}

export function createCabinGlassGeometry(): BufferGeometry {
  return mergeGeos([
    sideGlass(-1.62, -0.12, 1, 10),
    sideGlass(-1.62, -0.12, -1, 10),
    sideGlass(0.18, 0.92, 1, 8),
    sideGlass(0.18, 0.92, -1, 8),
    endGlass(0.9, 1.14, 6),
    endGlass(-2.0, -1.74, 6),
  ]);
}

export function sedanExtents() {
  return {
    length: KEYS[KEYS.length - 1].z - KEYS[0].z,
    width: 1.92,
    height: 1.41,
    front: KEYS[KEYS.length - 1].z,
    rear: KEYS[0].z,
    boundingRadius: 3.15,
  };
}
