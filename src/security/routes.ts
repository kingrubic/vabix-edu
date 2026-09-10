import { isBizcarAppPath, isPublicBizcarAppPath } from "@/lib/bizcarPaths";

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

/** Local / Cursor preview — mở MyBizCar, không mở website VABIX. */
export function isLocalDevHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const normalized = host.split(":")[0].toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "0.0.0.0" ||
    normalized === "[::1]" ||
    normalized.endsWith(".localhost")
  );
}

/** `/` phục vụ MyBizCar trên local, preview, và host bizcar. Production vabix.edu.vn giữ trang VABIX. */
export function shouldServeBizcarAtRoot(host: string | null | undefined): boolean {
  return isBizcarHost(host) || isLocalDevHost(host) || process.env.NODE_ENV !== "production";
}

export function isBizcarPath(pathname: string): boolean {
  return isBizcarAppPath(pathname) || pathname.startsWith("/api/bizcar");
}

export function isPublicBizcarPath(pathname: string): boolean {
  return isPublicBizcarAppPath(pathname);
}

const HOST_ALIASES: Record<string, string> = {
  "/": "/bizcar",
  "/engine": "/bizcar/engine",
  "/login": "/bizcar/login",
  "/dashboard": "/bizcar/dashboard",
  "/assessments": "/bizcar/assessments",
  "/admin": "/bizcar/admin",
};

export function rewriteBizcarHostPath(pathname: string): string | null {
  if (HOST_ALIASES[pathname]) return HOST_ALIASES[pathname];
  for (const [from, to] of Object.entries(HOST_ALIASES)) {
    if (from !== "/" && pathname.startsWith(`${from}/`)) {
      return `${to}${pathname.slice(from.length)}`;
    }
  }
  if (pathname.startsWith("/organizations/")) return `/bizcar${pathname}`;
  return null;
}
