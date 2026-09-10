import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { EngineWorkbench } from "@/components/engine/EngineWorkbench";

export const metadata = { title: "Động cơ 3D — MyBizCar", robots: { index: false, follow: false } };

export default async function EnginePage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, model } = await loadAssessmentPage(assessmentId);
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="engine">
      <EngineWorkbench model={model} />
    </AssessmentFrame>
  );
}
