import type { BizcarSystemId } from "@/mybizcar/domain/bizcar-systems";
import type { WheelId } from "@/mybizcar/visualization/tire-scenario";

/**
 * Semantic IDs used by camera, inspector, and tire scenario.
 * When a licensed GLB arrives, map node names here — do not rewrite form logic.
 */
export type WheelMeshNames = { tire: string; rim: string };

export const WHEEL_MESH: Record<WheelId, WheelMeshNames> = {
  "value-wheel": { tire: "tire_fl", rim: "rim_fl" },
  "market-wheel": { tire: "tire_fr", rim: "rim_fr" },
  "people-wheel": { tire: "tire_rl", rim: "rim_rl" },
  "finance-wheel": { tire: "tire_rr", rim: "rim_rr" },
};

export const SYSTEM_MESH: Record<BizcarSystemId, string[]> = {
  shell: ["body", "shell", "paint", "hood", "deck"],
  engine: ["engine_mtua"],
  chassis: ["chassis"],
  cockpit: ["cabin", "cockpit"],
  oil: ["oil"],
  gearbox: ["gearbox"],
  fuel: ["fuel"],
  environment: ["floor"],
  "value-wheel": ["tire_fl", "rim_fl"],
  "market-wheel": ["tire_fr", "rim_fr"],
  "people-wheel": ["tire_rl", "rim_rl"],
  "finance-wheel": ["tire_rr", "rim_rr"],
};

export function wheelMeshFor(id: WheelId): WheelMeshNames {
  return WHEEL_MESH[id];
}
