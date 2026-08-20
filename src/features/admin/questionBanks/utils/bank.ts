import type {
  Attempt,
  PopulatedLecture,
  PopulatedSubject,
  PopulatedUser,
  PopulatedYear,
  Question,
  QuestionBank,
  QuestionInput,
} from "../types";

// ==============================
// Populated field readers
// ==============================
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const getLectureTitle = (bank?: QuestionBank | null): string => {
  const lecture = bank?.lectureId;
  if (isObject(lecture)) return (lecture as PopulatedLecture).title ?? "—";
  return bank?.title ?? "—";
};

export const getLectureId = (bank?: QuestionBank | null): string => {
  const lecture = bank?.lectureId;
  if (isObject(lecture)) return (lecture as PopulatedLecture)._id ?? "";
  return typeof lecture === "string" ? lecture : "";
};

export const getSubjectName = (bank?: QuestionBank | null): string => {
  const subject = bank?.subjectId;
  if (isObject(subject)) return (subject as PopulatedSubject).name ?? "—";
  return "—";
};

export const getSubjectId = (bank?: QuestionBank | null): string => {
  const subject = bank?.subjectId;
  if (isObject(subject)) return (subject as PopulatedSubject)._id ?? "";
  return typeof subject === "string" ? subject : "";
};

export const getYearName = (bank?: QuestionBank | null): string => {
  const year = bank?.yearId;
  if (isObject(year)) return (year as PopulatedYear).name ?? "—";
  return "—";
};

export const getCreatorName = (bank?: QuestionBank | null): string => {
  const creator = bank?.createdBy;
  if (isObject(creator)) return (creator as PopulatedUser).name ?? "—";
  return "—";
};

export const getStudentName = (attempt: Attempt): string => {
  const student = attempt.studentId;
  if (isObject(student)) return (student as PopulatedUser).name ?? "—";
  return "—";
};

export const getStudentEmail = (attempt: Attempt): string => {
  const student = attempt.studentId;
  if (isObject(student)) return (student as PopulatedUser).email ?? "";
  return "";
};

export const getStudentId = (attempt: Attempt): string => {
  const student = attempt.studentId;
  if (isObject(student)) return (student as PopulatedUser)._id ?? "";
  return typeof student === "string" ? student : "";
};

// ==============================
// Errors
// ==============================
/**
 * يقرأ رسالة الخطأ القادمة من الـ Bluebits envelope أو من RTK Query.
 * يُرجع `null` عند غياب الرسالة – النصّ البديل مترجَم ومكانه
 * `useErrorMessage` لأنه يتبع اللغة الحالية.
 */
export function getApiErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "object") {
    const anyError = error as Record<string, unknown>;

    const data = anyError.data;
    if (typeof data === "string" && data.trim()) return data;
    if (isObject(data) && typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
    if (typeof anyError.error === "string" && anyError.error.trim()) {
      return anyError.error;
    }
    if (typeof anyError.message === "string" && anyError.message.trim()) {
      return anyError.message;
    }
  }

  return null;
}

// ==============================
// Question helpers
// ==============================
export const getCorrectIndex = (question: Question): number =>
  question.options?.findIndex((option) => option.isCorrect) ?? -1;

/** مفتاح داخل `mcq:question.*` – الترجمة تتمّ في المكوّن */
export const questionTypeKey = (
  question: Pick<Question, "type">,
): "question.typeTrueFalse" | "question.typeMcq" =>
  question.type === "true_false" ? "question.typeTrueFalse" : "question.typeMcq";

export const scoreColor = (percentage: number): string => {
  if (percentage >= 80) return "#059669";
  if (percentage >= 50) return "#F59E0B";
  return "#DC2626";
};

// ==============================
// JSON upload parsing
// ==============================
/**
 * قالب الـ JSON المعروض للمشرف.
 * النصوص التوضيحية داخله تُمرَّر مترجَمة من المكوّن عبر `questionsJsonTemplate`.
 */
export const questionsJsonTemplate = (samples: {
  mcqQuestion: string;
  mcqExplanation: string;
  trueFalseQuestion: string;
}): string => `[
  {
    "type": "mcq",
    "questionText": ${JSON.stringify(samples.mcqQuestion)},
    "options": [
      { "text": "3", "isCorrect": false },
      { "text": "4", "isCorrect": true },
      { "text": "5", "isCorrect": false },
      { "text": "6", "isCorrect": false }
    ],
    "explanation": ${JSON.stringify(samples.mcqExplanation)}
  },
  {
    "type": "true_false",
    "questionText": ${JSON.stringify(samples.trueFalseQuestion)},
    "correctAnswer": true
  }
]`;

/**
 * خطأ تحليل بصيغة بنيوية لا نصّية.
 * السبب: الدالة نقيّة وتُستدعى خارج شجرة React فلا تعرف اللغة الحالية،
 * والمكوّن يترجم `code` عبر `admin:banks.parseErrors.*`.
 */
export type QuestionParseError =
  | { code: "empty" }
  | { code: "invalidJson" }
  | { code: "notArray" }
  | { code: "noQuestions" }
  | { code: "notObject"; position: number }
  | { code: "missingText"; position: number }
  | { code: "missingCorrectAnswer"; position: number }
  | { code: "needTwoOptions"; position: number }
  | { code: "optionWithoutText"; position: number }
  | { code: "needExactlyOneCorrect"; position: number };

export interface ParsedQuestionsResult {
  questions: QuestionInput[];
  errors: QuestionParseError[];
}

/**
 * يقرأ نص JSON (مصفوفة أسئلة، أو { questions: [...] }، أو نفس body الـ bulk-upload)
 * ويتحقق من مطابقته للصيغة التي يتوقعها الباك.
 */
export function parseQuestionsJson(raw: string): ParsedQuestionsResult {
  const errors: QuestionParseError[] = [];

  if (!raw.trim()) {
    return { questions: [], errors: [{ code: "empty" }] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { questions: [], errors: [{ code: "invalidJson" }] };
  }

  let rawQuestions: unknown;
  if (Array.isArray(parsed)) {
    rawQuestions = parsed;
  } else if (isObject(parsed) && Array.isArray(parsed.questions)) {
    rawQuestions = parsed.questions;
  } else {
    return { questions: [], errors: [{ code: "notArray" }] };
  }

  const list = rawQuestions as unknown[];
  if (list.length === 0) {
    return { questions: [], errors: [{ code: "noQuestions" }] };
  }

  const questions: QuestionInput[] = [];

  list.forEach((item, index) => {
    const position = index + 1;

    if (!isObject(item)) {
      errors.push({ code: "notObject", position });
      return;
    }

    const questionText =
      typeof item.questionText === "string" ? item.questionText.trim() : "";
    if (!questionText) {
      errors.push({ code: "missingText", position });
      return;
    }

    const explanation =
      typeof item.explanation === "string" && item.explanation.trim()
        ? item.explanation.trim()
        : undefined;

    const type = item.type === "true_false" ? "true_false" : "mcq";

    if (type === "true_false") {
      let correctAnswer: boolean | undefined;
      if (typeof item.correctAnswer === "boolean") {
        correctAnswer = item.correctAnswer;
      } else if (Array.isArray(item.options)) {
        // نسمح بصيغة الـ options كذلك ونحوّلها لـ correctAnswer
        const correctIndex = (item.options as unknown[]).findIndex(
          (option) => isObject(option) && option.isCorrect === true,
        );
        if (correctIndex >= 0) correctAnswer = correctIndex === 0;
      }

      if (typeof correctAnswer !== "boolean") {
        errors.push({ code: "missingCorrectAnswer", position });
        return;
      }

      questions.push({ type: "true_false", questionText, correctAnswer, explanation });
      return;
    }

    if (!Array.isArray(item.options) || item.options.length < 2) {
      errors.push({ code: "needTwoOptions", position });
      return;
    }

    const options = (item.options as unknown[]).map((option) => {
      if (isObject(option)) {
        return {
          text: typeof option.text === "string" ? option.text.trim() : "",
          isCorrect: option.isCorrect === true,
        };
      }
      return { text: String(option ?? "").trim(), isCorrect: false };
    });

    if (options.some((option) => !option.text)) {
      errors.push({ code: "optionWithoutText", position });
      return;
    }

    const correctCount = options.filter((option) => option.isCorrect).length;
    if (correctCount !== 1) {
      errors.push({ code: "needExactlyOneCorrect", position });
      return;
    }

    questions.push({ type: "mcq", questionText, options, explanation });
  });

  return { questions, errors };
}
