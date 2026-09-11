import { redirect } from "next/navigation";
import { bootPlatform } from "@/platform/boot";
import { getPlatformActor, type PlatformActor } from "@/platform/auth/session";
import { can, homePath, visibleWorkspaces, type ResourceContext } from "@/platform/permissions/evaluate";
import type { PermissionAction, Workspace } from "@/platform/permissions/registry";
import { menusByPath } from "@/platform/permissions/registry";

export async function requirePageActor(): Promise<PlatformActor> {
  await bootPlatform();
  const actor = await getPlatformActor();
  if (!actor) redirect("/dang-nhap");
  return actor;
}

export async function requireMenu(pathname: string, action: PermissionAction = "view", resource?: ResourceContext) {
  const actor = await requirePageActor();
  const menus = menusByPath(pathname);
  if (!menus.length) return actor;
  const allowed = menus.some((menu) => can(actor, menu.code, action, resource));
  if (!allowed) redirect("/tai-khoan?forbidden=1");
  return actor;
}

export function assertWorkspace(actor: PlatformActor, workspace: Workspace) {
  if (!visibleWorkspaces(actor).includes(workspace)) {
    redirect(homePath(actor));
  }
}
