import Link from "next/link";
import { requireSession } from "@/security/guards";
import { isAcademicAdmin, isPlatformAdmin } from "@/security/rbac";
import { BizcarShell } from "@/components/bizcar/Shell";
import { Panel } from "@/components/bizcar/Ui";
import { redirect } from "next/navigation";
import { loadStore } from "@/db/store";

export const metadata = { title: "Quản trị — MyBizCar", robots: { index: false, follow: false } };

export default async function AdminPage() {
  await loadStore();
  const user = await requireSession();
  if (!isPlatformAdmin(user.access) && !isAcademicAdmin(user.access)) redirect("/dashboard");
  return (
    <BizcarShell user={user} title="Quản trị nền tảng">
      <div className="mx-auto grid max-w-4xl gap-4 px-4 py-10 md:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-semibold">Chuẩn học thuật</h2>
          <Link href="/admin/standards" className="mt-3 inline-flex min-h-11 text-vabix-gold">
            Mở Standards CMS
          </Link>
        </Panel>
        <Panel>
          <h2 className="text-xl font-semibold">Người dùng</h2>
          <Link href="/admin/users" className="mt-3 inline-flex min-h-11 text-vabix-gold">
            Danh sách tài khoản
          </Link>
        </Panel>
        <Panel>
          <h2 className="text-xl font-semibold">Doanh nghiệp</h2>
          <Link href="/admin/organizations" className="mt-3 inline-flex min-h-11 text-vabix-gold">
            Tổ chức
          </Link>
        </Panel>
        <Panel>
          <h2 className="text-xl font-semibold">Nhật ký kiểm toán</h2>
          <Link href="/admin/audit-log" className="mt-3 inline-flex min-h-11 text-vabix-gold">
            Audit log
          </Link>
        </Panel>
      </div>
    </BizcarShell>
  );
}
