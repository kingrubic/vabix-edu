import { findUserByEmail } from "@/db/repo";
import { loadStore } from "@/db/store";
import { verifyPassword } from "@/security/auth";
import { rateLimit } from "@/security/rateLimit";
import { loginSchema } from "./schema";

export type LoginResult =
  | { ok: true; user: { id: string; email: string; name: string } }
  | { ok: false; error: string; status?: number };

export async function loginWithPassword(email: string, password: string): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const limited = rateLimit(`login:${parsed.data.email.toLowerCase()}`, 8, 10 * 60 * 1000);
  if (!limited.ok) return { ok: false, error: "Quá nhiều lần đăng nhập. Thử lại sau.", status: 429 };

  try {
    await loadStore();
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Chưa kết nối được kho dữ liệu MyBizCar.",
      status: 503,
    };
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user || !user.isActive) return { ok: false, error: "Email hoặc mật khẩu không đúng.", status: 401 };
  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return { ok: false, error: "Email hoặc mật khẩu không đúng.", status: 401 };

  return { ok: true, user: { id: user.id, email: user.email, name: user.name } };
}
