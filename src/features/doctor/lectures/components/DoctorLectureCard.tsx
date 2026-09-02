import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  Clock,
  Download,
  Edit3,
  File,
  FileText,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import type { LecturePopulated } from "../../../admin/lectures/types";

interface DoctorLectureCardProps {
  lecture: LecturePopulated;
  isDark: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export default function DoctorLectureCard({
  lecture,
  isDark,
  onEdit,
  onDelete,
  onToggleStatus,
}: DoctorLectureCardProps) {
  const { t } = useTranslation("doctor");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isPractical = lecture.type === "practical";

  const formattedDate = new Date(lecture.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
        isDark
          ? "border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
          : "border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-[#404293]/8 hover:-translate-y-0.5"
      }`}
    >
      <div
        className={`h-1 w-full ${
          isPractical
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : "bg-gradient-to-r from-[#404293] to-[#2376BB]"
        }`}
      />
      <div className="flex flex-col sm:flex-row gap-4 p-5">
        <div className="relative flex-shrink-0 self-start">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
              isPractical
                ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200/60"
                : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-200/60"
            }`}
          >
            <FileText className="w-7 h-7 text-white" />
          </div>
          <span
            className={`absolute -bottom-1 -end-1 text-[8px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm ${
              isPractical ? "bg-emerald-500" : "bg-[#404293]"
            }`}
          >
            {isPractical ? t("lectures.card.labBadge") : t("lectures.card.pdfBadge")}
          </span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4
            className={`text-sm font-bold leading-snug mb-2 line-clamp-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {lecture.title}
          </h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-1 text-gray-400">
            <span className="flex items-center gap-1 font-medium">
              <Clock size={11} className={isDark ? "text-gray-600" : "text-gray-300"} /> {formattedDate}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <File size={11} className={isDark ? "text-gray-600" : "text-gray-300"} />{" "}
              {isPractical ? t("lectures.types.practical") : t("lectures.types.theoretical")}
            </span>
          </div>
          <p className={`text-[11px] font-semibold ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            {lecture.subjectId?.name ?? "—"}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2.5 flex-shrink-0 pt-1">
          <button
            onClick={onToggleStatus}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              lecture.isPublished
                ? isDark
                  ? "bg-green-500/15 border-green-500/25 text-green-400 hover:bg-green-500/25"
                  : "bg-green-500/10 border-green-500/25 text-green-600 hover:bg-green-500/20"
                : isDark
                  ? "bg-amber-500/15 border-amber-500/25 text-amber-400 hover:bg-amber-500/25"
                  : "bg-amber-500/10 border-amber-500/25 text-amber-600 hover:bg-amber-500/20"
            }`}
          >
            {lecture.isPublished ? (
              <>
                <ToggleRight size={13} /> {t("lectures.card.published")}
              </>
            ) : (
              <>
                <ToggleLeft size={13} /> {t("lectures.card.draft")}
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            <a
              href={lecture.fileUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-transparent transition-all ${
                isDark
                  ? "text-gray-400 hover:text-[#7fb5e4] hover:bg-[#2376BB]/10 hover:border-[#2376BB]/20"
                  : "text-gray-500 hover:text-[#404293] hover:bg-[#404293]/6 hover:border-[#404293]/15"
              }`}
            >
              <Download size={12} /> {t("lectures.card.download")}
            </a>
            <button
              onClick={onEdit}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-transparent transition-all ${
                isDark
                  ? "text-gray-400 hover:text-[#7fb5e4] hover:bg-[#2376BB]/10 hover:border-[#2376BB]/20"
                  : "text-gray-500 hover:text-[#404293] hover:bg-[#404293]/6 hover:border-[#404293]/15"
              }`}
            >
              <Edit3 size={12} /> {t("lectures.card.edit")}
            </button>
            {confirmDelete ? (
              <span className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                    onDelete();
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  {t("lectures.confirmDelete.yes")}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold ${
                    isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t("lectures.form.cancel")}
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
                <Trash2 size={12} /> {t("lectures.card.delete")}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
