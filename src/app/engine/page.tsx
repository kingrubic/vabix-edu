import Link from "next/link";
import { EngineWorkbench } from "@/components/engine/EngineWorkbench";
import { BizcarShell } from "@/components/bizcar/Shell";
import { DemoMark, Panel } from "@/components/bizcar/Ui";
import { loadStore } from "@/db/store";
import { loadAssessmentBundle, getAssessment } from "@/db/repo";
import { assembleEngine } from "@/scoring/assemble";
import { IDS } from "@/db/ids";
import { getCurrentUser } from "@/security/session";
import { canViewAssessment } from "@/security/rbac";
import { DEVELOPMENT_DISCLAIMER, MNEMONIC_DISCLAIMER } from "@/domain/labels";

export const metadata = {
  title: "Động cơ doanh nghiệp MTUA — MyBizCar 3D",
  description: "Module chính: hình dung 3D động cơ doanh nghiệp MTUA từ dữ liệu đánh giá.",
};

export default async function EngineModulePage({
  searchParams,
}: {
  searchParams: Promise<{ assessment?: string }>;
}) {
  await loadStore();
  const user = await getCurrentUser();
  const query = await searchParams;
  let assessmentId: string = IDS.assessment.demo;
  if (query.assessment && user) {
    const row = await getAssessment(query.assessment);
    if (row && canViewAssessment(user.access, row)) assessmentId = row.id;
  }
  const bundle = await loadAssessmentBundle(assessmentId);
  if (!bundle) {
    return (
      <BizcarShell user={user} title="Động cơ doanh nghiệp">
        <p className="px-4 py-16">Chưa đủ dữ liệu để dựng động cơ.</p>
      </BizcarShell>
    );
  }
  const model = assembleEngine(bundle);
  const isDemo = bundle.assessment.isDemo || bundle.organization?.isDemo;
  return (
    <BizcarShell user={user} title="Động cơ doanh nghiệp MTUA">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Module chính · /engine</p>
            <h1 className="mt-2 text-3xl font-semibold">Động cơ doanh nghiệp 3D</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/65">{MNEMONIC_DISCLAIMER}</p>
            <p className="mt-1 text-xs text-white/45">{DEVELOPMENT_DISCLAIMER}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DemoMark show={Boolean(isDemo)} />
            {user ? (
              <Link
                href={`/assessments/${assessmentId}/engine`}
                className="inline-flex min-h-11 items-center text-vabix-gold"
              >
                Mở trong hồ sơ đánh giá
              </Link>
            ) : (
              <Link href="/login?next=/engine" className="inline-flex min-h-11 items-center bg-vabix-gold px-4 font-semibold text-vabix-deep-teal">
                Đăng nhập để đánh giá
              </Link>
            )}
          </div>
        </div>
        <Panel>
          <p className="text-sm text-white/70">
            {bundle.organization?.name} · {bundle.assessment.title} · MDS là chất lượng thiết kế, không phải bằng chứng đã triển khai.
          </p>
        </Panel>
        <EngineWorkbench model={model} />
      </div>
    </BizcarShell>
  );
}
