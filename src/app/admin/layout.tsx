import { PlatformShell } from "@/platform/ui/Shell";
import { requirePageActor } from "@/platform/auth/guard";
import { sidebarNodes, visibleWorkspaces } from "@/platform/permissions/evaluate";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const actor = await requirePageActor();
  const spaces = visibleWorkspaces(actor);
  if (!spaces.includes("admin") && actor.role === "user") {
    // layout still renders; page guards will redirect
  }
  return (
    <PlatformShell
      name={actor.name}
      role={actor.role}
      workspace="admin"
      workspaces={spaces}
      nodes={sidebarNodes(actor, "admin")}
    >
      {children}
    </PlatformShell>
  );
}
