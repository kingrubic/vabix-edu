import { requireSession } from "@/security/guards";
import { listOrganizationsForUser } from "@/db/repo";
import { createAssessmentAction } from "@/features/assessments/actions";
import { BizcarShell } from "@/components/bizcar/Shell";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { Field, Panel, PrimaryButton } from "@/components/bizcar/Ui";
import { loadStore } from "@/db/store";

export const metadata = { title: "Tạo đánh giá — MyBizCar", robots: { index: false, follow: false } };

export default async function NewAssessmentPage() {
  await loadStore();
  const user = await requireSession();
  const organizations = (await listOrganizationsForUser(user.id)).filter((item) => item.slug !== "vabix-platform");
  return (
    <BizcarShell user={user} title="Tạo đánh giá mới">
      <div className="mx-auto max-w-xl px-4 py-10">
        <Panel>
          <h1 className="text-2xl font-semibold">Đánh giá MTUA mới</h1>
          <ActionForm action={createAssessmentAction} className="mt-6 space-y-4">
            <Field label="Doanh nghiệp">
              <select className="bizcar-input" name="organizationId" required>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tiêu đề">
              <input className="bizcar-input" name="title" required placeholder="Đánh giá MTUA — kỳ …" />
            </Field>
            <PrimaryButton>Tạo và nhập ngữ cảnh</PrimaryButton>
          </ActionForm>
        </Panel>
      </div>
    </BizcarShell>
  );
}
