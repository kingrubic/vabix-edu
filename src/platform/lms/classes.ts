import { getDb, nowIso, newId } from "@/platform/db/client";
import { writeAudit } from "@/platform/audit";
import { assertCan, type Actor } from "@/platform/permissions/evaluate";
import { endsAfterStart } from "@/platform/time";
import { notifyUsers } from "@/platform/notify/service";

export function listClasses() {
  return getDb()
    .prepare(
      `SELECT c.*, k.name AS course_name, v.version_number,
        (SELECT COUNT(*) FROM lms_enrollments e WHERE e.class_id = c.id AND e.status IN ('pending','active','completed','paused')) AS enrollment_count
       FROM lms_classes c
       JOIN lms_courses k ON k.id = c.course_id
       JOIN lms_course_versions v ON v.id = c.version_id
       ORDER BY c.updated_at DESC`,
    )
    .all();
}

export function getClass(id: string) {
  return getDb()
    .prepare(
      `SELECT c.*, k.name AS course_name, v.version_number, v.completion_rules AS version_rules
       FROM lms_classes c
       JOIN lms_courses k ON k.id = c.course_id
       JOIN lms_course_versions v ON v.id = c.version_id
       WHERE c.id = ?`,
    )
    .get(id) as Record<string, unknown> | undefined;
}

export function saveClass(
  actor: Actor,
  input: {
    id?: string;
    code: string;
    name: string;
    courseId: string;
    versionId: string;
    format: string;
    startsOn: string | null;
    endsOn: string | null;
    location: string;
    meetingUrl: string;
    capacity: number | null;
    status: string;
  },
) {
  assertCan(actor, "lms.classes", input.id ? "update" : "create");
  if (input.startsOn && input.endsOn && !endsAfterStart(input.startsOn, input.endsOn)) {
    throw new Error("Ngày kết thúc phải sau ngày bắt đầu.");
  }
  const version = getDb().prepare(`SELECT status FROM lms_course_versions WHERE id = ? AND course_id = ?`).get(input.versionId, input.courseId) as
    | { status: string }
    | undefined;
  if (!version) throw new Error("Phiên bản giáo trình không thuộc khóa đã chọn.");
  const at = nowIso();
  if (input.id) {
    getDb()
      .prepare(
        `UPDATE lms_classes SET code=?, name=?, course_id=?, version_id=?, format=?, starts_on=?, ends_on=?, location=?, meeting_url=?, capacity=?, status=?, updated_at=?, updated_by=? WHERE id=?`,
      )
      .run(
        input.code,
        input.name,
        input.courseId,
        input.versionId,
        input.format,
        input.startsOn,
        input.endsOn,
        input.location,
        input.meetingUrl,
        input.capacity,
        input.status,
        at,
        actor.id,
        input.id,
      );
    writeAudit({ actorUserId: actor.id, action: "class.update", entityType: "lms_class", entityId: input.id, summary: `Cập nhật lớp ${input.name}.` });
    return input.id;
  }
  const id = newId();
  getDb()
    .prepare(
      `INSERT INTO lms_classes (id, code, name, public_program_slug, course_id, version_id, format, starts_on, ends_on, location, meeting_url, capacity, status, access_until, completion_rules, created_at, updated_at, created_by, updated_by)
       VALUES (?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, '{}', ?, ?, ?, ?)`,
    )
    .run(
      id,
      input.code,
      input.name,
      input.courseId,
      input.versionId,
      input.format,
      input.startsOn,
      input.endsOn,
      input.location,
      input.meetingUrl,
      input.capacity,
      input.status,
      at,
      at,
      actor.id,
      actor.id,
    );
  writeAudit({ actorUserId: actor.id, action: "class.create", entityType: "lms_class", entityId: id, summary: `Tạo lớp ${input.name}.` });
  return id;
}

export function classStaff(classId: string) {
  return getDb()
    .prepare(
      `SELECT s.*, u.name, u.email FROM lms_class_staff s JOIN users u ON u.id = s.user_id WHERE s.class_id = ?`,
    )
    .all(classId);
}

export function assignStaff(actor: Actor, classId: string, userId: string, role: "instructor" | "assistant" | "coordinator") {
  assertCan(actor, "lms.staffing", "assign");
  const groups = getDb()
    .prepare(
      `SELECT g.code FROM permission_group_members m JOIN permission_groups g ON g.id = m.group_id WHERE m.user_id = ? AND g.status='active'`,
    )
    .all(userId) as { code: string }[];
  const user = getDb().prepare(`SELECT role FROM users WHERE id = ?`).get(userId) as { role: string } | undefined;
  const hasTeaching = user?.role === "admin" || user?.role === "mod" || groups.some((row) => row.code === "instructor");
  getDb()
    .prepare(
      `INSERT OR IGNORE INTO lms_class_staff (id, class_id, user_id, role, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(newId(), classId, userId, role, nowIso(), actor.id);
  writeAudit({ actorUserId: actor.id, action: "class.assign", entityType: "lms_class", entityId: classId, summary: `Phân công giảng dạy.` });
  return {
    warning: hasTeaching
      ? null
      : "Tài khoản chưa có nhóm quyền Giảng viên. Yêu cầu Admin cấp nhóm phù hợp trước khi người này vào khu giảng dạy.",
  };
}

export function listLearners(q?: string) {
  const like = `%${q ?? ""}%`;
  return getDb()
    .prepare(
      `SELECT * FROM learner_profiles WHERE status='active' AND (full_name LIKE ? OR IFNULL(email,'') LIKE ?) ORDER BY full_name LIMIT 100`,
    )
    .all(like, like);
}

export function saveLearner(
  actor: Actor,
  input: { id?: string; fullName: string; email: string; phone: string; organization: string; accountUserId: string | null; notes: string },
) {
  assertCan(actor, "lms.learners", input.id ? "update" : "create");
  const at = nowIso();
  if (input.accountUserId) {
    const taken = getDb()
      .prepare(`SELECT id FROM learner_profiles WHERE account_user_id = ? AND id != ?`)
      .get(input.accountUserId, input.id ?? "") as { id: string } | undefined;
    if (taken) throw new Error("Tài khoản này đã liên kết hồ sơ học viên khác.");
  }
  if (input.id) {
    getDb()
      .prepare(
        `UPDATE learner_profiles SET full_name=?, email=?, phone=?, organization=?, account_user_id=?, notes=?, updated_at=?, updated_by=? WHERE id=?`,
      )
      .run(input.fullName, input.email, input.phone, input.organization, input.accountUserId, input.notes, at, actor.id, input.id);
    return input.id;
  }
  const id = newId();
  getDb()
    .prepare(
      `INSERT INTO learner_profiles (id, full_name, email, phone, organization, account_user_id, notes, status, created_at, updated_at, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)`,
    )
    .run(id, input.fullName, input.email, input.phone, input.organization, input.accountUserId, input.notes, at, at, actor.id, actor.id);
  return id;
}

export function enroll(actor: Actor, classId: string, learnerProfileId: string) {
  assertCan(actor, "lms.learners", "assign");
  const existing = getDb()
    .prepare(`SELECT id, status FROM lms_enrollments WHERE class_id = ? AND learner_profile_id = ?`)
    .get(classId, learnerProfileId) as { id: string; status: string } | undefined;
  const profile = getDb().prepare(`SELECT account_user_id FROM learner_profiles WHERE id = ?`).get(learnerProfileId) as
    | { account_user_id: string | null }
    | undefined;
  if (!profile) throw new Error("Không tìm thấy hồ sơ học viên.");
  const at = nowIso();
  if (existing) {
    if (existing.status === "withdrawn" || existing.status === "expired") {
      getDb()
        .prepare(`UPDATE lms_enrollments SET status='pending', user_id=?, updated_at=? WHERE id=?`)
        .run(profile.account_user_id, at, existing.id);
      return { id: existing.id, warning: null };
    }
    throw new Error("Học viên đã được ghi danh vào lớp này.");
  }
  const id = newId();
  getDb()
    .prepare(
      `INSERT INTO lms_enrollments (id, class_id, learner_profile_id, user_id, status, enrolled_at, access_until, created_by, updated_at)
       VALUES (?, ?, ?, ?, 'pending', ?, NULL, ?, ?)`,
    )
    .run(id, classId, learnerProfileId, profile.account_user_id, at, actor.id, at);
  const groups = profile.account_user_id
    ? (getDb()
        .prepare(
          `SELECT g.code FROM permission_group_members m JOIN permission_groups g ON g.id = m.group_id WHERE m.user_id = ? AND g.status='active'`,
        )
        .all(profile.account_user_id) as { code: string }[])
    : [];
  const warning = profile.account_user_id && !groups.some((row) => row.code === "learner")
    ? "Tài khoản chưa có nhóm quyền Học viên. Yêu cầu Admin cấp nhóm trước khi học viên vào cổng học tập."
    : !profile.account_user_id
      ? "Hồ sơ chưa liên kết tài khoản. Mod không được tự tạo tài khoản — gửi yêu cầu cho Admin."
      : null;
  if (profile.account_user_id) {
    notifyUsers([profile.account_user_id], {
      type: "enrolled",
      title: "Bạn đã được ghi danh vào lớp",
      body: "Mở cổng học tập để xem lớp của bạn.",
      href: "/hoc-tap",
      refId: id,
    });
  }
  return { id, warning };
}

export function setEnrollmentStatus(actor: Actor, enrollmentId: string, status: string) {
  assertCan(actor, "lms.learners", "update");
  getDb().prepare(`UPDATE lms_enrollments SET status=?, updated_at=? WHERE id=?`).run(status, nowIso(), enrollmentId);
}

export function listEnrollments(classId: string) {
  return getDb()
    .prepare(
      `SELECT e.*, p.full_name, p.email, p.organization, u.name AS account_name
       FROM lms_enrollments e
       JOIN learner_profiles p ON p.id = e.learner_profile_id
       LEFT JOIN users u ON u.id = e.user_id
       WHERE e.class_id = ?
       ORDER BY p.full_name`,
    )
    .all(classId);
}

export function saveSchedule(
  actor: Actor,
  input: {
    id?: string;
    classId: string;
    title: string;
    startsAt: string;
    endsAt: string;
    instructorUserId: string | null;
    location: string;
    meetingUrl: string;
  },
) {
  assertCan(actor, "lms.schedules", input.id ? "update" : "create");
  if (!endsAfterStart(input.startsAt, input.endsAt)) throw new Error("Giờ kết thúc phải sau giờ bắt đầu.");
  const conflicts = input.instructorUserId
    ? (getDb()
        .prepare(
          `SELECT id, title FROM lms_schedules
           WHERE instructor_user_id = ? AND id != ? AND starts_at < ? AND ends_at > ?`,
        )
        .all(input.instructorUserId, input.id ?? "", input.endsAt, input.startsAt) as { title: string }[])
    : [];
  const classConflicts = getDb()
    .prepare(`SELECT id, title FROM lms_schedules WHERE class_id = ? AND id != ? AND starts_at < ? AND ends_at > ?`)
    .all(input.classId, input.id ?? "", input.endsAt, input.startsAt) as { title: string }[];
  const at = nowIso();
  const id = input.id ?? newId();
  if (input.id) {
    getDb()
      .prepare(
        `UPDATE lms_schedules SET title=?, starts_at=?, ends_at=?, instructor_user_id=?, location=?, meeting_url=?, updated_at=? WHERE id=?`,
      )
      .run(input.title, input.startsAt, input.endsAt, input.instructorUserId, input.location, input.meetingUrl, at, id);
  } else {
    getDb()
      .prepare(
        `INSERT INTO lms_schedules (id, class_id, title, body, starts_at, ends_at, instructor_user_id, location, meeting_url, created_at, updated_at, created_by)
         VALUES (?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(id, input.classId, input.title, input.startsAt, input.endsAt, input.instructorUserId, input.location, input.meetingUrl, at, at, actor.id);
  }
  const classRow = getClass(input.classId);
  const users = (getDb()
    .prepare(`SELECT user_id FROM lms_enrollments WHERE class_id = ? AND user_id IS NOT NULL AND status IN ('active','pending')`)
    .all(input.classId) as { user_id: string }[])
    .map((row) => row.user_id);
  notifyUsers(users, {
    type: "schedule_changed",
    title: "Lịch học được cập nhật",
    body: `${String(classRow?.name ?? "Lớp")}: ${input.title}`,
    href: "/hoc-tap/lich",
    refId: id,
  });
  return {
    id,
    warning:
      conflicts.length || classConflicts.length
        ? `Cảnh báo trùng lịch: ${[...conflicts, ...classConflicts].map((item) => item.title).join(", ")}`
        : null,
  };
}

export function saveAttendance(actor: Actor, scheduleId: string, enrollmentId: string, status: string, note: string) {
  assertCan(actor, "lms.attendance", "update", { classId: scheduleClassId(scheduleId), assignedClassIds: actor.assignedClassIds });
  const at = nowIso();
  getDb()
    .prepare(
      `INSERT INTO lms_attendance (id, schedule_id, enrollment_id, status, note, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(schedule_id, enrollment_id) DO UPDATE SET status=excluded.status, note=excluded.note, updated_at=excluded.updated_at, updated_by=excluded.updated_by`,
    )
    .run(newId(), scheduleId, enrollmentId, status, note, at, actor.id);
}

function scheduleClassId(scheduleId: string) {
  return (getDb().prepare(`SELECT class_id FROM lms_schedules WHERE id = ?`).get(scheduleId) as { class_id: string } | undefined)?.class_id ?? null;
}

export function importLearnerPreview(actor: Actor, rows: { fullName: string; email: string; phone?: string; organization?: string }[]) {
  assertCan(actor, "lms.learners", "create");
  return rows.map((row) => {
    const email = row.email.trim().toLowerCase();
    const existing = getDb().prepare(`SELECT id FROM learner_profiles WHERE lower(email) = ?`).get(email) as { id: string } | undefined;
    const errors: string[] = [];
    if (!row.fullName.trim()) errors.push("Thiếu họ tên.");
    if (!email) errors.push("Thiếu email.");
    else if (!email.includes("@")) errors.push("Email không hợp lệ.");
    return { ...row, email, exists: Boolean(existing), errors, createsAccount: false };
  });
}

export function importLearners(
  actor: Actor,
  rows: { fullName: string; email: string; phone?: string; organization?: string }[],
  classId?: string,
) {
  const preview = importLearnerPreview(actor, rows);
  if (preview.some((row) => row.errors.length)) {
    return { ok: false as const, preview, message: "CSV còn dòng lỗi. Không ghi dữ liệu." };
  }
  const created: string[] = [];
  const reused: string[] = [];
  for (const row of preview) {
    const existing = getDb().prepare(`SELECT id FROM learner_profiles WHERE lower(email) = ?`).get(row.email) as { id: string } | undefined;
    let id = existing?.id;
    if (!id) {
      id = saveLearner(actor, {
        fullName: row.fullName,
        email: row.email,
        phone: row.phone ?? "",
        organization: row.organization ?? "",
        accountUserId: null,
        notes: "import-lop",
      });
      created.push(id);
    } else {
      reused.push(id);
    }
    if (classId) enroll(actor, classId, id);
  }
  return { ok: true as const, preview, created, reused };
}
