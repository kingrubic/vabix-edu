import { requirePageActor } from "@/platform/auth/guard";
import { continueLesson, myEnrollments, contentProgress } from "@/platform/lms/progress";
import { getDb } from "@/platform/db/client";
import { formatDateTime } from "@/platform/time";
import { listNotifications } from "@/platform/notify/service";
import Link from "next/link";
import { EmptyState } from "@/platform/ui/Shell";

export default async function LearningHome() {
  const actor = await requirePageActor();
  const next = continueLesson(actor.id);
  const classes = myEnrollments(actor.id) as Record<string, unknown>[];
  const upcoming = getDb()
    .prepare(
      `SELECT s.title, s.starts_at, c.name AS class_name FROM lms_schedules s
       JOIN lms_enrollments e ON e.class_id = s.class_id
       JOIN lms_classes c ON c.id = s.class_id
       WHERE e.user_id=? AND e.status IN ('active','pending') AND s.starts_at >= datetime('now')
       ORDER BY s.starts_at LIMIT 5`,
    )
    .all(actor.id) as { title: string; starts_at: string; class_name: string }[];
  const due = getDb()
    .prepare(
      `SELECT a.title, a.due_at, e.id AS enrollment_id FROM lms_assignments a
       JOIN lms_enrollments e ON e.class_id = a.class_id
       WHERE e.user_id=? AND e.status='active' AND a.due_at IS NOT NULL
       ORDER BY a.due_at LIMIT 8`,
    )
    .all(actor.id) as { title: string; due_at: string; enrollment_id: string }[];
  const notifs = listNotifications(actor.id) as { id: string; title: string; body: string; href: string }[];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Học tập</h1>
      {next ? (
        <Link href={`/hoc-tap/lop/${next.classId}/bai/${next.lessonId}`} className="platform-card block p-6">
          <p className="text-sm text-[#66746f]">Tiếp tục học</p>
          <p className="mt-1 text-xl font-semibold">{next.title}</p>
        </Link>
      ) : (
        <EmptyState title="Chưa có bài đang học" body="Khi bạn được ghi danh và lớp mở học liệu, nút tiếp tục sẽ xuất hiện tại đây." />
      )}
      <section>
        <h2 className="font-semibold">Khóa / lớp của tôi</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {classes.map((item) => {
            const progress = contentProgress(String(item.id));
            return (
              <li key={String(item.id)}>
                <Link href={`/hoc-tap/lop/${item.class_id}`} className="platform-card block p-4">
                  <p className="font-semibold">{String(item.class_name)}</p>
                  <p className="text-sm text-[#66746f]">{String(item.course_name)} · tiến độ nội dung {progress.percent}%</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="platform-card p-5">
          <h2 className="font-semibold">Buổi học sắp tới</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {upcoming.map((item) => <li key={item.starts_at}>{formatDateTime(item.starts_at)} — {item.class_name}: {item.title}</li>)}
          </ul>
        </div>
        <div className="platform-card p-5">
          <h2 className="font-semibold">Bài tập</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {due.map((item) => <li key={item.title}>{item.title} · hạn {formatDateTime(item.due_at)}</li>)}
          </ul>
        </div>
      </section>
      <section className="platform-card p-5">
        <h2 className="font-semibold">Thông báo</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {notifs.map((item) => <li key={item.id}><Link href={item.href}>{item.title}</Link> — {item.body}</li>)}
        </ul>
      </section>
    </div>
  );
}
