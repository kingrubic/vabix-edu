import Link from "next/link";
import { requireSession } from "@/security/guards";
import { listOrganizationsForUser, listAssessments, loadAssessmentBundle } from "@/db/repo";
import { assembleEngine } from "@/scoring/assemble";
import { BizcarShell } from "@/components/bizcar/Shell";
import { DemoMark, Panel, StatusBadge } from "@/components/bizcar/Ui";
import { loadStore } from "@/db/store";

export const metadata = { title: "Bảng điều khiển — MyBizCar", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  await loadStore();
  const user = await requireSession();
  const organizations = (await listOrganizationsForUser(user.id)).filter((item) => item.slug !== "vabix-platform");
  const assessments = (await listAssessments()).filter((item) =>
    organizations.some((org) => org.id === item.organizationId) || user.access.shares.some((share) => share.assessmentId === item.id),
  );

  const cards = await Promise.all(
    assessments.slice(0, 8).map(async (assessment) => {
      const bundle = await loadAssessmentBundle(assessment.id);
      const model = bundle ? assembleEngine(bundle) : null;
      return { assessment, organization: bundle?.organization, model };
    }),
  );

  return (
    <BizcarShell user={user} title="Bảng điều khiển điều hành">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Không gian mật</p>
            <h1 className="text-3xl font-semibold">Hồ sơ đánh giá MTUA</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/bizcar/assessments/new" className="inline-flex min-h-11 items-center bg-vabix-gold px-4 font-semibold text-vabix-deep-teal">
              Tạo đánh giá
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {organizations.map((org) => (
            <Panel key={org.id}>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{org.name}</h2>
                <DemoMark show={org.isDemo} />
              </div>
              <p className="mt-2 text-sm text-white/60">
                {org.industry} · {org.stage} · {org.size}
              </p>
              <Link href={`/bizcar/organizations/${org.id}`} className="mt-4 inline-flex min-h-11 items-center text-vabix-gold">
                Mở doanh nghiệp
              </Link>
            </Panel>
          ))}
        </div>
        <div className="grid gap-4">
          {cards.map(({ assessment, organization, model }) => (
            <Panel key={assessment.id}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{assessment.title}</h3>
                <StatusBadge status={assessment.status} />
                <DemoMark show={assessment.isDemo} />
              </div>
              <p className="mt-1 text-sm text-white/50">
                {organization?.name} · {assessment.assessmentDate} · chuẩn {assessment.standardVersionId.slice(0, 8)}
              </p>
              {model ? (
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-5">
                  {(["M", "T", "U", "A"] as const).map((code) => (
                    <div key={code} className="border border-white/10 p-2">
                      <p className="text-vabix-gold">{code}</p>
                      <p>MDS {model.mds[code].finalMds ?? "—"}</p>
                      <p>Kích hoạt {model.profiles[code].activation ?? "—"}</p>
                      <p>Lực {model.profiles[code].force.force ?? "—"}</p>
                      <p>Bằng chứng {model.profiles[code].evidenceGrade ?? "—"}</p>
                    </div>
                  ))}
                  <div className="border border-white/10 p-2">
                    <p className="text-vabix-gold">CFS</p>
                    <p>{model.cfs.cfs ?? "Chưa đủ dữ liệu"}</p>
                    <p>{model.cfs.band}</p>
                  </div>
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/bizcar/assessments/${assessment.id}`} className="text-vabix-gold">
                  Mở hồ sơ
                </Link>
                <Link href={`/bizcar/assessments/${assessment.id}/engine`} className="text-white/70">
                  Động cơ 3D
                </Link>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </BizcarShell>
  );
}
