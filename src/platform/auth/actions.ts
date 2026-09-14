"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/security/auth";
import { rateLimit } from "@/security/rateLimit";
import { isPlatformConvexConfigured } from "@/platform/convex/client";
import {
  convexCreateToken,
  convexFindValidToken,
  convexMarkTokenUsed,
  convexTouchLastLogin,
  convexUpdatePassword,
} from "@/platform/convex/repo";
import { writeAuditAsync } from "@/platform/audit";
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
  if (!isPlatformConvexConfigured()) {
    return { error: "Hệ thống đăng nhập chưa kết nối Convex. Kiểm tra CONVEX_URL và PLATFORM_CONVEX_SECRET." };
  }

  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." };

  const limited = rateLimit(`platform-login:${parsed.data.email.toLowerCase()}`, 8, 10 * 60 * 1000);
  if (!limited.ok) return { error: "Quá nhiều lần đăng nhập. Vui lòng thử lại sau." };

  const user = await findPlatformUserByEmail(parsed.data.email);
  if (!user || user.status !== "active" || !user.password_hash) {
    return { error: "Email hoặc mật khẩu không đúng." };
  }
  const ok = await verifyPassword(parsed.data.password, user.password_hash);
  if (!ok) return { error: "Email hoặc mật khẩu không đúng." };

  const { token, jti } = await signPlatformSession({ sub: user.id, email: user.email, name: user.name });
  await createSessionRecord(user.id, jti);
  await convexTouchLastLogin(user.id);
  const jar = await cookies();
  jar.set(PLATFORM_SESSION_COOKIE, token, platformCookieOptions());
  await writeAuditAsync({
    actorUserId: user.id,
    action: "auth.login",
    entityType: "user",
    entityId: user.id,
    summary: "Đăng nhập nền tảng.",
  });

  const actor = toActor(user, { sub: user.id, email: user.email, name: user.name, jti });
  if (user.must_change_password) redirect("/doi-mat-khau");
  const dest = safePlatformNext(String(formData.get("next") ?? ""), homePath(actor));
  redirect(dest);
}

export async function platformLogoutAction() {
  const actor = await getPlatformActor();
  const jar = await cookies();
  if (actor) {
    await revokeUserSessions(actor.id, actor.claims.jti);
    await writeAuditAsync({
      actorUserId: actor.id,
      action: "auth.logout",
      entityType: "user",
      entityId: actor.id,
      summary: "Đăng xuất.",
    });
  }
  jar.set(PLATFORM_SESSION_COOKIE, "", { ...platformCookieOptions(), maxAge: 0 });
  redirect("/dang-nhap");
}

export async function requestPasswordResetAction(_prev: { message: string } | null, formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const generic = "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi khi dịch vụ email đã kết nối.";
  const limited = rateLimit(`platform-reset:${email || "unknown"}`, 5, 15 * 60 * 1000);
  if (!limited.ok) return { message: generic };
  if (!email) return { message: generic };

  const user = await findPlatformUserByEmail(email);
  if (!user || user.status === "archived") return { message: generic };

  const token = randomToken();
  await convexCreateToken({
    userId: user.id,
    purpose: "reset",
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  });

  const link = `${process.env.PLATFORM_PUBLIC_URL ?? ""}/dat-lai-mat-khau?token=${token}`;
  const mail = await sendPlatformMail({
    to: user.email,
    subject: "Đặt lại mật khẩu VABIX",
    text: `Dùng liên kết sau trong vòng 60 phút để đặt mật khẩu mới:\n${link || "/dat-lai-mat-khau?token=***"}`,
  });
  await writeAuditAsync({
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
  const row = await convexFindValidToken(hashToken(token), "reset");
  if (!row) return { error: "Liên kết không hợp lệ hoặc đã hết hạn." };
  const passwordHash = await hashPassword(password);
  await convexUpdatePassword({ userId: row.user_id, passwordHash, activatePending: true });
  await convexMarkTokenUsed(row.id);
  await revokeUserSessions(row.user_id);
  await writeAuditAsync({
    actorUserId: row.user_id,
    action: "auth.reset_completed",
    entityType: "user",
    entityId: row.user_id,
    summary: "Đặt lại mật khẩu thành công.",
  });
  return { ok: true };
}

export async function activateAccountAction(_prev: { error?: string; ok?: boolean } | null, formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (password.length < 10) return { error: "Mật khẩu tối thiểu 10 ký tự." };
  if (password !== confirm) return { error: "Xác nhận mật khẩu không khớp." };
  const row = await convexFindValidToken(hashToken(token), "activation");
  if (!row) return { error: "Liên kết kích hoạt không hợp lệ hoặc đã hết hạn." };
  const passwordHash = await hashPassword(password);
  await convexUpdatePassword({
    userId: row.user_id,
    passwordHash,
    name: name || undefined,
    forceActive: true,
  });
  await convexMarkTokenUsed(row.id);
  await writeAuditAsync({
    actorUserId: row.user_id,
    action: "auth.activated",
    entityType: "user",
    entityId: row.user_id,
    summary: "Kích hoạt tài khoản.",
  });
  return { ok: true };
}

export async function changeOwnPasswordAction(_prev: { error?: string } | null, formData: FormData) {
  const actor = await getPlatformActor();
  if (!actor) return { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  if (!actor.mustChangePassword) return { error: "Tài khoản không cần đổi mật khẩu bắt buộc." };

  const current = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 10) return { error: "Mật khẩu mới tối thiểu 10 ký tự." };
  if (password !== confirm) return { error: "Xác nhận mật khẩu không khớp." };

  const user = await findPlatformUserByEmail(actor.email);
  if (!user || user.status !== "active" || !user.password_hash) {
    return { error: "Không tìm thấy tài khoản." };
  }
  const currentOk = await verifyPassword(current, user.password_hash);
  if (!currentOk) return { error: "Mật khẩu tạm không đúng." };
  const reused = await verifyPassword(password, user.password_hash);
  if (reused) return { error: "Mật khẩu mới phải khác mật khẩu tạm." };

  const passwordHash = await hashPassword(password);
  await convexUpdatePassword({ userId: user.id, passwordHash, forceActive: true });
  await writeAuditAsync({
    actorUserId: user.id,
    action: "auth.password_changed",
    entityType: "user",
    entityId: user.id,
    summary: "Đổi mật khẩu tạm thành mật khẩu mới.",
  });
  redirect(homePath(toActor({ ...user, must_change_password: false }, actor.claims)));
}
