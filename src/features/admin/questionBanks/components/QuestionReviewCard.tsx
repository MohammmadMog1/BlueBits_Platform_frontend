import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Info, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Question } from "../types";
import { questionTypeKey } from "../utils/bank";

interface QuestionReviewCardProps {
  question: Question;
  index: number;
  isDark: boolean;
  disabled?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function QuestionReviewCard({
  question,
  index,
  isDark,
  disabled,
  canUpdate = true,
  canDelete = true,
  onEdit,
  onDelete,
}: QuestionReviewCardProps) {
  const { t } = useTranslation(["admin", "mcq"]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-5 ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#404293]/10 text-[#404293]"
            }`}
          >
            {index}
          </span>
          <div className="min-w-0">
            <p className={`text-sm font-bold leading-snug ${isDark ? "text-white" : "text-gray-900"}`}>
              {question.questionText}
            </p>
            <span
              className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? "bg-[#2376BB]/20 text-[#7fb5e4]" : "bg-[#2376BB]/10 text-[#2376BB]"
              }`}
            >
              {t(`mcq:${questionTypeKey(question)}`)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {canUpdate && (
            <button
              onClick={onEdit}
              disabled={disabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-transparent disabled:opacity-50 transition-all ${
                isDark
                  ? "text-gray-400 hover:text-[#7fb5e4] hover:bg-[#2376BB]/10 hover:border-[#2376BB]/25"
                  : "text-gray-500 hover:text-[#404293] hover:bg-[#404293]/6 hover:border-[#404293]/15"
              }`}
            >
              <Pencil size={12} /> {t("banks.question.edit")}
            </button>
          )}
          {canDelete &&
            (confirmDelete ? (
              <span className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                    onDelete();
                  }}
                  disabled={disabled}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {t("banks.question.confirm")}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold ${
                    isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t("banks.question.cancel")}
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={disabled}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-transparent disabled:opacity-50 transition-all ${
                  isDark
                    ? "text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100"
                }`}
              >
                <Trash2 size={12} /> {t("banks.question.delete")}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ps-10">
        {question.options?.map((option, optionIndex) => (
          <div
            key={`${option.text}-${optionIndex}`}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm border ${
              option.isCorrect
                ? isDark
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 font-semibold"
                  : "bg-green-500/8 border-green-500/25 text-green-700 font-semibold"
                : isDark
                  ? "bg-white/5 border-white/10 text-gray-300"
                  : "bg-gray-50 border-gray-100 text-gray-600"
            }`}
          >
            {option.isCorrect ? (
              <CheckCircle2
                size={14}
                className={isDark ? "text-emerald-400 flex-shrink-0" : "text-green-500 flex-shrink-0"}
              />
            ) : (
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                  isDark ? "border-white/15" : "border-gray-200"
                }`}
              />
            )}
            <span className="truncate">{option.text}</span>
          </div>
        ))}
      </div>

      {question.explanation && (
        <div
          className={`flex gap-2 mt-3 ms-10 rounded-xl border px-3.5 py-2.5 ${
            isDark ? "bg-[#2376BB]/10 border-[#2376BB]/25" : "bg-[#2376BB]/6 border-[#2376BB]/12"
          }`}
        >
          <Info size={13} className="text-[#2376BB] flex-shrink-0 mt-0.5" />
          <p className={`text-xs leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {question.explanation}
          </p>
        </div>
      )}
    </motion.div>
  );
}
