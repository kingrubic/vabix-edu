import { requireMenu } from "@/platform/auth/guard";
import { listCourses, listVersions, getVersionBundle } from "@/platform/lms/courses";
import { saveCourseForm, saveModuleForm, saveLessonForm, publishVersionForm, cloneVersionForm } from "@/platform/ui/actions";

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ id?: string; version?: string }> }) {
  await requireMenu("/admin/dao-tao/khoa-hoc");
  const { id, version } = await searchParams;
  const courses = listCourses() as { id: string; code: string; name: string; status: string }[];
  const versions = id ? (listVersions(id) as { id: string; version_number: number; status: string }[]) : [];
  const bundle = version ? getVersionBundle(version) : null;
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Khóa học và giáo trình</h1>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead><tr><th>Mã</th><th>Tên</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td><a className="underline" href={`/admin/dao-tao/khoa-hoc?id=${course.id}`}>{course.code}</a></td>
                <td>{course.name}</td>
                <td>{course.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form action={saveCourseForm} className="platform-card grid gap-3 p-6 md:grid-cols-2">
        <label className="text-sm">Mã<input className="input mt-1" name="code" required /></label>
        <label className="text-sm">Tên<input className="input mt-1" name="name" required /></label>
        <label className="text-sm md:col-span-2">Mô tả<textarea className="input mt-1" name="description" /></label>
        <label className="text-sm">Chương trình công khai (slug)<input className="input mt-1" name="publicProgramSlug" placeholder="bmdo" /></label>
        <label className="text-sm">
          Hình thức
          <select className="input mt-1" name="format">
            <option value="in_person">Trực tiếp</option>
            <option value="online">Trực tuyến</option>
            <option value="blended">Kết hợp</option>
            <option value="self_paced">Tự học</option>
          </select>
        </label>
        <label className="text-sm">Thời lượng tham khảo<input className="input mt-1" name="durationNote" /></label>
        <button className="bg-[#163c3e] px-4 py-2 text-white">Tạo khóa học</button>
      </form>
      {id ? (
        <section className="platform-card p-6">
          <h2 className="font-semibold">Phiên bản giáo trình</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {versions.map((item) => (
              <li key={item.id}>
                <a className="underline" href={`/admin/dao-tao/khoa-hoc?id=${id}&version=${item.id}`}>v{item.version_number}</a> — {item.status}
              </li>
            ))}
          </ul>
          {version ? (
            <div className="mt-4 flex gap-2">
              <form action={publishVersionForm}><input type="hidden" name="versionId" value={version} /><button className="bg-[#163c3e] px-3 py-2 text-white">Xuất bản phiên bản</button></form>
              <form action={cloneVersionForm}><input type="hidden" name="versionId" value={version} /><button className="border border-[#163c3e] px-3 py-2">Tạo bản nháp mới từ phiên bản này</button></form>
            </div>
          ) : null}
        </section>
      ) : null}
      {bundle ? (
        <section className="space-y-4">
          {(bundle.modules as { id: string; title: string }[]).map((mod) => (
            <article key={mod.id} className="platform-card p-5">
              <h3 className="font-semibold">{mod.title}</h3>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {(bundle.lessons as { id: string; module_id: string; title: string; kind: string }[])
                  .filter((lesson) => lesson.module_id === mod.id)
                  .map((lesson) => <li key={lesson.id}>{lesson.title} ({lesson.kind})</li>)}
              </ul>
              <form action={saveLessonForm} className="mt-3 grid gap-2 md:grid-cols-2">
                <input type="hidden" name="moduleId" value={mod.id} />
                <input className="input" name="title" placeholder="Tên bài" required />
                <select className="input" name="kind">
                  <option value="article">Văn bản</option>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="assignment">Bài tập</option>
                  <option value="quiz">Kiểm tra</option>
                  <option value="live">Buổi học</option>
                  <option value="link">Liên kết</option>
                </select>
                <textarea className="input md:col-span-2" name="body" placeholder="Nội dung" />
                <select className="input" name="completionRule" defaultValue="confirm">
                  <option value="confirm">Xác nhận đã học</option>
                  <option value="video_confirm">Video — xác nhận thủ công</option>
                  <option value="assignment">Theo bài tập</option>
                  <option value="quiz">Theo kiểm tra</option>
                </select>
                <button className="bg-[#163c3e] px-3 py-2 text-white">Thêm bài</button>
              </form>
            </article>
          ))}
          <form action={saveModuleForm} className="platform-card flex gap-2 p-4">
            <input type="hidden" name="versionId" value={version} />
            <input className="input" name="title" placeholder="Tên chuyên đề" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="required" defaultChecked /> Bắt buộc</label>
            <button className="bg-[#163c3e] px-3 text-white">Thêm chuyên đề</button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
