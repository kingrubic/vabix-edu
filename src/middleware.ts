import { NextResponse, type NextRequest } from "next/server";
import {
  isBizcarHost,
  isBizcarPath,
  isPublicBizcarPath,
  rewriteBizcarHostPath,
  shouldServeBizcarAtRoot,
} from "@/security/routes";
import { bizcarPath } from "@/lib/bizcarPaths";
import { SESSION_COOKIE, verifySession } from "@/security/jwt";
import {
  PLATFORM_SESSION_COOKIE,
  isPlatformProtectedPath,
  verifyPlatformSession,
} from "@/platform/auth/jwt";
import { isLocaleSkipped, LOCALE_HEADER, stripLocale } from "@/i18n/locale";

function continueWithPath(request: NextRequest, effectivePath: string, rewriteTo?: string, locale?: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", effectivePath);
  if (locale) requestHeaders.set(LOCALE_HEADER, locale);

  if (rewriteTo && rewriteTo !== request.nextUrl.pathname) {
    const url = request.nextUrl.clone();
    url.pathname = rewriteTo;
    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    response.headers.set("x-pathname", effectivePath);
    return response;
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-pathname", effectivePath);
  return response;
}

export async function middleware(request: NextRequest) {
  const rawPath = request.nextUrl.pathname;
  const localePrefixed = rawPath === "/en" || rawPath.startsWith("/en/");
  const pathname = localePrefixed ? stripLocale(rawPath) : rawPath;

  if (localePrefixed && isLocaleSkipped(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url);
  }

  const locale = localePrefixed ? "en" : undefined;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const rewritten = rewriteBizcarHostPath(pathname, host);

  if (rewritten && (isBizcarHost(host) || (pathname === "/" && shouldServeBizcarAtRoot(host)))) {
    const response = continueWithPath(request, rewritten, rewritten, locale);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  if (rewritten && pathname !== "/" && !pathname.startsWith("/bizcar") && !isBizcarHost(host)) {
    const url = request.nextUrl.clone();
    url.pathname = rewritten;
    return NextResponse.redirect(url);
  }

  if (isPlatformProtectedPath(pathname)) {
    const token = request.cookies.get(PLATFORM_SESSION_COOKIE)?.value;
    const session = token ? await verifyPlatformSession(token) : null;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/dang-nhap";
      url.searchParams.set("next", pathname);
      const response = NextResponse.redirect(url);
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }
  }

  if (isBizcarPath(pathname) && !isPublicBizcarPath(pathname)) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = bizcarPath.login;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  const response = continueWithPath(request, pathname, localePrefixed ? pathname : undefined, locale);
  if (
    isBizcarPath(pathname) ||
    isBizcarHost(host) ||
    isPlatformProtectedPath(pathname) ||
    pathname.startsWith("/dang-nhap")
  ) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
