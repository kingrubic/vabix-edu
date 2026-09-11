"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/security/auth";
import { rateLimit } from "@/security/rateLimit";
import { getDb, nowIso, newId } from "@/platform/db/client";
import { writeAudit } from "@/platform/audit";
import { sendPlatformMail } from "@/platform/mail/send";
import {
  PLATFORM_SESSION_COOKIE,
  createSessionRecord,
  findPlatformUserByEmail,
  getPlatformActor,
  hashToken,
  platformCookieOptions,
  randomToken,
  revokeUserSessions,
  signPlatformSession,
  toActor,
} from "./session";
import { homePath } from "@/platform/permissions/evaluate";
import { safePlatformNext } from "./redirect";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ."),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự."),
});

export async function platformLoginAction(_prev: { error?: string } | null, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." };

  const limited = rateLimit(`platform-login:${parsed.data.email.toLowerCase()}`, 8, 10 * 60 * 1000);
  if (!limited.ok) return { error: "Quá nhiều lần đăng nhập. Vui lòng thử lại sau." };

  const user = findPlatformUserByEmail(parsed.data.email);
  if (!user || user.status !== "active" || !user.password_hash) {
    return { error: "Email hoặc mật khẩu không đúng." };
  }
  const ok = await verifyPassword(parsed.data.password, user.password_hash);
  if (!ok) return { error: "Email hoặc mật khẩu không đúng." };

  const { token, jti } = await signPlatformSession({ sub: user.id, email: user.email, name: user.name });
  createSessionRecord(user.id, jti);
  getDb().prepare(`UPDATE users SET last_login_at = ? WHERE id = ?`).run(nowIso(), user.id);
  const jar = await cookies();
  jar.set(PLATFORM_SESSION_COOKIE, token, platformCookieOptions());
  writeAudit({ actorUserId: user.id, action: "auth.login", entityType: "user", entityId: user.id, summary: "Đăng nhập nền tảng." });

  const actor = toActor(user, { sub: user.id, email: user.email, name: user.name, jti });
  const dest = safePlatformNext(String(formData.get("next") ?? ""), homePath(actor));
  redirect(dest);
}

export async function platformLogoutAction() {
  const actor = await getPlatformActor();
  const jar = await cookies();
  if (actor) {
    revokeUserSessions(actor.id, actor.claims.jti);
    getDb().prepare(`UPDATE auth_sessions SET revoked_at = ? WHERE id = ?`).run(nowIso(), actor.claims.jti);
    writeAudit({ actorUserId: actor.id, action: "auth.logout", entityType: "user", entityId: actor.id, summary: "Đăng xuất." });
  }
  jar.set(PLATFORM_SESSION_COOKIE, "", { ...platformCookieOptions(), maxAge: 0 });
  redirect("/dang-nhap");
}

export async function requestPasswordResetAction(_prev: { message: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const generic = "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi khi dịch vụ email đã kết nối.";
  const limited = rateLimit(`platform-reset:${email || "unknown"}`, 5, 15 * 60 * 1000);
  if (!limited.ok) return { message: generic };
  if (!email) return { message: generic };

  const user = findPlatformUserByEmail(email);
  if (!user || user.status === "archived") return { message: generic };

  const token = randomToken();
  getDb()
    .prepare(
      `INSERT INTO auth_tokens (id, user_id, purpose, token_hash, expires_at, used_at, created_at, created_by)
       VALUES (?, ?, 'reset', ?, ?, NULL, ?, NULL)`,
    )
    .run(newId(), user.id, hashToken(token), new Date(Date.now() + 60 * 60 * 1000).toISOString(), nowIso());

  const link = `${process.env.PLATFORM_PUBLIC_URL ?? ""}/dat-lai-mat-khau?token=${token}`;
  const mail = await sendPlatformMail({
    to: user.email,
    subject: "Đặt lại mật khẩu VABIX",
    text: `Dùng liên kết sau trong vòng 60 phút để đặt mật khẩu mới:\n${link || "/dat-lai-mat-khau?token=***"}`,
  });
  writeAudit({
    actorUserId: user.id,
    action: "auth.reset_requested",
    entityType: "user",
    entityId: user.id,
    summary: mail.ok ? "Đã gửi yêu cầu đặt lại mật khẩu." : "Yêu cầu đặt lại mật khẩu — email chưa gửi được.",
    metadata: { mail: mail.ok ? "sent" : mail.code },
  });
  if (!mail.ok) {
    return {
      message: `${generic} ${mail.message}`,
    };
  }
  return { message: generic };
}

export async function resetPasswordAction(_prev: { error?: string; ok?: boolean } | null, formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 10) return { error: "Mật khẩu mới tối thiểu 10 ký tự." };
  if (password !== confirm) return { error: "Xác nhận mật khẩu không khớp." };
  const row = getDb()
    .prepare(
      `SELECT * FROM auth_tokens WHERE token_hash = ? AND purpose = 'reset' AND used_at IS NULL AND expires_at > ?`,
    )
    .get(hashToken(token), nowIso()) as { id: string; user_id: string } | undefined;
  if (!row) return { error: "Liên kết không hợp lệ hoặc đã hết hạn." };
  const passwordHash = await hashPassword(password);
  getDb().prepare(`UPDATE users SET password_hash = ?, status = CASE WHEN status = 'pending' THEN 'active' ELSE status END, updated_at = ? WHERE id = ?`).run(
    passwordHash,
    nowIso(),
    row.user_id,
  );
  getDb().prepare(`UPDATE auth_tokens SET used_at = ? WHERE id = ?`).run(nowIso(), row.id);
  revokeUserSessions(row.user_id);
  writeAudit({ actorUserId: row.user_id, action: "auth.reset_completed", entityType: "user", entityId: row.user_id, summary: "Đặt lại mật khẩu thành công." });
  return { ok: true };
}

export async function activateAccountAction(_prev: { error?: string; ok?: boolean } | null, formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (password.length < 10) return { error: "Mật khẩu tối thiểu 10 ký tự." };
  if (password !== confirm) return { error: "Xác nhận mật khẩu không khớp." };
  const row = getDb()
    .prepare(
      `SELECT * FROM auth_tokens WHERE token_hash = ? AND purpose = 'activation' AND used_at IS NULL AND expires_at > ?`,
    )
    .get(hashToken(token), nowIso()) as { id: string; user_id: string } | undefined;
  if (!row) return { error: "Liên kết kích hoạt không hợp lệ hoặc đã hết hạn." };
  const passwordHash = await hashPassword(password);
  getDb()
    .prepare(`UPDATE users SET password_hash = ?, name = COALESCE(NULLIF(?, ''), name), status = 'active', updated_at = ? WHERE id = ?`)
    .run(passwordHash, name, nowIso(), row.user_id);
  getDb().prepare(`UPDATE auth_tokens SET used_at = ? WHERE id = ?`).run(nowIso(), row.id);
  writeAudit({ actorUserId: row.user_id, action: "auth.activated", entityType: "user", entityId: row.user_id, summary: "Kích hoạt tài khoản." });
  return { ok: true };
}
