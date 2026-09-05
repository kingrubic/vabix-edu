import Link from "next/link";
import { requireSession } from "@/security/guards";
import { listAssessments, listOrganizationsForUser } from "@/db/repo";
import { BizcarShell } from "@/components/bizcar/Shell";
import { DemoMark, Panel, StatusBadge } from "@/components/bizcar/Ui";
import { canViewAssessment } from "@/security/rbac";
import { loadStore } from "@/db/store";

export const metadata = { title: "Đánh giá — MyBizCar", robots: { index: false, follow: false } };

export default async function AssessmentsPage() {
  await loadStore();
  const user = await requireSession();
  const orgs = await listOrganizationsForUser(user.id);
  const assessments = (await listAssessments()).filter((item) => canViewAssessment(user.access, item));
  return (
    <BizcarShell user={user} title="Danh sách đánh giá">
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">Đánh giá MTUA</h1>
          <Link href="/assessments/new" className="inline-flex min-h-11 items-center bg-vabix-gold px-4 font-semibold text-vabix-deep-teal">
            Tạo mới
          </Link>
        </div>
        {assessments.map((assessment) => (
          <Panel key={assessment.id}>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/assessments/${assessment.id}`} className="text-xl font-semibold">
                {assessment.title}
              </Link>
              <StatusBadge status={assessment.status} />
              <DemoMark show={assessment.isDemo} />
            </div>
            <p className="mt-2 text-sm text-white/50">
              {orgs.find((item) => item.id === assessment.organizationId)?.name} · {assessment.assessmentDate}
            </p>
          </Panel>
        ))}
      </div>
    </BizcarShell>
  );
}
