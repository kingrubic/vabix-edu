"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePageActor } from "@/platform/auth/guard";
import { saveDepartment, saveGroup, saveUser } from "@/platform/iam/service";
import { saveCms } from "@/platform/cms/service";
import { parseJson } from "@/platform/sanitize";
import { saveCourse, saveLesson, saveModule, publishVersion, cloneVersion, reorderLessons } from "@/platform/lms/courses";
import { assignStaff, enroll, importLearners, saveAttendance, saveClass, saveLearner, saveSchedule, setEnrollmentStatus } from "@/platform/lms/classes";
import { gradeSubmission, saveAssignment, saveEval3W, submitAssignment } from "@/platform/lms/assignments";
import { saveQuestion, saveQuiz, startAttempt, saveAnswer, submitAttempt } from "@/platform/lms/quizzes";
import { issueCertificate, revokeCertificate } from "@/platform/lms/certificates";
import { confirmLesson, savePrivateNote } from "@/platform/lms/progress";
import { addTaskComment, saveTask, updateTaskStatus } from "@/platform/tasks/service";
import { updateInquiry } from "@/platform/inquiries/service";
import { parseCsv } from "@/platform/csv";
import { fromDatetimeLocal } from "@/platform/time";
import type { DataScope, PermissionAction, PlatformRole } from "@/platform/permissions/registry";

function fail(error: unknown): never {
  throw new Error(error instanceof Error ? error.message : "Không thực hiện được.");
}

export async function saveUserForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    const groupIds = formData.getAll("groupIds").map(String).filter(Boolean);
    await saveUser(actor, {
      id: String(formData.get("id") ?? "") || undefined,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      role: String(formData.get("role") ?? "user") as PlatformRole,
      departmentId: String(formData.get("departmentId") ?? "") || null,
      groupIds,
      status: String(formData.get("status") ?? "pending") as "pending" | "active" | "locked" | "archived",
      invite: formData.get("invite") === "on",
    });
    revalidatePath("/admin/he-thong/tai-khoan");
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveDepartmentForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveDepartment(actor, {
      id: String(formData.get("id") ?? "") || undefined,
      code: String(formData.get("code") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      parentId: String(formData.get("parentId") ?? "") || null,
      leadUserId: String(formData.get("leadUserId") ?? "") || null,
      status: String(formData.get("status") ?? "active") as "active" | "archived",
    });
    revalidatePath("/admin/he-thong/phong-ban");
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveGroupForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    const grants = parseJson<{ menuCode: string; action: PermissionAction; scope: DataScope }[]>(
      String(formData.get("grants") ?? "[]"),
      [],
    );
    saveGroup(actor, {
      id: String(formData.get("id") ?? "") || undefined,
      code: String(formData.get("code") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      status: String(formData.get("status") ?? "active") as "active" | "archived",
      grants,
    });
    revalidatePath("/admin/he-thong/nhom-quyen");
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveCmsForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveCms(actor, {
      id: String(formData.get("id") ?? "") || undefined,
      type: String(formData.get("type") ?? "page"),
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      status: String(formData.get("status") ?? "draft") as "draft" | "pending_review" | "published" | "archived",
      payload: parseJson(String(formData.get("payload") ?? "{}"), {}),
      seo: parseJson(String(formData.get("seo") ?? "{}"), {}),
      internalNotes: String(formData.get("internalNotes") ?? ""),
      featured: formData.get("featured") === "on",
      expectedVersion: Number(formData.get("expectedVersion") ?? 0) || undefined,
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveCourseForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveCourse(actor, {
      id: String(formData.get("id") ?? "") || undefined,
      code: String(formData.get("code") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      publicProgramSlug: String(formData.get("publicProgramSlug") ?? ""),
      format: String(formData.get("format") ?? "blended"),
      durationNote: String(formData.get("durationNote") ?? ""),
      status: String(formData.get("status") ?? "draft") as "draft" | "published" | "archived",
    });
    revalidatePath("/admin/dao-tao/khoa-hoc");
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveClassForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveClass(actor, {
      id: String(formData.get("id") ?? "") || undefined,
      code: String(formData.get("code") ?? ""),
      name: String(formData.get("name") ?? ""),
      courseId: String(formData.get("courseId") ?? ""),
      versionId: String(formData.get("versionId") ?? ""),
      format: String(formData.get("format") ?? "blended"),
      startsOn: String(formData.get("startsOn") ?? "") || null,
      endsOn: String(formData.get("endsOn") ?? "") || null,
      location: String(formData.get("location") ?? ""),
      meetingUrl: String(formData.get("meetingUrl") ?? ""),
      capacity: String(formData.get("capacity") ?? "") ? Number(formData.get("capacity")) : null,
      status: String(formData.get("status") ?? "recruiting"),
    });
    revalidatePath("/admin/dao-tao/lop");
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveModuleForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveModule(actor, {
      versionId: String(formData.get("versionId") ?? ""),
      title: String(formData.get("title") ?? ""),
      required: formData.get("required") === "on",
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveLessonForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveLesson(actor, {
      id: String(formData.get("id") ?? "") || undefined,
      moduleId: String(formData.get("moduleId") ?? ""),
      title: String(formData.get("title") ?? ""),
      kind: String(formData.get("kind") ?? "article"),
      body: String(formData.get("body") ?? ""),
      resourceUrl: String(formData.get("resourceUrl") ?? ""),
      required: formData.get("required") !== "off",
      sortOrder: Number(formData.get("sortOrder") ?? 0),
      unlockRule: String(formData.get("unlockRule") ?? "immediate"),
      completionRule: String(formData.get("completionRule") ?? "confirm"),
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function publishVersionForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    publishVersion(actor, String(formData.get("versionId") ?? ""));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function cloneVersionForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    cloneVersion(actor, String(formData.get("versionId") ?? ""));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function reorderLessonsForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    reorderLessons(actor, String(formData.get("moduleId") ?? ""), String(formData.get("lessonIds") ?? "").split(",").filter(Boolean));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function enrollForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    enroll(actor, String(formData.get("classId") ?? ""), String(formData.get("learnerProfileId") ?? ""));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveLearnerForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveLearner(actor, {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      accountUserId: String(formData.get("accountUserId") ?? "") || null,
      notes: String(formData.get("notes") ?? ""),
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function assignStaffForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    assignStaff(
      actor,
      String(formData.get("classId") ?? ""),
      String(formData.get("userId") ?? ""),
      String(formData.get("role") ?? "instructor") as "instructor" | "assistant" | "coordinator",
    );
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveScheduleForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveSchedule(actor, {
      classId: String(formData.get("classId") ?? ""),
      title: String(formData.get("title") ?? ""),
      startsAt: fromDatetimeLocal(String(formData.get("startsAt") ?? "")),
      endsAt: fromDatetimeLocal(String(formData.get("endsAt") ?? "")),
      instructorUserId: String(formData.get("instructorUserId") ?? "") || null,
      location: String(formData.get("location") ?? ""),
      meetingUrl: String(formData.get("meetingUrl") ?? ""),
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function setEnrollmentStatusForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    setEnrollmentStatus(actor, String(formData.get("enrollmentId") ?? ""), String(formData.get("status") ?? "active"));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveAssignmentForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveAssignment(actor, {
      classId: String(formData.get("classId") ?? ""),
      title: String(formData.get("title") ?? ""),
      instructions: String(formData.get("instructions") ?? ""),
      mode: (String(formData.get("mode") ?? "individual") as "individual" | "group"),
      dueAt: String(formData.get("dueAt") ?? "") ? fromDatetimeLocal(String(formData.get("dueAt") ?? "")) : null,
      allowLate: formData.get("allowLate") === "on",
      maxAttempts: Number(formData.get("maxAttempts") ?? 1),
      maxScore: Number(formData.get("maxScore") ?? 100),
      required: formData.get("required") === "on",
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function submitAssignmentForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    submitAssignment(actor.id, {
      assignmentId: String(formData.get("assignmentId") ?? ""),
      enrollmentId: String(formData.get("enrollmentId") ?? ""),
      textBody: String(formData.get("textBody") ?? ""),
      linkUrl: String(formData.get("linkUrl") ?? ""),
      fileId: String(formData.get("fileId") ?? "") || null,
      confirm: formData.get("confirm") === "on",
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function gradeForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    gradeSubmission(actor, {
      submissionId: String(formData.get("submissionId") ?? ""),
      score: Number(formData.get("score") ?? 0),
      comment: String(formData.get("comment") ?? ""),
      status: String(formData.get("status") ?? "draft") as "draft" | "published",
      reason: String(formData.get("reason") ?? ""),
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function eval3wForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveEval3W(actor, {
      enrollmentId: String(formData.get("enrollmentId") ?? ""),
      dimension: String(formData.get("dimension") ?? "WOW") as "WOW" | "WELL" | "WIN",
      criteria: String(formData.get("criteria") ?? ""),
      evidence: String(formData.get("evidence") ?? ""),
      comment: String(formData.get("comment") ?? ""),
      status: String(formData.get("status") ?? "draft") as "draft" | "published",
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveQuestionForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveQuestion(actor, {
      courseId: String(formData.get("courseId") ?? "") || null,
      prompt: String(formData.get("prompt") ?? ""),
      kind: String(formData.get("kind") ?? "single") as "single" | "multiple" | "boolean" | "essay",
      options: String(formData.get("options") ?? "").split("\n").map((item) => item.trim()).filter(Boolean),
      answerKey: String(formData.get("answerKey") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
      explanation: String(formData.get("explanation") ?? ""),
      points: Number(formData.get("points") ?? 1),
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveQuizForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveQuiz(actor, {
      classId: String(formData.get("classId") ?? ""),
      title: String(formData.get("title") ?? ""),
      opensAt: String(formData.get("opensAt") ?? "") ? fromDatetimeLocal(String(formData.get("opensAt") ?? "")) : null,
      closesAt: String(formData.get("closesAt") ?? "") ? fromDatetimeLocal(String(formData.get("closesAt") ?? "")) : null,
      durationMinutes: String(formData.get("durationMinutes") ?? "") ? Number(formData.get("durationMinutes")) : null,
      maxAttempts: Number(formData.get("maxAttempts") ?? 1),
      passScore: String(formData.get("passScore") ?? "") ? Number(formData.get("passScore")) : null,
      shuffle: formData.get("shuffle") === "on",
      scorePolicy: String(formData.get("scorePolicy") ?? "highest") as "highest" | "latest",
      revealPolicy: String(formData.get("revealPolicy") ?? "after_close"),
      questionIds: String(formData.get("questionIds") ?? "").split(",").filter(Boolean),
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function startQuizForm(formData: FormData) {
  const classId = String(formData.get("classId") ?? "");
  const quizId = String(formData.get("quizId") ?? "");
  try {
    const actor = await requirePageActor();
    startAttempt(actor.id, quizId, String(formData.get("enrollmentId") ?? ""));
  } catch (error) {
    fail(error);
  }
  redirect(`/hoc-tap/lop/${classId}/kiem-tra/${quizId}`);
}

export async function saveAnswerForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveAnswer(actor.id, String(formData.get("attemptId") ?? ""), String(formData.get("questionId") ?? ""), formData.getAll("answer").map(String));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function submitQuizForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    submitAttempt(actor.id, String(formData.get("attemptId") ?? ""));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function confirmLessonForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    confirmLesson(actor.id, String(formData.get("enrollmentId") ?? ""), String(formData.get("lessonId") ?? ""));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveNoteForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    savePrivateNote(actor.id, String(formData.get("enrollmentId") ?? ""), String(formData.get("lessonId") ?? ""), String(formData.get("body") ?? ""));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function issueCertForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    issueCertificate(actor, String(formData.get("enrollmentId") ?? ""));
    revalidatePath("/admin/dao-tao/chung-nhan");
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveAttendanceForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveAttendance(
      actor,
      String(formData.get("scheduleId") ?? ""),
      String(formData.get("enrollmentId") ?? ""),
      String(formData.get("status") ?? "present"),
      String(formData.get("note") ?? ""),
    );
    return;
  } catch (error) {
    fail(error);
  }
}

export async function importLearnersForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    const csv = String(formData.get("csv") ?? "");
    const classId = String(formData.get("classId") ?? "") || undefined;
    if (formData.get("confirm") !== "on") {
      throw new Error("Cần xác nhận đã kiểm tra CSV trước khi ghi. Import chỉ tạo hồ sơ học viên, không tạo tài khoản đăng nhập.");
    }
    const rows = parseCsv(csv).map((row) => ({
      fullName: row.hoten || row["ho ten"] || row.name || row.fullname || "",
      email: row.email || "",
      phone: row.phone || row.dienthoai || row["dien thoai"] || "",
      organization: row.organization || row.doanhnghiep || row.company || "",
    }));
    const result = importLearners(actor, rows, classId);
    if (!result.ok) {
      const first = result.preview.find((row) => row.errors.length);
      throw new Error(result.message + (first ? ` (${first.email || first.fullName}: ${first.errors.join(", ")})` : ""));
    }
    revalidatePath("/admin/dao-tao/lop");
    return;
  } catch (error) {
    fail(error);
  }
}

export async function revokeCertForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    revokeCertificate(actor, String(formData.get("id") ?? ""), String(formData.get("reason") ?? ""));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function saveTaskForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    saveTask(actor, {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      assigneeUserId: String(formData.get("assigneeUserId") ?? ""),
      collaboratorIds: formData.getAll("collaboratorIds").map(String).filter(Boolean),
      departmentId: String(formData.get("departmentId") ?? "") || null,
      startsOn: String(formData.get("startsOn") ?? "") || null,
      dueOn: String(formData.get("dueOn") ?? "") || null,
      priority: String(formData.get("priority") ?? "normal"),
      status: String(formData.get("status") ?? "new"),
    });
    return;
  } catch (error) {
    fail(error);
  }
}

export async function taskStatusForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    updateTaskStatus(actor, String(formData.get("id") ?? ""), String(formData.get("status") ?? "in_progress"));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function taskCommentForm(formData: FormData) {
  try {
    const actor = await requirePageActor();
    addTaskComment(actor, String(formData.get("taskId") ?? ""), String(formData.get("body") ?? ""));
    return;
  } catch (error) {
    fail(error);
  }
}

export async function inquiryForm(formData: FormData) {
  try {
    await requirePageActor();
    updateInquiry(String(formData.get("id") ?? ""), {
      status: String(formData.get("status") ?? "processing"),
      notes: String(formData.get("notes") ?? ""),
      assigneeUserId: String(formData.get("assigneeUserId") ?? "") || null,
      nextContactAt: String(formData.get("nextContactAt") ?? "") || null,
    });
    return;
  } catch (error) {
    fail(error);
  }
}
