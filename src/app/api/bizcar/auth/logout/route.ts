import { NextResponse } from "next/server";
import { revokeJti } from "@/db/repo";
import { cookieOptions, SESSION_COOKIE } from "@/security/auth";
import { getCurrentUser } from "@/security/session";
import { bizcarPath } from "@/lib/bizcarPaths";

export async function POST() {
  const user = await getCurrentUser();
  if (user) await revokeJti(user.id, user.claims.jti);
  const response = NextResponse.json({ ok: true, next: bizcarPath.login });
  response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return response;
}
