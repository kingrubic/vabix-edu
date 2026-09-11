import { NextResponse, type NextRequest } from "next/server";
import {
  isAssetPath,
  isBizcarHost,
  isBizcarPath,
  isPublicBizcarPath,
  rewriteBizcarHostPath,
  shouldServeBizcarAtRoot,
  wwwCanonicalRedirectUrl,
} from "@/security/routes";
import { bizcarPath } from "@/lib/bizcarPaths";
import {
  CACHE_BUST_COOKIE,
  CACHE_BUST_PARAM,
  CACHE_BUST_VERSION,
  documentCacheControl,
  hasFreshCacheCookie,
  isCacheBustDocumentRequest,
  needsCacheBustRedirect,
} from "@/lib/cacheBust";
import { SESSION_COOKIE, verifySession } from "@/security/jwt";

function isHttps(request: NextRequest) {
  return request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
}

function applyDocumentCacheHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(documentCacheControl)) {
    response.headers.set(key, value);
  }
}

function stampCacheBustCookie(response: NextResponse, request: NextRequest) {
  response.cookies.set(CACHE_BUST_COOKIE, CACHE_BUST_VERSION, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: isHttps(request),
    httpOnly: true,
  });
}

function bustStaleClientCache(request: NextRequest, response: NextResponse) {
  if (hasFreshCacheCookie(request.cookies.get(CACHE_BUST_COOKIE)?.value)) {
    return response;
  }
  stampCacheBustCookie(response, request);
  response.headers.set("Clear-Site-Data", '"cache"');
  return response;
}

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
  const incomingHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const wwwRedirect = wwwCanonicalRedirectUrl(incomingHost, pathname, request.nextUrl.search);
  if (wwwRedirect) {
    return NextResponse.redirect(wwwRedirect, 301);
  }

  if (isAssetPath(pathname)) {
    return bustStaleClientCache(request, NextResponse.next());
  }

  const documentRequest = isCacheBustDocumentRequest({
    method: request.method,
    dest: request.headers.get("sec-fetch-dest"),
    prefetch: request.headers.has("next-router-prefetch"),
    rsc: request.headers.has("rsc") || request.headers.has("next-router-prefetch"),
    userAgent: request.headers.get("user-agent"),
  });

  if (
    documentRequest &&
    needsCacheBustRedirect({
      cookieValue: request.cookies.get(CACHE_BUST_COOKIE)?.value,
      paramValue: request.nextUrl.searchParams.get(CACHE_BUST_PARAM),
    })
  ) {
    const url = request.nextUrl.clone();
    url.searchParams.set(CACHE_BUST_PARAM, CACHE_BUST_VERSION);
    const redirect = NextResponse.redirect(url, 307);
    stampCacheBustCookie(redirect, request);
    applyDocumentCacheHeaders(redirect);
    redirect.headers.set("Clear-Site-Data", '"cache"');
    return redirect;
  }

  const host = incomingHost;
  const rewritten = rewriteBizcarHostPath(pathname);

  if (rewritten && (isBizcarHost(host) || (pathname === "/" && shouldServeBizcarAtRoot(host)))) {
    const response = continueWithPath(request, rewritten, rewritten);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    applyDocumentCacheHeaders(response);
    return bustStaleClientCache(request, response);
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
  applyDocumentCacheHeaders(response);
  if (isBizcarPath(pathname) || isBizcarHost(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return bustStaleClientCache(request, response);
}

export const config = {
  matcher: ["/:path*"],
};
