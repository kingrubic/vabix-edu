"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AssessmentStatus } from "@/domain/types";
import {
  addMember,
  cloneAssessmentRevision,
  createAssessment,
  createOrganization,
  getAssessment,
  writeAudit,
} from "@/db/repo";
import { mutateStore } from "@/db/store";
import { assembleEngine } from "@/scoring/assemble";
import { assessmentBundle } from "@/db/repo";
import { getCurrentUser } from "@/security/session";
import { canAccessOrganization, canEditAssessment, canLockAssessment, canScoreAssessment } from "@/security/rbac";
import {
  activationSchema,
  cfsSchema,
  commentSchema,
  componentMetaSchema,
  contextSchema,
  criterionPatchSchema,
  evidenceItemSchema,
  forceSchema,
  newAssessmentSchema,
  organizationSchema,
  statusSchema,
} from "./schema";

function revalidateAssessment(id: string) {
  revalidatePath(`/bizcar/assessments/${id}`);
  revalidatePath(`/bizcar/assessments/${id}/engine`);
  revalidatePath("/bizcar/dashboard");
}

async function actor() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

async function editable(assessmentId: string) {
  const user = await actor();
  const assessment = await getAssessment(assessmentId);
  if (!assessment || !canEditAssessment(user.access, assessment)) {
    throw new Error("Không có quyền chỉnh sửa hoặc đánh giá đã khóa.");
  }
  return { user, assessment };
}

export async function createOrganizationAction(formData: FormData) {
  const user = await actor();
  const parsed = organizationSchema.safeParse({
    name: formData.get("name"),
    industry: formData.get("industry"),
    stage: formData.get("stage"),
    size: formData.get("size"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const organization = await createOrganization({
    ...parsed.data,
    createdBy: user.id,
    adminUserId: user.id,
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: organization.id,
    assessmentId: null,
    action: "CREATE_ORGANIZATION",
    entityType: "organization",
    entityId: organization.id,
    oldValue: null,
    newValue: organization.name,
    reason: "Tạo doanh nghiệp",
    standardVersionId: null,
    ip: null,
  });
  redirect(`/bizcar/organizations/${organization.id}`);
}

export async function createAssessmentAction(formData: FormData) {
  const user = await actor();
  const parsed = newAssessmentSchema.safeParse({
    organizationId: formData.get("organizationId"),
    title: formData.get("title"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  if (!canAccessOrganization(user.access, parsed.data.organizationId)) {
    return { error: "Không thuộc tổ chức này." };
  }
  const assessment = await createAssessment({
    organizationId: parsed.data.organizationId,
    title: parsed.data.title,
    createdBy: user.id,
    primaryEvaluatorId: user.id,
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: parsed.data.organizationId,
    assessmentId: assessment.id,
    action: "CREATE_ASSESSMENT",
    entityType: "assessment",
    entityId: assessment.id,
    oldValue: null,
    newValue: assessment.title,
    reason: "Tạo đánh giá MTUA",
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  redirect(`/bizcar/assessments/${assessment.id}/context`);
}

export async function saveContextAction(formData: FormData) {
  const parsed = contextSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    businessUnit: formData.get("businessUnit"),
    industry: formData.get("industry"),
    companyStage: formData.get("companyStage"),
    companySize: formData.get("companySize"),
    scope: formData.get("scope"),
    timeHorizon: formData.get("timeHorizon"),
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    const row = store.assessmentContexts.find((item) => item.assessmentId === parsed.data.assessmentId);
    if (!row) throw new Error("Thiếu ngữ cảnh đánh giá.");
    Object.assign(row, {
      businessUnit: parsed.data.businessUnit,
      industry: parsed.data.industry,
      companyStage: parsed.data.companyStage,
      companySize: parsed.data.companySize,
      scope: parsed.data.scope,
      timeHorizon: parsed.data.timeHorizon,
      notes: parsed.data.notes,
      updatedAt: new Date().toISOString(),
    });
    const current = store.assessments.find((item) => item.id === assessment.id);
    if (current && current.status === "DRAFT") current.status = "DATA_COLLECTION";
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: assessment.id,
    action: "UPDATE_CONTEXT",
    entityType: "assessment_context",
    entityId: assessment.id,
    oldValue: null,
    newValue: parsed.data.scope,
    reason: "Cập nhật ngữ cảnh",
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  revalidateAssessment(assessment.id);
  return { ok: true };
}

export async function saveCriterionAction(formData: FormData) {
  const parsed = criterionPatchSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    criterionCode: formData.get("criterionCode"),
    primaryScore: formData.get("primaryScore"),
    secondaryScore: formData.get("secondaryScore") ?? "",
    evidenceNote: formData.get("evidenceNote") ?? "",
    evidenceReferences: formData.get("evidenceReferences") ?? "",
    evaluatorExplanation: formData.get("evaluatorExplanation") ?? "",
    reason: formData.get("reason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  if (!canScoreAssessment(user.access, assessment)) return { error: "Không có quyền chấm điểm." };
  let oldValue: string | null = null;
  await mutateStore((store) => {
    const row = store.criterionScores.find(
      (item) => item.assessmentId === parsed.data.assessmentId && item.criterionCode === parsed.data.criterionCode,
    );
    if (!row) throw new Error("Không tìm thấy tiêu chí.");
    oldValue = row.primaryScore == null ? null : String(row.primaryScore);
    row.primaryScore = parsed.data.primaryScore;
    row.secondaryScore = parsed.data.secondaryScore === "" || parsed.data.secondaryScore == null ? null : Number(parsed.data.secondaryScore);
    row.evidenceNote = parsed.data.evidenceNote;
    row.evidenceReferences = parsed.data.evidenceReferences;
    row.evaluatorExplanation = parsed.data.evaluatorExplanation;
    if (row.secondaryScore != null && Math.abs(row.secondaryScore - row.primaryScore) > 1.5) {
      row.calibrationStatus = "PENDING";
    }
    row.updatedAt = new Date().toISOString();
    row.updatedBy = user.id;
    const current = store.assessments.find((item) => item.id === assessment.id);
    const bundle = assessmentBundle(store, assessment.id);
    if (current && bundle) {
      const model = assembleEngine(bundle);
      if (model.calibrationRequired) current.status = "CALIBRATION_REQUIRED";
    }
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: assessment.id,
    action: "SCORE_CRITERION",
    entityType: "criterion_score",
    entityId: parsed.data.criterionCode,
    oldValue,
    newValue: String(parsed.data.primaryScore),
    reason: parsed.data.reason,
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  revalidateAssessment(assessment.id);
  return { ok: true };
}

export async function saveComponentMetaAction(formData: FormData) {
  const parsed = componentMetaSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    componentCode: formData.get("componentCode"),
    requiredLevel: formData.get("requiredLevel"),
    evidenceGrade: formData.get("evidenceGrade"),
    narrative: formData.get("narrative") ?? "",
    reason: formData.get("reason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    const row = store.componentAssessments.find(
      (item) => item.assessmentId === parsed.data.assessmentId && item.componentCode === parsed.data.componentCode,
    );
    if (!row) throw new Error("Không tìm thấy cấu kiện.");
    row.requiredLevel = parsed.data.requiredLevel;
    row.evidenceGrade = parsed.data.evidenceGrade;
    row.narrative = parsed.data.narrative;
    row.updatedAt = new Date().toISOString();
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: assessment.id,
    action: "UPDATE_COMPONENT_META",
    entityType: "component_assessment",
    entityId: parsed.data.componentCode,
    oldValue: null,
    newValue: parsed.data.evidenceGrade,
    reason: parsed.data.reason,
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  revalidateAssessment(assessment.id);
  return { ok: true };
}

export async function saveActivationAction(formData: FormData) {
  const parsed = activationSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    componentCode: formData.get("componentCode"),
    score: formData.get("score"),
    rationale: formData.get("rationale"),
    evidenceReferences: formData.get("evidenceReferences") ?? "",
    scope: formData.get("scope"),
    assessedAt: formData.get("assessedAt"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    const row = store.activationAssessments.find(
      (item) => item.assessmentId === parsed.data.assessmentId && item.componentCode === parsed.data.componentCode,
    );
    if (!row) throw new Error("Không tìm thấy Activation.");
    row.score = parsed.data.score;
    row.rationale = parsed.data.rationale;
    row.evidenceReferences = parsed.data.evidenceReferences;
    row.scope = parsed.data.scope;
    row.assessedAt = parsed.data.assessedAt;
    row.updatedAt = new Date().toISOString();
    row.updatedBy = user.id;
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: assessment.id,
    action: "UPDATE_ACTIVATION",
    entityType: "activation_assessment",
    entityId: parsed.data.componentCode,
    oldValue: null,
    newValue: String(parsed.data.score),
    reason: parsed.data.reason,
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  revalidateAssessment(assessment.id);
  return { ok: true };
}

export async function saveForceAction(formData: FormData) {
  const parsed = forceSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    componentCode: formData.get("componentCode"),
    direction: formData.get("direction"),
    scope: formData.get("scope"),
    intensity: formData.get("intensity"),
    duration: formData.get("duration"),
    bottleneckProximity: formData.get("bottleneckProximity"),
    evidenceGrade: formData.get("evidenceGrade"),
    evidenceNote: formData.get("evidenceNote") ?? "",
    reason: formData.get("reason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    const row = store.forceAssessments.find(
      (item) => item.assessmentId === parsed.data.assessmentId && item.componentCode === parsed.data.componentCode,
    );
    if (!row) throw new Error("Không tìm thấy Force.");
    row.direction = parsed.data.direction;
    row.scope = parsed.data.scope;
    row.intensity = parsed.data.intensity;
    row.duration = parsed.data.duration;
    row.bottleneckProximity = parsed.data.bottleneckProximity;
    row.evidenceGrade = parsed.data.evidenceGrade;
    row.evidenceNote = parsed.data.evidenceNote;
    row.updatedAt = new Date().toISOString();
    row.updatedBy = user.id;
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: assessment.id,
    action: "UPDATE_FORCE",
    entityType: "force_assessment",
    entityId: parsed.data.componentCode,
    oldValue: null,
    newValue: parsed.data.direction,
    reason: parsed.data.reason,
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  revalidateAssessment(assessment.id);
  return { ok: true };
}

export async function saveCfsAction(formData: FormData) {
  const parsed = cfsSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    connectionCode: formData.get("connectionCode"),
    score: formData.get("score"),
    evidence: formData.get("evidence"),
    evidenceStatus: formData.get("evidenceStatus"),
    deviationSignal: formData.get("deviationSignal") ?? "",
    evaluatorNote: formData.get("evaluatorNote") ?? "",
    reason: formData.get("reason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    const row = store.cfsConnectionScores.find(
      (item) => item.assessmentId === parsed.data.assessmentId && item.connectionCode === parsed.data.connectionCode,
    );
    if (!row) throw new Error("Không tìm thấy liên kết CFS.");
    row.score = parsed.data.score;
    row.evidence = parsed.data.evidence;
    row.evidenceStatus = parsed.data.evidenceStatus;
    row.deviationSignal = parsed.data.deviationSignal;
    row.evaluatorNote = parsed.data.evaluatorNote;
    row.updatedAt = new Date().toISOString();
    row.updatedBy = user.id;
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: assessment.id,
    action: "UPDATE_CFS",
    entityType: "cfs_connection_score",
    entityId: parsed.data.connectionCode,
    oldValue: null,
    newValue: String(parsed.data.score),
    reason: parsed.data.reason,
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  revalidateAssessment(assessment.id);
  return { ok: true };
}

export async function addEvidenceAction(formData: FormData) {
  const parsed = evidenceItemSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    title: formData.get("title"),
    note: formData.get("note") ?? "",
    linkUrl: formData.get("linkUrl") ?? "",
    componentCode: formData.get("componentCode") || undefined,
    criterionCode: formData.get("criterionCode") || undefined,
    kind: formData.get("kind"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    store.evidenceItems.push({
      id: crypto.randomUUID(),
      assessmentId: parsed.data.assessmentId,
      componentCode: parsed.data.componentCode ?? null,
      criterionCode: parsed.data.criterionCode ?? null,
      connectionCode: null,
      title: parsed.data.title,
      note: parsed.data.note,
      linkUrl: parsed.data.linkUrl || null,
      storageKey: null,
      mimeType: null,
      fileName: null,
      fileSize: null,
      kind: parsed.data.kind,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    });
  });
  revalidateAssessment(assessment.id);
  return { ok: true };
}

export async function addCommentAction(formData: FormData) {
  const parsed = commentSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    store.comments.push({
      id: crypto.randomUUID(),
      assessmentId: parsed.data.assessmentId,
      body: parsed.data.body,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    });
  });
  revalidateAssessment(assessment.id);
  return { ok: true };
}

export async function changeStatusAction(formData: FormData) {
  const parsed = statusSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    status: formData.get("status"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const user = await actor();
  const assessment = await getAssessment(parsed.data.assessmentId);
  if (!assessment || !canAccessOrganization(user.access, assessment.organizationId)) {
    return { error: "Không có quyền." };
  }
  if (parsed.data.status === "LOCKED") {
    if (!canLockAssessment(user.access, assessment.organizationId)) {
      return { error: "Không có quyền khóa đánh giá." };
    }
    const bundle = await (await import("@/db/repo")).loadAssessmentBundle(assessment.id);
    if (!bundle) return { error: "Thiếu dữ liệu đánh giá." };
    const model = assembleEngine(bundle);
    if (model.calibrationRequired) {
      return { error: "Cần hiệu chuẩn — không được khóa khi lệch điểm đánh giá viên." };
    }
  }
  if (assessment.status === "LOCKED" && parsed.data.status !== "ARCHIVED" && parsed.data.status !== "IMPROVEMENT") {
    return { error: "Đánh giá đã khóa. Hãy tạo bản sửa mới, không sửa lặng lẽ." };
  }
  await mutateStore((store) => {
    const row = store.assessments.find((item) => item.id === assessment.id);
    if (!row) return;
    const now = new Date().toISOString();
    row.status = parsed.data.status as AssessmentStatus;
    row.updatedAt = now;
    if (parsed.data.status === "LOCKED") {
      row.lockedAt = now;
      row.lockedBy = user.id;
      store.assessmentSnapshots.push({
        id: crypto.randomUUID(),
        assessmentId: row.id,
        kind: "LOCK",
        payloadJson: JSON.stringify(assessmentBundle(store, row.id)),
        createdAt: now,
        createdBy: user.id,
      });
    }
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: assessment.id,
    action: "CHANGE_STATUS",
    entityType: "assessment",
    entityId: assessment.id,
    oldValue: assessment.status,
    newValue: parsed.data.status,
    reason: parsed.data.reason,
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  revalidateAssessment(assessment.id);
  return { ok: true };
}

export async function createRevisionAction(formData: FormData) {
  const assessmentId = String(formData.get("assessmentId") ?? "");
  const user = await actor();
  const assessment = await getAssessment(assessmentId);
  if (!assessment || !canAccessOrganization(user.access, assessment.organizationId)) {
    return { error: "Không có quyền." };
  }
  const next = await cloneAssessmentRevision(assessmentId, user.id);
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: next.id,
    action: "CREATE_REVISION",
    entityType: "assessment",
    entityId: next.id,
    oldValue: assessmentId,
    newValue: next.id,
    reason: "Tạo bản đánh giá mới từ bản đã khóa",
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  redirect(`/bizcar/assessments/${next.id}`);
}

export async function inviteMemberAction(formData: FormData) {
  const user = await actor();
  const organizationId = String(formData.get("organizationId") ?? "");
  const email = String(formData.get("email") ?? "").toLowerCase();
  const role = String(formData.get("role") ?? "COMPANY_MEMBER") as
    | "COMPANY_ADMIN"
    | "COMPANY_MEMBER"
    | "COACH_EVALUATOR"
    | "VIEWER";
  if (!canAccessOrganization(user.access, organizationId)) return { error: "Không có quyền." };
  const { findUserByEmail } = await import("@/db/repo");
  const target = await findUserByEmail(email);
  if (!target) return { error: "Chưa có tài khoản với email này." };
  await addMember({ organizationId, userId: target.id, role, createdBy: user.id });
  revalidatePath(`/bizcar/organizations/${organizationId}`);
  return { ok: true };
}
