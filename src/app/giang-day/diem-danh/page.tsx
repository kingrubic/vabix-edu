import { requirePageActor } from "@/platform/auth/guard";
import { teachingClasses } from "@/platform/lms/progress";
import { listEnrollments } from "@/platform/lms/classes";
import { getDb } from "@/platform/db/client";
import { saveAttendanceForm } from "@/platform/ui/actions";
import { EmptyState } from "@/platform/ui/Shell";

export default async function TeachingAttendancePage() {
  const actor = await requirePageActor();
  const classes = teachingClasses(actor.id) as { id: string; name: string }[];
  if (!classes.length) return <EmptyState title="Chưa được phân công lớp" body="Điểm danh chỉ hiện với lớp bạn phụ trách." />;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Điểm danh</h1>
      {classes.map((cls) => {
        const schedules = getDb().prepare(`SELECT id, title FROM lms_schedules WHERE class_id=? ORDER BY starts_at`).all(cls.id) as { id: string; title: string }[];
        const enrollments = listEnrollments(cls.id) as { id: string; full_name: string }[];
        return (
          <section key={cls.id} className="platform-card p-5">
            <h2 className="font-semibold">{cls.name}</h2>
            {!schedules.length ? <p className="mt-2 text-sm text-[#66746f]">Chưa có buổi học.</p> : (
              <div className="platform-table-wrap mt-3">
                <table className="platform-table">
                  <thead><tr><th>Học viên</th>{schedules.map((item) => <th key={item.id}>{item.title}</th>)}</tr></thead>
                  <tbody>
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td>{enrollment.full_name}</td>
                        {schedules.map((schedule) => (
                          <td key={schedule.id}>
                            <form action={saveAttendanceForm} className="flex gap-1">
                              <input type="hidden" name="scheduleId" value={schedule.id} />
                              <input type="hidden" name="enrollmentId" value={enrollment.id} />
                              <select name="status" className="input">
                                <option value="present">Có mặt</option>
                                <option value="late">Đi muộn</option>
                                <option value="absent">Vắng</option>
                                <option value="excused">Có phép</option>
                              </select>
                              <button className="underline">Lưu</button>
                            </form>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
