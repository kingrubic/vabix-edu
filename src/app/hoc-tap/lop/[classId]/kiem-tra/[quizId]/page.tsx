import { notFound } from "next/navigation";
import { requirePageActor } from "@/platform/auth/guard";
import { enrollmentForUser } from "@/platform/lms/progress";
import { getLearnerAttempt } from "@/platform/lms/quizzes";
import { startQuizForm, saveAnswerForm, submitQuizForm } from "@/platform/ui/actions";
import { getDb } from "@/platform/db/client";
import { formatDateTime } from "@/platform/time";

function loadQuiz(quizId: string, classId: string) {
  return getDb()
    .prepare(`SELECT id, title, opens_at, closes_at, duration_minutes, max_attempts FROM lms_quizzes WHERE id=? AND class_id=?`)
    .get(quizId, classId) as
    | { id: string; title: string; opens_at: string | null; closes_at: string | null; duration_minutes: number | null; max_attempts: number }
    | undefined;
}

export default async function LearnerQuizPage({ params }: { params: Promise<{ classId: string; quizId: string }> }) {
  const actor = await requirePageActor();
  const { classId, quizId } = await params;
  const enrollment = enrollmentForUser(actor.id, classId);
  if (!enrollment) notFound();
  const quiz = loadQuiz(quizId, classId);
  if (!quiz) notFound();
  const attempt = getLearnerAttempt(actor.id, quizId, String(enrollment.id));
  const questions = (attempt?.questions ?? []) as { id: string; prompt: string; kind: string; options: string[]; points: number }[];
  return (
    <div className="platform-card space-y-4 p-6">
      <h1 className="text-2xl font-semibold text-[#163c3e]">{quiz.title}</h1>
      <p className="text-sm text-[#66746f]">
        Thời lượng {quiz.duration_minutes ?? "không giới hạn"} phút.
        {quiz.closes_at ? ` Đóng lúc ${formatDateTime(quiz.closes_at)}.` : ""}
        Thời gian kiểm soát phía máy chủ.
      </p>
      {!attempt || attempt.status !== "in_progress" ? (
        <>
          {attempt?.status && attempt.status !== "in_progress" ? (
            <p className="text-sm">
              Lượt gần nhất: {attempt.status}
              {attempt.score != null ? ` · điểm đã công bố: ${attempt.score}` : " · điểm/đáp án chỉ hiện khi chính sách cho phép."}
            </p>
          ) : null}
          <form action={startQuizForm}>
            <input type="hidden" name="classId" value={classId} />
            <input type="hidden" name="quizId" value={quizId} />
            <input type="hidden" name="enrollmentId" value={String(enrollment.id)} />
            <button className="bg-[#163c3e] px-4 py-2 text-white">{attempt ? "Tiếp tục / làm lại nếu còn lượt" : "Bắt đầu làm bài"}</button>
          </form>
        </>
      ) : (
        <div className="space-y-6">
          <p className="text-sm">Hết hạn lượt: {formatDateTime(attempt.endsAt)}. Tải lại trang sẽ khôi phục câu đã lưu, không tạo lượt mới.</p>
          {questions.map((question) => (
            <form key={question.id} action={saveAnswerForm} className="border border-[#163c3e]/10 p-4">
              <input type="hidden" name="attemptId" value={String(attempt.id)} />
              <input type="hidden" name="questionId" value={question.id} />
              <p className="font-medium">{question.prompt}</p>
              {question.kind === "essay" ? (
                <textarea className="input mt-2 min-h-24" name="answer" defaultValue={((attempt.answers as Record<string, string[]>)[question.id] ?? []).join("\n")} />
              ) : (
                <ul className="mt-2 space-y-1">
                  {(question.options ?? []).map((option) => (
                    <li key={option}>
                      <label className="flex gap-2 text-sm">
                        <input
                          type={question.kind === "multiple" ? "checkbox" : "radio"}
                          name="answer"
                          value={option}
                          defaultChecked={((attempt.answers as Record<string, string[]>)[question.id] ?? []).includes(option)}
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <button className="mt-2 underline text-sm">Lưu câu trả lời</button>
            </form>
          ))}
          <form action={submitQuizForm}>
            <input type="hidden" name="attemptId" value={String(attempt.id)} />
            <button className="bg-[#163c3e] px-4 py-2 text-white">Nộp bài</button>
          </form>
        </div>
      )}
    </div>
  );
}
