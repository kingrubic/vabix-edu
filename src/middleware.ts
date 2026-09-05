import { NextResponse, type NextRequest } from "next/server";
import { isBizcarHost, isBizcarPath, isPublicBizcarPath, rewriteBizcarHostPath } from "@/security/routes";
import { bizcarPath } from "@/lib/bizcarPaths";
import { SESSION_COOKIE, verifySession } from "@/security/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (isBizcarHost(host)) {
    const rewritten = rewriteBizcarHostPath(pathname);
    if (rewritten) {
      const url = request.nextUrl.clone();
      url.pathname = rewritten;
      const response = NextResponse.rewrite(url);
      response.headers.set("x-pathname", rewritten);
      return response;
    }
  }

  const legacy = rewriteBizcarHostPath(pathname);
  if (legacy && !isBizcarHost(host) && pathname !== "/" && !pathname.startsWith("/bizcar")) {
    const url = request.nextUrl.clone();
    url.pathname = legacy;
    return NextResponse.redirect(url);
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

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-pathname", pathname);
  if (isBizcarPath(pathname) || isBizcarHost(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
