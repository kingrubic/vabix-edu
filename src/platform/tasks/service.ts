import { getDb, nowIso, newId } from "@/platform/db/client";
import { assertCan, can, type Actor } from "@/platform/permissions/evaluate";
import { notifyUsers } from "@/platform/notify/service";
import { writeAudit } from "@/platform/audit";

function nextTaskCode() {
  const year = new Date().getFullYear();
  const count = (getDb().prepare(`SELECT COUNT(*) AS n FROM tasks`).get() as { n: number }).n + 1;
  return `CV-${year}-${String(count).padStart(4, "0")}`;
}

export function listTasks(actor: Actor, filter: "mine" | "created" | "all" | "overdue") {
  const now = nowIso().slice(0, 10);
  let sql = `SELECT t.*, a.name AS assignee_name, c.name AS creator_name, d.name AS department_name
    FROM tasks t
    JOIN users a ON a.id = t.assignee_user_id
    JOIN users c ON c.id = t.creator_user_id
    LEFT JOIN departments d ON d.id = t.department_id
    WHERE 1=1`;
  const params: unknown[] = [];
  if (actor.role === "user") {
    if (filter === "created") {
      sql += ` AND t.creator_user_id = ?`;
      params.push(actor.id);
    } else if (filter === "all" && can(actor, "work.user.created", "view")) {
      if (can(actor, "work.all", "view") || can(actor, "work.user.created", "view")) {
        sql += ` AND (t.assignee_user_id = ? OR t.creator_user_id = ? OR t.department_id = ?)`;
        params.push(actor.id, actor.id, actor.departmentId);
      }
    } else {
      sql += ` AND (t.assignee_user_id = ? OR EXISTS(SELECT 1 FROM task_collaborators x WHERE x.task_id=t.id AND x.user_id=?))`;
      params.push(actor.id, actor.id);
    }
  } else if (filter === "mine") {
    sql += ` AND t.assignee_user_id = ?`;
    params.push(actor.id);
  } else if (filter === "created") {
    sql += ` AND t.creator_user_id = ?`;
    params.push(actor.id);
  }
  if (filter === "overdue") {
    sql += ` AND t.due_on < ? AND t.status NOT IN ('done','cancelled')`;
    params.push(now);
  }
  sql += ` ORDER BY t.due_on IS NULL, t.due_on, t.updated_at DESC`;
  return getDb().prepare(sql).all(...params);
}

export function saveTask(
  actor: Actor,
  input: {
    id?: string;
    title: string;
    description: string;
    assigneeUserId: string;
    collaboratorIds: string[];
    departmentId: string | null;
    startsOn: string | null;
    dueOn: string | null;
    priority: string;
    status: string;
    linkedType?: string | null;
    linkedId?: string | null;
  },
) {
  const menu = actor.role === "user" ? "work.user.created" : "work.all";
  assertCan(actor, menu, input.id ? "update" : "create");
  const assignee = getDb().prepare(`SELECT id, status FROM users WHERE id=?`).get(input.assigneeUserId) as { status: string } | undefined;
  if (!assignee || assignee.status !== "active") throw new Error("Người nhận phải là tài khoản đang hoạt động.");
  const groups = getDb()
    .prepare(
      `SELECT g.code FROM permission_group_members m JOIN permission_groups g ON g.id = m.group_id WHERE m.user_id=? AND g.status='active'`,
    )
    .all(input.assigneeUserId) as { code: string }[];
  const assigneeUser = getDb().prepare(`SELECT role FROM users WHERE id=?`).get(input.assigneeUserId) as { role: string };
  const hasWork =
    assigneeUser.role === "admin" ||
    assigneeUser.role === "mod" ||
    groups.some((row) => row.code === "internal_staff");
  const at = nowIso();
  const id = input.id ?? newId();
  if (input.id) {
    const current = getDb().prepare(`SELECT * FROM tasks WHERE id=?`).get(id) as { creator_user_id: string } | undefined;
    if (!current) throw new Error("Không tìm thấy công việc.");
    if (actor.role === "user" && current.creator_user_id !== actor.id && !can(actor, "work.all", "update")) {
      throw new Error("Không được đổi người phụ trách hoặc hạn nếu không có quyền.");
    }
    getDb()
      .prepare(
        `UPDATE tasks SET title=?, description=?, assignee_user_id=?, department_id=?, starts_on=?, due_on=?, priority=?, status=?, updated_at=? WHERE id=?`,
      )
      .run(input.title, input.description, input.assigneeUserId, input.departmentId, input.startsOn, input.dueOn, input.priority, input.status, at, id);
  } else {
    getDb()
      .prepare(
        `INSERT INTO tasks (id, code, title, description, creator_user_id, assignee_user_id, department_id, starts_on, due_on, priority, status, linked_type, linked_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        id,
        nextTaskCode(),
        input.title,
        input.description,
        actor.id,
        input.assigneeUserId,
        input.departmentId,
        input.startsOn,
        input.dueOn,
        input.priority,
        input.status,
        input.linkedType ?? null,
        input.linkedId ?? null,
        at,
        at,
      );
  }
  getDb().prepare(`DELETE FROM task_collaborators WHERE task_id=?`).run(id);
  for (const userId of input.collaboratorIds) {
    getDb().prepare(`INSERT OR IGNORE INTO task_collaborators (task_id, user_id) VALUES (?, ?)`).run(id, userId);
  }
  notifyUsers([input.assigneeUserId, ...input.collaboratorIds], {
    type: "task",
    title: "Công việc được giao",
    body: input.title,
    href: actor.role === "user" ? "/lam-viec" : "/admin/cong-viec",
    refId: id,
  });
  writeAudit({ actorUserId: actor.id, action: "task.save", entityType: "task", entityId: id, summary: `Giao việc ${input.title}.` });
  return {
    id,
    warning: hasWork ? null : "Người nhận chưa có menu Công việc. Yêu cầu Admin cấp nhóm Nhân sự nội bộ.",
  };
}

export function updateTaskStatus(actor: Actor, id: string, status: string) {
  const task = getDb().prepare(`SELECT * FROM tasks WHERE id=?`).get(id) as {
    assignee_user_id: string;
    creator_user_id: string;
    department_id: string | null;
  };
  assertCan(actor, actor.role === "user" ? "work.user.mine" : "work.mine", "update", {
    assigneeUserId: task.assignee_user_id,
    ownerUserId: task.creator_user_id,
    departmentId: task.department_id,
  });
  getDb().prepare(`UPDATE tasks SET status=?, updated_at=? WHERE id=?`).run(status, nowIso(), id);
}

export function addTaskComment(actor: Actor, taskId: string, body: string) {
  getDb()
    .prepare(`INSERT INTO task_comments (id, task_id, body, file_id, created_at, created_by) VALUES (?, ?, ?, NULL, ?, ?)`)
    .run(newId(), taskId, body, nowIso(), actor.id);
}

export function toggleChecklist(actor: Actor, id: string, done: boolean) {
  getDb().prepare(`UPDATE task_checklist SET done=? WHERE id=?`).run(done ? 1 : 0, id);
  void actor;
}

export function addChecklist(actor: Actor, taskId: string, title: string) {
  getDb().prepare(`INSERT INTO task_checklist (id, task_id, title, done, sort_order) VALUES (?, ?, ?, 0, 0)`).run(newId(), taskId, title);
  void actor;
}
