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
import type { QuestionBank } from "../types";
import {
  formatDateTime,
  getCreatorName,
  getLectureTitle,
  getSubjectName,
} from "../utils/bank";

interface BankCardProps {
  bank: QuestionBank;
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
  disabled,
  canPublish = true,
  canDelete = true,
  onOpen,
  onPublish,
  onUnpublish,
  onDelete,
}: BankCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isPublished = bank.status === "published";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#404293]/8 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
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
          <span className="absolute -bottom-1 -right-1 text-[8px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm bg-[#2376BB]">
            MCQ
          </span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4
            onClick={onOpen}
            className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#404293] transition-colors line-clamp-2 cursor-pointer"
          >
            {getLectureTitle(bank) || bank.title}
          </h4>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-1 font-medium">
              <ListChecks size={11} className="text-[#2376BB]/60" />
              <span className="text-[#2376BB] font-bold">
                {bank.questionCount ?? 0}
              </span>{" "}
              questions
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Clock size={11} className="text-gray-300" />
              {formatDateTime(bank.publishedAt ?? bank.createdAt)}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <User size={11} className="text-gray-300" /> {getCreatorName(bank)}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-semibold">
            {getSubjectName(bank)}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2.5 flex-shrink-0 pt-1">
          <button
            onClick={isPublished ? onUnpublish : onPublish}
            disabled={disabled || !canPublish}
            title={
              canPublish ? undefined : "لا تملك صلاحية النشر"
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border disabled:opacity-50 disabled:cursor-not-allowed ${
              isPublished
                ? "bg-green-500/10 border-green-500/25 text-green-600 hover:bg-green-500/20"
                : "bg-amber-500/10 border-amber-500/25 text-amber-600 hover:bg-amber-500/20"
            }`}
          >
            {isPublished ? (
              <>
                <ToggleRight size={13} /> Published
              </>
            ) : (
              <>
                <ToggleLeft size={13} /> Draft
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={onOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#404293] hover:bg-[#404293]/6 border border-transparent hover:border-[#404293]/15 transition-all"
            >
              <Eye size={12} /> Review
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
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                >
                  <Trash2 size={12} /> Delete
                </button>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
