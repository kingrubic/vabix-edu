import { getDb, nowIso, newId, tx } from "@/platform/db/client";
import { assertCan, type Actor } from "@/platform/permissions/evaluate";
import { parseJson } from "@/platform/sanitize";

export type QuestionKind = "single" | "multiple" | "boolean" | "essay";

export function saveQuestion(
  actor: Actor,
  input: { id?: string; courseId: string | null; prompt: string; kind: QuestionKind; options: string[]; answerKey: string[]; explanation: string; points: number },
) {
  assertCan(actor, "lms.quizzes", input.id ? "update" : "create");
  const at = nowIso();
  const id = input.id ?? newId();
  if (input.id) {
    getDb()
      .prepare(
        `UPDATE lms_questions SET prompt=?, kind=?, options=?, answer_key=?, explanation=?, points=?, version=version+1, updated_at=? WHERE id=?`,
      )
      .run(input.prompt, input.kind, JSON.stringify(input.options), JSON.stringify(input.answerKey), input.explanation, input.points, at, id);
  } else {
    getDb()
      .prepare(
        `INSERT INTO lms_questions (id, course_id, module_id, prompt, kind, options, answer_key, explanation, points, version, status, created_at, updated_at)
         VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, 1, 'active', ?, ?)`,
      )
      .run(id, input.courseId, input.prompt, input.kind, JSON.stringify(input.options), JSON.stringify(input.answerKey), input.explanation, input.points, at, at);
  }
  return id;
}

export function saveQuiz(
  actor: Actor,
  input: {
    id?: string;
    classId: string;
    title: string;
    opensAt: string | null;
    closesAt: string | null;
    durationMinutes: number | null;
    maxAttempts: number;
    passScore: number | null;
    shuffle: boolean;
    scorePolicy: "highest" | "latest";
    revealPolicy: string;
    questionIds: string[];
  },
) {
  assertCan(actor, "lms.quizzes", input.id ? "update" : "create");
  const at = nowIso();
  const id = input.id ?? newId();
  return tx((db) => {
    if (input.id) {
      db.prepare(
        `UPDATE lms_quizzes SET title=?, opens_at=?, closes_at=?, duration_minutes=?, max_attempts=?, pass_score=?, shuffle=?, score_policy=?, reveal_policy=?, updated_at=? WHERE id=?`,
      ).run(
        input.title,
        input.opensAt,
        input.closesAt,
        input.durationMinutes,
        input.maxAttempts,
        input.passScore,
        input.shuffle ? 1 : 0,
        input.scorePolicy,
        input.revealPolicy,
        at,
        id,
      );
      db.prepare(`DELETE FROM lms_quiz_items WHERE quiz_id=?`).run(id);
    } else {
      db.prepare(
        `INSERT INTO lms_quizzes (id, class_id, version_id, title, opens_at, closes_at, duration_minutes, max_attempts, pass_score, shuffle, score_policy, reveal_policy, created_at, updated_at, created_by)
         VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        input.classId,
        input.title,
        input.opensAt,
        input.closesAt,
        input.durationMinutes,
        input.maxAttempts,
        input.passScore,
        input.shuffle ? 1 : 0,
        input.scorePolicy,
        input.revealPolicy,
        at,
        at,
        actor.id,
      );
    }
    input.questionIds.forEach((questionId, index) => {
      db.prepare(`INSERT INTO lms_quiz_items (quiz_id, question_id, sort_order, points) VALUES (?, ?, ?, NULL)`).run(id, questionId, index);
    });
    return id;
  });
}

function quizWindow(quiz: { opens_at: string | null; closes_at: string | null }) {
  const now = nowIso();
  if (quiz.opens_at && quiz.opens_at > now) return { ok: false, reason: "Chưa đến giờ mở bài kiểm tra." };
  if (quiz.closes_at && quiz.closes_at < now) return { ok: false, reason: "Bài kiểm tra đã đóng." };
  return { ok: true, reason: null };
}

export function startAttempt(userId: string, quizId: string, enrollmentId: string) {
  return tx((db) => {
    const enrollment = db.prepare(`SELECT * FROM lms_enrollments WHERE id=? AND user_id=?`).get(enrollmentId, userId) as
      | { id: string; class_id: string; status: string }
      | undefined;
    if (!enrollment || enrollment.status !== "active") throw new Error("Không thể làm bài.");
    const quiz = db.prepare(`SELECT * FROM lms_quizzes WHERE id=?`).get(quizId) as {
      class_id: string | null;
      duration_minutes: number | null;
      max_attempts: number;
      shuffle: number;
      opens_at: string | null;
      closes_at: string | null;
    };
    if (quiz.class_id !== enrollment.class_id) throw new Error("Bài kiểm tra không thuộc lớp của bạn.");
    const windowOk = quizWindow(quiz);
    if (!windowOk.ok) throw new Error(windowOk.reason ?? "");
    const inProgress = db
      .prepare(`SELECT * FROM lms_attempts WHERE quiz_id=? AND enrollment_id=? AND status='in_progress'`)
      .get(quizId, enrollmentId) as { id: string } | undefined;
    if (inProgress) return clientAttempt(inProgress.id, false);
    const count = (db.prepare(`SELECT COUNT(*) AS n FROM lms_attempts WHERE quiz_id=? AND enrollment_id=?`).get(quizId, enrollmentId) as { n: number }).n;
    if (count >= quiz.max_attempts) throw new Error("Đã hết lượt làm bài.");
    const items = db
      .prepare(
        `SELECT q.id, q.prompt, q.kind, q.options, q.answer_key, q.explanation, q.points, i.sort_order
         FROM lms_quiz_items i JOIN lms_questions q ON q.id = i.question_id WHERE i.quiz_id=? ORDER BY i.sort_order`,
      )
      .all(quizId) as {
      id: string;
      prompt: string;
      kind: QuestionKind;
      options: string;
      answer_key: string;
      explanation: string;
      points: number;
    }[];
    const ordered = quiz.shuffle ? [...items].sort(() => Math.random() - 0.5) : items;
    const snapshot = ordered.map((item) => ({
      id: item.id,
      prompt: item.prompt,
      kind: item.kind,
      options: parseJson<string[]>(item.options, []),
      points: item.points,
    }));
    const answerKey = ordered.map((item) => ({ id: item.id, kind: item.kind, answer: parseJson<string[]>(item.answer_key, []), points: item.points }));
    const started = nowIso();
    const endsAt = quiz.duration_minutes ? new Date(Date.now() + quiz.duration_minutes * 60 * 1000).toISOString() : quiz.closes_at;
    const id = newId();
    db.prepare(
      `INSERT INTO lms_attempts (id, quiz_id, enrollment_id, attempt_no, status, started_at, ends_at, submitted_at, score, snapshot, answer_key)
       VALUES (?, ?, ?, ?, 'in_progress', ?, ?, NULL, NULL, ?, ?)`,
    ).run(id, quizId, enrollmentId, count + 1, started, endsAt, JSON.stringify(snapshot), JSON.stringify(answerKey));
    return clientAttempt(id, false);
  });
}

function clientAttempt(attemptId: string, reveal: boolean) {
  const attempt = getDb().prepare(`SELECT * FROM lms_attempts WHERE id=?`).get(attemptId) as {
    id: string;
    quiz_id: string;
    status: string;
    started_at: string;
    ends_at: string | null;
    score: number | null;
    snapshot: string;
    answer_key: string;
  };
  const answers = getDb().prepare(`SELECT question_id, answer FROM lms_attempt_answers WHERE attempt_id=?`).all(attemptId) as {
    question_id: string;
    answer: string;
  }[];
  const quiz = getDb().prepare(`SELECT reveal_policy, closes_at FROM lms_quizzes WHERE id=?`).get(attempt.quiz_id) as {
    reveal_policy: string;
    closes_at: string | null;
  };
  const canReveal =
    reveal &&
    (quiz.reveal_policy === "after_submit" ||
      (quiz.reveal_policy === "after_close" && quiz.closes_at && quiz.closes_at <= nowIso()) ||
      quiz.reveal_policy === "after_grade");
  return {
    id: attempt.id,
    status: attempt.status,
    startedAt: attempt.started_at,
    endsAt: attempt.ends_at,
    serverNow: nowIso(),
    score: canReveal ? attempt.score : null,
    questions: parseJson(attempt.snapshot, []),
    answers: Object.fromEntries(answers.map((row) => [row.question_id, parseJson(row.answer, [])])),
    answerKey: canReveal ? parseJson(attempt.answer_key, []) : null,
  };
}

export function saveAnswer(userId: string, attemptId: string, questionId: string, answer: string[]) {
  const attempt = getDb()
    .prepare(
      `SELECT a.* FROM lms_attempts a JOIN lms_enrollments e ON e.id = a.enrollment_id WHERE a.id=? AND e.user_id=?`,
    )
    .get(attemptId, userId) as { id: string; status: string; ends_at: string | null } | undefined;
  if (!attempt || attempt.status !== "in_progress") throw new Error("Không thể lưu câu trả lời.");
  if (attempt.ends_at && attempt.ends_at < nowIso()) {
    expireAttempt(attemptId);
    throw new Error("Đã hết thời gian làm bài.");
  }
  getDb()
    .prepare(
      `INSERT INTO lms_attempt_answers (attempt_id, question_id, answer, auto_score, updated_at) VALUES (?, ?, ?, NULL, ?)
       ON CONFLICT(attempt_id, question_id) DO UPDATE SET answer=excluded.answer, updated_at=excluded.updated_at`,
    )
    .run(attemptId, questionId, JSON.stringify(answer), nowIso());
  return { saved: true, at: nowIso() };
}

function expireAttempt(attemptId: string) {
  getDb().prepare(`UPDATE lms_attempts SET status='expired' WHERE id=? AND status='in_progress'`).run(attemptId);
}

export function submitAttempt(userId: string, attemptId: string) {
  return tx((db) => {
    const attempt = db
      .prepare(
        `SELECT a.* FROM lms_attempts a JOIN lms_enrollments e ON e.id = a.enrollment_id WHERE a.id=? AND e.user_id=?`,
      )
      .get(attemptId, userId) as { id: string; status: string; ends_at: string | null; answer_key: string; quiz_id: string } | undefined;
    if (!attempt) throw new Error("Không tìm thấy lượt làm.");
    if (attempt.status !== "in_progress") throw new Error("Lượt làm đã nộp.");
    const answers = db.prepare(`SELECT question_id, answer FROM lms_attempt_answers WHERE attempt_id=?`).all(attemptId) as {
      question_id: string;
      answer: string;
    }[];
    const key = parseJson<{ id: string; kind: QuestionKind; answer: string[]; points: number }[]>(attempt.answer_key, []);
    let score = 0;
    let pendingEssay = false;
    for (const item of key) {
      const given = parseJson<string[]>(answers.find((row) => row.question_id === item.id)?.answer ?? "[]", []);
      if (item.kind === "essay") {
        pendingEssay = true;
        continue;
      }
      const ok =
        item.kind === "multiple"
          ? [...given].sort().join("|") === [...item.answer].sort().join("|")
          : given[0] === item.answer[0];
      const auto = ok ? item.points : 0;
      score += auto;
      db.prepare(`UPDATE lms_attempt_answers SET auto_score=? WHERE attempt_id=? AND question_id=?`).run(auto, attemptId, item.id);
    }
    db.prepare(`UPDATE lms_attempts SET status=?, submitted_at=?, score=? WHERE id=?`).run(
      pendingEssay ? "submitted" : "graded",
      nowIso(),
      pendingEssay ? null : score,
      attemptId,
    );
    const quiz = db.prepare(`SELECT reveal_policy FROM lms_quizzes WHERE id=?`).get(attempt.quiz_id) as { reveal_policy: string };
    return clientAttempt(attemptId, quiz.reveal_policy === "after_submit" && !pendingEssay);
  });
}

export function questionsForCourse(courseId?: string) {
  if (courseId) return getDb().prepare(`SELECT id, prompt, kind, points, version FROM lms_questions WHERE course_id=?`).all(courseId);
  return getDb().prepare(`SELECT id, prompt, kind, points, version FROM lms_questions ORDER BY updated_at DESC LIMIT 200`).all();
}

export function listClassQuizzes(classId: string) {
  return getDb()
    .prepare(`SELECT id, title, opens_at, closes_at, duration_minutes, max_attempts, reveal_policy FROM lms_quizzes WHERE class_id=? ORDER BY created_at DESC`)
    .all(classId);
}

export function getLearnerAttempt(userId: string, quizId: string, enrollmentId: string) {
  const attempt = getDb()
    .prepare(
      `SELECT a.id, a.status FROM lms_attempts a
       JOIN lms_enrollments e ON e.id = a.enrollment_id
       WHERE a.quiz_id=? AND a.enrollment_id=? AND e.user_id=?
       ORDER BY a.started_at DESC LIMIT 1`,
    )
    .get(quizId, enrollmentId, userId) as { id: string; status: string } | undefined;
  if (!attempt) return null;
  return clientAttempt(attempt.id, attempt.status !== "in_progress");
}
