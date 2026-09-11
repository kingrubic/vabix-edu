import { notFound } from "next/navigation";
import { requirePageActor } from "@/platform/auth/guard";
import { enrollmentForUser, lessonUnlocked, contentProgress } from "@/platform/lms/progress";
import { getVersionBundle } from "@/platform/lms/courses";
import { getClass } from "@/platform/lms/classes";
import { listClassQuizzes } from "@/platform/lms/quizzes";
import { getDb } from "@/platform/db/client";
import Link from "next/link";
import { formatDateTime } from "@/platform/time";

export default async function ClassLearnPage({ params }: { params: Promise<{ classId: string }> }) {
  const actor = await requirePageActor();
  const { classId } = await params;
  const enrollment = enrollmentForUser(actor.id, classId);
  if (!enrollment) notFound();
  const cls = getClass(classId);
  const bundle = getVersionBundle(String(enrollment.version_id));
  const progress = contentProgress(String(enrollment.id));
  const schedules = getDb().prepare(`SELECT * FROM lms_schedules WHERE class_id=? ORDER BY starts_at`).all(classId) as { id: string; title: string; starts_at: string; meeting_url: string }[];
  const assignments = getDb().prepare(`SELECT * FROM lms_assignments WHERE class_id=?`).all(classId) as { id: string; title: string; due_at: string | null }[];
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#163c3e]">{String(cls?.name)}</h1>
        <p className="text-sm text-[#66746f]">Tiến độ nội dung bắt buộc: {progress.percent}% ({progress.completed}/{progress.required})</p>
      </div>
      <nav className="flex flex-wrap gap-3 text-sm">
        <a href="#noidung">Nội dung</a>
        <a href="#lich">Lịch học</a>
        <a href="#baitap">Bài tập</a>
        <a href="#kiemtra">Kiểm tra</a>
      </nav>
      <section id="noidung" className="space-y-4">
        {(bundle?.modules as { id: string; title: string }[]).map((mod) => (
          <article key={mod.id} className="platform-card p-5">
            <h2 className="font-semibold">{mod.title}</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {(bundle?.lessons as { id: string; module_id: string; title: string; unlock_rule: string; unlock_at: string | null; prerequisite_lesson_id: string | null; status: string }[])
                .filter((lesson) => lesson.module_id === mod.id)
                .map((lesson) => {
                  const gate = lessonUnlocked(String(enrollment.id), lesson);
                  return (
                    <li key={lesson.id}>
                      {gate.open ? (
                        <Link className="underline" href={`/hoc-tap/lop/${classId}/bai/${lesson.id}`}>{lesson.title}</Link>
                      ) : (
                        <span>{lesson.title} — {gate.reason}</span>
                      )}
                    </li>
                  );
                })}
            </ul>
          </article>
        ))}
      </section>
      <section id="lich" className="platform-card p-5">
        <h2 className="font-semibold">Lịch học</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {schedules.map((item) => (
            <li key={item.id}>
              {formatDateTime(item.starts_at)} — {item.title}
              {item.meeting_url ? <span> · link chỉ hiện với thành viên lớp</span> : null}
            </li>
          ))}
        </ul>
      </section>
      <section id="baitap" className="platform-card p-5">
        <h2 className="font-semibold">Bài tập</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {assignments.map((item) => (
            <li key={item.id}>
              <Link className="underline" href={`/hoc-tap/lop/${classId}/bai-tap/${item.id}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section id="kiemtra" className="platform-card p-5">
        <h2 className="font-semibold">Kiểm tra</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {(listClassQuizzes(classId) as { id: string; title: string }[]).map((item) => (
            <li key={item.id}>
              <Link className="underline" href={`/hoc-tap/lop/${classId}/kiem-tra/${item.id}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
