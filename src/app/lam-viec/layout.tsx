import { PlatformShell } from "@/platform/ui/Shell";
import { requirePageActor, assertWorkspace } from "@/platform/auth/guard";
import { sidebarNodes, visibleWorkspaces } from "@/platform/permissions/evaluate";

export default async function WorkLayout({ children }: { children: React.ReactNode }) {
  const actor = await requirePageActor();
  assertWorkspace(actor, "work");
  return (
    <PlatformShell name={actor.name} role={actor.role} workspace="work" workspaces={visibleWorkspaces(actor)} nodes={sidebarNodes(actor, "work")}>
      {children}
    </PlatformShell>
  );
}
