import { requireMenu } from "@/platform/auth/guard";
import { listUsers, listDepartments, listGroups } from "@/platform/iam/service";
import { saveUserForm } from "@/platform/ui/actions";
import { formatDateTime } from "@/platform/time";

export default async function AccountsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireMenu("/admin/he-thong/tai-khoan");
  const { q } = await searchParams;
  const { rows } = listUsers({ q, limit: 50, offset: 0 });
  const departments = listDepartments() as { id: string; name: string }[];
  const groups = listGroups() as { id: string; name: string; status: string }[];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Tài khoản</h1>
      <form className="flex gap-2">
        <label className="flex-1 text-sm">
          <span className="sr-only">Tìm</span>
          <input className="input" name="q" defaultValue={q} placeholder="Tên hoặc email" />
        </label>
        <button className="bg-[#163c3e] px-4 text-white">Tìm</button>
      </form>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phòng ban</th>
              <th>Nhóm quyền</th>
              <th>Trạng thái</th>
              <th>Đăng nhập gần nhất</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                <td>{String(row.name)}{row.is_seed ? " · mẫu" : ""}</td>
                <td>{String(row.email)}</td>
                <td>{String(row.role)}</td>
                <td>{String(row.department_name ?? "—")}</td>
                <td>{String(row.groups ?? "—")}</td>
                <td>{String(row.status)}</td>
                <td>{formatDateTime(row.last_login_at as string | null)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="platform-card p-6">
        <h2 className="font-semibold text-[#163c3e]">Tạo / mời tài khoản</h2>
        <form action={saveUserForm} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm">Họ tên<input className="input mt-1" name="name" required /></label>
          <label className="text-sm">Email<input className="input mt-1" type="email" name="email" required /></label>
          <label className="text-sm">
            Role
            <select className="input mt-1" name="role" defaultValue="user">
              <option value="admin">Admin</option>
              <option value="mod">Mod</option>
              <option value="user">User</option>
            </select>
          </label>
          <label className="text-sm">
            Phòng ban
            <select className="input mt-1" name="departmentId">
              <option value="">Không gán (học viên ngoài)</option>
              {departments.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            Nhóm quyền (User)
            <select className="input mt-1" name="groupIds" multiple size={6}>
              {groups.filter((item) => item.status === "active").map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Trạng thái
            <select className="input mt-1" name="status" defaultValue="pending">
              <option value="pending">Chờ kích hoạt</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Khóa</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="invite" defaultChecked /> Gửi lời mời kích hoạt</label>
          <button className="bg-[#163c3e] px-4 py-2 text-white md:col-span-2">Lưu tài khoản</button>
        </form>
      </section>
    </div>
  );
}
