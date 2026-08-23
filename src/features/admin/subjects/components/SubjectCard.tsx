import { GraduationCap, Layers, Edit3, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  accentIconClass,
  dividerClass,
  headingClass,
  mutedClass,
} from "../../../../shared/utils/theme";
import type { Subject } from "../types";

interface SubjectCardProps {
  subject: Subject;
  yearLabel: string;
  semesterLabel: string;
  isDark: boolean;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

export default function SubjectCard({
  subject,
  yearLabel,
  semesterLabel,
  isDark,
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
      className={`group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? "border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-lg"
          : "border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-[#404293]/8"
      }`}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
      <div className="p-5">
        <h3
          className={`mb-2 line-clamp-2 text-base font-black leading-snug transition-colors ${headingClass(
            isDark,
          )} ${isDark ? "group-hover:text-[#7fb5e4]" : "group-hover:text-[#404293]"}`}
        >
          {subject.name}
        </h3>
        {subject.description && (
          <p className={`mb-4 line-clamp-2 text-xs leading-relaxed ${mutedClass(isDark)}`}>
            {subject.description}
          </p>
        )}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${accentIconClass(
              isDark,
              "brand",
            )}`}
          >
            <GraduationCap className="h-3 w-3" /> {yearLabel}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${accentIconClass(
              isDark,
              "sky",
            )}`}
          >
            <Layers className="h-3 w-3" /> {semesterLabel}
          </span>
        </div>
        <div className={`flex items-center gap-2 border-t pt-3 ${dividerClass(isDark)}`}>
          <button
            type="button"
            onClick={() => onEdit(subject)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold transition-all ${
              isDark
                ? "text-gray-400 hover:border-[#2376BB]/30 hover:bg-[#2376BB]/10 hover:text-[#2376BB]"
                : "text-gray-500 hover:border-[#404293]/15 hover:bg-[#404293]/6 hover:text-[#404293]"
            }`}
          >
            <Edit3 size={12} /> {t("subjects.card.edit")}
          </button>
          <button
            type="button"
            onClick={() => onDelete(subject)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold transition-all ${
              isDark
                ? "text-gray-500 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                : "text-gray-400 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Trash2 size={12} /> {t("subjects.card.delete")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
