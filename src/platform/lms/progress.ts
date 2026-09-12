import { getDb, nowIso, newId } from "@/platform/db/client";
import { getVersionBundle, parseRules } from "./courses";

export function enrollmentForUser(userId: string, classId: string) {
  return getDb()
    .prepare(
      `SELECT e.*, c.version_id, c.name AS class_name, c.meeting_url, c.access_until AS class_access, c.status AS class_status
       FROM lms_enrollments e
       JOIN lms_classes c ON c.id = e.class_id
       WHERE e.user_id = ? AND e.class_id = ?`,
    )
    .get(userId, classId) as Record<string, unknown> | undefined;
}

export function myEnrollments(userId: string) {
  return getDb()
    .prepare(
      `SELECT e.*, c.name AS class_name, c.code AS class_code, k.name AS course_name, c.starts_on, c.ends_on, c.status AS class_status
       FROM lms_enrollments e
       JOIN lms_classes c ON c.id = e.class_id
       JOIN lms_courses k ON k.id = c.course_id
       WHERE e.user_id = ? AND e.status IN ('active','completed','paused','pending')
       ORDER BY c.starts_on DESC`,
    )
    .all(userId);
}

export function teachingClasses(userId: string) {
  return getDb()
    .prepare(
      `SELECT c.*, s.role AS staff_role, k.name AS course_name
       FROM lms_class_staff s
       JOIN lms_classes c ON c.id = s.class_id
       JOIN lms_courses k ON k.id = c.course_id
       WHERE s.user_id = ?
       ORDER BY c.starts_on DESC`,
    )
    .all(userId);
}

export function canAccessClass(userId: string, classId: string, role: string) {
  if (role === "admin" || role === "mod") return true;
  const staff = getDb().prepare(`SELECT 1 FROM lms_class_staff WHERE class_id=? AND user_id=?`).get(classId, userId);
  if (staff) return true;
  const enrolled = enrollmentForUser(userId, classId);
  return Boolean(enrolled && ["active", "completed", "paused"].includes(String(enrolled.status)));
}

export function lessonUnlocked(enrollmentId: string, lesson: {
  id: string;
  unlock_rule: string;
  unlock_at: string | null;
  prerequisite_lesson_id: string | null;
  status: string;
}) {
  if (lesson.status !== "published") return { open: false, reason: "Bài học chưa xuất bản." };
  if (lesson.unlock_rule === "immediate") return { open: true, reason: null };
  if (lesson.unlock_rule === "after_date") {
    if (!lesson.unlock_at || lesson.unlock_at > nowIso()) {
      return { open: false, reason: "Bài học mở theo lịch. Chưa đến thời điểm cho phép." };
    }
    return { open: true, reason: null };
  }
  if (lesson.unlock_rule === "after_prerequisite" && lesson.prerequisite_lesson_id) {
    const prev = getDb()
      .prepare(`SELECT status FROM lms_progress WHERE enrollment_id=? AND lesson_id=?`)
      .get(enrollmentId, lesson.prerequisite_lesson_id) as { status: string } | undefined;
    if (prev?.status !== "completed") return { open: false, reason: "Cần hoàn thành bài học tiên quyết trước." };
  }
  return { open: true, reason: null };
}

export function confirmLesson(userId: string, enrollmentId: string, lessonId: string) {
  const enrollment = getDb().prepare(`SELECT * FROM lms_enrollments WHERE id=? AND user_id=?`).get(enrollmentId, userId) as
    | { id: string; status: string }
    | undefined;
  if (!enrollment || !["active", "paused"].includes(enrollment.status)) throw new Error("Không có quyền học bài này.");
  const lesson = getDb().prepare(`SELECT * FROM lms_lessons WHERE id=?`).get(lessonId) as {
    id: string;
    completion_rule: string;
    unlock_rule: string;
    unlock_at: string | null;
    prerequisite_lesson_id: string | null;
    status: string;
  };
  const gate = lessonUnlocked(enrollmentId, lesson);
  if (!gate.open) throw new Error(gate.reason ?? "Bài học đang khóa.");
  if (!["confirm", "video_confirm"].includes(lesson.completion_rule)) {
    throw new Error("Bài này hoàn thành theo quy tắc bài tập hoặc kiểm tra, không xác nhận thủ công.");
  }
  const at = nowIso();
  getDb()
    .prepare(
      `INSERT INTO lms_progress (id, enrollment_id, lesson_id, status, evidence_type, completed_at, updated_at)
       VALUES (?, ?, ?, 'completed', ?, ?, ?)
       ON CONFLICT(enrollment_id, lesson_id) DO UPDATE SET status='completed', evidence_type=excluded.evidence_type, completed_at=excluded.completed_at, updated_at=excluded.updated_at`,
    )
    .run(newId(), enrollmentId, lessonId, lesson.completion_rule, at, at);
}

export function savePrivateNote(userId: string, enrollmentId: string, lessonId: string, body: string) {
  const enrollment = getDb().prepare(`SELECT id FROM lms_enrollments WHERE id=? AND user_id=?`).get(enrollmentId, userId);
  if (!enrollment) throw new Error("Không lưu được ghi chú.");
  getDb()
    .prepare(
      `INSERT INTO lms_lesson_notes (id, enrollment_id, lesson_id, body, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(enrollment_id, lesson_id) DO UPDATE SET body=excluded.body, updated_at=excluded.updated_at`,
    )
    .run(newId(), enrollmentId, lessonId, body, nowIso());
}

export function attendanceRate(enrollmentId: string) {
  const rows = getDb()
    .prepare(
      `SELECT a.status FROM lms_attendance a
       JOIN lms_schedules s ON s.id = a.schedule_id
       JOIN lms_enrollments e ON e.id = a.enrollment_id
       WHERE a.enrollment_id = ?`,
    )
    .all(enrollmentId) as { status: string }[];
  const counted = rows.filter((row) => row.status !== "excused");
  if (!counted.length) return { percent: null as number | null, present: 0, total: 0, formula: "Tỷ lệ chuyên cần = (có mặt + đi muộn) / (có mặt + đi muộn + vắng). Vắng có phép không tính vào mẫu số." };
  const present = counted.filter((row) => row.status === "present" || row.status === "late").length;
  return {
    percent: Math.round((present / counted.length) * 1000) / 10,
    present,
    total: counted.length,
    formula: "Tỷ lệ chuyên cần = (có mặt + đi muộn) / (có mặt + đi muộn + vắng). Vắng có phép không tính vào mẫu số.",
  };
}

export function contentProgress(enrollmentId: string) {
  const enrollment = getDb()
    .prepare(`SELECT e.*, c.version_id, c.completion_rules FROM lms_enrollments e JOIN lms_classes c ON c.id = e.class_id WHERE e.id=?`)
    .get(enrollmentId) as { version_id: string; completion_rules: string } | undefined;
  if (!enrollment) return { percent: 0, completed: 0, required: 0 };
  const bundle = getVersionBundle(enrollment.version_id);
  const required = (bundle?.lessons as { id: string; required: number; status: string }[] | undefined)?.filter(
    (lesson) => lesson.required && lesson.status === "published",
  ) ?? [];
  if (!required.length) return { percent: 0, completed: 0, required: 0 };
  const done = getDb()
    .prepare(`SELECT lesson_id FROM lms_progress WHERE enrollment_id=? AND status='completed'`)
    .all(enrollmentId) as { lesson_id: string }[];
  const doneSet = new Set(done.map((row) => row.lesson_id));
  const completed = required.filter((lesson) => doneSet.has(lesson.id)).length;
  return { percent: Math.round((completed / required.length) * 1000) / 10, completed, required: required.length };
}

export function completionState(enrollmentId: string) {
  const enrollment = getDb()
    .prepare(`SELECT e.*, c.completion_rules, c.version_id FROM lms_enrollments e JOIN lms_classes c ON c.id = e.class_id WHERE e.id=?`)
    .get(enrollmentId) as { completion_rules: string; version_id: string; status: string } | undefined;
  if (!enrollment) throw new Error("Không tìm thấy ghi danh.");
  const rules = parseRules(enrollment.completion_rules);
  const content = contentProgress(enrollmentId);
  const attendance = attendanceRate(enrollmentId);
  const requiredAssignments = getDb()
    .prepare(
      `SELECT a.id FROM lms_assignments a JOIN lms_enrollments e ON e.class_id = a.class_id WHERE e.id=? AND a.required=1`,
    )
    .all(enrollmentId) as { id: string }[];
  const graded = requiredAssignments.filter((item) => {
    const grade = getDb()
      .prepare(
        `SELECT g.status FROM lms_grades g JOIN lms_submissions s ON s.id = g.submission_id
         WHERE s.assignment_id=? AND s.enrollment_id=? AND g.status='published' AND s.status='graded'
         ORDER BY s.version_no DESC LIMIT 1`,
      )
      .get(item.id, enrollmentId) as { status: string } | undefined;
    return grade?.status === "published";
  });
  const contentDone = content.percent >= rules.contentPercent;
  const attendanceDone = attendance.percent == null ? !rules.attendancePercent : attendance.percent >= rules.attendancePercent;
  const assignmentsDone = !rules.requiredAssignments || graded.length === requiredAssignments.length;
  const eval3w = getDb().prepare(`SELECT dimension, status FROM lms_eval_3w WHERE enrollment_id=?`).all(enrollmentId) as {
    dimension: string;
    status: string;
  }[];
  const wowWellWin = !rules.require3w || ["WOW", "WELL", "WIN"].every((dim) => eval3w.some((row) => row.dimension === dim && row.status === "published"));
  const contentComplete = contentDone;
  const coursePassed = contentDone && attendanceDone && assignmentsDone && wowWellWin;
  return {
    content,
    attendance,
    assignments: { required: requiredAssignments.length, graded: graded.length },
    rules,
    contentComplete,
    coursePassed,
    definitions: {
      contentComplete: "Đã hoàn thành nội dung: đủ tỷ lệ bài bắt buộc của phiên bản giáo trình đang học.",
      coursePassed: "Đạt khóa học: đủ điều kiện hoàn thành của lớp (nội dung, chuyên cần, bài tập, 3W nếu có).",
    },
  };
}

export function continueLesson(userId: string) {
  const enrollments = myEnrollments(userId) as { id: string; class_id: string; version_id?: string }[];
  for (const enrollment of enrollments) {
    const row = getDb()
      .prepare(`SELECT version_id FROM lms_classes WHERE id=?`)
      .get(enrollment.class_id) as { version_id: string };
    const bundle = getVersionBundle(row.version_id);
    const lessons = (bundle?.lessons as { id: string; title: string; required: number; status: string }[]) ?? [];
    const done = new Set(
      (getDb().prepare(`SELECT lesson_id FROM lms_progress WHERE enrollment_id=? AND status='completed'`).all(enrollment.id) as { lesson_id: string }[]).map(
        (item) => item.lesson_id,
      ),
    );
    const next = lessons.find((lesson) => lesson.status === "published" && !done.has(lesson.id));
    if (next) return { enrollmentId: enrollment.id, classId: enrollment.class_id, lessonId: next.id, title: next.title };
  }
  return null;
}
