import { notFound } from "next/navigation";
import { requirePageActor } from "@/platform/auth/guard";
import { enrollmentForUser } from "@/platform/lms/progress";
import { getDb } from "@/platform/db/client";
import { submitAssignmentForm } from "@/platform/ui/actions";
import { publishedGradeForLearner } from "@/platform/lms/assignments";

export default async function AssignmentPage({ params }: { params: Promise<{ classId: string; assignmentId: string }> }) {
  const actor = await requirePageActor();
  const { classId, assignmentId } = await params;
  const enrollment = enrollmentForUser(actor.id, classId);
  if (!enrollment) notFound();
  const assignment = getDb().prepare(`SELECT * FROM lms_assignments WHERE id=? AND class_id=?`).get(assignmentId, classId) as Record<string, unknown> | undefined;
  if (!assignment) notFound();
  const grade = publishedGradeForLearner(String(enrollment.id), assignmentId) as { score: number; comment: string } | undefined;
  return (
    <div className="platform-card space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">{String(assignment.title)}</h1>
      <p className="whitespace-pre-wrap">{String(assignment.instructions)}</p>
      {grade ? <p>Điểm đã công bố: {grade.score}. {grade.comment}</p> : <p className="text-sm text-[#66746f]">Điểm nháp không hiển thị cho học viên.</p>}
      <form action={submitAssignmentForm} className="space-y-3">
        <input type="hidden" name="assignmentId" value={assignmentId} />
        <input type="hidden" name="enrollmentId" value={String(enrollment.id)} />
        <label className="block text-sm">Nội dung nộp<textarea className="input mt-1 min-h-40" name="textBody" /></label>
        <label className="block text-sm">Link<input className="input mt-1" name="linkUrl" /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="confirm" required /> Tôi xác nhận nộp bài này</label>
        <button className="bg-[#163c3e] px-4 py-2 text-white">Nộp bài</button>
      </form>
    </div>
  );
}
