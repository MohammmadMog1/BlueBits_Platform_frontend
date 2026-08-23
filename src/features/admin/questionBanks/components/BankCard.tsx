import { useState } from "react";
import { motion } from "motion/react";
import {
  BrainCircuit,
  Clock,
  ListChecks,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Eye,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import type { QuestionBank } from "../types";
import {
  getCreatorName,
  getLectureTitle,
  getSubjectName,
} from "../utils/bank";

interface BankCardProps {
  bank: QuestionBank;
  isDark: boolean;
  disabled?: boolean;
  canPublish?: boolean;
  canDelete?: boolean;
  onOpen: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
}

export function BankCard({
  bank,
  isDark,
  disabled,
  canPublish = true,
  canDelete = true,
  onOpen,
  onPublish,
  onUnpublish,
  onDelete,
}: BankCardProps) {
  const { t } = useTranslation("admin");
  const { formatDateTimeOrDash } = useFormatters();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isPublished = bank.status === "published";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`group rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${
        isDark
          ? "bg-white/5 border-white/10 hover:shadow-black/20"
          : "bg-white border-gray-100 hover:shadow-[#404293]/8"
      }`}
    >
      <div
        className={`h-1 w-full ${
          isPublished
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : "bg-gradient-to-r from-amber-400 to-orange-500"
        }`}
      />
      <div className="flex flex-col sm:flex-row gap-4 p-5">
        <div className="relative flex-shrink-0 self-start">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-lg shadow-[#404293]/25">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <span className="absolute -bottom-1 -end-1 text-[8px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm bg-[#2376BB]">
            MCQ
          </span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4
            onClick={onOpen}
            className={`text-sm font-bold leading-snug mb-2 transition-colors line-clamp-2 cursor-pointer ${
              isDark
                ? "text-white group-hover:text-[#7fb5e4]"
                : "text-gray-900 group-hover:text-[#404293]"
            }`}
          >
            {getLectureTitle(bank) || bank.title}
          </h4>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-1 font-medium">
              <ListChecks size={11} className="text-[#2376BB]/60" />
              <span className="text-[#2376BB] font-bold">
                {bank.questionCount ?? 0}
              </span>{" "}
              {t("banks.card.questions")}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Clock size={11} className={isDark ? "text-gray-600" : "text-gray-300"} />
              {formatDateTimeOrDash(bank.publishedAt ?? bank.createdAt)}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <User size={11} className={isDark ? "text-gray-600" : "text-gray-300"} />{" "}
              {getCreatorName(bank)}
            </span>
          </div>
          <p className={`text-[11px] font-semibold ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            {getSubjectName(bank)}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2.5 flex-shrink-0 pt-1">
          <button
            onClick={isPublished ? onUnpublish : onPublish}
            disabled={disabled || !canPublish}
            title={canPublish ? undefined : t("banks.noPublishPermission")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
              isPublished
                ? isDark
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                  : "bg-green-500/10 border-green-500/25 text-green-600 hover:bg-green-500/20"
                : isDark
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                  : "bg-amber-500/10 border-amber-500/25 text-amber-600 hover:bg-amber-500/20"
            }`}
          >
            {isPublished ? (
              <>
                <ToggleRight size={13} /> {t("banks.card.published")}
              </>
            ) : (
              <>
                <ToggleLeft size={13} /> {t("banks.card.draft")}
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={onOpen}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-transparent transition-all ${
                isDark
                  ? "text-gray-400 hover:text-[#7fb5e4] hover:bg-[#2376BB]/10 hover:border-[#2376BB]/25"
                  : "text-gray-500 hover:text-[#404293] hover:bg-[#404293]/6 hover:border-[#404293]/15"
              }`}
            >
              <Eye size={12} /> {t("banks.card.review")}
            </button>
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
                    {t("banks.card.confirm")}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className={`px-2 py-1.5 rounded-xl text-xs font-semibold ${
                      isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {t("banks.card.cancel")}
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-transparent transition-all ${
                    isDark
                      ? "text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100"
                  }`}
                >
                  <Trash2 size={12} /> {t("banks.card.delete")}
                </button>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
