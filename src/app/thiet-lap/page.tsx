import { getDb, nowIso, newId } from "@/platform/db/client";
import { hashPassword } from "@/security/auth";
import { bootPlatform } from "@/platform/boot";
import { redirect } from "next/navigation";
import { writeAudit } from "@/platform/audit";

export default async function SetupPage() {
  await bootPlatform();
  const count = (getDb().prepare(`SELECT COUNT(*) AS n FROM users WHERE role='admin'`).get() as { n: number }).n;
  if (count > 0) redirect("/dang-nhap");
  async function create(formData: FormData) {
    "use server";
    await bootPlatform();
    const exists = (getDb().prepare(`SELECT COUNT(*) AS n FROM users WHERE role='admin'`).get() as { n: number }).n;
    if (exists > 0) redirect("/dang-nhap");
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const name = String(formData.get("name") ?? "Quản trị viên");
    const password = String(formData.get("password") ?? "");
    if (!email.includes("@") || password.length < 12) return;
    const hash = await hashPassword(password);
    const id = newId();
    const at = nowIso();
    getDb()
      .prepare(
        `INSERT INTO users (id, email, name, password_hash, avatar_file_id, role, department_id, status, last_login_at, created_at, updated_at, created_by, updated_by, archived_at, is_seed)
         VALUES (?, ?, ?, ?, NULL, 'admin', NULL, 'active', NULL, ?, ?, NULL, NULL, NULL, 0)`,
      )
      .run(id, email, name, hash, at, at);
    writeAudit({ actorUserId: id, action: "user.bootstrap", entityType: "user", entityId: id, summary: "Tạo Admin đầu tiên từ trang thiết lập." });
    redirect("/dang-nhap");
  }
  return (
    <form action={create} className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Thiết lập Admin đầu tiên</h1>
      <p className="mt-2 text-sm text-[#66746f]">Chỉ mở khi chưa có tài khoản Admin. Không phải đăng ký công khai.</p>
      <label className="mt-6 text-sm">Họ tên<input className="input mt-1" name="name" required /></label>
      <label className="mt-3 text-sm">Email<input className="input mt-1" type="email" name="email" required /></label>
      <label className="mt-3 text-sm">Mật khẩu (tối thiểu 12 ký tự)<input className="input mt-1" type="password" name="password" minLength={12} required /></label>
      <button className="mt-6 min-h-11 bg-[#163c3e] text-white">Tạo Admin</button>
    </form>
  );
}
