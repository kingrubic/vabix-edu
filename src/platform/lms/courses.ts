import { getDb, nowIso, newId, tx } from "@/platform/db/client";
import { writeAudit } from "@/platform/audit";
import { assertCan, type Actor } from "@/platform/permissions/evaluate";
import { parseJson } from "@/platform/sanitize";

export const DEFAULT_COMPLETION = {
  contentPercent: 80,
  attendancePercent: 70,
  requiredAssignments: true,
  require3w: false,
  requireApproval: false,
};

export function listCourses() {
  return getDb().prepare(`SELECT * FROM lms_courses ORDER BY updated_at DESC`).all();
}

export function getCourse(id: string) {
  return getDb().prepare(`SELECT * FROM lms_courses WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
}

export function saveCourse(
  actor: Actor,
  input: {
    id?: string;
    code: string;
    name: string;
    description: string;
    publicProgramSlug: string;
    format: string;
    durationNote: string;
    status: "draft" | "published" | "archived";
  },
) {
  assertCan(actor, "lms.courses", input.id ? "update" : "create");
  const at = nowIso();
  return tx((db) => {
    if (input.id) {
      db.prepare(
        `UPDATE lms_courses SET code=?, name=?, description=?, public_program_slug=?, format=?, duration_note=?, status=?, updated_at=?, updated_by=? WHERE id=?`,
      ).run(
        input.code,
        input.name,
        input.description,
        input.publicProgramSlug,
        input.format,
        input.durationNote,
        input.status,
        at,
        actor.id,
        input.id,
      );
      writeAudit({ actorUserId: actor.id, action: "course.update", entityType: "lms_course", entityId: input.id, summary: `Cập nhật khóa ${input.name}.` });
      return input.id;
    }
    const id = newId();
    db.prepare(
      `INSERT INTO lms_courses (id, code, name, cover_file_id, description, public_program_slug, audience, objectives, outcomes, format, duration_note, prerequisites, owner_user_id, status, completion_rules, created_at, updated_at, created_by, updated_by)
       VALUES (?, ?, ?, NULL, ?, ?, '', '[]', '[]', ?, ?, '', ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      input.code,
      input.name,
      input.description,
      input.publicProgramSlug,
      input.format,
      input.durationNote,
      actor.id,
      input.status,
      JSON.stringify(DEFAULT_COMPLETION),
      at,
      at,
      actor.id,
      actor.id,
    );
    const versionId = newId();
    db.prepare(
      `INSERT INTO lms_course_versions (id, course_id, version_number, status, summary, completion_rules, created_at, created_by, published_at)
       VALUES (?, ?, 1, 'draft', 'Bản nháp ban đầu', ?, ?, ?, NULL)`,
    ).run(versionId, id, JSON.stringify(DEFAULT_COMPLETION), at, actor.id);
    writeAudit({ actorUserId: actor.id, action: "course.create", entityType: "lms_course", entityId: id, summary: `Tạo khóa ${input.name}.` });
    return id;
  });
}

export function listVersions(courseId: string) {
  return getDb()
    .prepare(`SELECT * FROM lms_course_versions WHERE course_id = ? ORDER BY version_number DESC`)
    .all(courseId);
}

export function getVersionBundle(versionId: string) {
  const version = getDb().prepare(`SELECT * FROM lms_course_versions WHERE id = ?`).get(versionId) as
    | { id: string; course_id: string; version_number: number; status: string; completion_rules: string }
    | undefined;
  if (!version) return null;
  const modules = getDb()
    .prepare(`SELECT * FROM lms_modules WHERE version_id = ? ORDER BY sort_order`)
    .all(versionId) as { id: string }[];
  const lessons = getDb()
    .prepare(
      `SELECT l.* FROM lms_lessons l JOIN lms_modules m ON m.id = l.module_id WHERE m.version_id = ? ORDER BY m.sort_order, l.sort_order`,
    )
    .all(versionId);
  return { version, modules, lessons };
}

export function saveModule(actor: Actor, input: { id?: string; versionId: string; title: string; required: boolean; sortOrder: number }) {
  assertCan(actor, "lms.courses", input.id ? "update" : "create");
  const version = getDb().prepare(`SELECT status FROM lms_course_versions WHERE id = ?`).get(input.versionId) as { status: string } | undefined;
  if (!version) throw new Error("Không tìm thấy phiên bản giáo trình.");
  if (version.status !== "draft") throw new Error("Chỉ sửa giáo trình ở bản nháp. Hãy tạo phiên bản mới.");
  if (input.id) {
    getDb().prepare(`UPDATE lms_modules SET title=?, required=?, sort_order=? WHERE id=?`).run(input.title, input.required ? 1 : 0, input.sortOrder, input.id);
    return input.id;
  }
  const id = newId();
  getDb()
    .prepare(`INSERT INTO lms_modules (id, version_id, title, description, sort_order, required) VALUES (?, ?, ?, '', ?, ?)`)
    .run(id, input.versionId, input.title, input.sortOrder, input.required ? 1 : 0);
  return id;
}

export function saveLesson(
  actor: Actor,
  input: {
    id?: string;
    moduleId: string;
    title: string;
    kind: string;
    body: string;
    resourceUrl: string;
    required: boolean;
    sortOrder: number;
    unlockRule: string;
    unlockAt?: string | null;
    prerequisiteLessonId?: string | null;
    completionRule: string;
  },
) {
  assertCan(actor, "lms.lessons", input.id ? "update" : "create");
  const moduleRow = getDb().prepare(`SELECT version_id FROM lms_modules WHERE id = ?`).get(input.moduleId) as { version_id: string } | undefined;
  if (!moduleRow) throw new Error("Không tìm thấy chuyên đề.");
  const version = getDb().prepare(`SELECT status FROM lms_course_versions WHERE id = ?`).get(moduleRow.version_id) as { status: string };
  if (version.status !== "draft") throw new Error("Chỉ sửa bài học trên bản nháp giáo trình.");
  if (input.id) {
    getDb()
      .prepare(
        `UPDATE lms_lessons SET title=?, kind=?, body=?, resource_url=?, required=?, sort_order=?, unlock_rule=?, unlock_at=?, prerequisite_lesson_id=?, completion_rule=? WHERE id=?`,
      )
      .run(
        input.title,
        input.kind,
        input.body,
        input.resourceUrl,
        input.required ? 1 : 0,
        input.sortOrder,
        input.unlockRule,
        input.unlockAt ?? null,
        input.prerequisiteLessonId ?? null,
        input.completionRule,
        input.id,
      );
    return input.id;
  }
  const id = newId();
  getDb()
    .prepare(
      `INSERT INTO lms_lessons (id, module_id, title, description, kind, body, resource_url, file_id, duration_minutes, sort_order, required, status, unlock_rule, unlock_at, prerequisite_lesson_id, completion_rule, assignment_id, quiz_id)
       VALUES (?, ?, ?, '', ?, ?, ?, NULL, NULL, ?, ?, 'published', ?, ?, ?, ?, NULL, NULL)`,
    )
    .run(
      id,
      input.moduleId,
      input.title,
      input.kind,
      input.body,
      input.resourceUrl,
      input.sortOrder,
      input.required ? 1 : 0,
      input.unlockRule,
      input.unlockAt ?? null,
      input.prerequisiteLessonId ?? null,
      input.completionRule,
    );
  return id;
}

export function reorderLessons(actor: Actor, moduleId: string, lessonIds: string[]) {
  assertCan(actor, "lms.courses", "update");
  const apply = getDb().transaction(() => {
    lessonIds.forEach((id, index) => {
      getDb().prepare(`UPDATE lms_lessons SET sort_order = ? WHERE id = ? AND module_id = ?`).run(index, id, moduleId);
    });
  });
  apply();
}

export function publishVersion(actor: Actor, versionId: string) {
  assertCan(actor, "lms.courses", "approve");
  getDb()
    .prepare(`UPDATE lms_course_versions SET status='published', published_at=? WHERE id=?`)
    .run(nowIso(), versionId);
  writeAudit({ actorUserId: actor.id, action: "curriculum.publish", entityType: "lms_course_version", entityId: versionId, summary: "Xuất bản phiên bản giáo trình." });
}

export function cloneVersion(actor: Actor, versionId: string) {
  assertCan(actor, "lms.courses", "create");
  const bundle = getVersionBundle(versionId);
  if (!bundle) throw new Error("Không tìm thấy phiên bản.");
  const at = nowIso();
  return tx((db) => {
    const max = (db.prepare(`SELECT MAX(version_number) AS n FROM lms_course_versions WHERE course_id = ?`).get(bundle.version.course_id) as { n: number }).n;
    const newVersionId = newId();
    db.prepare(
      `INSERT INTO lms_course_versions (id, course_id, version_number, status, summary, completion_rules, created_at, created_by, published_at)
       VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, NULL)`,
    ).run(
      newVersionId,
      bundle.version.course_id,
      max + 1,
      `Nháp từ phiên bản ${bundle.version.version_number}`,
      bundle.version.completion_rules,
      at,
      actor.id,
    );
    const moduleMap = new Map<string, string>();
    for (const mod of bundle.modules as { id: string; title: string; description: string; sort_order: number; required: number }[]) {
      const nid = newId();
      moduleMap.set(mod.id, nid);
      db.prepare(`INSERT INTO lms_modules (id, version_id, title, description, sort_order, required) VALUES (?, ?, ?, ?, ?, ?)`).run(
        nid,
        newVersionId,
        mod.title,
        mod.description,
        mod.sort_order,
        mod.required,
      );
    }
    for (const lesson of bundle.lessons as { module_id: string; title: string; description: string; kind: string; body: string; resource_url: string; sort_order: number; required: number; status: string; unlock_rule: string; completion_rule: string }[]) {
      db.prepare(
        `INSERT INTO lms_lessons (id, module_id, title, description, kind, body, resource_url, file_id, duration_minutes, sort_order, required, status, unlock_rule, unlock_at, prerequisite_lesson_id, completion_rule, assignment_id, quiz_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, NULL, NULL, ?, NULL, NULL)`,
      ).run(
        newId(),
        moduleMap.get(lesson.module_id),
        lesson.title,
        lesson.description,
        lesson.kind,
        lesson.body,
        lesson.resource_url,
        lesson.sort_order,
        lesson.required,
        lesson.status,
        lesson.unlock_rule,
        lesson.completion_rule,
      );
    }
    return newVersionId;
  });
}

export function versionImpact(versionId: string) {
  const classes = getDb()
    .prepare(`SELECT id, code, name, status FROM lms_classes WHERE version_id = ?`)
    .all(versionId) as { id: string; status: string }[];
  const active = classes.filter((row) => row.status === "in_progress" || row.status === "upcoming");
  return { classCount: classes.length, activeCount: active.length, classes };
}

export function parseRules(raw: string | null | undefined) {
  return { ...DEFAULT_COMPLETION, ...parseJson(raw, {}) };
}
