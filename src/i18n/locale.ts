export type Locale = "vi" | "en";

export const LOCALE_HEADER = "x-locale";

const LOCALE_SKIP = [/^\/admin(?:\/|$)/, /^\/bizcar(?:\/|$)/, /^\/dang-nhap(?:\/|$)/, /^\/giang-day(?:\/|$)/, /^\/hoc-tap(?:\/|$)/, /^\/lam-viec(?:\/|$)/, /^\/api(?:\/|$)/];

export function isLocaleSkipped(pathname: string) {
  return LOCALE_SKIP.some((pattern) => pattern.test(pathname));
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "vi";
}

export function stripLocale(pathname: string) {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/";
  return pathname;
}

export function withLocale(href: string, locale: Locale) {
  if (locale === "vi" || !href.startsWith("/") || href.startsWith("//")) return href;
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const path = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const [base, query] = path.split("?");
  if (base === "/en" || base.startsWith("/en/")) return href;
  const localized = base === "/" ? "/en" : `/en${base}`;
  return `${localized}${query ? `?${query}` : ""}${hash}`;
}

export function switchLocalePath(pathname: string, next: Locale) {
  const bare = stripLocale(pathname);
  return withLocale(bare || "/", next);
}
