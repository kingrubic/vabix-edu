import { requireSession } from "@/security/guards";
import { isPlatformAdmin } from "@/security/rbac";
import { redirect } from "next/navigation";
import { loadStore } from "@/db/store";
import { BizcarShell } from "@/components/bizcar/Shell";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { Panel, PrimaryButton } from "@/components/bizcar/Ui";
import { toggleUserAction } from "@/features/admin/actions";

export const metadata = { title: "Người dùng — MyBizCar", robots: { index: false, follow: false } };

export default async function UsersPage() {
  await loadStore();
  const user = await requireSession();
  if (!isPlatformAdmin(user.access)) redirect("/bizcar/dashboard");
  const store = await loadStore();
  return (
    <BizcarShell user={user} title="Người dùng">
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-8">
        {store.users.map((row) => (
          <Panel key={row.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{row.name}</p>
                <p className="text-sm text-white/50">{row.email}</p>
                <p className="text-xs text-white/40">{row.isDemo ? "DEMO" : "thật"} · {row.isActive ? "đang hoạt động" : "đã khóa"}</p>
              </div>
              <ActionForm action={toggleUserAction}>
                <input type="hidden" name="userId" value={row.id} />
                <PrimaryButton>{row.isActive ? "Vô hiệu hóa" : "Kích hoạt"}</PrimaryButton>
              </ActionForm>
            </div>
          </Panel>
        ))}
      </div>
    </BizcarShell>
  );
}
