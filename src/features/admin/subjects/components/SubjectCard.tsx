import { GraduationCap, Layers, Edit3, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { Subject } from "../types";

interface SubjectCardProps {
  subject: Subject;
  yearLabel: string;
  semesterLabel: string;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

export default function SubjectCard({
  subject,
  yearLabel,
  semesterLabel,
  onEdit,
  onDelete,
}: SubjectCardProps) {
  const { t } = useTranslation("admin");

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
        <h3 className="mb-2 line-clamp-2 text-base font-black leading-snug text-gray-900 transition-colors group-hover:text-[#404293]">
          {subject.name}
        </h3>
        {subject.description && (
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-400">
            {subject.description}
          </p>
        )}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-[#404293]/8 px-2.5 py-1 text-[11px] font-bold text-[#404293]">
            <GraduationCap className="h-3 w-3" /> {yearLabel}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#33529F]/8 px-2.5 py-1 text-[11px] font-bold text-[#33529F]">
            <Layers className="h-3 w-3" /> {semesterLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={() => onEdit(subject)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold text-gray-500 transition-all hover:border-[#404293]/15 hover:bg-[#404293]/6 hover:text-[#404293]"
          >
            <Edit3 size={12} /> {t("subjects.card.edit")}
          </button>
          <button
            type="button"
            onClick={() => onDelete(subject)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold text-gray-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={12} /> {t("subjects.card.delete")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
