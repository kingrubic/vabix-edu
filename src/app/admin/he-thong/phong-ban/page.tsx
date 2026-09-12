import { requireMenu } from "@/platform/auth/guard";
import { listDepartments, listUsers } from "@/platform/iam/service";
import { saveDepartmentForm } from "@/platform/ui/actions";

export default async function DepartmentsPage() {
  await requireMenu("/admin/he-thong/phong-ban");
  const rows = listDepartments() as Record<string, unknown>[];
  const users = listUsers({ status: "active", limit: 200 }).rows as { id: string; name: string }[];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Phòng ban</h1>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead>
            <tr><th>Mã</th><th>Tên</th><th>Phụ trách</th><th>Thành viên</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                <td>{String(row.code)}</td>
                <td>{String(row.name)}</td>
                <td>{String(row.lead_name ?? "—")}</td>
                <td>{String(row.member_count)}</td>
                <td>{String(row.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form action={saveDepartmentForm} className="platform-card grid gap-3 p-6 md:grid-cols-2">
        <label className="text-sm">Mã<input className="input mt-1" name="code" required /></label>
        <label className="text-sm">Tên<input className="input mt-1" name="name" required /></label>
        <label className="text-sm md:col-span-2">Mô tả<textarea className="input mt-1" name="description" /></label>
        <label className="text-sm">
          Phòng ban cha
          <select className="input mt-1" name="parentId">
            <option value="">Không</option>
            {rows.map((row) => <option key={String(row.id)} value={String(row.id)}>{String(row.name)}</option>)}
          </select>
        </label>
        <label className="text-sm">
          Người phụ trách
          <select className="input mt-1" name="leadUserId">
            <option value="">Không</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
        </label>
        <p className="md:col-span-2 text-xs text-[#66746f]">Người phụ trách không mặc nhiên có quyền Mod/Admin. Phòng ban cha không mặc nhiên xem dữ liệu con.</p>
        <button className="bg-[#163c3e] px-4 py-2 text-white">Lưu phòng ban</button>
      </form>
    </div>
  );
}
