import { getDb, nowIso, newId } from "@/platform/db/client";
import { assertCan, type Actor } from "@/platform/permissions/evaluate";
import { notifyUsers } from "@/platform/notify/service";
import { scheduleNotification } from "@/platform/notify/service";

export function saveAssignment(
  actor: Actor,
  input: {
    id?: string;
    classId: string;
    title: string;
    instructions: string;
    mode: "individual" | "group";
    dueAt: string | null;
    allowLate: boolean;
    maxAttempts: number;
    maxScore: number;
    required: boolean;
  },
) {
  assertCan(actor, "lms.assignments", input.id ? "update" : "create", { classId: input.classId });
  const at = nowIso();
  const id = input.id ?? newId();
  if (input.id) {
    getDb()
      .prepare(
        `UPDATE lms_assignments SET title=?, instructions=?, mode=?, due_at=?, allow_late=?, max_attempts=?, max_score=?, required=?, updated_at=? WHERE id=?`,
      )
      .run(input.title, input.instructions, input.mode, input.dueAt, input.allowLate ? 1 : 0, input.maxAttempts, input.maxScore, input.required ? 1 : 0, at, id);
  } else {
    getDb()
      .prepare(
        `INSERT INTO lms_assignments (id, class_id, version_id, title, instructions, file_id, mode, opens_at, due_at, allow_late, max_attempts, submission_types, rubric, max_score, weight, required, created_at, updated_at, created_by)
         VALUES (?, ?, NULL, ?, ?, NULL, ?, ?, ?, ?, ?, '["text","file","link"]', '[]', ?, 1, ?, ?, ?, ?)`,
      )
      .run(id, input.classId, input.title, input.instructions, input.mode, at, input.dueAt, input.allowLate ? 1 : 0, input.maxAttempts, input.maxScore, input.required ? 1 : 0, at, at, actor.id);
  }
  if (input.dueAt) {
    const fire = new Date(new Date(input.dueAt).getTime() - 24 * 60 * 60 * 1000).toISOString();
    scheduleNotification("assignment_due", id, fire);
  }
  return id;
}

export function submitAssignment(
  userId: string,
  input: { assignmentId: string; enrollmentId: string; textBody: string; linkUrl: string; fileId: string | null; confirm: boolean },
) {
  if (!input.confirm) throw new Error("Cần xác nhận trước khi nộp bài.");
  const enrollment = getDb().prepare(`SELECT * FROM lms_enrollments WHERE id=? AND user_id=?`).get(input.enrollmentId, userId) as
    | { id: string; status: string; class_id: string }
    | undefined;
  if (!enrollment || enrollment.status !== "active") throw new Error("Không thể nộp bài.");
  const assignment = getDb().prepare(`SELECT * FROM lms_assignments WHERE id=?`).get(input.assignmentId) as {
    class_id: string;
    due_at: string | null;
    allow_late: number;
    max_attempts: number;
    mode: string;
  };
  if (assignment.class_id !== enrollment.class_id) throw new Error("Bài tập không thuộc lớp của bạn.");
  const now = nowIso();
  if (assignment.due_at && assignment.due_at < now && !assignment.allow_late) {
    throw new Error("Đã hết hạn nộp và lớp không cho nộp trễ.");
  }
  const previous = getDb()
    .prepare(`SELECT MAX(version_no) AS n FROM lms_submissions WHERE assignment_id=? AND enrollment_id=?`)
    .get(input.assignmentId, input.enrollmentId) as { n: number | null };
  const version = (previous.n ?? 0) + 1;
  if (version > assignment.max_attempts) throw new Error("Đã hết số lần nộp lại.");
  const group = assignment.mode === "group"
    ? (getDb()
        .prepare(
          `SELECT g.id FROM lms_study_groups g JOIN lms_study_group_members m ON m.group_id = g.id WHERE g.class_id=? AND m.enrollment_id=?`,
        )
        .get(enrollment.class_id, enrollment.id) as { id: string } | undefined)
    : null;
  const members = group
    ? (getDb()
        .prepare(
          `SELECT p.full_name, m.enrollment_id FROM lms_study_group_members m JOIN lms_enrollments e ON e.id = m.enrollment_id JOIN learner_profiles p ON p.id = e.learner_profile_id WHERE m.group_id=?`,
        )
        .all(group.id) as { full_name: string; enrollment_id: string }[])
    : [];
  const id = newId();
  getDb()
    .prepare(
      `INSERT INTO lms_submissions (id, assignment_id, enrollment_id, study_group_id, member_snapshot, version_no, status, text_body, link_url, file_id, submitted_at, created_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, 'submitted', ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.assignmentId,
      input.enrollmentId,
      group?.id ?? null,
      JSON.stringify(members),
      version,
      input.textBody,
      input.linkUrl,
      input.fileId,
      now,
      now,
      userId,
    );
  return { id, version };
}

export function gradeSubmission(
  actor: Actor,
  input: { submissionId: string; score: number; comment: string; status: "draft" | "published"; reason?: string },
) {
  const submission = getDb()
    .prepare(
      `SELECT s.*, a.class_id FROM lms_submissions s JOIN lms_assignments a ON a.id = s.assignment_id WHERE s.id=?`,
    )
    .get(input.submissionId) as { id: string; class_id: string; enrollment_id: string; assignment_id: string } | undefined;
  if (!submission) throw new Error("Không tìm thấy bài nộp.");
  assertCan(actor, "lms.assignments", "grade", { classId: submission.class_id });
  const at = nowIso();
  const existing = getDb().prepare(`SELECT * FROM lms_grades WHERE submission_id=?`).get(input.submissionId) as { id: string; score: number | null } | undefined;
  const gradeId = existing?.id ?? newId();
  if (existing) {
    getDb()
      .prepare(`INSERT INTO lms_grade_history (id, grade_id, score, comment, status, changed_by, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(newId(), existing.id, existing.score, "", "draft", actor.id, input.reason ?? "Cập nhật điểm", at);
    getDb()
      .prepare(`UPDATE lms_grades SET score=?, comment=?, status=?, graded_by=?, graded_at=?, change_reason=? WHERE id=?`)
      .run(input.score, input.comment, input.status, actor.id, at, input.reason ?? "", existing.id);
  } else {
    getDb()
      .prepare(
        `INSERT INTO lms_grades (id, submission_id, rubric_scores, score, comment, status, graded_by, graded_at, change_reason) VALUES (?, ?, '{}', ?, ?, ?, ?, ?, ?)`,
      )
      .run(gradeId, input.submissionId, input.score, input.comment, input.status, actor.id, at, input.reason ?? "");
  }
  if (input.status === "published") {
    getDb().prepare(`UPDATE lms_submissions SET status='graded' WHERE id=?`).run(input.submissionId);
    const enrollment = getDb().prepare(`SELECT user_id FROM lms_enrollments WHERE id=?`).get(submission.enrollment_id) as { user_id: string | null };
    if (enrollment.user_id) {
      notifyUsers([enrollment.user_id], {
        type: "graded",
        title: "Bài tập đã được chấm",
        body: "Kết quả đã được công bố.",
        href: "/hoc-tap/ket-qua",
        refId: input.submissionId,
      });
    }
  }
  return gradeId;
}

export function pendingGrading(actor: Actor) {
  const params = actor.role === "user" ? actor.assignedClassIds : null;
  const rows = getDb()
    .prepare(
      `SELECT s.*, a.title, a.class_id, p.full_name
       FROM lms_submissions s
       JOIN lms_assignments a ON a.id = s.assignment_id
       JOIN lms_enrollments e ON e.id = s.enrollment_id
       JOIN learner_profiles p ON p.id = e.learner_profile_id
       LEFT JOIN lms_grades g ON g.submission_id = s.id AND g.status='published'
       WHERE s.status='submitted' AND g.id IS NULL
       ${params ? `AND a.class_id IN (${params.map(() => "?").join(",") || "''"})` : ""}
       ORDER BY s.submitted_at`,
    )
    .all(...(params && params.length ? params : []));
  return params && !params.length && actor.role === "user" ? [] : rows;
}

export function publishedGradeForLearner(enrollmentId: string, assignmentId: string) {
  return getDb()
    .prepare(
      `SELECT g.score, g.comment, g.status, s.version_no, s.submitted_at
       FROM lms_submissions s
       JOIN lms_grades g ON g.submission_id = s.id
       WHERE s.enrollment_id=? AND s.assignment_id=? AND g.status='published'
       ORDER BY s.version_no DESC LIMIT 1`,
    )
    .get(enrollmentId, assignmentId);
}

export function saveEval3W(
  actor: Actor,
  input: { enrollmentId: string; dimension: "WOW" | "WELL" | "WIN"; criteria: string; evidence: string; comment: string; status: "draft" | "published" },
) {
  const enrollment = getDb().prepare(`SELECT class_id FROM lms_enrollments WHERE id=?`).get(input.enrollmentId) as { class_id: string };
  assertCan(actor, "lms.results", "grade", { classId: enrollment.class_id });
  const at = nowIso();
  getDb()
    .prepare(
      `INSERT INTO lms_eval_3w (id, enrollment_id, dimension, criteria, evidence, comment, evaluator_user_id, evaluated_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(enrollment_id, dimension) DO UPDATE SET criteria=excluded.criteria, evidence=excluded.evidence, comment=excluded.comment, evaluator_user_id=excluded.evaluator_user_id, evaluated_at=excluded.evaluated_at, status=excluded.status`,
    )
    .run(newId(), input.enrollmentId, input.dimension, input.criteria, input.evidence, input.comment, actor.id, at, input.status);
}
