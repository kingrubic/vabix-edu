import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { saveActivationAction, saveForceAction } from "@/features/assessments/actions";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { Field, Panel, PrimaryButton, ScoreBox } from "@/components/bizcar/Ui";
import { ACTIVATION_FORMULA_DISCLAIMER, COMPONENT_LABELS, FORCE_LABELS } from "@/domain/labels";
import { COMPONENT_CODES } from "@/domain/types";

export const metadata = { title: "Kích hoạt & Lực — MyBizCar", robots: { index: false, follow: false } };

export default async function ActivationForcePage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, model, readOnly } = await loadAssessmentPage(assessmentId);
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="activation-force">
      <Panel>
        <h1 className="text-2xl font-semibold">Mức kích hoạt và lực tác động</h1>
        <p className="mt-3 text-sm text-white/65">{ACTIVATION_FORMULA_DISCLAIMER}</p>
        <p className="mt-2 text-sm text-white/50">Lực không hàm ý chắc chắn nhân quả. Hướng được chọn trước, độ lớn tính từ bốn đầu vào 1–10.</p>
      </Panel>
      {COMPONENT_CODES.map((code) => {
        const activation = bundle.activations.find((item) => item.componentCode === code);
        const force = bundle.forces.find((item) => item.componentCode === code);
        const computed = model.profiles[code].force;
        return (
          <div key={code} className="mt-4 grid gap-4 lg:grid-cols-2">
            <ActionForm action={saveActivationAction} className="bizcar-panel space-y-3 p-5">
              <input type="hidden" name="assessmentId" value={assessmentId} />
              <input type="hidden" name="componentCode" value={code} />
              <h2 className="text-xl font-semibold">
                {code} kích hoạt · {COMPONENT_LABELS[code].vi}
              </h2>
              <Field label="Điểm 1–10 (do đánh giá viên nhập)">
                <input className="bizcar-input" type="number" min={1} max={10} name="score" defaultValue={activation?.score ?? ""} required disabled={readOnly} />
              </Field>
              <Field label="Phạm vi">
                <input className="bizcar-input" name="scope" defaultValue={activation?.scope} required disabled={readOnly} />
              </Field>
              <Field label="Ngày đánh giá">
                <input className="bizcar-input" type="date" name="assessedAt" defaultValue={activation?.assessedAt ?? ""} required disabled={readOnly} />
              </Field>
              <Field label="Lý do chuyên môn">
                <textarea className="bizcar-input min-h-24" name="rationale" defaultValue={activation?.rationale} required disabled={readOnly} />
              </Field>
              <Field label="Tham chiếu bằng chứng">
                <input className="bizcar-input" name="evidenceReferences" defaultValue={activation?.evidenceReferences} disabled={readOnly} />
              </Field>
              <Field label="Lý do thay đổi nhật ký">
                <input className="bizcar-input" name="reason" required disabled={readOnly} />
              </Field>
              {readOnly ? null : <PrimaryButton>Lưu kích hoạt</PrimaryButton>}
            </ActionForm>
            <ActionForm action={saveForceAction} className="bizcar-panel space-y-3 p-5">
              <input type="hidden" name="assessmentId" value={assessmentId} />
              <input type="hidden" name="componentCode" value={code} />
              <h2 className="text-xl font-semibold">{code} lực tác động</h2>
              <ScoreBox label="Lực tính được" value={computed.force} hint={computed.unsupported ? "Chưa đủ bằng chứng để xác định lực" : undefined} />
              <Field label="Hướng (chọn trước)">
                <select className="bizcar-input" name="direction" defaultValue={force?.direction ?? "NEUTRAL"} disabled={readOnly}>
                  {Object.entries(FORCE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phạm vi">
                  <input className="bizcar-input" type="number" min={1} max={10} name="scope" defaultValue={force?.scope ?? ""} required disabled={readOnly} />
                </Field>
                <Field label="Cường độ">
                  <input className="bizcar-input" type="number" min={1} max={10} name="intensity" defaultValue={force?.intensity ?? ""} required disabled={readOnly} />
                </Field>
                <Field label="Thời lượng">
                  <input className="bizcar-input" type="number" min={1} max={10} name="duration" defaultValue={force?.duration ?? ""} required disabled={readOnly} />
                </Field>
                <Field label="Độ gần điểm nghẽn">
                  <input className="bizcar-input" type="number" min={1} max={10} name="bottleneckProximity" defaultValue={force?.bottleneckProximity ?? ""} required disabled={readOnly} />
                </Field>
              </div>
              <Field label="Cấp bằng chứng lực">
                <select className="bizcar-input" name="evidenceGrade" defaultValue={force?.evidenceGrade ?? "D"} disabled={readOnly}>
                  <option value="D">D</option>
                  <option value="C">C</option>
                  <option value="B">B</option>
                  <option value="A">A</option>
                </select>
              </Field>
              <Field label="Ghi chú">
                <textarea className="bizcar-input min-h-16" name="evidenceNote" defaultValue={force?.evidenceNote} disabled={readOnly} />
              </Field>
              <Field label="Lý do thay đổi nhật ký">
                <input className="bizcar-input" name="reason" required disabled={readOnly} />
              </Field>
              {readOnly ? null : <PrimaryButton>Lưu lực</PrimaryButton>}
            </ActionForm>
          </div>
        );
      })}
    </AssessmentFrame>
  );
}
