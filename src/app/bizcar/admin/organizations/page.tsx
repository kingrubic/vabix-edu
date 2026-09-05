import Link from "next/link";
import { requireSession } from "@/security/guards";
import { isPlatformAdmin } from "@/security/rbac";
import { redirect } from "next/navigation";
import { loadStore } from "@/db/store";
import { BizcarShell } from "@/components/bizcar/Shell";
import { DemoMark, Panel } from "@/components/bizcar/Ui";

export const metadata = { title: "Tổ chức — MyBizCar", robots: { index: false, follow: false } };

export default async function AdminOrganizationsPage() {
  await loadStore();
  const user = await requireSession();
  if (!isPlatformAdmin(user.access)) redirect("/bizcar/dashboard");
  const store = await loadStore();
  return (
    <BizcarShell user={user} title="Tổ chức">
      <div className="mx-auto max-w-4xl space-y-3 px-4 py-8">
        {store.organizations.map((org) => (
          <Panel key={org.id}>
            <div className="flex items-center gap-2">
              <Link href={`/bizcar/organizations/${org.id}`} className="text-lg font-semibold">
                {org.name}
              </Link>
              <DemoMark show={org.isDemo} />
            </div>
            <p className="text-sm text-white/50">{org.industry}</p>
          </Panel>
        ))}
      </div>
    </BizcarShell>
  );
}
