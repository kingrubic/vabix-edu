import { requireMenu } from "@/platform/auth/guard";
import { listClasses } from "@/platform/lms/classes";
import { questionsForCourse, listClassQuizzes } from "@/platform/lms/quizzes";
import { saveQuestionForm, saveQuizForm } from "@/platform/ui/actions";

export default async function QuizzesAdminPage() {
  await requireMenu("/admin/dao-tao/kiem-tra");
  const classes = listClasses() as { id: string; name: string }[];
  const questions = questionsForCourse() as { id: string; prompt: string; kind: string }[];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-[#163c3e]">Kiểm tra / ngân hàng câu hỏi</h1>
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
        <p className="text-xs text-[#66746f]">Đáp án không trả về API học viên. Sửa ngân hàng không đổi lượt đã thi.</p>
        <button className="bg-[#163c3e] px-3 py-2 text-white">Lưu câu hỏi</button>
      </form>
      <ul className="platform-card space-y-1 p-6 text-sm">
        {questions.map((item) => <li key={item.id}><code>{item.id}</code> — {item.prompt} ({item.kind})</li>)}
      </ul>
      <form action={saveQuizForm} className="platform-card grid gap-3 p-6">
        <h2 className="font-semibold">Tạo bài kiểm tra</h2>
        <select className="input" name="classId">{classes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <input className="input" name="title" placeholder="Tên bài kiểm tra" required />
        <input className="input" name="questionIds" placeholder="ID câu hỏi, cách nhau bởi dấu phẩy" defaultValue={questions.map((item) => item.id).slice(0, 5).join(",")} />
        <input className="input" type="number" name="durationMinutes" placeholder="Thời lượng (phút)" />
        <input className="input" type="datetime-local" name="opensAt" />
        <input className="input" type="datetime-local" name="closesAt" />
        <button className="bg-[#163c3e] px-3 py-2 text-white">Lưu đề</button>
      </form>
      {classes.map((item) => (
        <section key={item.id} className="text-sm">
          <h3 className="font-semibold">{item.name}</h3>
          <ul>{(listClassQuizzes(item.id) as { id: string; title: string }[]).map((quiz) => <li key={quiz.id}>{quiz.title}</li>)}</ul>
        </section>
      ))}
    </div>
  );
}
