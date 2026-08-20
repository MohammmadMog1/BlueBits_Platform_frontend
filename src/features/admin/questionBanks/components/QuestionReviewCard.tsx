import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Info, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Question } from "../types";
import { questionTypeKey } from "../utils/bank";

interface QuestionReviewCardProps {
  question: Question;
  index: number;
  disabled?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function QuestionReviewCard({
  question,
  index,
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
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-7 h-7 rounded-xl bg-[#404293]/10 text-[#404293] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
            {index}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-snug">
              {question.questionText}
            </p>
            <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2376BB]/10 text-[#2376BB]">
              {t(`mcq:${questionTypeKey(question)}`)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {canUpdate && (
            <button
              onClick={onEdit}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#404293] hover:bg-[#404293]/6 border border-transparent hover:border-[#404293]/15 disabled:opacity-50 transition-all"
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
                  className="px-2 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600"
                >
                  {t("banks.question.cancel")}
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={disabled}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 disabled:opacity-50 transition-all"
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
                ? "bg-green-500/8 border-green-500/25 text-green-700 font-semibold"
                : "bg-gray-50 border-gray-100 text-gray-600"
            }`}
          >
            {option.isCorrect ? (
              <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 flex-shrink-0" />
            )}
            <span className="truncate">{option.text}</span>
          </div>
        ))}
      </div>

      {question.explanation && (
        <div className="flex gap-2 mt-3 ms-10 rounded-xl bg-[#2376BB]/6 border border-[#2376BB]/12 px-3.5 py-2.5">
          <Info size={13} className="text-[#2376BB] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </motion.div>
  );
}
