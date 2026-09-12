import { notFound } from "next/navigation";
import { requirePageActor } from "@/platform/auth/guard";
import { enrollmentForUser, lessonUnlocked } from "@/platform/lms/progress";
import { getDb } from "@/platform/db/client";
import { confirmLessonForm, saveNoteForm } from "@/platform/ui/actions";
import Link from "next/link";

export default async function LessonPage({ params }: { params: Promise<{ classId: string; lessonId: string }> }) {
  const actor = await requirePageActor();
  const { classId, lessonId } = await params;
  const enrollment = enrollmentForUser(actor.id, classId);
  if (!enrollment) notFound();
  const lesson = getDb().prepare(`SELECT * FROM lms_lessons WHERE id=?`).get(lessonId) as Record<string, unknown> | undefined;
  if (!lesson) notFound();
  const gate = lessonUnlocked(String(enrollment.id), lesson as never);
  const note = getDb().prepare(`SELECT body FROM lms_lesson_notes WHERE enrollment_id=? AND lesson_id=?`).get(enrollment.id, lessonId) as { body: string } | undefined;
  const progress = getDb().prepare(`SELECT status FROM lms_progress WHERE enrollment_id=? AND lesson_id=?`).get(enrollment.id, lessonId) as { status: string } | undefined;
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="platform-card p-4 text-sm">
        <Link href={`/hoc-tap/lop/${classId}`}>← Về lớp</Link>
        <p className="mt-4 text-[#66746f]">Trạng thái: {progress?.status === "completed" ? "Đã hoàn thành" : "Chưa hoàn thành"}</p>
      </aside>
      <article className="platform-card p-6">
        <h1 className="text-2xl font-semibold text-[#163c3e]">{String(lesson.title)}</h1>
        {!gate.open ? (
          <p className="mt-4">{gate.reason}</p>
        ) : (
          <>
            <div className="prose-vabix mt-4 whitespace-pre-wrap text-[16px]">{String(lesson.body)}</div>
            {lesson.resource_url ? <p className="mt-4 text-sm">Tài nguyên: {String(lesson.resource_url)}</p> : null}
            {String(lesson.kind) === "video" ? (
              <p className="mt-3 text-sm text-[#66746f]">Video dùng xác nhận thủ công. Hệ thống không tuyên bố chống tải tuyệt đối.</p>
            ) : null}
            <form action={confirmLessonForm} className="mt-6">
              <input type="hidden" name="enrollmentId" value={String(enrollment.id)} />
              <input type="hidden" name="lessonId" value={lessonId} />
              <button className="bg-[#163c3e] px-4 py-2 text-white">Xác nhận hoàn thành bài đọc</button>
            </form>
            <form action={saveNoteForm} className="mt-8">
              <input type="hidden" name="enrollmentId" value={String(enrollment.id)} />
              <input type="hidden" name="lessonId" value={lessonId} />
              <label className="block text-sm">Ghi chú cá nhân (riêng tư)
                <textarea className="input mt-1 min-h-32" name="body" defaultValue={note?.body} />
              </label>
              <button className="mt-2 border border-[#163c3e] px-3 py-2">Lưu ghi chú</button>
            </form>
          </>
        )}
      </article>
    </div>
  );
}
