"use client";

import { useMemo, useState } from "react";
import { saveGroupForm } from "@/platform/ui/actions";
import type { DataScope, MenuNode, PermissionAction, FlatMenu } from "@/platform/permissions/registry";
import { isAdminOnlyMenu } from "@/platform/permissions/registry";

type Grant = { menuCode: string; action: PermissionAction; scope: DataScope };

export function GroupEditor({
  tree,
  menus,
  group,
}: {
  tree: MenuNode[];
  menus: FlatMenu[];
  group: {
    id: string;
    code: string;
    name: string;
    description: string;
    status: string;
    is_seed?: number;
    grants: { menu_code: string; action: PermissionAction; scope: DataScope }[];
    members: { id: string; name?: string; email?: string }[];
  } | null;
}) {
  const [grants, setGrants] = useState<Grant[]>(
    group?.grants.map((item) => ({ menuCode: item.menu_code, action: item.action, scope: item.scope })) ?? [],
  );
  const byMenu = useMemo(() => {
    const map = new Map<string, Grant[]>();
    for (const grant of grants) {
      map.set(grant.menuCode, [...(map.get(grant.menuCode) ?? []), grant]);
    }
    return map;
  }, [grants]);

  function toggle(menuCode: string, action: PermissionAction, on: boolean) {
    setGrants((current) => {
      const next = current.filter((item) => !(item.menuCode === menuCode && item.action === action));
      if (on) next.push({ menuCode, action, scope: "assigned" });
      if (on && action !== "view" && !next.some((item) => item.menuCode === menuCode && item.action === "view")) {
        next.push({ menuCode, action: "view", scope: "assigned" });
      }
      return next;
    });
  }

  function setScope(menuCode: string, action: PermissionAction, scope: DataScope) {
    setGrants((current) => current.map((item) => (item.menuCode === menuCode && item.action === action ? { ...item, scope } : item)));
  }

  function renderNodes(nodes: MenuNode[], depth = 0): React.ReactNode {
    return nodes.map((node) => {
      if (isAdminOnlyMenu(node.code)) return null;
      const selected = byMenu.get(node.code) ?? [];
      const viewOn = selected.some((item) => item.action === "view");
      return (
        <div key={node.code} className="border-b border-[#163c3e]/10 py-3" style={{ paddingLeft: depth * 16 }}>
          <label className="flex items-center gap-2 text-sm font-medium text-[#163c3e]">
            <input type="checkbox" checked={viewOn} onChange={(e) => toggle(node.code, "view", e.target.checked)} />
            Cho phép truy cập — {node.label}
          </label>
          {viewOn && node.actions?.length ? (
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              {node.actions.filter((action) => action !== "view").map((action) => {
                const grant = selected.find((item) => item.action === action);
                return (
                  <label key={action} className="flex items-center gap-1">
                    <input type="checkbox" checked={Boolean(grant)} onChange={(e) => toggle(node.code, action, e.target.checked)} />
                    {action}
                    {grant ? (
                      <select value={grant.scope} onChange={(e) => setScope(node.code, action, e.target.value as DataScope)}>
                        <option value="self">Của bản thân</option>
                        <option value="assigned">Được giao</option>
                        <option value="department">Phòng ban</option>
                        <option value="all">Toàn bộ</option>
                      </select>
                    ) : null}
                  </label>
                );
              })}
            </div>
          ) : null}
          {node.children ? renderNodes(node.children, depth + 1) : null}
        </div>
      );
    });
  }

  const preview = menus.filter((item) => grants.some((grant) => grant.menuCode === item.code && grant.action === "view") && item.path);

  return (
    <form action={saveGroupForm} className="platform-card space-y-4 p-6">
      <input type="hidden" name="id" value={group?.id ?? ""} />
      <input type="hidden" name="grants" value={JSON.stringify(grants)} />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm">Mã<input className="input mt-1" name="code" defaultValue={group?.code} required /></label>
        <label className="text-sm">Tên<input className="input mt-1" name="name" defaultValue={group?.name} required /></label>
      </div>
      <label className="block text-sm">Mô tả<textarea className="input mt-1" name="description" defaultValue={group?.description} /></label>
      <label className="block text-sm">
        Trạng thái
        <select className="input mt-1" name="status" defaultValue={group?.status ?? "active"}>
          <option value="active">Hoạt động</option>
          <option value="archived">Lưu trữ</option>
        </select>
      </label>
      {group?.members.length ? <p className="text-sm text-[#16332b]">Lưu trữ nhóm này sẽ ảnh hưởng {group.members.length} thành viên.</p> : null}
      <div>{renderNodes(tree.filter((node) => !node.adminOnly))}</div>
      <div>
        <h3 className="font-semibold text-[#163c3e]">Xem trước sidebar</h3>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {preview.map((item) => <li key={item.code}>{item.label}</li>)}
        </ul>
      </div>
      <button className="bg-[#163c3e] px-4 py-2 text-white">Lưu nhóm quyền</button>
    </form>
  );
}
