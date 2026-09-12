import { requirePageActor } from "@/platform/auth/guard";
import { pendingGrading } from "@/platform/lms/assignments";
import { gradeForm } from "@/platform/ui/actions";
import { EmptyState } from "@/platform/ui/Shell";

export default async function TeachingGradePage() {
  const actor = await requirePageActor();
  const pending = pendingGrading(actor) as Record<string, unknown>[];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Bài cần chấm</h1>
      {!pending.length ? <EmptyState title="Không có bài chờ chấm" body="Bài nộp của lớp bạn phụ trách sẽ hiện tại đây. Điểm nháp không hiện với học viên." /> : (
        <ul className="space-y-3">
          {pending.map((item) => (
            <li key={String(item.id)} className="platform-card p-5">
              <p className="font-semibold">{String(item.full_name)} — {String(item.title)}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{String(item.text_body ?? item.body ?? "")}</p>
              <form action={gradeForm} className="mt-3 flex flex-wrap gap-2">
                <input type="hidden" name="submissionId" value={String(item.id)} />
                <input className="input w-24" name="score" type="number" placeholder="Điểm" />
                <input className="input" name="comment" placeholder="Nhận xét" />
                <select className="input" name="status">
                  <option value="draft">Nháp điểm</option>
                  <option value="published">Công bố</option>
                </select>
                <input className="input" name="reason" placeholder="Lý do đổi điểm" />
                <button className="bg-[#163c3e] px-3 text-white">Lưu</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
