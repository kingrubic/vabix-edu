import { requireMenu } from "@/platform/auth/guard";
import { listAudit } from "@/platform/audit";
import { formatDateTime } from "@/platform/time";

export default async function AuditPage() {
  await requireMenu("/admin/he-thong/nhat-ky");
  const rows = listAudit(100) as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Nhật ký quản trị / bảo mật</h1>
      <div className="platform-table-wrap platform-card">
        <table className="platform-table">
          <thead><tr><th>Thời gian</th><th>Người</th><th>Hành động</th><th>Tóm tắt</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)}>
                <td>{formatDateTime(String(row.created_at))}</td>
                <td>{String(row.actor_name ?? "Hệ thống")}</td>
                <td>{String(row.action)}</td>
                <td>{String(row.summary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
