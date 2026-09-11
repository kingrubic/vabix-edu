import type { BizcarSystemId } from "@/mybizcar/domain/bizcar-systems";
import type { WheelId } from "@/mybizcar/visualization/tire-scenario";

export const WHEEL_LAYOUT: Record<WheelId, { x: number; z: number; side: "left" | "right"; axle: "front" | "rear" }> = {
  "value-wheel": { x: -0.79, z: 1.49, side: "left", axle: "front" },
  "market-wheel": { x: 0.79, z: 1.49, side: "right", axle: "front" },
  "people-wheel": { x: -0.79, z: -1.49, side: "left", axle: "rear" },
  "finance-wheel": { x: 0.79, z: -1.49, side: "right", axle: "rear" },
};

export const WHEEL_LAYOUT_NOTE =
  "Vị trí bốn bánh (trái trước = Giá trị, phải trước = Thị trường, trái sau = Con người, phải sau = Tài chính) là cấu hình MyBizCar 3D cho bản phát triển. Không trình bày như quy chuẩn BMDO đã xác nhận.";

export const SEDAN = {
  tireRadius: 0.355,
  tireTube: 0.108,
  rimRadius: 0.232,
  wheelY: 0.473,
};

export type ViewAngleId = "whole" | "front" | "side" | "rear" | "exploded";
export type FocusId = ViewAngleId | BizcarSystemId;

export const VIEW_ANGLES: { id: Exclude<ViewAngleId, "exploded">; label: string }[] = [
  { id: "whole", label: "Tổng thể" },
  { id: "front", label: "Phía trước" },
  { id: "side", label: "Bên hông" },
  { id: "rear", label: "Phía sau" },
];

export const CAMERA_FOCUS: Record<FocusId, { position: [number, number, number]; target: [number, number, number]; minDistance: number }> = {
  whole: { position: [4.55, 1.42, 5.05], target: [0, 0.58, 0.04], minDistance: 4.2 },
  front: { position: [0.15, 1.35, 7.6], target: [0, 0.55, 0.55], minDistance: 4.4 },
  side: { position: [7.2, 1.45, 0.15], target: [0, 0.52, 0], minDistance: 4.8 },
  rear: { position: [0.3, 1.42, -7.35], target: [0, 0.55, -0.4], minDistance: 4.4 },
  exploded: { position: [7.6, 3.6, 8.1], target: [0, 0.9, 0], minDistance: 5.5 },
  engine: { position: [1.55, 1.42, 4.85], target: [0, 0.78, 1.85], minDistance: 1.6 },
  "value-wheel": { position: [-3.15, 0.95, 3.55], target: [-0.79, 0.47, 1.49], minDistance: 1.6 },
  "market-wheel": { position: [3.15, 0.95, 3.55], target: [0.79, 0.47, 1.49], minDistance: 1.6 },
  "people-wheel": { position: [-3.15, 0.95, -3.55], target: [-0.79, 0.47, -1.49], minDistance: 1.6 },
  "finance-wheel": { position: [3.15, 0.95, -3.55], target: [0.79, 0.47, -1.49], minDistance: 1.6 },
  chassis: { position: [0.15, 0.55, 5.4], target: [0, 0.18, 0], minDistance: 2.4 },
  cockpit: { position: [0.12, 1.55, 2.85], target: [0, 0.95, 0.05], minDistance: 1.3 },
  oil: { position: [1.9, 0.55, 3.4], target: [0, 0.28, 1.55], minDistance: 1.2 },
  gearbox: { position: [2.4, 0.7, 1.2], target: [0, 0.32, 0.2], minDistance: 1.4 },
  shell: { position: [5.4, 1.8, 5.8], target: [0, 0.7, 0], minDistance: 3.8 },
  environment: { position: [0.2, 4.2, 0.2], target: [0, 0, 0], minDistance: 4 },
  fuel: { position: [1.8, 0.85, -3.6], target: [0, 0.45, -2.15], minDistance: 1.3 },
};

export const EXPLODE_OFFSET: Record<BizcarSystemId, [number, number, number]> = {
  engine: [0, 0.28, 0.48],
  "value-wheel": [-0.38, 0.06, 0.16],
  "market-wheel": [0.38, 0.06, 0.16],
  "people-wheel": [-0.38, 0.06, -0.16],
  "finance-wheel": [0.38, 0.06, -0.16],
  oil: [0, -0.22, 0.22],
  gearbox: [0, -0.18, 0],
  chassis: [0, -0.32, 0],
  shell: [0, 0.42, 0],
  environment: [0, -0.08, 0],
  fuel: [0, 0.1, -0.42],
  cockpit: [0, 0.32, -0.08],
};

export function focusForSelection(selected: { type: string; id?: string }): FocusId {
  if (selected.type === "chamber" || selected.type === "connection") return "engine";
  if (selected.type === "system" && selected.id && selected.id in CAMERA_FOCUS) return selected.id as FocusId;
  return "whole";
}

export function isViewAngle(focus: FocusId): focus is Exclude<ViewAngleId, "exploded"> {
  return focus === "whole" || focus === "front" || focus === "side" || focus === "rear";
}

export function fitCameraPosition(
  position: [number, number, number],
  target: [number, number, number],
  aspect: number,
  fovDeg: number,
  radius = 2.35,
): [number, number, number] {
  if (aspect >= 1.2) return position;
  const vFov = (fovDeg * Math.PI) / 180;
  const halfH = Math.tan(vFov / 2);
  const halfW = halfH * Math.max(0.35, aspect);
  const dist = (radius * 1.05) / Math.min(halfH, halfW);
  const dx = position[0] - target[0];
  const dy = position[1] - target[1];
  const dz = position[2] - target[2];
  const len = Math.hypot(dx, dy, dz) || 1;
  const scale = Math.max(6.1, Math.min(9.0, dist)) / len;
  return [target[0] + dx * scale, Math.max(1.45, target[1] + dy * scale), target[2] + dz * scale];
}
