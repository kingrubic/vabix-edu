import { requireMenu } from "@/platform/auth/guard";
import { getGroup, listGroups } from "@/platform/iam/service";
import { MENU_TREE, allMenus } from "@/platform/permissions/registry";
import { GroupEditor } from "./GroupEditor";

export default async function GroupsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  await requireMenu("/admin/he-thong/nhom-quyen");
  const { id } = await searchParams;
  const groups = listGroups() as { id: string; code: string; name: string; status: string; member_count: number; is_seed: number }[];
  const current = id ? getGroup(id) : null;
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Nhóm quyền</h1>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead>
            <tr><th>Mã</th><th>Tên</th><th>Thành viên</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td><a className="underline" href={`/admin/he-thong/nhom-quyen?id=${group.id}`}>{group.code}</a></td>
                <td>{group.name}{group.is_seed ? " · mẫu" : ""}</td>
                <td>{group.member_count}</td>
                <td>{group.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GroupEditor
        tree={MENU_TREE}
        menus={allMenus()}
        group={current}
      />
    </div>
  );
}
