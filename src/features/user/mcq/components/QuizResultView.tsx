import { useTheme } from "next-themes";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Info,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../shared/i18n/useLanguage";
import type { Question } from "../../../admin/questionBanks/types";
import { scoreColor } from "../../../admin/questionBanks/utils/bank";
import type { QuizResult } from "../hooks/useQuizRunner";

interface QuizResultViewProps {
  result: QuizResult;
  questions: Question[];
  onRetry: () => void;
  onBackToList: () => void;
}

export function QuizResultView({
  result,
  questions,
  onRetry,
  onBackToList,
}: QuizResultViewProps) {
  const { t } = useTranslation("mcq");
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const percentage = result.scorePercentage ?? 0;
  const color = scoreColor(percentage);
  const answeredWrong = result.answers.filter((answer) => !answer.isCorrect).length;
  const unanswered = Math.max(
    (result.totalQuestions ?? questions.length) - result.answers.length,
    0,
  );

  const answerByQuestion = new Map(
    result.answers.map((answer) => [answer.questionId, answer]),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 sm:space-y-6"
    >
      {/* Score summary */}
      <div
        className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 backdrop-blur-md ${
          isDark ? "bg-white/5 border-white/10" : "bg-white/90 border-gray-200"
        }`}
      >
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="10"
              className={isDark ? "stroke-white/10" : "stroke-gray-100"}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              stroke={color}
              strokeDasharray={2 * Math.PI * 42}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100),
              }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black" style={{ color }}>
              {percentage}%
            </span>
            <span
              className={`text-[10px] font-bold ${isDark ? "text-gray-400" : "text-gray-400"}`}
            >
              {t("result.outOf100")}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-start w-full">
          <h3
            className={`text-lg sm:text-2xl font-black mb-1.5 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {t(
              percentage >= 80
                ? "result.excellent"
                : percentage >= 50
                  ? "result.good"
                  : "result.needsReview",
            )}
          </h3>
          <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {t("result.summary", {
              correct: result.correctCount,
              total: result.totalQuestions,
            })}
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              {
                label: t("result.correct"),
                value: result.correctCount,
                color: "#059669",
                icon: CheckCircle2,
              },
              {
                label: t("result.wrong"),
                value: answeredWrong,
                color: "#DC2626",
                icon: XCircle,
              },
              {
                label: t("result.unanswered"),
                value: unanswered,
                color: "#F59E0B",
                icon: Target,
              },
            ].map(({ label, value, color: itemColor, icon: Icon }) => (
              <div
                key={label}
                className={`rounded-xl sm:rounded-2xl border px-3 py-2.5 flex items-center gap-2 ${
                  isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"
                }`}
              >
                <Icon size={16} style={{ color: itemColor }} className="flex-shrink-0" />
                <div className="min-w-0">
                  <p
                    className={`text-base font-black leading-none ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {value}
                  </p>
                  <p
                    className={`text-[10px] font-semibold mt-0.5 ${isDark ? "text-gray-400" : "text-gray-400"}`}
                  >
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-lg shadow-[#404293]/25 hover:-translate-y-0.5 transition-all"
            >
              <RotateCcw size={15} /> {t("result.retry")}
            </button>
            <button
              onClick={onBackToList}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                isDark
                  ? "bg-white/5 border-white/20 text-gray-200 hover:bg-white/10"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ArrowLeft size={15} className={isRTL ? "rotate-180" : ""} />{" "}
              {t("result.backToBanks")}
            </button>
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="space-y-3">
        <h4
          className={`text-base sm:text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {t("result.reviewHeading")}
        </h4>

        {questions.map((question, index) => {
          const answer = answerByQuestion.get(question._id);
          const correctIndex = question.options?.findIndex((option) => option.isCorrect);
          const isCorrect = answer?.isCorrect === true;
          const skipped = !answer;

          return (
            <div
              key={question._id}
              className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-md ${
                isDark ? "bg-white/5 border-white/10" : "bg-white/90 border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    skipped
                      ? "bg-amber-500/12 text-amber-500"
                      : isCorrect
                        ? "bg-green-500/12 text-green-600"
                        : "bg-red-500/12 text-red-500"
                  }`}
                >
                  {index + 1}
                </span>
                <p
                  className={`text-sm font-bold leading-snug ${isDark ? "text-gray-100" : "text-gray-900"}`}
                >
                  {question.questionText}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ps-10">
                {question.options?.map((option, optionIndex) => {
                  const isSelected = answer?.selectedIndex === optionIndex;
                  const isRightOption = optionIndex === correctIndex;

                  const base =
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm border transition-colors";
                  const style = isRightOption
                    ? "bg-green-500/10 border-green-500/30 text-green-700 font-semibold"
                    : isSelected
                      ? "bg-red-500/8 border-red-500/30 text-red-600 font-semibold"
                      : isDark
                        ? "bg-white/5 border-white/10 text-gray-300"
                        : "bg-gray-50 border-gray-100 text-gray-600";

                  return (
                    <div key={`${option.text}-${optionIndex}`} className={`${base} ${style}`}>
                      {isRightOption ? (
                        <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                      ) : isSelected ? (
                        <XCircle size={14} className="text-red-500 flex-shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300/60 flex-shrink-0" />
                      )}
                      <span className="truncate">{option.text}</span>
                      {isSelected && (
                        <span className="ms-auto text-[10px] font-bold opacity-70">
                          {t("question.yourAnswer")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {question.explanation && (
                <div
                  className={`flex gap-2 mt-3 ms-10 rounded-xl px-3.5 py-2.5 border ${
                    isDark
                      ? "bg-[#2376BB]/10 border-[#2376BB]/20"
                      : "bg-[#2376BB]/6 border-[#2376BB]/12"
                  }`}
                >
                  <Info size={13} className="text-[#2376BB] flex-shrink-0 mt-0.5" />
                  <p
                    className={`text-xs leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
