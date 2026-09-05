import { requireSession } from "@/security/guards";
import { isPlatformAdmin, isAcademicAdmin } from "@/security/rbac";
import { redirect } from "next/navigation";
import { loadStore } from "@/db/store";
import { BizcarShell } from "@/components/bizcar/Shell";
import { Panel } from "@/components/bizcar/Ui";

export const metadata = { title: "Nhật ký — MyBizCar", robots: { index: false, follow: false } };

export default async function AuditLogPage() {
  await loadStore();
  const user = await requireSession();
  if (!isPlatformAdmin(user.access) && !isAcademicAdmin(user.access)) redirect("/dashboard");
  const store = await loadStore();
  return (
    <BizcarShell user={user} title="Nhật ký kiểm toán">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8">
        {store.auditLogs.map((row) => (
          <Panel key={row.id}>
            <p className="text-xs text-white/40">{row.createdAt}</p>
            <p className="font-semibold">{row.action}</p>
            <p className="text-sm text-white/65">
              {row.entityType} {row.entityId} · {row.oldValue ?? "∅"} → {row.newValue ?? "∅"}
            </p>
            <p className="text-xs text-white/50">{row.reason}</p>
          </Panel>
        ))}
      </div>
    </BizcarShell>
  );
}
