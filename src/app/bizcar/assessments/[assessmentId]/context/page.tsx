import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { saveContextAction } from "@/features/assessments/actions";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { Field, Panel, PrimaryButton } from "@/components/bizcar/Ui";

export const metadata = { title: "Ngữ cảnh đánh giá — MyBizCar", robots: { index: false, follow: false } };

export default async function ContextPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, readOnly } = await loadAssessmentPage(assessmentId);
  const ctx = bundle.context;
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="context">
      <Panel>
        <h1 className="text-2xl font-semibold">Ngữ cảnh đánh giá</h1>
        <ActionForm action={saveContextAction} className="mt-5 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="assessmentId" value={assessmentId} />
          <Field label="Đơn vị / dự án / toàn công ty">
            <input className="bizcar-input" name="businessUnit" defaultValue={ctx?.businessUnit} required disabled={readOnly} />
          </Field>
          <Field label="Ngành">
            <input className="bizcar-input" name="industry" defaultValue={ctx?.industry} required disabled={readOnly} />
          </Field>
          <Field label="Giai đoạn">
            <input className="bizcar-input" name="companyStage" defaultValue={ctx?.companyStage} required disabled={readOnly} />
          </Field>
          <Field label="Quy mô">
            <input className="bizcar-input" name="companySize" defaultValue={ctx?.companySize} required disabled={readOnly} />
          </Field>
          <Field label="Phạm vi">
            <input className="bizcar-input" name="scope" defaultValue={ctx?.scope} required disabled={readOnly} />
          </Field>
          <Field label="Chân trời định hướng">
            <input className="bizcar-input" name="timeHorizon" defaultValue={ctx?.timeHorizon} required disabled={readOnly} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Ghi chú">
              <textarea className="bizcar-input min-h-24" name="notes" defaultValue={ctx?.notes} disabled={readOnly} />
            </Field>
          </div>
          {readOnly ? <p>Chỉ xem.</p> : <PrimaryButton>Lưu ngữ cảnh</PrimaryButton>}
        </ActionForm>
      </Panel>
    </AssessmentFrame>
  );
}
