import { convexListAudit, convexWriteAudit } from "@/platform/convex/repo";
import { isPlatformConvexConfigured } from "@/platform/convex/client";

const SENSITIVE = /password|secret|token|hash|authorization/i;

function sanitizeMetadata(input?: Record<string, unknown>) {
  const metadata = { ...(input ?? {}) };
  for (const key of Object.keys(metadata)) {
    if (SENSITIVE.test(key)) delete metadata[key];
  }
  return metadata;
}

export async function writeAuditAsync(input: {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}) {
  if (!isPlatformConvexConfigured()) return;
  await convexWriteAudit({
    actorUserId: input.actorUserId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    summary: input.summary,
    metadata: JSON.stringify(sanitizeMetadata(input.metadata)),
    ip: input.ip,
  });
}

/** Fire-and-forget wrapper so LMS/CMS callers can stay sync. */
export function writeAudit(input: {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}) {
  void writeAuditAsync(input).catch((error) => {
    console.error("[platform-audit]", error);
  });
}

export async function listAudit(limit = 50, offset = 0) {
  if (!isPlatformConvexConfigured()) return [];
  return convexListAudit(limit, offset);
}
