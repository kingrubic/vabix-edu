import { NextResponse } from "next/server";
import { loginWithPassword } from "@/features/auth/login";
import { cookieOptions, signSession } from "@/security/auth";
import { SESSION_COOKIE } from "@/security/jwt";
import { safeBizcarNext } from "@/lib/bizcarPaths";

async function readCredentials(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { email?: unknown; password?: unknown; next?: unknown };
    return {
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
      next: typeof body.next === "string" ? body.next : "",
    };
  }
  const form = await request.formData();
  return {
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
    next: String(form.get("next") ?? ""),
  };
}

export async function POST(request: Request) {
  const credentials = await readCredentials(request);
  const result = await loginWithPassword(credentials.email, credentials.password);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status ?? 401 });
  }

  const { token } = await signSession({
    sub: result.user.id,
    email: result.user.email,
    name: result.user.name,
  });
  const response = NextResponse.json({
    ok: true,
    next: safeBizcarNext(credentials.next),
    user: { email: result.user.email, name: result.user.name },
  });
  response.cookies.set(SESSION_COOKIE, token, cookieOptions());
  return response;
}
