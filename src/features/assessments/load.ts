import { notFound, redirect } from "next/navigation";
import { loadAssessmentBundle } from "@/db/repo";
import { assembleEngine } from "@/scoring/assemble";
import { canEditAssessment, canViewAssessment } from "@/security/rbac";
import { requireSession } from "@/security/guards";

export async function loadAssessmentPage(assessmentId: string) {
  const user = await requireSession();
  const bundle = await loadAssessmentBundle(assessmentId);
  if (!bundle || !bundle.organization || !bundle.standard) notFound();
  if (!canViewAssessment(user.access, bundle.assessment)) redirect("/dashboard");
  const model = assembleEngine(bundle);
  return {
    user,
    bundle,
    model,
    readOnly: !canEditAssessment(user.access, bundle.assessment),
  };
}
