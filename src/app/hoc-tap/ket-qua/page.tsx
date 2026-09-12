import { requirePageActor } from "@/platform/auth/guard";
import { myEnrollments, completionState } from "@/platform/lms/progress";
import { getDb } from "@/platform/db/client";

export default async function ResultsPage() {
  const actor = await requirePageActor();
  const classes = myEnrollments(actor.id) as { id: string; class_name: string }[];
  const certs = getDb().prepare(`SELECT c.* FROM lms_certificates c JOIN lms_enrollments e ON e.id=c.enrollment_id WHERE e.user_id=? AND c.status='issued'`).all(actor.id) as { code: string; program_name: string }[];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Kết quả</h1>
      {classes.map((item) => {
        const state = completionState(item.id);
        return (
          <article key={item.id} className="platform-card p-5">
            <h2 className="font-semibold">{item.class_name}</h2>
            <p className="text-sm">Đã hoàn thành nội dung: {state.contentComplete ? "Có" : "Chưa"} ({state.content.percent}%)</p>
            <p className="text-sm">Đạt khóa học: {state.coursePassed ? "Có" : "Chưa"}</p>
            <p className="mt-2 text-xs text-[#66746f]">{state.definitions.contentComplete} {state.definitions.coursePassed}</p>
          </article>
        );
      })}
      <section className="platform-card p-5">
        <h2 className="font-semibold">Chứng nhận</h2>
        <ul className="mt-2 text-sm">{certs.map((item) => <li key={item.code}>{item.program_name} — {item.code}</li>)}</ul>
      </section>
    </div>
  );
}
