import type { Assessment, OrganizationMember, Role, SharePermission } from "@/domain/types";

export type AccessContext = {
  userId: string;
  memberships: OrganizationMember[];
  shares: SharePermission[];
  platformRoles: Role[];
};

export function platformRolesOf(ctx: AccessContext): Role[] {
  return ctx.platformRoles;
}

export function isPlatformAdmin(ctx: AccessContext): boolean {
  return ctx.platformRoles.includes("SUPER_ADMIN") || ctx.memberships.some((item) => item.role === "SUPER_ADMIN");
}

export function isAcademicAdmin(ctx: AccessContext): boolean {
  return (
    isPlatformAdmin(ctx) ||
    ctx.platformRoles.includes("ACADEMIC_ADMIN") ||
    ctx.memberships.some((item) => item.role === "ACADEMIC_ADMIN")
  );
}

export function roleInOrg(ctx: AccessContext, organizationId: string): Role | null {
  if (isPlatformAdmin(ctx)) return "SUPER_ADMIN";
  return ctx.memberships.find((item) => item.organizationId === organizationId)?.role ?? null;
}

export function canAccessOrganization(ctx: AccessContext, organizationId: string): boolean {
  return roleInOrg(ctx, organizationId) != null;
}

export function canManageOrganization(ctx: AccessContext, organizationId: string): boolean {
  const role = roleInOrg(ctx, organizationId);
  return role === "SUPER_ADMIN" || role === "COMPANY_ADMIN";
}

export function canViewAssessment(
  ctx: AccessContext,
  assessment: Pick<Assessment, "id" | "organizationId">,
): boolean {
  if (canAccessOrganization(ctx, assessment.organizationId)) return true;
  return ctx.shares.some((item) => item.assessmentId === assessment.id);
}

export function canEditAssessment(
  ctx: AccessContext,
  assessment: Pick<Assessment, "id" | "organizationId" | "status">,
): boolean {
  if (assessment.status === "LOCKED" || assessment.status === "ARCHIVED") return false;
  const role = roleInOrg(ctx, assessment.organizationId);
  if (role === "SUPER_ADMIN" || role === "COACH_EVALUATOR" || role === "COMPANY_ADMIN") return true;
  if (role === "COMPANY_MEMBER") return true;
  const share = ctx.shares.find((item) => item.assessmentId === assessment.id);
  return Boolean(share?.canEdit);
}

export function canScoreAssessment(
  ctx: AccessContext,
  assessment: Pick<Assessment, "organizationId" | "status">,
): boolean {
  if (assessment.status === "LOCKED" || assessment.status === "ARCHIVED") return false;
  const role = roleInOrg(ctx, assessment.organizationId);
  return role === "SUPER_ADMIN" || role === "COACH_EVALUATOR" || role === "COMPANY_ADMIN";
}

export function canLockAssessment(ctx: AccessContext, organizationId: string): boolean {
  const role = roleInOrg(ctx, organizationId);
  return role === "SUPER_ADMIN" || role === "COACH_EVALUATOR" || role === "ACADEMIC_ADMIN";
}

export function canAdminUsers(ctx: AccessContext): boolean {
  return isPlatformAdmin(ctx);
}

export function visibleOrganizationIds(ctx: AccessContext): string[] | "ALL" {
  if (isPlatformAdmin(ctx)) return "ALL";
  return [...new Set(ctx.memberships.map((item) => item.organizationId))];
}
