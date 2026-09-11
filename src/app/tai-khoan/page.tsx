import { PlatformShell, Alert } from "@/platform/ui/Shell";
import { requirePageActor } from "@/platform/auth/guard";
import { sidebarNodes, visibleWorkspaces } from "@/platform/permissions/evaluate";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ forbidden?: string }> }) {
  const actor = await requirePageActor();
  const { forbidden } = await searchParams;
  const spaces = visibleWorkspaces(actor);
  return (
    <PlatformShell name={actor.name} role={actor.role} workspace="account" workspaces={spaces} nodes={sidebarNodes(actor, "account")}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#163c3e]">Tài khoản</h1>
        {forbidden ? <Alert tone="error">Bạn không có quyền truy cập mục đó.</Alert> : null}
        {spaces.filter((item) => item !== "account").length === 0 ? (
          <Alert>Tài khoản chưa được cấp nhóm quyền. Liên hệ Admin để được vào học tập, giảng dạy hoặc làm việc.</Alert>
        ) : null}
        <section className="platform-card p-6">
          <p><strong>Họ tên:</strong> {actor.name}</p>
          <p><strong>Email:</strong> {actor.email}</p>
          <p><strong>Role:</strong> {actor.role}</p>
          <p className="mt-4 font-semibold">Quyền hiệu lực</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {actor.grants.map((grant) => (
              <li key={`${grant.menuCode}:${grant.action}:${grant.groupCode}`}>
                {grant.menuCode} / {grant.action} / {grant.scope} — nhóm {grant.groupName}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PlatformShell>
  );
}
