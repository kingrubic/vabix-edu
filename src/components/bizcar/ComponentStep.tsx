import type { ComponentCode } from "@/domain/types";
import { COMPONENT_LABELS } from "@/domain/labels";
import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "./AssessmentFrame";
import { ComponentMetaForm } from "./ComponentMetaForm";
import { CriterionForm } from "./CriterionForm";
import { WhyScore } from "./WhyScore";

export async function ComponentStep({
  assessmentId,
  code,
  current,
}: {
  assessmentId: string;
  code: ComponentCode;
  current: string;
}) {
  const { user, bundle, model, readOnly } = await loadAssessmentPage(assessmentId);
  const criteria = bundle.standard!.criteria.filter((item) => item.componentCode === code);
  const component = bundle.components.find((item) => item.componentCode === code);
  const meta = COMPONENT_LABELS[code];
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current={current}>
      <div className="space-y-4">
        <div>
          <p className="eyebrow">
            {code} · {meta.mnemonic}
          </p>
          <h1 className="text-3xl font-semibold">{meta.vi}</h1>
          <p className="mt-2 text-white/60">{meta.en}</p>
        </div>
        <ComponentMetaForm assessmentId={assessmentId} code={code} row={component} readOnly={readOnly} />
        <WhyScore mds={model.mds[code]} />
        {criteria.map((criterion) => (
          <CriterionForm
            key={criterion.id}
            assessmentId={assessmentId}
            criterion={criterion}
            score={bundle.scores.find((item) => item.criterionId === criterion.id)}
            anchors={bundle.standard!.anchors.filter((item) => item.criterionId === criterion.id)}
            readOnly={readOnly}
          />
        ))}
      </div>
    </AssessmentFrame>
  );
}
