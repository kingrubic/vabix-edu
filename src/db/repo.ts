import type {
  Assessment,
  AssessmentStatus,
  AuditLog,
  Organization,
  Role,
  StoreShape,
  User,
} from "@/domain/types";
import { getStandardBundle } from "@/standards/registry";
import { createEmptyAssessmentRecords } from "./seed";
import { loadStore, mutateStore } from "./store";

export async function findUserByEmail(email: string): Promise<User | null> {
  const store = await loadStore();
  return store.users.find((item) => item.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  const store = await loadStore();
  return store.users.find((item) => item.id === id) ?? null;
}

export async function accessContext(userId: string) {
  const store = await loadStore();
  const memberships = store.organizationMembers.filter((item) => item.userId === userId);
  const shares = store.sharePermissions.filter((item) => item.userId === userId);
  const platformRoles = memberships
    .filter((item) => item.role === "SUPER_ADMIN" || item.role === "ACADEMIC_ADMIN")
    .map((item) => item.role);
  return { userId, memberships, shares, platformRoles };
}

export async function listOrganizationsForUser(userId: string): Promise<Organization[]> {
  const store = await loadStore();
  const ctx = await accessContext(userId);
  const isSuper = ctx.platformRoles.includes("SUPER_ADMIN");
  if (isSuper) return store.organizations.filter((item) => item.slug !== "vabix-platform" || true);
  const ids = new Set(ctx.memberships.map((item) => item.organizationId));
  return store.organizations.filter((item) => ids.has(item.id) && item.slug !== "vabix-platform");
}

export async function getOrganization(id: string): Promise<Organization | null> {
  const store = await loadStore();
  return store.organizations.find((item) => item.id === id) ?? null;
}

export async function listAssessments(organizationId?: string): Promise<Assessment[]> {
  const store = await loadStore();
  return store.assessments
    .filter((item) => (organizationId ? item.organizationId === organizationId : true))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getAssessment(id: string): Promise<Assessment | null> {
  const store = await loadStore();
  return store.assessments.find((item) => item.id === id) ?? null;
}

export function assessmentBundle(store: StoreShape, assessmentId: string) {
  const assessment = store.assessments.find((item) => item.id === assessmentId);
  if (!assessment) return null;
  const standard = getStandardBundle(assessment.standardVersionId, store);
  return {
    assessment,
    organization: store.organizations.find((item) => item.id === assessment.organizationId) ?? null,
    context: store.assessmentContexts.find((item) => item.assessmentId === assessmentId) ?? null,
    components: store.componentAssessments.filter((item) => item.assessmentId === assessmentId),
    scores: store.criterionScores.filter((item) => item.assessmentId === assessmentId),
    activations: store.activationAssessments.filter((item) => item.assessmentId === assessmentId),
    forces: store.forceAssessments.filter((item) => item.assessmentId === assessmentId),
    cfs: store.cfsConnectionScores.filter((item) => item.assessmentId === assessmentId),
    evidence: store.evidenceItems.filter((item) => item.assessmentId === assessmentId),
    actions: store.improvementActions.filter((item) => item.assessmentId === assessmentId),
    experiments: store.improvementExperiments.filter((item) => item.assessmentId === assessmentId),
    comments: store.comments.filter((item) => item.assessmentId === assessmentId),
    snapshots: store.assessmentSnapshots.filter((item) => item.assessmentId === assessmentId),
    standard,
  };
}

export async function loadAssessmentBundle(assessmentId: string) {
  const store = await loadStore();
  return assessmentBundle(store, assessmentId);
}

export async function createOrganization(input: {
  name: string;
  industry: string;
  stage: string;
  size: string;
  createdBy: string;
  adminUserId: string;
}): Promise<Organization> {
  return mutateStore((store) => {
    const organization: Organization = {
      id: crypto.randomUUID(),
      name: input.name,
      slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || crypto.randomUUID(),
      industry: input.industry,
      stage: input.stage,
      size: input.size,
      isDemo: false,
      confidentialityNote: "Dữ liệu chiến lược — chỉ thành viên tổ chức.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: input.createdBy,
    };
    store.organizations.push(organization);
    store.organizationMembers.push({
      id: crypto.randomUUID(),
      organizationId: organization.id,
      userId: input.adminUserId,
      role: "COMPANY_ADMIN",
      createdAt: organization.createdAt,
      createdBy: input.createdBy,
    });
    return organization;
  });
}

export async function createAssessment(input: {
  organizationId: string;
  title: string;
  createdBy: string;
  primaryEvaluatorId: string;
}): Promise<Assessment> {
  return mutateStore((store) => {
    const records = createEmptyAssessmentRecords({
      assessmentId: crypto.randomUUID(),
      organizationId: input.organizationId,
      createdBy: input.createdBy,
      title: input.title,
      primaryEvaluatorId: input.primaryEvaluatorId,
    });
    store.assessments.push(records.assessment);
    store.assessmentContexts.push(records.context);
    store.componentAssessments.push(...records.components);
    store.criterionScores.push(...records.scores);
    store.activationAssessments.push(...records.activations);
    store.forceAssessments.push(...records.forces);
    store.cfsConnectionScores.push(...records.cfs);
    return records.assessment;
  });
}

export async function cloneAssessmentRevision(assessmentId: string, createdBy: string): Promise<Assessment> {
  return mutateStore((store) => {
    const source = assessmentBundle(store, assessmentId);
    if (!source) throw new Error("Không tìm thấy đánh giá.");
    const now = new Date().toISOString();
    const newId = crypto.randomUUID();
    const revision = source.assessment.revisionNumber + 1;
    const next: Assessment = {
      ...source.assessment,
      id: newId,
      parentAssessmentId: source.assessment.id,
      revisionNumber: revision,
      title: `${source.assessment.title} · bản ${revision}`,
      status: "DRAFT",
      lockedAt: null,
      lockedBy: null,
      createdAt: now,
      updatedAt: now,
      createdBy,
    };
    store.assessments.push(next);
    if (source.context) {
      store.assessmentContexts.push({ ...source.context, id: `ctx-${newId}`, assessmentId: newId, updatedAt: now });
    }
    for (const row of source.components) {
      store.componentAssessments.push({ ...row, id: `ca-${newId}-${row.componentCode}`, assessmentId: newId, updatedAt: now });
    }
    for (const row of source.scores) {
      store.criterionScores.push({
        ...row,
        id: `cs-${newId}-${row.criterionCode}`,
        assessmentId: newId,
        updatedAt: now,
        updatedBy: createdBy,
      });
    }
    for (const row of source.activations) {
      store.activationAssessments.push({
        ...row,
        id: `act-${newId}-${row.componentCode}`,
        assessmentId: newId,
        updatedAt: now,
        updatedBy: createdBy,
      });
    }
    for (const row of source.forces) {
      store.forceAssessments.push({
        ...row,
        id: `frc-${newId}-${row.componentCode}`,
        assessmentId: newId,
        updatedAt: now,
        updatedBy: createdBy,
      });
    }
    for (const row of source.cfs) {
      store.cfsConnectionScores.push({
        ...row,
        id: `cfs-${newId}-${row.connectionCode}`,
        assessmentId: newId,
        updatedAt: now,
        updatedBy: createdBy,
      });
    }
    return next;
  });
}

export async function writeAudit(entry: Omit<AuditLog, "id" | "createdAt">) {
  await mutateStore((store) => {
    store.auditLogs.unshift({
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });
  });
}

export async function setAssessmentStatus(assessmentId: string, status: AssessmentStatus, actorId: string) {
  await mutateStore((store) => {
    const row = store.assessments.find((item) => item.id === assessmentId);
    if (!row) throw new Error("Không tìm thấy đánh giá.");
    row.status = status;
    row.updatedAt = new Date().toISOString();
    if (status === "LOCKED") {
      row.lockedAt = row.updatedAt;
      row.lockedBy = actorId;
      const bundle = assessmentBundle(store, assessmentId);
      store.assessmentSnapshots.push({
        id: crypto.randomUUID(),
        assessmentId,
        kind: "LOCK",
        payloadJson: JSON.stringify(bundle),
        createdAt: row.updatedAt,
        createdBy: actorId,
      });
    }
  });
}

export async function addMember(input: {
  organizationId: string;
  userId: string;
  role: Role;
  createdBy: string;
}) {
  await mutateStore((store) => {
    if (store.organizationMembers.some((item) => item.organizationId === input.organizationId && item.userId === input.userId)) {
      return;
    }
    store.organizationMembers.push({
      id: crypto.randomUUID(),
      organizationId: input.organizationId,
      userId: input.userId,
      role: input.role,
      createdAt: new Date().toISOString(),
      createdBy: input.createdBy,
    });
  });
}

export async function revokeJti(userId: string, jti: string) {
  await mutateStore((store) => {
    store.revokedSessions.push({
      id: crypto.randomUUID(),
      jti,
      userId,
      revokedAt: new Date().toISOString(),
    });
  });
}

export async function isJtiRevoked(jti: string): Promise<boolean> {
  const store = await loadStore();
  return store.revokedSessions.some((item) => item.jti === jti);
}
