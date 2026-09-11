/** Bump this when a release must drop stale browser/CDN HTML+JS for every visitor. */
export const CACHE_BUST_VERSION = "20260911-qa";
export const CACHE_BUST_COOKIE = "vabix_cv";
export const CACHE_BUST_PARAM = "_cv";

const BOT_UA =
  /bot|crawler|spider|preview|facebookexternalhit|pingdom|slurp|duckduckbot|bingpreview|lighthouse|pagespeed/i;

export function hasFreshCacheCookie(cookieValue: string | undefined): boolean {
  return cookieValue === CACHE_BUST_VERSION;
}

export function isCacheBustDocumentRequest(input: {
  method: string;
  dest: string | null;
  prefetch: boolean;
  rsc: boolean;
  userAgent: string | null;
}): boolean {
  if (input.method !== "GET" && input.method !== "HEAD") return false;
  if (input.prefetch || input.rsc) return false;
  if (input.userAgent && BOT_UA.test(input.userAgent)) return false;
  return input.dest === "document";
}

export function needsCacheBustRedirect(input: {
  cookieValue: string | undefined;
  paramValue: string | null;
}): boolean {
  if (hasFreshCacheCookie(input.cookieValue)) return false;
  return input.paramValue !== CACHE_BUST_VERSION;
}

export const documentCacheControl = {
  "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Cloudflare-CDN-Cache-Control": "no-store",
} as const;
