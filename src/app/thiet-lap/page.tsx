import { nowIso, newId } from "@/platform/db/client";
import { hashPassword } from "@/security/auth";
import { bootPlatform } from "@/platform/boot";
import { redirect } from "next/navigation";
import { writeAuditAsync } from "@/platform/audit";
import { convexCountAdmins, convexUpsertUser } from "@/platform/convex/repo";
import { isPlatformConvexConfigured } from "@/platform/convex/client";

export default async function SetupPage() {
  await bootPlatform();
  if (!isPlatformConvexConfigured()) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <h1 className="text-2xl font-semibold text-[#163c3e]">Chưa kết nối Convex</h1>
        <p className="mt-2 text-sm text-[#66746f]">
          Đặt CONVEX_URL và PLATFORM_CONVEX_SECRET trước khi tạo Admin nền tảng.
        </p>
      </div>
    );
  }
  const count = await convexCountAdmins();
  if (count > 0) redirect("/dang-nhap");
  async function create(formData: FormData) {
    "use server";
    await bootPlatform();
    const exists = await convexCountAdmins();
    if (exists > 0) redirect("/dang-nhap");
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const name = String(formData.get("name") ?? "Quản trị viên");
    const password = String(formData.get("password") ?? "");
    if (!email.includes("@") || password.length < 12) return;
    const hash = await hashPassword(password);
    const id = newId();
    const at = nowIso();
    await convexUpsertUser({
      id,
      email,
      name,
      passwordHash: hash,
      role: "admin",
      departmentId: null,
      status: "active",
      createdAt: at,
      updatedAt: at,
    });
    await writeAuditAsync({
      actorUserId: id,
      action: "user.bootstrap",
      entityType: "user",
      entityId: id,
      summary: "Tạo Admin đầu tiên từ trang thiết lập.",
    });
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
