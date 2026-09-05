import Link from "next/link";
import { requireOrgAccess } from "@/security/guards";
import { getOrganization, listAssessments } from "@/db/repo";
import { createOrganizationAction, inviteMemberAction } from "@/features/assessments/actions";
import { BizcarShell } from "@/components/bizcar/Shell";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { DemoMark, Field, Panel, PrimaryButton, StatusBadge } from "@/components/bizcar/Ui";
import { loadStore } from "@/db/store";
import { notFound } from "next/navigation";

export const metadata = { title: "Doanh nghiệp — MyBizCar", robots: { index: false, follow: false } };

export default async function OrganizationPage({ params }: { params: Promise<{ organizationId: string }> }) {
  await loadStore();
  const { organizationId } = await params;
  const user = await requireOrgAccess(organizationId);
  const organization = await getOrganization(organizationId);
  if (!organization) notFound();
  const assessments = await listAssessments(organizationId);
  return (
    <BizcarShell user={user} title={organization.name}>
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold">{organization.name}</h1>
          <DemoMark show={organization.isDemo} />
        </div>
        <p className="text-white/60">
          {organization.industry} · {organization.stage} · {organization.size}
        </p>
        <p className="text-sm text-amber-100/70">{organization.confidentialityNote}</p>
        <Link href="/bizcar/assessments/new" className="inline-flex min-h-11 items-center text-vabix-gold">
          Tạo đánh giá cho doanh nghiệp này
        </Link>
        {assessments.map((assessment) => (
          <Panel key={assessment.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/bizcar/assessments/${assessment.id}`} className="text-lg font-semibold">
                {assessment.title}
              </Link>
              <StatusBadge status={assessment.status} />
            </div>
          </Panel>
        ))}
        <Panel>
          <h2 className="text-xl font-semibold">Mời thành viên đã có tài khoản</h2>
          <ActionForm action={inviteMemberAction} className="mt-4 grid gap-3 md:grid-cols-3">
            <input type="hidden" name="organizationId" value={organization.id} />
            <Field label="Email">
              <input className="bizcar-input" name="email" type="email" required />
            </Field>
            <Field label="Vai trò">
              <select className="bizcar-input" name="role" defaultValue="COMPANY_MEMBER">
                <option value="COMPANY_ADMIN">Quản trị doanh nghiệp</option>
                <option value="COMPANY_MEMBER">Thành viên</option>
                <option value="COACH_EVALUATOR">Đánh giá viên</option>
                <option value="VIEWER">Người xem</option>
              </select>
            </Field>
            <div className="flex items-end">
              <PrimaryButton>Thêm</PrimaryButton>
            </div>
          </ActionForm>
        </Panel>
        <Panel>
          <h2 className="text-xl font-semibold">Tạo doanh nghiệp khác</h2>
          <ActionForm action={createOrganizationAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Tên">
              <input className="bizcar-input" name="name" required />
            </Field>
            <Field label="Ngành">
              <input className="bizcar-input" name="industry" required />
            </Field>
            <Field label="Giai đoạn">
              <input className="bizcar-input" name="stage" required />
            </Field>
            <Field label="Quy mô">
              <input className="bizcar-input" name="size" required />
            </Field>
            <PrimaryButton>Tạo doanh nghiệp</PrimaryButton>
          </ActionForm>
        </Panel>
      </div>
    </BizcarShell>
  );
}
