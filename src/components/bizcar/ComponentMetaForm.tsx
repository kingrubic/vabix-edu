import type { ComponentAssessment, ComponentCode } from "@/domain/types";
import { saveComponentMetaAction } from "@/features/assessments/actions";
import { EVIDENCE_LABELS } from "@/domain/labels";
import { ActionForm } from "./ActionForm";
import { Field, PrimaryButton } from "./Ui";

export function ComponentMetaForm({
  assessmentId,
  code,
  row,
  readOnly,
}: {
  assessmentId: string;
  code: ComponentCode;
  row?: ComponentAssessment;
  readOnly?: boolean;
}) {
  return (
    <ActionForm action={saveComponentMetaAction} className="bizcar-panel grid gap-4 p-5 md:grid-cols-2">
      <input type="hidden" name="assessmentId" value={assessmentId} />
      <input type="hidden" name="componentCode" value={code} />
      <Field
        label="Mức yêu cầu (kích thước 3D)"
        hint="Giả định phát triển: size = required level, không phải MDS."
      >
        <input
          className="bizcar-input"
          type="number"
          min={1}
          max={10}
          name="requiredLevel"
          defaultValue={row?.requiredLevel ?? 7}
          disabled={readOnly}
        />
      </Field>
      <Field label="Cấp bằng chứng">
        <select className="bizcar-input" name="evidenceGrade" defaultValue={row?.evidenceGrade ?? "D"} disabled={readOnly}>
          {Object.entries(EVIDENCE_LABELS).map(([grade, meta]) => (
            <option key={grade} value={grade}>
              {meta.name} — {meta.use}
            </option>
          ))}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field label="Nhận định cấu kiện">
          <textarea className="bizcar-input min-h-24" name="narrative" defaultValue={row?.narrative} disabled={readOnly} />
        </Field>
      </div>
      <Field label="Lý do thay đổi">
        <input className="bizcar-input" name="reason" required disabled={readOnly} />
      </Field>
      {readOnly ? null : <PrimaryButton>Lưu cấu kiện</PrimaryButton>}
    </ActionForm>
  );
}
