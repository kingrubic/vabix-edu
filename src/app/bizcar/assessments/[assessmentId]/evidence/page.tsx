import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { addEvidenceAction } from "@/features/assessments/actions";
import { ActionForm } from "@/components/bizcar/ActionForm";
import { Field, Panel, PrimaryButton } from "@/components/bizcar/Ui";
import { EVIDENCE_LABELS } from "@/domain/labels";

export const metadata = { title: "Bằng chứng — MyBizCar", robots: { index: false, follow: false } };

export default async function EvidencePage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, readOnly } = await loadAssessmentPage(assessmentId);
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="evidence">
      <Panel>
        <h1 className="text-2xl font-semibold">Hồ sơ bằng chứng</h1>
        <p className="mt-2 text-sm text-white/60">
          Tệp được lưu riêng, không phát hành URL công khai vĩnh viễn. Liên kết ngoài chỉ là tham chiếu.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {Object.entries(EVIDENCE_LABELS).map(([grade, meta]) => (
            <li key={grade}>
              <strong className="text-vabix-gold">{meta.name}.</strong> {meta.meaning} — dùng: {meta.use}
            </li>
          ))}
        </ul>
      </Panel>
      {bundle.evidence.map((item) => (
        <Panel key={item.id}>
          <p className="eyebrow">{item.kind}</p>
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="mt-2 text-white/70">{item.note}</p>
          {item.linkUrl ? <p className="mt-2 text-sm text-white/50">Tham chiếu: {item.linkUrl}</p> : null}
        </Panel>
      ))}
      {readOnly ? null : (
        <Panel>
          <ActionForm action={addEvidenceAction} className="grid gap-3 md:grid-cols-2">
            <input type="hidden" name="assessmentId" value={assessmentId} />
            <Field label="Tiêu đề">
              <input className="bizcar-input" name="title" required />
            </Field>
            <Field label="Loại">
              <select className="bizcar-input" name="kind" defaultValue="NOTE">
                <option value="NOTE">Ghi chú</option>
                <option value="LINK">Liên kết</option>
                <option value="DECISION_RECORD">Hồ sơ quyết định</option>
                <option value="FILE">Tệp (mô tả)</option>
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
            <Field label="Liên kết (nếu có)">
              <input className="bizcar-input" name="linkUrl" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Ghi chú">
                <textarea className="bizcar-input min-h-24" name="note" />
              </Field>
            </div>
            <PrimaryButton>Thêm bằng chứng</PrimaryButton>
          </ActionForm>
        </Panel>
      )}
    </AssessmentFrame>
  );
}
