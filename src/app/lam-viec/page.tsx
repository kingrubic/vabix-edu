import { requirePageActor } from "@/platform/auth/guard";
import { listTasks } from "@/platform/tasks/service";
import { directoryForTasks } from "@/platform/iam/service";
import { saveTaskForm, taskStatusForm } from "@/platform/ui/actions";
import { formatDate } from "@/platform/time";
import { can } from "@/platform/permissions/evaluate";

export default async function UserWorkPage() {
  const actor = await requirePageActor();
  if (!can(actor, "work.user.mine", "view") && !can(actor, "work.mine", "view") && actor.role === "user") {
    return <p>Bạn chưa được cấp quyền công việc.</p>;
  }
  const rows = listTasks(actor, "mine") as Record<string, unknown>[];
  const created = listTasks(actor, "created") as Record<string, unknown>[];
  const people = directoryForTasks() as { id: string; name: string; department_name: string | null }[];
  const canCreate = actor.role !== "user" || can(actor, "work.user.created", "create");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Công việc của tôi</h1>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead><tr><th>Mã</th><th>Tiêu đề</th><th>Hạn</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                <td>{String(row.code)}</td>
                <td>{String(row.title)}</td>
                <td>{formatDate(row.due_on as string | null)}</td>
                <td>
                  <form action={taskStatusForm} className="flex gap-2">
                    <input type="hidden" name="id" value={String(row.id)} />
                    <select className="input" name="status" defaultValue={String(row.status)}>
                      <option value="new">Mới</option>
                      <option value="in_progress">Đang làm</option>
                      <option value="waiting">Chờ phản hồi</option>
                      <option value="done">Hoàn thành</option>
                    </select>
                    <button className="underline">Lưu</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {canCreate ? (
        <form action={saveTaskForm} className="platform-card grid gap-3 p-6">
          <h2 className="font-semibold">Tôi đã giao ({created.length})</h2>
          <input className="input" name="title" required placeholder="Tiêu đề" />
          <select className="input" name="assigneeUserId">
            {people.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <button className="bg-[#163c3e] px-3 py-2 text-white">Tạo</button>
        </form>
      ) : null}
    </div>
  );
}
