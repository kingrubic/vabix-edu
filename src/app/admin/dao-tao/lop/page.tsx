import { requireMenu } from "@/platform/auth/guard";
import { listClasses, listEnrollments, classStaff, listLearners } from "@/platform/lms/classes";
import { listCourses, listVersions } from "@/platform/lms/courses";
import { directoryForTasks } from "@/platform/iam/service";
import { saveClassForm, enrollForm, saveLearnerForm, assignStaffForm, saveScheduleForm, setEnrollmentStatusForm } from "@/platform/ui/actions";
import { ImportLearnersBox } from "./ImportLearnersBox";

export default async function ClassesPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireMenu("/admin/dao-tao/lop");
  const { id } = await searchParams;
  const classes = listClasses() as Record<string, unknown>[];
  const courses = listCourses() as { id: string; name: string }[];
  const current = classes.find((row) => row.id === id);
  const enrollments = id ? listEnrollments(id) as Record<string, unknown>[] : [];
  const staff = id ? classStaff(id) as Record<string, unknown>[] : [];
  const learners = listLearners();
  const people = directoryForTasks() as { id: string; name: string }[];
  const versions = current ? (listVersions(String(current.course_id)) as { id: string; version_number: number; status: string }[]) : [];
  const publishedVersions = courses.flatMap((course) =>
    (listVersions(course.id) as { id: string; version_number: number; status: string }[])
      .filter((item) => item.status === "published")
      .map((item) => ({ ...item, courseName: course.name })),
  );
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Lớp học</h1>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead><tr><th>Mã</th><th>Tên</th><th>Khóa</th><th>Trạng thái</th><th>Sĩ số</th></tr></thead>
          <tbody>
            {classes.map((row) => (
              <tr key={String(row.id)}>
                <td><a className="underline" href={`/admin/dao-tao/lop?id=${row.id}`}>{String(row.code)}</a></td>
                <td>{String(row.name)}</td>
                <td>{String(row.course_name)}</td>
                <td>{String(row.status)}</td>
                <td>{String(row.enrollment_count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form action={saveClassForm} className="platform-card grid gap-3 p-6 md:grid-cols-2">
        <label className="text-sm">Mã<input className="input mt-1" name="code" required /></label>
        <label className="text-sm">Tên<input className="input mt-1" name="name" required /></label>
        <label className="text-sm">
          Khóa học
          <select className="input mt-1" name="courseId" required>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
          </select>
        </label>
        <label className="text-sm">
          Phiên bản giáo trình đã xuất bản
          <select className="input mt-1" name="versionId" required>
            <option value="">Chọn phiên bản</option>
            {publishedVersions.map((item) => (
              <option key={item.id} value={item.id}>{item.courseName} · v{item.version_number}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">Bắt đầu<input className="input mt-1" type="date" name="startsOn" /></label>
        <label className="text-sm">Kết thúc<input className="input mt-1" type="date" name="endsOn" /></label>
        <label className="text-sm">Địa điểm<input className="input mt-1" name="location" /></label>
        <label className="text-sm">Link học<input className="input mt-1" name="meetingUrl" /></label>
        <button className="bg-[#163c3e] px-4 py-2 text-white">Tạo lớp</button>
      </form>
      {id ? (
        <>
          <section className="platform-card p-6">
            <h2 className="font-semibold">Phân công giảng dạy</h2>
            <ul className="mt-2 text-sm">{staff.map((item) => <li key={String(item.id)}>{String(item.name)} — {String(item.role)}</li>)}</ul>
            <form action={assignStaffForm} className="mt-3 flex gap-2">
              <input type="hidden" name="classId" value={id} />
              <select className="input" name="userId">{people.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
              <select className="input" name="role">
                <option value="instructor">Giảng viên</option>
                <option value="assistant">Trợ giảng</option>
                <option value="coordinator">Điều phối</option>
              </select>
              <button className="bg-[#163c3e] px-3 text-white">Phân công</button>
            </form>
          </section>
          <section className="platform-card p-6">
            <h2 className="font-semibold">Ghi danh</h2>
            <div className="platform-table-wrap mt-3">
              <table className="platform-table">
                <thead><tr><th>Học viên</th><th>Tài khoản</th><th>Trạng thái</th><th></th></tr></thead>
                <tbody>
                  {enrollments.map((item) => (
                    <tr key={String(item.id)}>
                      <td>{String(item.full_name)}</td>
                      <td>{String(item.account_name ?? "Chưa liên kết")}</td>
                      <td>{String(item.status)}</td>
                      <td>
                        <form action={setEnrollmentStatusForm} className="flex gap-2">
                          <input type="hidden" name="enrollmentId" value={String(item.id)} />
                          <select className="input" name="status" defaultValue={String(item.status)}>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="active">Đang học</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="paused">Tạm dừng</option>
                            <option value="withdrawn">Rút</option>
                          </select>
                          <button className="px-2 underline">Cập nhật</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form action={enrollForm} className="mt-4 flex gap-2">
              <input type="hidden" name="classId" value={id} />
              <select className="input" name="learnerProfileId">
                {(learners as { id: string; full_name: string }[]).map((item) => <option key={item.id} value={item.id}>{item.full_name}</option>)}
              </select>
              <button className="bg-[#163c3e] px-3 text-white">Ghi danh</button>
            </form>
            <form action={saveLearnerForm} className="mt-4 grid gap-2 md:grid-cols-2">
              <p className="md:col-span-2 text-sm">Thêm hồ sơ học viên — không tạo tài khoản đăng nhập.</p>
              <input className="input" name="fullName" placeholder="Họ tên" required />
              <input className="input" name="email" placeholder="Email" />
              <input className="input" name="phone" placeholder="Điện thoại" />
              <input className="input" name="organization" placeholder="Doanh nghiệp" />
              <button className="bg-[#163c3e] px-3 py-2 text-white">Lưu hồ sơ</button>
            </form>
            <ImportLearnersBox classId={id} />
          </section>
          <form action={saveScheduleForm} className="platform-card grid gap-3 p-6 md:grid-cols-2">
            <h2 className="md:col-span-2 font-semibold">Thêm buổi học</h2>
            <input type="hidden" name="classId" value={id} />
            <input className="input" name="title" placeholder="Nội dung buổi" required />
            <input className="input" type="datetime-local" name="startsAt" required />
            <input className="input" type="datetime-local" name="endsAt" required />
            <input className="input" name="location" placeholder="Địa điểm" />
            <input className="input" name="meetingUrl" placeholder="Link phòng học" />
            <button className="bg-[#163c3e] px-3 py-2 text-white">Lưu lịch</button>
            {versions.length ? <p className="md:col-span-2 text-xs text-[#66746f]">Lớp đang dùng giáo trình v{versions.find((item) => item.id === current?.version_id)?.version_number}.</p> : null}
          </form>
        </>
      ) : null}
    </div>
  );
}
