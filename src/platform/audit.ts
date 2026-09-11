import { getDb, nowIso, newId } from "@/platform/db/client";

const SENSITIVE = /password|secret|token|hash|authorization/i;

export function writeAudit(input: {
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}) {
  const metadata = { ...(input.metadata ?? {}) };
  for (const key of Object.keys(metadata)) {
    if (SENSITIVE.test(key)) delete metadata[key];
  }
  getDb()
    .prepare(
      `INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, summary, metadata, ip, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      newId(),
      input.actorUserId ?? null,
      input.action,
      input.entityType,
      input.entityId ?? null,
      input.summary,
      JSON.stringify(metadata),
      input.ip ?? null,
      nowIso(),
    );
}

export function listAudit(limit = 50, offset = 0) {
  return getDb()
    .prepare(
      `SELECT a.*, u.name AS actor_name, u.email AS actor_email
       FROM audit_logs a
       LEFT JOIN users u ON u.id = a.actor_user_id
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .all(limit, offset);
}
