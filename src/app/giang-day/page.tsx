import { requirePageActor } from "@/platform/auth/guard";
import { teachingClasses } from "@/platform/lms/progress";
import { pendingGrading } from "@/platform/lms/assignments";
import { getDb } from "@/platform/db/client";
import { formatDateTime } from "@/platform/time";
import Link from "next/link";
import { EmptyState } from "@/platform/ui/Shell";

export default async function TeachingHome() {
  const actor = await requirePageActor();
  const classes = teachingClasses(actor.id) as Record<string, unknown>[];
  const pending = pendingGrading(actor) as Record<string, unknown>[];
  const schedule = getDb()
    .prepare(
      `SELECT s.title, s.starts_at, c.name FROM lms_schedules s
       JOIN lms_class_staff st ON st.class_id = s.class_id
       JOIN lms_classes c ON c.id = s.class_id
       WHERE st.user_id=? AND s.starts_at >= datetime('now') ORDER BY s.starts_at LIMIT 6`,
    )
    .all(actor.id) as { title: string; starts_at: string; name: string }[];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Giảng dạy</h1>
      {!classes.length ? <EmptyState title="Chưa được phân công lớp" body="Khi Admin/Mod phân công, lớp phụ trách sẽ hiện tại đây." /> : (
        <ul className="grid gap-3 md:grid-cols-2">
          {classes.map((item) => (
            <li key={String(item.id)}>
              <Link href={`/giang-day/lop/${item.id}`} className="platform-card block p-4">
                <p className="font-semibold">{String(item.name)}</p>
                <p className="text-sm text-[#66746f]">{String(item.course_name)} · {String(item.staff_role)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <section className="platform-card p-5">
        <h2 className="font-semibold">Lịch giảng dạy</h2>
        <ul className="mt-2 text-sm space-y-2">{schedule.map((item) => <li key={item.starts_at}>{formatDateTime(item.starts_at)} — {item.name}: {item.title}</li>)}</ul>
      </section>
      <section className="platform-card p-5">
        <h2 className="font-semibold">Bài cần chấm</h2>
        <ul className="mt-2 text-sm">{pending.map((item) => <li key={String(item.id)}>{String(item.full_name)} — {String(item.title)}</li>)}</ul>
      </section>
    </div>
  );
}
