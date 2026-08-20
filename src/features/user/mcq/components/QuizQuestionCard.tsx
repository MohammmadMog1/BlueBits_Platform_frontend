import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { Check, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Question } from "../../../admin/questionBanks/types";
import { questionTypeKey } from "../../../admin/questionBanks/utils/bank";

interface QuizQuestionCardProps {
  question: Question;
  number: number;
  /** الخيار الذي اختاره الطالب، أو undefined إذا لم يُجب بعد */
  selectedIndex?: number;
  correctIndex: number;
  onSelect: (optionIndex: number) => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizQuestionCard({
  question,
  number,
  selectedIndex,
  correctIndex,
  onSelect,
}: QuizQuestionCardProps) {
  const { t } = useTranslation("mcq");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const answered = selectedIndex !== undefined;
  const isCorrect = answered && selectedIndex === correctIndex;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl sm:rounded-2xl md:rounded-[1.75rem] border p-4 sm:p-5 md:p-6 backdrop-blur-md transition-colors ${
        answered
          ? isCorrect
            ? isDark
              ? "bg-green-500/[0.07] border-green-500/25"
              : "bg-green-50/70 border-green-200"
            : isDark
              ? "bg-red-500/[0.07] border-red-500/25"
              : "bg-red-50/60 border-red-200"
          : isDark
            ? "bg-white/5 border-white/10"
            : "bg-white/90 border-gray-200 shadow-sm"
      }`}
    >
      {/* Question head */}
      <div className="flex items-start gap-3 mb-4">
        <span
          className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center flex-shrink-0 ${
            answered
              ? isCorrect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              : isDark
                ? "bg-white/10 text-gray-300"
                : "bg-[#404293]/10 text-[#404293]"
          }`}
        >
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm sm:text-base font-bold leading-relaxed ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            {question.questionText}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? "bg-white/10 text-gray-300" : "bg-[#2376BB]/10 text-[#2376BB]"
              }`}
            >
              {t(questionTypeKey(question))}
            </span>
            {answered && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isCorrect
                    ? "bg-green-500/12 text-green-600"
                    : "bg-red-500/12 text-red-600"
                }`}
              >
                {isCorrect ? <Check size={10} /> : <X size={10} />}
                {t(
                  isCorrect ? "question.correctAnswer" : "question.wrongAnswer",
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5 sm:ps-11">
        {question.options?.map((option, optionIndex) => {
          const isSelected = selectedIndex === optionIndex;
          const isRight = optionIndex === correctIndex;
          const revealRight = answered && isRight;
          const revealWrong = answered && isSelected && !isRight;

          return (
            <button
              key={`${option.text}-${optionIndex}`}
              onClick={() => onSelect(optionIndex)}
              disabled={answered}
              className={`w-full flex items-center gap-3 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl border transition-all text-start ${
                revealRight
                  ? "bg-green-500/12 border-green-500/40"
                  : revealWrong
                    ? "bg-red-500/10 border-red-500/40"
                    : answered
                      ? isDark
                        ? "bg-white/[0.03] border-white/10 opacity-60"
                        : "bg-gray-50 border-gray-200 opacity-60"
                      : isDark
                        ? "bg-white/5 border-white/10 hover:border-[#2376BB]/50 hover:bg-white/[0.08] cursor-pointer"
                        : "bg-gray-50 border-gray-200 hover:border-[#404293]/40 hover:bg-white cursor-pointer"
              } ${answered ? "cursor-default" : ""}`}
            >
              <span
                className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center flex-shrink-0 ${
                  revealRight
                    ? "bg-green-500 text-white"
                    : revealWrong
                      ? "bg-red-500 text-white"
                      : isDark
                        ? "bg-white/10 text-gray-400"
                        : "bg-white text-gray-400 border border-gray-200"
                }`}
              >
                {revealRight ? (
                  <CheckCircle2 size={14} />
                ) : revealWrong ? (
                  <XCircle size={14} />
                ) : (
                  (OPTION_LETTERS[optionIndex] ?? optionIndex + 1)
                )}
              </span>
              <span
                className={`text-sm font-semibold ${
                  revealRight
                    ? "text-green-700"
                    : revealWrong
                      ? "text-red-600"
                      : isDark
                        ? "text-gray-300"
                        : "text-gray-700"
                }`}
              >
                {option.text}
              </span>
              {revealWrong && (
                <span className="ms-auto text-[10px] font-bold text-red-500 flex-shrink-0">
                  {t("question.yourAnswer")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation – تظهر بعد الإجابة فقط */}
      {answered && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div
            className={`flex gap-2 mt-3.5 sm:ms-11 rounded-xl px-3.5 py-2.5 border ${
              isDark
                ? "bg-[#2376BB]/10 border-[#2376BB]/20"
                : "bg-[#2376BB]/6 border-[#2376BB]/15"
            }`}
          >
            <Info size={14} className="text-[#2376BB] flex-shrink-0 mt-0.5" />
            <p
              className={`text-xs leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              {question.explanation}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
