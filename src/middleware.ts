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

function continueWithPath(request: NextRequest, effectivePath: string, rewriteTo?: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", effectivePath);

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
  const { pathname } = request.nextUrl;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const rewritten = rewriteBizcarHostPath(pathname);

  if (rewritten && (isBizcarHost(host) || (pathname === "/" && shouldServeBizcarAtRoot(host)))) {
    const response = continueWithPath(request, rewritten, rewritten);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  if (rewritten && pathname !== "/" && !pathname.startsWith("/bizcar") && !isBizcarHost(host)) {
    const url = request.nextUrl.clone();
    url.pathname = rewritten;
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

  const response = continueWithPath(request, pathname);
  if (isBizcarPath(pathname) || isBizcarHost(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
