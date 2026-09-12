import { requireMenu } from "@/platform/auth/guard";
import { listEnrollments, listClasses } from "@/platform/lms/classes";
import { contentProgress, attendanceRate, completionState } from "@/platform/lms/progress";

export default async function ReportsPage() {
  await requireMenu("/admin/dao-tao/bao-cao");
  const classes = listClasses() as { id: string; name: string }[];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Báo cáo học tập</h1>
      <p className="text-sm text-[#66746f]">Cùng công thức với màn hình chi tiết: tiến độ nội dung chỉ tính bài bắt buộc; chuyên cần = (có mặt + đi muộn) / (có mặt + đi muộn + vắng).</p>
      <p><a className="underline" href="/api/platform/reports/learning">Tải CSV (theo quyền export)</a></p>
      {classes.map((item) => {
        const enrollments = listEnrollments(item.id) as { id: string; full_name: string }[];
        return (
          <section key={item.id} className="platform-card p-5">
            <h2 className="font-semibold">{item.name}</h2>
            <div className="platform-table-wrap mt-3">
              <table className="platform-table">
                <thead><tr><th>Học viên</th><th>Nội dung</th><th>Chuyên cần</th><th>Đạt khóa</th></tr></thead>
                <tbody>
                  {enrollments.map((enrollment) => {
                    const content = contentProgress(enrollment.id);
                    const att = attendanceRate(enrollment.id);
                    const done = completionState(enrollment.id);
                    return (
                      <tr key={enrollment.id}>
                        <td>{enrollment.full_name}</td>
                        <td>{content.percent}%</td>
                        <td>{att.percent ?? "—"}</td>
                        <td>{done.coursePassed ? "Có" : "Chưa"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
