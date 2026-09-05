import type { CriterionAnchor, StandardCriterion } from "@/domain/types";
import type { CriterionScore } from "@/domain/types";
import { saveCriterionAction } from "@/features/assessments/actions";
import { ActionForm } from "./ActionForm";
import { Field, PrimaryButton } from "./Ui";

export function CriterionForm({
  assessmentId,
  criterion,
  score,
  anchors,
  readOnly,
}: {
  assessmentId: string;
  criterion: StandardCriterion;
  score: CriterionScore | undefined;
  anchors: CriterionAnchor[];
  readOnly?: boolean;
}) {
  const shown = [1, 3, 5, 7, 9, 10] as const;
  return (
    <ActionForm action={saveCriterionAction} className="bizcar-panel space-y-4 p-5">
      <input type="hidden" name="assessmentId" value={assessmentId} />
      <input type="hidden" name="criterionCode" value={criterion.code} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">
            {criterion.code}
            {criterion.critical ? " · Tới hạn" : ""} · trọng số {criterion.weight}
          </p>
          <h3 className="mt-1 text-xl font-semibold">{criterion.nameVi}</h3>
        </div>
        <p className="text-sm text-white/50">Thang 1–10. Mốc neo ở 1 / 3 / 5 / 7 / 9 / 10.</p>
      </div>
      <Field label="Điểm đánh giá viên chính">
        <input
          className="bizcar-input"
          name="primaryScore"
          type="number"
          min={1}
          max={10}
          step={0.5}
          defaultValue={score?.primaryScore ?? ""}
          required
          disabled={readOnly}
        />
      </Field>
      <Field label="Điểm đánh giá viên thứ hai (nếu có)">
        <input
          className="bizcar-input"
          name="secondaryScore"
          type="number"
          min={1}
          max={10}
          step={0.5}
          defaultValue={score?.secondaryScore ?? ""}
          disabled={readOnly}
        />
      </Field>
      <div className="grid gap-2 text-sm text-white/70">
        {shown.map((n) => {
          const anchor = anchors.find((item) => item.score === n);
          return (
            <p key={n}>
              <strong className="text-vabix-gold">{n}.</strong> {anchor?.descriptionVi}
            </p>
          );
        })}
      </div>
      <Field label="Ghi chú bằng chứng">
        <textarea
          className="bizcar-input min-h-24"
          name="evidenceNote"
          defaultValue={score?.evidenceNote}
          disabled={readOnly}
        />
      </Field>
      <Field label="Tham chiếu bằng chứng">
        <input className="bizcar-input" name="evidenceReferences" defaultValue={score?.evidenceReferences} disabled={readOnly} />
      </Field>
      <Field label="Giải thích của đánh giá viên">
        <textarea
          className="bizcar-input min-h-20"
          name="evaluatorExplanation"
          defaultValue={score?.evaluatorExplanation}
          disabled={readOnly}
        />
      </Field>
      <Field label="Lý do thay đổi điểm (bắt buộc — phục vụ nhật ký)">
        <input className="bizcar-input" name="reason" required disabled={readOnly} placeholder="Vì sao điểm này thay đổi?" />
      </Field>
      {readOnly ? <p className="text-sm text-white/50">Đánh giá đã khóa hoặc chỉ xem.</p> : <PrimaryButton>Lưu tiêu chí</PrimaryButton>}
    </ActionForm>
  );
}
