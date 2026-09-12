import { PlatformShell } from "@/platform/ui/Shell";
import { requirePageActor, assertWorkspace } from "@/platform/auth/guard";
import { sidebarNodes, visibleWorkspaces } from "@/platform/permissions/evaluate";

export default async function LearningLayout({ children }: { children: React.ReactNode }) {
  const actor = await requirePageActor();
  assertWorkspace(actor, "learning");
  return (
    <PlatformShell name={actor.name} role={actor.role} workspace="learning" workspaces={visibleWorkspaces(actor)} nodes={sidebarNodes(actor, "learning")}>
      {children}
    </PlatformShell>
  );
}
