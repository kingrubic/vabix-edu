import { redirect } from "next/navigation";
import { getCurrentUser, type CurrentUser } from "./session";
import {
  canAccessOrganization,
  canAdminUsers,
  canEditAssessment,
  canLockAssessment,
  canScoreAssessment,
  canViewAssessment,
  isAcademicAdmin,
  isPlatformAdmin,
} from "./rbac";
import { getAssessment } from "@/db/repo";

export async function requireSession(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireOrgAccess(organizationId: string): Promise<CurrentUser> {
  const user = await requireSession();
  if (!canAccessOrganization(user.access, organizationId)) redirect("/dashboard");
  return user;
}

export async function requireAssessmentView(assessmentId: string) {
  const user = await requireSession();
  const assessment = await getAssessment(assessmentId);
  if (!assessment || !canViewAssessment(user.access, assessment)) redirect("/dashboard");
  return { user, assessment };
}

export async function requireAssessmentEdit(assessmentId: string) {
  const { user, assessment } = await requireAssessmentView(assessmentId);
  if (!canEditAssessment(user.access, assessment)) {
    throw new Error("Không có quyền chỉnh sửa đánh giá này.");
  }
  return { user, assessment };
}

export function assertCanScore(user: CurrentUser, assessment: { organizationId: string; status: typeof user extends never ? never : import("@/domain/types").AssessmentStatus }) {
  if (!canScoreAssessment(user.access, assessment)) {
    throw new Error("Không có quyền chấm điểm.");
  }
}

export function assertCanLock(user: CurrentUser, organizationId: string) {
  if (!canLockAssessment(user.access, organizationId)) {
    throw new Error("Không có quyền khóa đánh giá.");
  }
}

export function assertAcademic(user: CurrentUser) {
  if (!isAcademicAdmin(user.access)) throw new Error("Chỉ quản trị học thuật.");
}

export function assertPlatform(user: CurrentUser) {
  if (!isPlatformAdmin(user.access) && !canAdminUsers(user.access)) {
    throw new Error("Chỉ quản trị nền tảng.");
  }
}
