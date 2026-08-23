import {
  BookMarked,
  Clock,
  Edit3,
  FileText,
  FileSearch,
  GraduationCap,
  Lock,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import { dividerClass } from "../../../../shared/utils/theme";
import type { AcademicTask } from "../types";

interface AcademicTaskCardProps {
  task: AcademicTask;
  isDark: boolean;
  onEdit: (task: AcademicTask) => void;
  onDelete: (task: AcademicTask) => void;
  onClose: (task: AcademicTask) => void;
  onViewSubmissions: (task: AcademicTask) => void;
}

export default function AcademicTaskCard({
  task,
  isDark,
  onEdit,
  onDelete,
  onClose,
  onViewSubmissions,
}: AcademicTaskCardProps) {
  const { t } = useTranslation("admin");
  const { formatDateTimeOrDash } = useFormatters();
  const isOpen = task.status === "open";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`group overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? "border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-lg"
          : "border-gray-100 bg-white hover:shadow-xl hover:shadow-[#404293]/8"
      }`}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3
            className={`line-clamp-2 text-base font-black leading-snug transition-colors ${
              isDark
                ? "text-white group-hover:text-[#7fb5e4]"
                : "text-gray-900 group-hover:text-[#404293]"
            }`}
          >
            {task.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isOpen
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-gray-500/10 text-gray-500"
            }`}
          >
            {t(isOpen ? "tasks.card.open" : "tasks.card.closed")}
          </span>
        </div>
        {task.description && (
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-400">
            {task.description}
          </p>
        )}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isDark ? "bg-[#404293]/15 text-[#9a9de8]" : "bg-[#404293]/8 text-[#404293]"
            }`}
          >
            <GraduationCap className="h-3 w-3" /> {task.yearId?.name ?? "—"}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isDark ? "bg-[#33529F]/15 text-[#7d94d1]" : "bg-[#33529F]/8 text-[#33529F]"
            }`}
          >
            <BookMarked className="h-3 w-3" /> {task.subjectId?.name ?? "—"}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#2376BB]/8 text-[#2376BB]"
            }`}
          >
            <FileText className="h-3 w-3" /> {task.lectureId?.title ?? "—"}
          </span>
        </div>
        <div
          className={`mb-4 space-y-1 text-[11px] font-semibold ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <p className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />{" "}
            {t("tasks.card.opensAt", {
              date: formatDateTimeOrDash(task.opensAt),
            })}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />{" "}
            {t("tasks.card.closesAt", {
              date: formatDateTimeOrDash(task.closesAt),
            })}
          </p>
        </div>
        <div className={`flex items-center gap-2 border-t pt-3 ${dividerClass(isDark)}`}>
          <button
            type="button"
            onClick={() => onViewSubmissions(task)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold transition-all ${
              isDark
                ? "text-[#7fb5e4] hover:border-[#2376BB]/25 hover:bg-[#2376BB]/12"
                : "text-[#2376BB] hover:border-[#2376BB]/15 hover:bg-[#2376BB]/6"
            }`}
          >
            <FileSearch size={12} /> {t("tasks.card.submissions")}
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold transition-all ${
              isDark
                ? "text-gray-400 hover:border-[#2376BB]/25 hover:bg-[#2376BB]/12 hover:text-[#7fb5e4]"
                : "text-gray-500 hover:border-[#404293]/15 hover:bg-[#404293]/6 hover:text-[#404293]"
            }`}
          >
            <Edit3 size={12} /> {t("tasks.card.edit")}
          </button>
          {isOpen && (
            <button
              type="button"
              onClick={() => onClose(task)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold transition-all ${
                isDark
                  ? "text-amber-400 hover:border-amber-500/25 hover:bg-amber-500/10"
                  : "text-amber-500 hover:border-amber-100 hover:bg-amber-50"
              }`}
            >
              <Lock size={12} /> {t("tasks.card.close")}
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(task)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold transition-all ${
              isDark
                ? "text-gray-500 hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-400"
                : "text-gray-400 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Trash2 size={12} /> {t("tasks.card.delete")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
