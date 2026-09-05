export const BIZCAR_PREFIXES = [
  "/engine",
  "/login",
  "/dashboard",
  "/organizations",
  "/assessments",
  "/admin",
  "/api/bizcar",
] as const;

export function isBizcarHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const normalized = host.split(":")[0].toLowerCase();
  return (
    normalized === "bizcar.vabix.edu.vn" ||
    normalized.endsWith(".bizcar.vabix.edu.vn") ||
    normalized === "bizcar.localhost" ||
    process.env.BIZCAR_HOST === normalized
  );
}

export function isBizcarPath(pathname: string): boolean {
  return BIZCAR_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isPublicBizcarPath(pathname: string): boolean {
  return pathname === "/engine" || pathname === "/login" || pathname.startsWith("/api/bizcar/auth");
}
