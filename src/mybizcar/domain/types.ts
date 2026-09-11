export type ComponentCode = "M" | "T" | "U" | "A";

export type EngineProfile = {
  mds: Record<ComponentCode, { finalMds: number | null }>;
};
