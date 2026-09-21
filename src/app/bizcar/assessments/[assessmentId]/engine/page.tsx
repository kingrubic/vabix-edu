import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { EngineExperience } from "@/mybizcar/engine/EngineExperience";
import { StudioFrame } from "@/mybizcar/engine/StudioFrame";
import { engineViewFromModel, extrasFromBundle } from "@/mybizcar/from-engine-model";

export const metadata = { title: "Động cơ 3D — MyBizCar", robots: { index: false, follow: false } };

export default async function EnginePage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, model } = await loadAssessmentPage(assessmentId);
  const isDemo = bundle.assessment.isDemo || bundle.organization?.isDemo;
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="engine">
      <StudioFrame demo={Boolean(isDemo)}>
        <EngineExperience
          model={engineViewFromModel(model, extrasFromBundle(bundle))}
          caption={
            isDemo
              ? "Sedan quản trị — dữ liệu minh họa từ hồ sơ đánh giá DEMO."
              : "Sedan quản trị — dữ liệu từ hồ sơ đánh giá."
          }
        />
      </StudioFrame>
    </AssessmentFrame>
  );
}
