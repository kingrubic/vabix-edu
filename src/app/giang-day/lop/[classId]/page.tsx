import { notFound } from "next/navigation";
import { requirePageActor } from "@/platform/auth/guard";
import { canAccessClass } from "@/platform/lms/progress";
import { getClass, listEnrollments } from "@/platform/lms/classes";
import { getDb } from "@/platform/db/client";
import { eval3wForm, saveAttendanceForm } from "@/platform/ui/actions";

export default async function TeachingClassPage({ params }: { params: Promise<{ classId: string }> }) {
  const actor = await requirePageActor();
  const { classId } = await params;
  if (!canAccessClass(actor.id, classId, actor.role)) notFound();
  const cls = getClass(classId);
  const enrollments = listEnrollments(classId) as { id: string; full_name: string; email: string }[];
  const schedules = getDb().prepare(`SELECT id, title FROM lms_schedules WHERE class_id=?`).all(classId) as { id: string; title: string }[];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">{String(cls?.name)}</h1>
      <p className="text-sm text-[#66746f]">Danh sách học viên tối thiểu phục vụ giảng dạy. Không hiện hồ sơ doanh nghiệp riêng.</p>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead><tr><th>Học viên</th><th>Email lớp</th><th>Điểm danh buổi đầu</th><th>3W</th></tr></thead>
          <tbody>
            {enrollments.map((item) => (
              <tr key={item.id}>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td>
                  {schedules[0] ? (
                    <form action={saveAttendanceForm}>
                      <input type="hidden" name="scheduleId" value={schedules[0].id} />
                      <input type="hidden" name="enrollmentId" value={item.id} />
                      <select name="status" className="input">
                        <option value="present">Có mặt</option>
                        <option value="late">Đi muộn</option>
                        <option value="absent">Vắng</option>
                        <option value="excused">Có phép</option>
                      </select>
                      <button className="underline">Lưu</button>
                    </form>
                  ) : "—"}
                </td>
                <td>
                  <form action={eval3wForm} className="flex gap-1">
                    <input type="hidden" name="enrollmentId" value={item.id} />
                    <select name="dimension" className="input"><option>WOW</option><option>WELL</option><option>WIN</option></select>
                    <input className="input" name="comment" placeholder="Nhận xét" />
                    <select name="status" className="input"><option value="draft">Nháp</option><option value="published">Công bố</option></select>
                    <button className="underline">Lưu</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
