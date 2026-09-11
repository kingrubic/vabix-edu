import { requireMenu, requirePageActor } from "@/platform/auth/guard";
import { listTasks } from "@/platform/tasks/service";
import { directoryForTasks } from "@/platform/iam/service";
import { saveTaskForm, taskStatusForm } from "@/platform/ui/actions";
import { formatDate } from "@/platform/time";

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const actor = await requirePageActor();
  await requireMenu("/admin/cong-viec");
  const { view } = await searchParams;
  const filter = (view === "mine" || view === "created" || view === "overdue" ? view : "all") as "mine" | "created" | "all" | "overdue";
  const rows = listTasks(actor, filter) as Record<string, unknown>[];
  const people = directoryForTasks() as { id: string; name: string; department_name: string | null }[];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Công việc</h1>
      <nav className="flex gap-3 text-sm">
        <a href="/admin/cong-viec">Tất cả</a>
        <a href="/admin/cong-viec?view=mine">Của tôi</a>
        <a href="/admin/cong-viec?view=created">Tôi đã giao</a>
        <a href="/admin/cong-viec?view=overdue">Quá hạn</a>
      </nav>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead><tr><th>Mã</th><th>Tiêu đề</th><th>Phụ trách</th><th>Hạn</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                <td>{String(row.code)}</td>
                <td>{String(row.title)}</td>
                <td>{String(row.assignee_name)}</td>
                <td>{formatDate(row.due_on as string | null)}</td>
                <td>{String(row.status)}</td>
                <td>
                  <form action={taskStatusForm} className="flex gap-2">
                    <input type="hidden" name="id" value={String(row.id)} />
                    <select className="input" name="status" defaultValue={String(row.status)}>
                      <option value="new">Mới</option>
                      <option value="in_progress">Đang làm</option>
                      <option value="waiting">Chờ phản hồi</option>
                      <option value="done">Hoàn thành</option>
                      <option value="cancelled">Hủy</option>
                    </select>
                    <button className="underline">Lưu</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form action={saveTaskForm} className="platform-card grid gap-3 p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 font-semibold">Giao việc</h2>
        <input className="input md:col-span-2" name="title" placeholder="Tiêu đề" required />
        <textarea className="input md:col-span-2" name="description" placeholder="Mô tả" />
        <label className="text-sm">
          Người phụ trách
          <select className="input mt-1" name="assigneeUserId" required>
            {people.map((user) => <option key={user.id} value={user.id}>{user.name}{user.department_name ? ` · ${user.department_name}` : ""}</option>)}
          </select>
        </label>
        <label className="text-sm">Hạn<input className="input mt-1" type="date" name="dueOn" /></label>
        <select className="input" name="priority">
          <option value="normal">Bình thường</option>
          <option value="high">Cao</option>
          <option value="urgent">Khẩn</option>
        </select>
        <button className="bg-[#163c3e] px-3 py-2 text-white">Tạo task</button>
      </form>
    </div>
  );
}
