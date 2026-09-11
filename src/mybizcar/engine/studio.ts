/**
 * MyBizCar showroom palette. Scene and UI must share these tokens.
 *
 * Vehicle model status (do not claim Mercedes-Benz E300):
 * The repo has no licensed E300 GLB/glTF. Until a single-generation E300 GLB
 * with separable tires/rims and web-usable license is supplied, the visual
 * remains the original MyBizCar procedural sedan.
 */
export const STUDIO = {
  page: "#F3F2ED",
  panel: "#FFFEFA",
  viewportTop: "#E7EEEA",
  viewportBottom: "#D4DFD8",
  ink: "#163D38",
  muted: "#64736B",
  line: "#D9E2DC",
  gold: "#B49A67",
  primary: "#163c3e",
  primaryFg: "#F3F2ED",
  paint: "#163c3e",
  chrome: "#C4B7A0",
  glass: "#7D9196",
  tire: "#2A2C2B",
  floor: "#D5DCD6",
  podium: "#E4E8E2",
  sceneBg: "#E4EBE6",
  fog: "#D7E0DA",
  wall: "#DCE6E1",
} as const;

export const MODEL_RECORD = {
  claimedAs: "MyBizCar procedural sedan",
  mercedesE300: false,
  generation: null,
  source: "original geometry in sedan-geometry.ts",
  license: "original work for VABIX / MyBizCar",
  webUse: "allowed (first-party)",
} as const;
