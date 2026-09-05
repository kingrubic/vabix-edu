import { requireSession } from "@/security/guards";
import { isAcademicAdmin } from "@/security/rbac";
import { redirect } from "next/navigation";
import { loadStore } from "@/db/store";
import { BizcarShell } from "@/components/bizcar/Shell";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { Field, Panel, PrimaryButton } from "@/components/bizcar/Ui";
import { updateCfsWeightAction } from "@/features/admin/actions";
import { CFS_WEIGHT_DISCLAIMER } from "@/domain/labels";

export const metadata = { title: "Chuẩn MTUA — MyBizCar", robots: { index: false, follow: false } };

export default async function MtuaStandardPage() {
  await loadStore();
  const user = await requireSession();
  if (!isAcademicAdmin(user.access)) redirect("/dashboard");
  const store = await loadStore();
  const connections = store.standardCfsConnections;
  const criteria = store.standardCriteria;
  return (
    <BizcarShell user={user} title="BMDO MDS 01 MTUA">
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <Panel>
          <h1 className="text-2xl font-semibold">Phiên bản chuẩn — không ghi đè khi đã có đánh giá</h1>
          <p className="mt-2 text-sm text-white/60">{CFS_WEIGHT_DISCLAIMER}</p>
        </Panel>
        {connections
          .filter((item) => item.standardVersionId === store.standardVersions[0]?.id)
          .map((connection) => (
            <ActionForm key={connection.id} action={updateCfsWeightAction} className="bizcar-panel grid gap-3 p-5 md:grid-cols-3">
              <input type="hidden" name="connectionCode" value={connection.code} />
              <p className="font-semibold">
                {connection.code} · trọng số hiện tại {connection.weight}
              </p>
              <Field label="Trọng số mới">
                <input className="bizcar-input" name="weight" type="number" step="0.1" defaultValue={connection.weight} />
              </Field>
              <Field label="Lý do thay đổi">
                <input className="bizcar-input" name="changeReason" required />
              </Field>
              <PrimaryButton>Cập nhật / fork phiên bản</PrimaryButton>
            </ActionForm>
          ))}
        <Panel>
          <h2 className="text-xl font-semibold">Tiêu chí (seed 0.1)</h2>
          <ul className="mt-3 columns-2 text-sm text-white/70">
            {criteria.map((item) => (
              <li key={item.id}>
                {item.code} {item.nameVi} · {item.weight}
                {item.critical ? " · tới hạn" : ""}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </BizcarShell>
  );
}
