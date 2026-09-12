import { requireMenu } from "@/platform/auth/guard";
import { getDb } from "@/platform/db/client";
import { completionState } from "@/platform/lms/progress";
import { issueCertForm, revokeCertForm } from "@/platform/ui/actions";
import { issuanceReady, previewCertificate } from "@/platform/lms/certificates";

export default async function CertificatesAdminPage() {
  const actor = await requireMenu("/admin/dao-tao/chung-nhan");
  const enrollments = getDb()
    .prepare(
      `SELECT e.id, p.full_name, c.name AS class_name FROM lms_enrollments e
       JOIN learner_profiles p ON p.id=e.learner_profile_id
       JOIN lms_classes c ON c.id=e.class_id
       WHERE e.status IN ('active','completed') LIMIT 80`,
    )
    .all() as { id: string; full_name: string; class_name: string }[];
  const issued = getDb()
    .prepare(`SELECT id, code, learner_name, program_name, status FROM lms_certificates ORDER BY created_at DESC LIMIT 50`)
    .all() as { id: string; code: string; learner_name: string; program_name: string; status: string }[];
  const ready = issuanceReady();
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Chứng nhận</h1>
      <p className="text-sm text-[#66746f]">
        {ready
          ? "Chữ ký/con dấu đã sẵn sàng. Chỉ phát hành khi học viên đạt điều kiện hoàn thành."
          : "Luồng duyệt đã sẵn sàng nhưng chưa phát hành chính thức vì đơn vị chưa cung cấp chữ ký/con dấu (`certificate_ready`)."}
      </p>
      <section className="platform-card p-6">
        <h2 className="font-semibold">Điều kiện theo ghi danh</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {enrollments.map((item) => {
            const state = completionState(item.id);
            const preview = previewCertificate(actor, item.id);
            return (
              <li key={item.id}>
                {item.full_name} — {item.class_name}: nội dung {state.content.percent}% · đạt khóa {state.coursePassed ? "có" : "chưa"}
                <p className="text-xs text-[#66746f]">{preview.message}</p>
                <form action={issueCertForm} className="mt-1">
                  <input type="hidden" name="enrollmentId" value={item.id} />
                  <button className="underline" disabled={!state.coursePassed || !ready}>Phát hành</button>
                </form>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="platform-card p-6">
        <h2 className="font-semibold">Đã cấp / thu hồi</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {issued.map((item) => (
            <li key={item.id}>
              {item.learner_name} — {item.program_name} · {item.code} · {item.status}
              {item.status === "issued" ? (
                <form action={revokeCertForm} className="mt-1 flex gap-2">
                  <input type="hidden" name="id" value={item.id} />
                  <input className="input" name="reason" placeholder="Lý do thu hồi" required />
                  <button className="underline">Thu hồi</button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
