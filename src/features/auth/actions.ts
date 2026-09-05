"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByEmail, revokeJti } from "@/db/repo";
import { loadStore } from "@/db/store";
import { cookieOptions, SESSION_COOKIE, signSession, verifyPassword } from "@/security/auth";
import { getCurrentUser } from "@/security/session";
import { rateLimit } from "@/security/rateLimit";
import { loginSchema } from "./schema";
import { bizcarPath, safeBizcarNext } from "@/lib/bizcarPaths";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  await loadStore();
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const limited = rateLimit(`login:${parsed.data.email.toLowerCase()}`, 8, 10 * 60 * 1000);
  if (!limited.ok) return { error: "Quá nhiều lần đăng nhập. Thử lại sau." };

  const user = await findUserByEmail(parsed.data.email);
  if (!user || !user.isActive) return { error: "Email hoặc mật khẩu không đúng." };
  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return { error: "Email hoặc mật khẩu không đúng." };

  const { token } = await signSession({ sub: user.id, email: user.email, name: user.name });
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
