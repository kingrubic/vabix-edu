import { getDb, nowIso, newId } from "@/platform/db/client";
import { writeAudit } from "@/platform/audit";

export function notifyUsers(
  userIds: string[],
  input: { type: string; title: string; body: string; href: string; refId: string },
) {
  const at = nowIso();
  const stmt = getDb().prepare(
    `INSERT OR IGNORE INTO notifications (id, user_id, type, title, body, href, ref_type, ref_id, read_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
  );
  for (const userId of [...new Set(userIds.filter(Boolean))]) {
    stmt.run(newId(), userId, input.type, input.title, input.body, input.href, input.type, input.refId, at);
  }
}

export function listNotifications(userId: string) {
  return getDb()
    .prepare(`SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`)
    .all(userId);
}

export function markNotificationRead(userId: string, id: string) {
  getDb().prepare(`UPDATE notifications SET read_at = ? WHERE id = ? AND user_id = ?`).run(nowIso(), id, userId);
}

export function scheduleNotification(type: string, refId: string, fireAt: string) {
  getDb()
    .prepare(
      `INSERT OR IGNORE INTO scheduled_notifications (id, type, ref_id, fire_at, processed_at) VALUES (?, ?, ?, ?, NULL)`,
    )
    .run(newId(), type, refId, fireAt);
}

export function processDueNotifications() {
  const now = nowIso();
  const due = getDb()
    .prepare(`SELECT * FROM scheduled_notifications WHERE processed_at IS NULL AND fire_at <= ?`)
    .all(now) as { id: string; type: string; ref_id: string }[];
  for (const item of due) {
    if (item.type === "assignment_due") {
      const assignment = getDb().prepare(`SELECT title, class_id FROM lms_assignments WHERE id = ?`).get(item.ref_id) as
        | { title: string; class_id: string | null }
        | undefined;
      if (assignment?.class_id) {
        const users = (
          getDb()
            .prepare(`SELECT user_id FROM lms_enrollments WHERE class_id = ? AND user_id IS NOT NULL AND status='active'`)
            .all(assignment.class_id) as { user_id: string }[]
        ).map((row) => row.user_id);
        notifyUsers(users, {
          type: "assignment_due",
          title: "Bài tập sắp đến hạn",
          body: assignment.title,
          href: "/hoc-tap/bai-tap",
          refId: item.ref_id,
        });
      }
    }
    getDb().prepare(`UPDATE scheduled_notifications SET processed_at = ? WHERE id = ?`).run(now, item.id);
  }
  writeAudit({ action: "notify.job", entityType: "scheduled_notifications", summary: `Xử lý ${due.length} thông báo theo lịch.` });
  return { processed: due.length };
}
