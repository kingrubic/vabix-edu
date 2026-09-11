import {
  actionAllowedOnMenu,
  isAdminOnlyMenu,
  MENU_TREE,
  SCOPE_RANK,
  type DataScope,
  type MenuNode,
  type PermissionAction,
  type PlatformRole,
  type Workspace,
  allMenus,
  findMenu,
} from "./registry";

export type Grant = {
  menuCode: string;
  action: PermissionAction;
  scope: DataScope;
  groupCode?: string;
  groupName?: string;
};

export type ResourceContext = {
  ownerUserId?: string | null;
  assigneeUserId?: string | null;
  collaboratorUserIds?: string[];
  departmentId?: string | null;
  classId?: string | null;
  enrolledUserId?: string | null;
  assignedClassIds?: string[];
  assignedEnrollment?: boolean;
};

export type Actor = {
  id: string;
  role: PlatformRole;
  departmentId: string | null;
  status: string;
  grants: Grant[];
  assignedClassIds: string[];
};

export function widestScope(grants: Grant[], menuCode: string, action: PermissionAction): DataScope | null {
  const matched = grants.filter((grant) => grant.menuCode === menuCode && grant.action === action);
  if (!matched.length) return null;
  return matched.reduce((best, grant) => (SCOPE_RANK[grant.scope] > SCOPE_RANK[best] ? grant.scope : best), matched[0].scope);
}

export function effectiveGrants(grants: Grant[]): Grant[] {
  const map = new Map<string, Grant>();
  for (const grant of grants) {
    const key = `${grant.menuCode}:${grant.action}`;
    const current = map.get(key);
    if (!current || SCOPE_RANK[grant.scope] > SCOPE_RANK[current.scope]) {
      map.set(key, grant);
    }
  }
  return [...map.values()];
}

export function visibleMenuCodes(actor: Actor): Set<string> {
  const codes = new Set<string>();
  if (actor.role === "admin") {
    for (const menu of allMenus()) codes.add(menu.code);
    return codes;
  }
  if (actor.role === "mod") {
    for (const menu of allMenus()) {
      if (!isAdminOnlyMenu(menu.code)) codes.add(menu.code);
    }
    return codes;
  }
  for (const grant of actor.grants) {
    if (grant.action !== "view") continue;
    let current: string | null = grant.menuCode;
    while (current) {
      if (isAdminOnlyMenu(current)) break;
      codes.add(current);
      current = findMenu(current)?.parentCode ?? null;
    }
  }
  codes.add("account");
  return codes;
}

export function visibleWorkspaces(actor: Actor): Workspace[] {
  const menus = visibleMenuCodes(actor);
  const spaces = new Set<Workspace>();
  if (actor.role === "admin" || actor.role === "mod") spaces.add("admin");
  for (const menu of allMenus()) {
    if (menus.has(menu.code) && menu.workspace !== "account") {
      if (menu.workspace === "admin" && menu.code.startsWith("work.")) {
        spaces.add("work");
        if (actor.role !== "user") spaces.add("admin");
        continue;
      }
      spaces.add(menu.workspace);
    }
  }
  if (actor.grants.some((grant) => grant.menuCode.startsWith("work.") && grant.action === "view")) {
    spaces.add("work");
  }
  spaces.add("account");
  return [...spaces];
}

export function sidebarNodes(actor: Actor, workspace: Workspace): MenuNode[] {
  const allowed = visibleMenuCodes(actor);
  function filterTree(nodes: MenuNode[]): MenuNode[] {
    const result: MenuNode[] = [];
    for (const node of nodes) {
      if (node.workspace !== workspace && !(node.children && node.children.some((child) => child.workspace === workspace))) {
        continue;
      }
      const children = node.children ? filterTree(node.children) : undefined;
      const selfVisible = allowed.has(node.code) && (node.workspace === workspace || Boolean(children?.length));
      if (!selfVisible && !children?.length) continue;
      result.push({ ...node, children });
    }
    return result;
  }
  return filterTree(MENU_TREE);
}

function scopeCovers(scope: DataScope, actor: Actor, resource?: ResourceContext) {
  if (scope === "all") return true;
  if (!resource) return scope === "self";
  if (scope === "self") {
    return resource.ownerUserId === actor.id || resource.enrolledUserId === actor.id || resource.assigneeUserId === actor.id;
  }
  if (scope === "assigned") {
    if (resource.assignedEnrollment) return true;
    if (resource.assigneeUserId === actor.id) return true;
    if (resource.collaboratorUserIds?.includes(actor.id)) return true;
    if (resource.classId && actor.assignedClassIds.includes(resource.classId)) return true;
    if (resource.assignedClassIds?.some((id) => actor.assignedClassIds.includes(id))) return true;
    return false;
  }
  if (scope === "department") {
    return Boolean(actor.departmentId && resource.departmentId && actor.departmentId === resource.departmentId);
  }
  return false;
}

export function can(actor: Actor, menuCode: string, action: PermissionAction, resource?: ResourceContext): boolean {
  if (actor.status !== "active") return false;
  if (isAdminOnlyMenu(menuCode) && actor.role !== "admin") return false;
  if (action !== "view" && !actionAllowedOnMenu(menuCode, action) && findMenu(menuCode)?.actions.length) {
    if (!actionAllowedOnMenu(menuCode, action)) return false;
  }
  if (actor.role === "admin") return true;
  if (actor.role === "mod") {
    return !isAdminOnlyMenu(menuCode);
  }
  const scope = widestScope(actor.grants, menuCode, action);
  if (!scope) return false;
  if (action !== "view") {
    const viewScope = widestScope(actor.grants, menuCode, "view");
    if (!viewScope) return false;
  }
  return scopeCovers(scope, actor, resource);
}

export function assertCan(actor: Actor, menuCode: string, action: PermissionAction, resource?: ResourceContext) {
  if (!can(actor, menuCode, action, resource)) {
    const error = new Error("FORBIDDEN") as Error & { code: string };
    error.code = "FORBIDDEN";
    throw error;
  }
}

export function homePath(actor: Actor) {
  if (actor.role === "admin" || actor.role === "mod") return "/admin";
  const spaces = visibleWorkspaces(actor);
  if (spaces.includes("learning")) return "/hoc-tap";
  if (spaces.includes("teaching")) return "/giang-day";
  if (spaces.includes("work")) return "/lam-viec";
  return "/tai-khoan";
}

export function grantSources(grants: Grant[], menuCode: string, action: PermissionAction) {
  return grants.filter((grant) => grant.menuCode === menuCode && grant.action === action);
}
