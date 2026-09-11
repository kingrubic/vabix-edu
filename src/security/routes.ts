import { isBizcarAppPath, isPublicBizcarAppPath } from "@/lib/bizcarPaths";

function hostname(host: string | null | undefined): string {
  return (host ?? "").split(":")[0].toLowerCase();
}

export function isBizcarHost(host: string | null | undefined): boolean {
  const normalized = hostname(host);
  if (!normalized) return false;
  return (
    normalized === "bizcar.vabix.edu.vn" ||
    normalized.endsWith(".bizcar.vabix.edu.vn") ||
    normalized === "bizcar.localhost" ||
    process.env.BIZCAR_HOST === normalized
  );
}

export const CANONICAL_HOST = "vabix.edu.vn";
export const CANONICAL_ORIGIN = "https://vabix.edu.vn";

/** Public VABIX corporate domains — never serve MyBizCar at `/`. */
export function isVabixCorporateHost(host: string | null | undefined): boolean {
  const normalized = hostname(host);
  return (
    normalized === CANONICAL_HOST ||
    normalized === `www.${CANONICAL_HOST}` ||
    normalized === "vabix.vn" ||
    normalized === "www.vabix.vn"
  );
}

/** Apex-only canonical. `www.vabix.edu.vn` must 301 here — never serve duplicate HTML. */
export function wwwCanonicalRedirectUrl(
  host: string | null | undefined,
  pathname: string,
  search = "",
): string | null {
  if (hostname(host) !== `www.${CANONICAL_HOST}`) return null;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${CANONICAL_ORIGIN}${path === "/" ? "/" : path}${search}`;
}

/** Local / Cursor preview — mở MyBizCar, không mở website VABIX. */
export function isLocalDevHost(host: string | null | undefined): boolean {
  const normalized = hostname(host);
  if (!normalized) return false;
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "0.0.0.0" ||
    normalized === "[::1]" ||
    normalized.endsWith(".localhost")
  );
}

/**
 * `/` serves MyBizCar only on local/preview and the bizcar host.
 * Never key this off NODE_ENV — a production build on vabix.edu.vn must keep the corporate homepage.
 */
export function shouldServeBizcarAtRoot(host: string | null | undefined): boolean {
  if (isVabixCorporateHost(host)) return false;
  return isBizcarHost(host) || isLocalDevHost(host);
}

export function corporateHomePath(host: string | null | undefined): string {
  return shouldServeBizcarAtRoot(host) ? "/vabix" : "/";
}

export function isAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/brand/") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|js|css|map|woff2?|ico|txt)$/i.test(pathname)
  );
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
  if (isAssetPath(pathname) || pathname.startsWith("/api/")) return null;
  if (HOST_ALIASES[pathname]) return HOST_ALIASES[pathname];
  for (const [from, to] of Object.entries(HOST_ALIASES)) {
    if (from !== "/" && pathname.startsWith(`${from}/`)) {
      return `${to}${pathname.slice(from.length)}`;
    }
  }
  if (pathname.startsWith("/organizations/")) return `/bizcar${pathname}`;
  return null;
}
