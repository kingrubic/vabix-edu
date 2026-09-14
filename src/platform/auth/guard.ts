import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { bootPlatform } from "@/platform/boot";
import { getPlatformActor, type PlatformActor } from "@/platform/auth/session";
import { can, homePath, visibleWorkspaces, type ResourceContext } from "@/platform/permissions/evaluate";
import type { PermissionAction, Workspace } from "@/platform/permissions/registry";
import { menusByPath } from "@/platform/permissions/registry";

const PASSWORD_CHANGE_PATH = "/doi-mat-khau";

export async function requirePageActor(): Promise<PlatformActor> {
  await bootPlatform();
  const actor = await getPlatformActor();
  if (!actor) redirect("/dang-nhap");
  if (actor.mustChangePassword) {
    const pathname = (await headers()).get("x-pathname") ?? "";
    if (pathname !== PASSWORD_CHANGE_PATH && !pathname.startsWith(`${PASSWORD_CHANGE_PATH}/`)) {
      redirect(PASSWORD_CHANGE_PATH);
    }
  }
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
