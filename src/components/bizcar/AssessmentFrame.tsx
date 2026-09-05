import Link from "next/link";
import type { CurrentUser } from "@/security/session";
import { AssessmentNav } from "./AssessmentNav";
import { DemoMark, StatusBadge } from "./Ui";
import { BizcarShell } from "./Shell";
import type { Assessment, Organization } from "@/domain/types";

export function AssessmentFrame({
  user,
  assessment,
  organization,
  current,
  children,
}: {
  user: CurrentUser;
  assessment: Assessment;
  organization: Organization;
  current: string;
  children: React.ReactNode;
}) {
  return (
    <BizcarShell user={user} title={assessment.title}>
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/assessments" className="text-sm text-white/60">
            ← Đánh giá
          </Link>
          <DemoMark show={assessment.isDemo || organization.isDemo} />
          <StatusBadge status={assessment.status} />
          <span className="text-sm text-white/50">{organization.name}</span>
          <span className="text-sm text-white/40">chuẩn {assessment.standardVersionId.slice(0, 8)}…</span>
        </div>
        <AssessmentNav assessmentId={assessment.id} current={current} />
        {children}
      </div>
    </BizcarShell>
  );
}
