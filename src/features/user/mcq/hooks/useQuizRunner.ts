import { useCallback, useMemo, useState } from "react";
import {
  useGetBankQuery,
  useGetMyAttemptsQuery,
  useSubmitAnswersMutation,
} from "../../../admin/questionBanks/api/questionBanksApi";
import { getApiErrorMessage } from "../../../admin/questionBanks/utils/bank";
import type {
  Attempt,
  Question,
  QuestionBank,
} from "../../../admin/questionBanks/types";

export type QuizPhase = "intro" | "running" | "result";

/** عدد الأسئلة المعروضة في الصفحة الواحدة أثناء الحل */
export const QUESTIONS_PER_PAGE = 5;

export interface QuizResult {
  correctCount: number;
  totalQuestions: number;
  scorePercentage: number;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
}

export interface UseQuizRunnerReturn {
  bank: QuestionBank | null;
  questions: Question[];
  /** أسئلة الصفحة الحالية فقط */
  pageQuestions: Question[];
  attempts: Attempt[];
  isLoading: boolean;
  attemptsLoading: boolean;
  submitting: boolean;
  error: string | null;
  phase: QuizPhase;
  page: number;
  totalPages: number;
  selectedIndexes: Record<string, number>;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  progressPercent: number;
  isComplete: boolean;
  result: QuizResult | null;
  bestScore: number | null;
  /** فهرس السؤال داخل البنك كامل (للترقيم في الواجهة) */
  questionNumber: (question: Question) => number;
  correctIndexOf: (question: Question) => number;
  start: () => void;
  selectOption: (questionId: string, optionIndex: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  submit: () => Promise<void>;
  restart: () => void;
}

export function useQuizRunner(bankId: string): UseQuizRunnerReturn {
  const { data: detail, isFetching: isLoading } = useGetBankQuery(bankId, {
    skip: !bankId,
  });
  const { data: attempts = [], isFetching: attemptsLoading } =
    useGetMyAttemptsQuery(bankId, { skip: !bankId });
  const [submitAnswers, { isLoading: submitting }] = useSubmitAnswersMutation();

  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [page, setPage] = useState(1);
  const [selectedIndexes, setSelectedIndexes] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bank = detail?.bank ?? null;
  const questions = useMemo(() => detail?.questions ?? [], [detail]);

  const totalPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const pageQuestions = useMemo(
    () =>
      questions.slice(
        (safePage - 1) * QUESTIONS_PER_PAGE,
        safePage * QUESTIONS_PER_PAGE,
      ),
    [questions, safePage],
  );

  const questionOrder = useMemo(() => {
    const order = new Map<string, number>();
    questions.forEach((question, index) => order.set(question._id, index + 1));
    return order;
  }, [questions]);

  const correctIndexes = useMemo(() => {
    const map = new Map<string, number>();
    questions.forEach((question) =>
      map.set(
        question._id,
        question.options?.findIndex((option) => option.isCorrect) ?? -1,
      ),
    );
    return map;
  }, [questions]);

  const answeredCount = Object.keys(selectedIndexes).length;

  const { correctCount, wrongCount } = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    Object.entries(selectedIndexes).forEach(([questionId, selectedIndex]) => {
      if (correctIndexes.get(questionId) === selectedIndex) correct += 1;
      else wrong += 1;
    });
    return { correctCount: correct, wrongCount: wrong };
  }, [selectedIndexes, correctIndexes]);

  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const isComplete = questions.length > 0 && answeredCount === questions.length;

  const bestScore = useMemo(() => {
    if (attempts.length === 0) return null;
    return attempts.reduce(
      (max, attempt) => Math.max(max, attempt.scorePercentage ?? 0),
      0,
    );
  }, [attempts]);

  const questionNumber = useCallback(
    (question: Question) => questionOrder.get(question._id) ?? 0,
    [questionOrder],
  );

  const correctIndexOf = useCallback(
    (question: Question) => correctIndexes.get(question._id) ?? -1,
    [correctIndexes],
  );

  const start = useCallback(() => {
    setSelectedIndexes({});
    setPage(1);
    setResult(null);
    setError(null);
    setPhase("running");
  }, []);

  /** الإجابة تُقفل بعد اختيارها – نفس سلوك التصحيح الفوري */
  const selectOption = useCallback((questionId: string, optionIndex: number) => {
    setSelectedIndexes((previous) =>
      previous[questionId] !== undefined
        ? previous
        : { ...previous, [questionId]: optionIndex },
    );
  }, []);

  const goToPage = useCallback(
    (target: number) => {
      if (target < 1 || target > totalPages) return;
      setPage(target);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => goToPage(safePage + 1), [goToPage, safePage]);
  const previousPage = useCallback(
    () => goToPage(safePage - 1),
    [goToPage, safePage],
  );

  const submit = useCallback(async () => {
    setError(null);

    const answers = questions
      .filter((question) => selectedIndexes[question._id] !== undefined)
      .map((question) => ({
        questionId: question._id,
        selectedIndex: selectedIndexes[question._id],
      }));

    // تصحيح محلي كـ fallback إذا لم يُرجع السيرفر تفاصيل كاملة
    const localAnswers = answers.map((answer) => ({
      ...answer,
      isCorrect: correctIndexes.get(answer.questionId) === answer.selectedIndex,
    }));
    const localCorrect = localAnswers.filter((answer) => answer.isCorrect).length;
    const localResult: QuizResult = {
      correctCount: localCorrect,
      totalQuestions: questions.length,
      scorePercentage: questions.length
        ? Math.round((localCorrect / questions.length) * 100)
        : 0,
      answers: localAnswers,
    };

    try {
      const attempt = await submitAnswers({ bankId, answers }).unwrap();
      setResult({
        correctCount: attempt?.correctCount ?? localResult.correctCount,
        totalQuestions: attempt?.totalQuestions ?? localResult.totalQuestions,
        scorePercentage: attempt?.scorePercentage ?? localResult.scorePercentage,
        answers:
          attempt?.answers && attempt.answers.length > 0
            ? attempt.answers
            : localResult.answers,
      });
      setPhase("result");
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "تعذّر إرسال الإجابات."));
    }
  }, [bankId, correctIndexes, questions, selectedIndexes, submitAnswers]);

  const restart = useCallback(() => {
    setSelectedIndexes({});
    setPage(1);
    setResult(null);
    setError(null);
    setPhase("intro");
  }, []);

  return {
    bank,
    questions,
    pageQuestions,
    attempts,
    isLoading,
    attemptsLoading,
    submitting,
    error,
    phase,
    page: safePage,
    totalPages,
    selectedIndexes,
    answeredCount,
    correctCount,
    wrongCount,
    progressPercent,
    isComplete,
    result,
    bestScore,
    questionNumber,
    correctIndexOf,
    start,
    selectOption,
    goToPage,
    nextPage,
    previousPage,
    submit,
    restart,
  };
}
