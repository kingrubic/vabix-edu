import { parseJson } from "@/platform/sanitize";

export const DEFAULT_COMPLETION = {
  contentPercent: 80,
  attendancePercent: 70,
  requiredAssignments: true,
  require3w: false,
  requireApproval: false,
};

export function parseRules(raw: string | null | undefined) {
  return { ...DEFAULT_COMPLETION, ...parseJson(raw, {}) };
}
