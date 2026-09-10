import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { Panel } from "@/components/bizcar/Ui";
import { DEVELOPMENT_DISCLAIMER } from "@/domain/labels";
import { COMPONENT_CODES } from "@/domain/types";

export const metadata = { title: "Báo cáo — MyBizCar", robots: { index: false, follow: false } };

export default async function ReportPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, model } = await loadAssessmentPage(assessmentId);
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="report">
      <article className="bizcar-panel print:bg-white print:text-black p-6">
        <p className="eyebrow">Báo cáo điều hành</p>
        <h1 className="mt-2 text-3xl font-semibold">{bundle.assessment.title}</h1>
        <p className="mt-3 text-sm text-white/60 print:text-black">
          {bundle.organization?.name} · {bundle.context?.scope} · {bundle.assessment.assessmentDate}
        </p>
        <p className="mt-2 text-sm text-amber-100 print:text-black">{DEVELOPMENT_DISCLAIMER}</p>
        <p className="mt-1 text-xs text-white/50">
          Chuẩn {bundle.standard?.version.name} {bundle.standard?.version.version} — không mô tả như chứng nhận cuối.
        </p>
        <section className="mt-6 grid gap-3 md:grid-cols-4">
          {COMPONENT_CODES.map((code) => (
            <div key={code} className="border border-white/15 p-3">
              <p className="font-semibold">{code}</p>
              <p>MDS cuối {model.mds[code].finalMds ?? "Chưa đủ dữ liệu"}</p>
              <p>MDS thô {model.mds[code].rawMds ?? "—"}</p>
              <p>Kích hoạt {model.profiles[code].activation ?? "—"}</p>
              <p>Lực {model.profiles[code].force.force ?? "—"}</p>
              <p>Bằng chứng {model.profiles[code].evidenceGrade ?? "Thiếu bằng chứng"}</p>
            </div>
          ))}
        </section>
        <section className="mt-6 space-y-2 text-sm">
          <p>CFS: {model.cfs.cfs ?? "Chưa đủ dữ liệu"} · {model.cfs.band}</p>
          <p>Liên kết yếu nhất: {model.cfs.weakestCode ?? "Chưa đủ dữ liệu"}</p>
          <p>Điểm khóa: {model.criticalLocks.join("; ") || "Không"}</p>
          <p>Ba tiêu chí yếu nhất: {model.threeWeakestCriteria.map((item) => `${item.code} ${item.score}`).join(", ") || "Chưa đủ dữ liệu"}</p>
          <p>Khoảng trống bằng chứng: {model.evidenceGaps.join(", ") || "Không"}</p>
        </section>
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Hành động MAIS</h2>
          <ul className="mt-2 text-sm">
            {bundle.actions.map((action) => (
              <li key={action.id}>
                {action.stage} — {action.title} ({action.ownerName})
              </li>
            ))}
          </ul>
        </section>
        <p className="mt-8 text-xs text-white/40">Đánh giá viên chính: {bundle.assessment.primaryEvaluatorId}</p>
      </article>
      <Panel className="mt-4 print:hidden">
        <p className="text-sm text-white/60">Dùng chức năng in của trình duyệt để xuất PDF. Ảnh 3D không phải chứng cứ — bảng số liệu ở trên mới là nguồn chính thức.</p>
      </Panel>
    </AssessmentFrame>
  );
}
