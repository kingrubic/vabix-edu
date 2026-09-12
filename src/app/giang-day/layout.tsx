import { PlatformShell } from "@/platform/ui/Shell";
import { requirePageActor, assertWorkspace } from "@/platform/auth/guard";
import { sidebarNodes, visibleWorkspaces } from "@/platform/permissions/evaluate";

export default async function TeachingLayout({ children }: { children: React.ReactNode }) {
  const actor = await requirePageActor();
  assertWorkspace(actor, "teaching");
  return (
    <PlatformShell name={actor.name} role={actor.role} workspace="teaching" workspaces={visibleWorkspaces(actor)} nodes={sidebarNodes(actor, "teaching")}>
      {children}
    </PlatformShell>
  );
}
