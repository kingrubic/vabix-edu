import { getDb, nowIso, newId } from "@/platform/db/client";
import { writeAudit } from "@/platform/audit";
import type { LeadPayload } from "@/lib/leads";

export function saveInquiryFromLead(payload: LeadPayload, sourcePath = "") {
  const at = nowIso();
  const recent = getDb()
    .prepare(
      `SELECT id FROM inquiries WHERE email=? AND type=? AND created_at > ? LIMIT 1`,
    )
    .get(payload.email.toLowerCase(), payload.type, new Date(Date.now() - 10 * 60 * 1000).toISOString()) as { id: string } | undefined;
  if (recent) return { id: recent.id, duplicate: true };
  const id = newId();
  getDb()
    .prepare(
      `INSERT INTO inquiries (id, type, source_path, name, email, phone, organization, role_title, body, program_slug, event_slug, assignee_user_id, status, notes, next_contact_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'new', '', NULL, ?, ?)`,
    )
    .run(
      id,
      payload.type,
      sourcePath,
      payload.name,
      payload.email.toLowerCase(),
      payload.phone,
      payload.company ?? "",
      payload.role ?? "",
      [payload.need, payload.message].filter(Boolean).join("\n"),
      payload.program ?? null,
      payload.eventSlug ?? null,
      at,
      at,
    );
  writeAudit({ action: "inquiry.create", entityType: "inquiry", entityId: id, summary: `Tiếp nhận ${payload.type} từ form công khai.` });
  return { id, duplicate: false };
}

export function listInquiries(type?: string) {
  if (type) {
    return getDb().prepare(`SELECT * FROM inquiries WHERE type=? ORDER BY created_at DESC`).all(type);
  }
  return getDb().prepare(`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 200`).all();
}

export function updateInquiry(
  id: string,
  input: { status: string; notes: string; assigneeUserId: string | null; nextContactAt: string | null },
) {
  getDb()
    .prepare(`UPDATE inquiries SET status=?, notes=?, assignee_user_id=?, next_contact_at=?, updated_at=? WHERE id=?`)
    .run(input.status, input.notes, input.assigneeUserId, input.nextContactAt, nowIso(), id);
}
