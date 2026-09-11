import { requireMenu } from "@/platform/auth/guard";
import { listInquiries } from "@/platform/inquiries/service";
import { directoryForTasks } from "@/platform/iam/service";
import { inquiryForm, saveTaskForm } from "@/platform/ui/actions";
import { formatDateTime } from "@/platform/time";

const MAP: Record<string, string[]> = {
  "chuong-trinh": ["program"],
  "su-kien": ["event"],
  "tu-van": ["consult"],
  trustworking: ["connect", "trust-buyer", "trust-supplier", "trust-expert", "partnership"],
};

export default async function InquiriesPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  await requireMenu(`/admin/ket-noi/${type}`);
  const types = MAP[type] ?? ["consult"];
  const rows = (listInquiries() as { type: string }[]).filter((row) => types.includes(row.type));
  const people = directoryForTasks() as { id: string; name: string }[];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Kết nối</h1>
      <div className="space-y-4">
        {rows.map((row: Record<string, unknown>) => (
          <article key={String(row.id)} className="platform-card p-5">
            <p className="font-semibold">{String(row.name)} — {String(row.organization || "Cá nhân")}</p>
            <p className="text-sm text-[#66746f]">{String(row.email)} · {String(row.phone)} · {formatDateTime(String(row.created_at))}</p>
            <p className="mt-2 text-sm whitespace-pre-wrap">{String(row.body)}</p>
            <form action={inquiryForm} className="mt-3 grid gap-2 md:grid-cols-4">
              <input type="hidden" name="id" value={String(row.id)} />
              <select className="input" name="status" defaultValue={String(row.status)}>
                <option value="new">Mới</option>
                <option value="processing">Đang xử lý</option>
                <option value="confirmed">Xác nhận</option>
                <option value="linked">Đã liên kết</option>
                <option value="closed">Đóng</option>
              </select>
              <select className="input" name="assigneeUserId" defaultValue={String(row.assignee_user_id ?? "")}>
                <option value="">Chưa gán</option>
                {people.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
              <input className="input" name="notes" placeholder="Ghi chú" defaultValue={String(row.notes ?? "")} />
              <button className="bg-[#163c3e] text-white">Lưu</button>
            </form>
            <form action={saveTaskForm} className="mt-2 flex gap-2">
              <input type="hidden" name="title" value={`Theo dõi: ${row.name}`} />
              <input type="hidden" name="description" value={String(row.body)} />
              <select className="input" name="assigneeUserId">{people.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select>
              <button className="underline text-sm">Tạo task theo dõi</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
