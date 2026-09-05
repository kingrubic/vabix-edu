import Link from "next/link";
import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { Panel, ScoreBox } from "@/components/bizcar/Ui";
import { changeStatusAction, createRevisionAction } from "@/features/assessments/actions";
import { ASSESSMENT_STATUSES } from "@/domain/types";
import { STATUS_LABELS } from "@/domain/labels";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { Field, PrimaryButton } from "@/components/bizcar/Ui";

export const metadata = { title: "Hồ sơ đánh giá — MyBizCar", robots: { index: false, follow: false } };

export default async function AssessmentHubPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, model } = await loadAssessmentPage(assessmentId);
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="">
      <div className="grid gap-4 md:grid-cols-2">
        <Panel>
          <h1 className="text-2xl font-semibold">{bundle.assessment.title}</h1>
          <p className="mt-2 text-sm text-white/60">
            {bundle.context?.scope || "Chưa đủ dữ liệu ngữ cảnh"} · chân trời {bundle.context?.timeHorizon}
          </p>
          <p className="mt-2 text-sm text-white/50">
            Chuẩn {bundle.standard?.version.name} {bundle.standard?.version.version} · {bundle.standard?.version.developmentDisclaimer}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/assessments/${assessmentId}/engine`} className="text-vabix-gold">
              Mở động cơ 3D
            </Link>
            <Link href={`/assessments/${assessmentId}/report`} className="text-white/70">
              Báo cáo
            </Link>
          </div>
        </Panel>
        <Panel>
          <h2 className="font-semibold">Trạng thái</h2>
          <ActionForm action={changeStatusAction} className="mt-3 space-y-3">
            <input type="hidden" name="assessmentId" value={assessmentId} />
            <Field label="Chuyển trạng thái">
              <select className="bizcar-input" name="status" defaultValue={bundle.assessment.status}>
                {ASSESSMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Lý do">
              <input className="bizcar-input" name="reason" required />
            </Field>
            <PrimaryButton>Cập nhật trạng thái</PrimaryButton>
          </ActionForm>
          {bundle.assessment.status === "LOCKED" ? (
            <ActionForm action={createRevisionAction} className="mt-4">
              <input type="hidden" name="assessmentId" value={assessmentId} />
              <PrimaryButton>Tạo bản đánh giá mới</PrimaryButton>
            </ActionForm>
          ) : null}
        </Panel>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {(["M", "T", "U", "A"] as const).map((code) => (
          <ScoreBox
            key={code}
            label={`${code} MDS cuối`}
            value={model.mds[code].finalMds}
            hint={`Thô ${model.mds[code].rawMds ?? "—"} · Kích hoạt ${model.profiles[code].activation ?? "—"} · Lực ${model.profiles[code].force.force ?? "—"}`}
          />
        ))}
      </div>
    </AssessmentFrame>
  );
}
