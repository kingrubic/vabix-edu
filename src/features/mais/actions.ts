"use server";

import { revalidatePath } from "next/cache";
import { getAssessment, writeAudit } from "@/db/repo";
import { mutateStore } from "@/db/store";
import { getCurrentUser } from "@/security/session";
import { canEditAssessment } from "@/security/rbac";
import { actionSchema, experimentDecisionSchema, experimentSchema } from "./schema";

async function editable(assessmentId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  const assessment = await getAssessment(assessmentId);
  if (!assessment || !canEditAssessment(user.access, assessment)) {
    throw new Error("Không có quyền hoặc đánh giá đã khóa.");
  }
  return { user, assessment };
}

export async function createMaisAction(formData: FormData) {
  const parsed = actionSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    title: formData.get("title"),
    stage: formData.get("stage"),
    componentCode: formData.get("componentCode") ?? "",
    symptom: formData.get("symptom") ?? "",
    causeHypothesis: formData.get("causeHypothesis") ?? "",
    connectionNote: formData.get("connectionNote") ?? "",
    sideEffect: formData.get("sideEffect") ?? "",
    ownerName: formData.get("ownerName"),
    scope: formData.get("scope"),
    testPeriod: formData.get("testPeriod"),
    priorityReason: formData.get("priorityReason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    store.improvementActions.push({
      id: crypto.randomUUID(),
      assessmentId: parsed.data.assessmentId,
      experimentId: null,
      stage: parsed.data.stage,
      componentCode: parsed.data.componentCode ? parsed.data.componentCode : null,
      title: parsed.data.title,
      symptom: parsed.data.symptom,
      causeHypothesis: parsed.data.causeHypothesis,
      connectionNote: parsed.data.connectionNote,
      sideEffect: parsed.data.sideEffect,
      ownerUserId: user.id,
      ownerName: parsed.data.ownerName,
      scope: parsed.data.scope,
      testPeriod: parsed.data.testPeriod,
      mechanism: "",
      evidence: "",
      reviewDate: null,
      priorityScore: 0,
      priorityReason: parsed.data.priorityReason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id,
    });
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: assessment.id,
    action: "CREATE_MAIS_ACTION",
    entityType: "improvement_action",
    entityId: assessment.id,
    oldValue: null,
    newValue: parsed.data.title,
    reason: parsed.data.priorityReason,
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  revalidatePath(`/bizcar/assessments/${assessment.id}/mais`);
  return { ok: true };
}

export async function createExperimentAction(formData: FormData) {
  const parsed = experimentSchema.safeParse({
    assessmentId: formData.get("assessmentId"),
    title: formData.get("title"),
    startDate: formData.get("startDate"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    store.improvementExperiments.push({
      id: crypto.randomUUID(),
      assessmentId: parsed.data.assessmentId,
      title: parsed.data.title,
      baselineLockedAt: assessment.lockedAt,
      startDate: parsed.data.startDate,
      decision: null,
      decisionNote: "",
      compareAssessmentId: assessment.parentAssessmentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id,
    });
  });
  revalidatePath(`/bizcar/assessments/${assessment.id}/mais`);
  return { ok: true };
}

export async function decideExperimentAction(formData: FormData) {
  const parsed = experimentDecisionSchema.safeParse({
    experimentId: formData.get("experimentId"),
    assessmentId: formData.get("assessmentId"),
    decision: formData.get("decision"),
    decisionNote: formData.get("decisionNote"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  const { user, assessment } = await editable(parsed.data.assessmentId);
  await mutateStore((store) => {
    const row = store.improvementExperiments.find((item) => item.id === parsed.data.experimentId);
    if (!row) throw new Error("Không tìm thấy thử nghiệm.");
    row.decision = parsed.data.decision;
    row.decisionNote = parsed.data.decisionNote;
    row.updatedAt = new Date().toISOString();
  });
  await writeAudit({
    actorUserId: user.id,
    organizationId: assessment.organizationId,
    assessmentId: assessment.id,
    action: "EXPERIMENT_DECISION",
    entityType: "improvement_experiment",
    entityId: parsed.data.experimentId,
    oldValue: null,
    newValue: parsed.data.decision,
    reason: parsed.data.decisionNote,
    standardVersionId: assessment.standardVersionId,
    ip: null,
  });
  revalidatePath(`/bizcar/assessments/${assessment.id}/mais`);
  return { ok: true };
}
