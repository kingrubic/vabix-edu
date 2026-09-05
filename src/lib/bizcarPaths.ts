export const BIZCAR_BASE = "/bizcar";

export const bizcarPath = {
  home: BIZCAR_BASE,
  engine: `${BIZCAR_BASE}/engine`,
  login: `${BIZCAR_BASE}/login`,
  dashboard: `${BIZCAR_BASE}/dashboard`,
  assessments: `${BIZCAR_BASE}/assessments`,
  assessmentNew: `${BIZCAR_BASE}/assessments/new`,
  assessment: (id: string) => `${BIZCAR_BASE}/assessments/${id}`,
  assessmentStep: (id: string, step: string) => `${BIZCAR_BASE}/assessments/${id}/${step}`,
  organization: (id: string) => `${BIZCAR_BASE}/organizations/${id}`,
  admin: `${BIZCAR_BASE}/admin`,
  adminStandards: `${BIZCAR_BASE}/admin/standards`,
  adminStandardsMtua: `${BIZCAR_BASE}/admin/standards/mtua`,
  adminUsers: `${BIZCAR_BASE}/admin/users`,
  adminOrganizations: `${BIZCAR_BASE}/admin/organizations`,
  adminAudit: `${BIZCAR_BASE}/admin/audit-log`,
} as const;

export function isBizcarAppPath(pathname: string): boolean {
  return pathname === BIZCAR_BASE || pathname.startsWith(`${BIZCAR_BASE}/`);
}

export function isPublicBizcarAppPath(pathname: string): boolean {
  return (
    pathname === bizcarPath.home ||
    pathname === bizcarPath.engine ||
    pathname === bizcarPath.login ||
    pathname.startsWith("/api/bizcar/auth")
  );
}

export function safeBizcarNext(next: string | null | undefined): string {
  if (!next) return bizcarPath.dashboard;
  if (next.startsWith(`${BIZCAR_BASE}/`) || next === BIZCAR_BASE) return next;
  return bizcarPath.dashboard;
}
