import { requireMenu } from "@/platform/auth/guard";
import { getDb } from "@/platform/db/client";
import { saveAssignmentForm, gradeForm, saveQuestionForm, saveQuizForm, issueCertForm } from "@/platform/ui/actions";
import { pendingGrading } from "@/platform/lms/assignments";
import { listClasses } from "@/platform/lms/classes";
import { questionsForCourse } from "@/platform/lms/quizzes";
import { completionState } from "@/platform/lms/progress";

export default async function TrainingToolsPage() {
  const actor = await requireMenu("/admin/dao-tao/bai-tap");
  const pending = pendingGrading(actor) as Record<string, unknown>[];
  const classes = listClasses() as { id: string; name: string }[];
  const questions = questionsForCourse() as { id: string; prompt: string }[];
  const enrollments = getDb()
    .prepare(
      `SELECT e.id, p.full_name, c.name AS class_name FROM lms_enrollments e JOIN learner_profiles p ON p.id=e.learner_profile_id JOIN lms_classes c ON c.id=e.class_id WHERE e.status IN ('active','completed') LIMIT 50`,
    )
    .all() as { id: string; full_name: string; class_name: string }[];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Bài tập, kiểm tra và chứng nhận</h1>
      <section className="platform-card p-6">
        <h2 className="font-semibold">Bài cần chấm</h2>
        <ul className="mt-3 space-y-3">
          {pending.map((item) => (
            <li key={String(item.id)} className="border-b border-[#163c3e]/10 pb-3">
              <p>{String(item.full_name)} — {String(item.title)}</p>
              <form action={gradeForm} className="mt-2 flex flex-wrap gap-2">
                <input type="hidden" name="submissionId" value={String(item.id)} />
                <input className="input w-24" name="score" type="number" placeholder="Điểm" />
                <input className="input" name="comment" placeholder="Nhận xét" />
                <select className="input" name="status">
                  <option value="draft">Nháp điểm</option>
                  <option value="published">Công bố</option>
                </select>
                <button className="bg-[#163c3e] px-3 text-white">Lưu</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
      <form action={saveAssignmentForm} className="platform-card grid gap-3 p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 font-semibold">Giao bài tập</h2>
        <select className="input" name="classId">{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <input className="input" name="title" placeholder="Tên bài" required />
        <textarea className="input md:col-span-2" name="instructions" placeholder="Hướng dẫn" />
        <input className="input" type="datetime-local" name="dueAt" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowLate" /> Cho nộp trễ</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="required" defaultChecked /> Bắt buộc</label>
        <button className="bg-[#163c3e] px-3 py-2 text-white">Tạo bài tập</button>
      </form>
      <form action={saveQuestionForm} className="platform-card grid gap-3 p-6">
        <h2 className="font-semibold">Ngân hàng câu hỏi</h2>
        <textarea className="input" name="prompt" placeholder="Nội dung câu hỏi" required />
        <select className="input" name="kind">
          <option value="single">Một đáp án</option>
          <option value="multiple">Nhiều đáp án</option>
          <option value="boolean">Đúng/sai</option>
          <option value="essay">Tự luận</option>
        </select>
        <textarea className="input" name="options" placeholder="Mỗi dòng một lựa chọn" />
        <input className="input" name="answerKey" placeholder="Đáp án đúng, cách nhau bởi dấu phẩy" />
        <button className="bg-[#163c3e] px-3 py-2 text-white">Lưu câu hỏi</button>
      </form>
      <form action={saveQuizForm} className="platform-card grid gap-3 p-6">
        <h2 className="font-semibold">Tạo bài kiểm tra</h2>
        <select className="input" name="classId">{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <input className="input" name="title" placeholder="Tên bài kiểm tra" />
        <input className="input" name="questionIds" placeholder="ID câu hỏi, cách nhau bởi dấu phẩy" defaultValue={questions.map((item) => item.id).slice(0, 5).join(",")} />
        <input className="input" type="number" name="durationMinutes" placeholder="Thời lượng (phút)" />
        <button className="bg-[#163c3e] px-3 py-2 text-white">Lưu đề</button>
      </form>
      <section className="platform-card p-6">
        <h2 className="font-semibold">Chứng nhận</h2>
        <ul className="mt-3 space-y-3">
          {enrollments.map((item) => {
            const state = completionState(item.id);
            return (
              <li key={item.id} className="text-sm">
                {item.full_name} — {item.class_name}: nội dung {state.content.percent}% · đạt khóa {state.coursePassed ? "có" : "chưa"}
                <form action={issueCertForm} className="mt-1">
                  <input type="hidden" name="enrollmentId" value={item.id} />
                  <button className="underline" disabled={!state.coursePassed}>Xem điều kiện / phát hành</button>
                </form>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
