"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revokeJti } from "@/db/repo";
import { cookieOptions, SESSION_COOKIE, signSession } from "@/security/auth";
import { getCurrentUser } from "@/security/session";
import { bizcarPath, safeBizcarNext } from "@/lib/bizcarPaths";
import { loginWithPassword } from "./login";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const result = await loginWithPassword(
    String(formData.get("email") ?? ""),
    String(formData.get("password") ?? ""),
  );
  if (!result.ok) return { error: result.error };

  const { token } = await signSession({
    sub: result.user.id,
    email: result.user.email,
    name: result.user.name,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, cookieOptions());
  redirect(safeBizcarNext(String(formData.get("next") ?? "")));
}

export async function logoutAction() {
  const user = await getCurrentUser();
  const jar = await cookies();
  if (user) await revokeJti(user.id, user.claims.jti);
  jar.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  redirect(bizcarPath.login);
}
