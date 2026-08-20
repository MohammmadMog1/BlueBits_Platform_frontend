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
import type { AcademicTask } from "../types";

interface AcademicTaskCardProps {
  task: AcademicTask;
  onEdit: (task: AcademicTask) => void;
  onDelete: (task: AcademicTask) => void;
  onClose: (task: AcademicTask) => void;
  onViewSubmissions: (task: AcademicTask) => void;
}

export default function AcademicTaskCard({
  task,
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
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#404293]/8"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base font-black leading-snug text-gray-900 transition-colors group-hover:text-[#404293]">
            {task.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isOpen
                ? "bg-emerald-50 text-emerald-600"
                : "bg-gray-100 text-gray-500"
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
          <span className="flex items-center gap-1 rounded-full bg-[#404293]/8 px-2.5 py-1 text-[11px] font-bold text-[#404293]">
            <GraduationCap className="h-3 w-3" /> {task.yearId?.name ?? "—"}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#33529F]/8 px-2.5 py-1 text-[11px] font-bold text-[#33529F]">
            <BookMarked className="h-3 w-3" /> {task.subjectId?.name ?? "—"}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#2376BB]/8 px-2.5 py-1 text-[11px] font-bold text-[#2376BB]">
            <FileText className="h-3 w-3" /> {task.lectureId?.title ?? "—"}
          </span>
        </div>
        <div className="mb-4 space-y-1 text-[11px] font-semibold text-gray-400">
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
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={() => onViewSubmissions(task)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold text-[#2376BB] transition-all hover:border-[#2376BB]/15 hover:bg-[#2376BB]/6"
          >
            <FileSearch size={12} /> {t("tasks.card.submissions")}
          </button>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold text-gray-500 transition-all hover:border-[#404293]/15 hover:bg-[#404293]/6 hover:text-[#404293]"
          >
            <Edit3 size={12} /> {t("tasks.card.edit")}
          </button>
          {isOpen && (
            <button
              type="button"
              onClick={() => onClose(task)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold text-amber-500 transition-all hover:border-amber-100 hover:bg-amber-50"
            >
              <Lock size={12} /> {t("tasks.card.close")}
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold text-gray-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={12} /> {t("tasks.card.delete")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
