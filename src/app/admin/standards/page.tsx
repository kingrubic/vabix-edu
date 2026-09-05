import Link from "next/link";
import { requireSession } from "@/security/guards";
import { isAcademicAdmin } from "@/security/rbac";
import { redirect } from "next/navigation";
import { loadStore } from "@/db/store";
import { BizcarShell } from "@/components/bizcar/Shell";
import { Panel } from "@/components/bizcar/Ui";

export const metadata = { title: "Chuẩn — MyBizCar", robots: { index: false, follow: false } };

export default async function StandardsPage() {
  await loadStore();
  const user = await requireSession();
  if (!isAcademicAdmin(user.access)) redirect("/dashboard");
  const store = await loadStore();
  return (
    <BizcarShell user={user} title="Standards CMS">
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
        {store.standardVersions.map((version) => (
          <Panel key={version.id}>
            <p className="eyebrow">{version.status}</p>
            <h2 className="text-xl font-semibold">
              {version.name} · {version.version}
            </h2>
            <p className="mt-2 text-sm text-white/60">{version.developmentDisclaimer}</p>
            <Link href="/admin/standards/mtua" className="mt-3 inline-flex min-h-11 text-vabix-gold">
              Quản lý MTUA
            </Link>
          </Panel>
        ))}
      </div>
    </BizcarShell>
  );
}
