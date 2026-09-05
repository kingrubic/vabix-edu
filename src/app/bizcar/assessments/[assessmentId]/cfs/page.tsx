import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { saveCfsAction } from "@/features/assessments/actions";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { Field, Panel, PrimaryButton, ScoreBox } from "@/components/bizcar/Ui";
import { CFS_LABELS, CFS_WEIGHT_DISCLAIMER } from "@/domain/labels";

export const metadata = { title: "CFS — MyBizCar", robots: { index: false, follow: false } };

export default async function CfsPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, model, readOnly } = await loadAssessmentPage(assessmentId);
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="cfs">
      <div className="grid gap-3 md:grid-cols-4">
        <ScoreBox label="CFS" value={model.cfs.cfs} hint={model.cfs.provisional ? "Điểm tạm tính" : model.cfs.band} />
        <ScoreBox label="Trung bình có trọng số" value={model.cfs.weightedAverage} />
        <ScoreBox label="Liên kết yếu nhất" value={model.cfs.weakestCode ? `${model.cfs.weakestCode} ${model.cfs.weakest}` : "Chưa đủ dữ liệu"} />
        <ScoreBox label="Trần khóa" value={model.cfs.appliedCriticalCap ? "Đã áp 5.9" : "Không áp"} />
      </div>
      <Panel className="mt-4">
        <p className="text-sm text-white/60">{CFS_WEIGHT_DISCLAIMER}</p>
        <ul className="mt-3 space-y-2 text-sm text-white/70">
          {model.cfs.explanation.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      </Panel>
      {bundle.standard!.connections.map((connection) => {
        const row = bundle.cfs.find((item) => item.connectionCode === connection.code);
        return (
          <ActionForm key={connection.code} action={saveCfsAction} className="bizcar-panel mt-4 space-y-3 p-5">
            <input type="hidden" name="assessmentId" value={assessmentId} />
            <input type="hidden" name="connectionCode" value={connection.code} />
            <h2 className="text-xl font-semibold">
              {connection.code} · {CFS_LABELS[connection.code].vi}
              {connection.critical ? " · tới hạn" : ""}
            </h2>
            <p className="text-xs text-white/50">Trọng số kỹ thuật: {connection.weight} — không phải quy tắc học thuật chính thức.</p>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Điểm 1–10">
                <input className="bizcar-input" type="number" min={1} max={10} step={0.5} name="score" defaultValue={row?.score ?? ""} required disabled={readOnly} />
              </Field>
              <Field label="Trạng thái bằng chứng">
                <select className="bizcar-input" name="evidenceStatus" defaultValue={row?.evidenceStatus} disabled={readOnly}>
                  <option value="VERIFIED">Đã kiểm chứng</option>
                  <option value="HYPOTHESIS">Giả thuyết</option>
                </select>
              </Field>
            </div>
            <Field label="Bằng chứng">
              <textarea className="bizcar-input min-h-20" name="evidence" defaultValue={row?.evidence} required disabled={readOnly} />
            </Field>
            <Field label="Tín hiệu lệch">
              <input className="bizcar-input" name="deviationSignal" defaultValue={row?.deviationSignal} disabled={readOnly} />
            </Field>
            <Field label="Ghi chú đánh giá viên">
              <textarea className="bizcar-input min-h-16" name="evaluatorNote" defaultValue={row?.evaluatorNote} disabled={readOnly} />
            </Field>
            <Field label="Lý do thay đổi">
              <input className="bizcar-input" name="reason" required disabled={readOnly} />
            </Field>
            {readOnly ? null : <PrimaryButton>Lưu liên kết</PrimaryButton>}
          </ActionForm>
        );
      })}
    </AssessmentFrame>
  );
}
