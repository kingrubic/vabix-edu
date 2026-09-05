import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { createExperimentAction, createMaisAction, decideExperimentAction } from "@/features/mais/actions";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { Field, Panel, PrimaryButton } from "@/components/bizcar/Ui";

export const metadata = { title: "MAIS — MyBizCar", robots: { index: false, follow: false } };

export default async function MaisPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, model, readOnly } = await loadAssessmentPage(assessmentId);
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="mais">
      <h1 className="text-3xl font-semibold">MAIS — Đo / Phân tích / Cải tiến / Chuẩn hóa</h1>
      <p className="mt-2 text-white/60">
        Ưu tiên không lấy MDS thấp nhất làm lý do duy nhất. Hệ thống xét điểm khóa, lực nghịch, độ tin cậy bằng chứng và khả năng can thiệp.
      </p>
      <Panel className="mt-5">
        <h2 className="text-xl font-semibold">Thứ tự ưu tiên gợi ý</h2>
        <ol className="mt-3 space-y-3">
          {model.priorities.map((item, index) => (
            <li key={`${item.title}-${index}`} className="border border-white/10 p-3">
              <p className="font-semibold">
                {index + 1}. {item.title}
              </p>
              <p className="text-sm text-white/65">{item.reason}</p>
            </li>
          ))}
        </ol>
      </Panel>
      {bundle.actions.map((action) => (
        <Panel key={action.id}>
          <p className="eyebrow">{action.stage}</p>
          <h3 className="text-lg font-semibold">{action.title}</h3>
          <p className="mt-2 text-sm text-white/70">Triệu chứng: {action.symptom}</p>
          <p className="text-sm text-white/70">Giả thuyết nguyên nhân: {action.causeHypothesis}</p>
          <p className="text-sm text-white/70">Tác dụng phụ: {action.sideEffect}</p>
          <p className="mt-2 text-xs text-white/50">
            Chủ sở hữu {action.ownerName} · {action.scope} · {action.testPeriod}
          </p>
        </Panel>
      ))}
      {readOnly ? null : (
        <Panel>
          <h2 className="text-xl font-semibold">Tạo hành động cải tiến</h2>
          <ActionForm action={createMaisAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="assessmentId" value={assessmentId} />
            <Field label="Tiêu đề">
              <input className="bizcar-input" name="title" required />
            </Field>
            <Field label="Giai đoạn">
              <select className="bizcar-input" name="stage" defaultValue="ANALYZE">
                <option value="MEASURE">MEASURE</option>
                <option value="ANALYZE">ANALYZE</option>
                <option value="IMPROVE">IMPROVE</option>
                <option value="STANDARDIZE">STANDARDIZE</option>
              </select>
            </Field>
            <Field label="Cấu kiện">
              <select className="bizcar-input" name="componentCode" defaultValue="">
                <option value="">—</option>
                <option value="M">M</option>
                <option value="T">T</option>
                <option value="U">U</option>
                <option value="A">A</option>
              </select>
            </Field>
            <Field label="Chủ sở hữu">
              <input className="bizcar-input" name="ownerName" required />
            </Field>
            <Field label="Phạm vi">
              <input className="bizcar-input" name="scope" required />
            </Field>
            <Field label="Thời gian thử">
              <input className="bizcar-input" name="testPeriod" required />
            </Field>
            <div className="md:col-span-2">
              <Field label="Triệu chứng">
                <textarea className="bizcar-input min-h-16" name="symptom" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Giả thuyết nguyên nhân">
                <textarea className="bizcar-input min-h-16" name="causeHypothesis" />
              </Field>
            </div>
            <Field label="Liên kết liên quan">
              <input className="bizcar-input" name="connectionNote" />
            </Field>
            <Field label="Tác dụng phụ">
              <input className="bizcar-input" name="sideEffect" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Vì sao ưu tiên (không chỉ vì MDS thấp)">
                <input className="bizcar-input" name="priorityReason" required />
              </Field>
            </div>
            <PrimaryButton>Lưu hành động</PrimaryButton>
          </ActionForm>
        </Panel>
      )}
      <Panel>
        <h2 className="text-xl font-semibold">Thử nghiệm 30 ngày</h2>
        <ol className="mt-3 space-y-2 text-sm text-white/70">
          <li>Ngày 0 — khóa baseline</li>
          <li>Ngày 1–7 — thiết kế lại và phản biện bên liên quan</li>
          <li>Ngày 8–14 — dùng phiên bản mới trong quyết định / nhịp quản trị</li>
          <li>Ngày 15–21 — quan sát hành vi, tác dụng phụ và tín hiệu</li>
          <li>Ngày 22–30 — đánh giá lại và quyết định KEEP / IMPROVE / STOP</li>
        </ol>
        {bundle.experiments.map((experiment) => (
          <article key={experiment.id} className="mt-4 border border-white/10 p-4">
            <h3 className="font-semibold">{experiment.title}</h3>
            <p className="text-sm text-white/60">Bắt đầu {experiment.startDate ?? "—"} · Quyết định {experiment.decision ?? "chưa có"}</p>
            {readOnly ? null : (
              <ActionForm action={decideExperimentAction} className="mt-3 grid gap-3 md:grid-cols-2">
                <input type="hidden" name="experimentId" value={experiment.id} />
                <input type="hidden" name="assessmentId" value={assessmentId} />
                <Field label="Quyết định">
                  <select className="bizcar-input" name="decision" defaultValue={experiment.decision ?? "IMPROVE"}>
                    <option value="KEEP">KEEP</option>
                    <option value="IMPROVE">IMPROVE</option>
                    <option value="STOP">STOP</option>
                  </select>
                </Field>
                <Field label="Ghi chú">
                  <input className="bizcar-input" name="decisionNote" required />
                </Field>
                <PrimaryButton>Lưu quyết định</PrimaryButton>
              </ActionForm>
            )}
          </article>
        ))}
        {readOnly ? null : (
          <ActionForm action={createExperimentAction} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="assessmentId" value={assessmentId} />
            <Field label="Tên thử nghiệm">
              <input className="bizcar-input" name="title" required />
            </Field>
            <Field label="Ngày bắt đầu">
              <input className="bizcar-input" type="date" name="startDate" required />
            </Field>
            <PrimaryButton>Tạo thử nghiệm</PrimaryButton>
          </ActionForm>
        )}
      </Panel>
    </AssessmentFrame>
  );
}
