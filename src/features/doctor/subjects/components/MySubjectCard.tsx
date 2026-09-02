import { BrainCircuit, FileText, GraduationCap, Layers } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { accentIconClass, dividerClass, headingClass, mutedClass } from "../../../../shared/utils/theme";
import type { MySubject } from "../../../admin/subjects/types";
import type { DoctorSubjectStats } from "../../types";

interface MySubjectCardProps {
  subject: MySubject;
  stats?: DoctorSubjectStats;
  isDark: boolean;
}

export default function MySubjectCard({ subject, stats, isDark }: MySubjectCardProps) {
  const { t } = useTranslation("doctor");

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
        <h3 className={`mb-2 line-clamp-2 text-base font-black leading-snug ${headingClass(isDark)}`}>
          {subject.name}
        </h3>
        {subject.description && (
          <p className={`mb-4 line-clamp-2 text-xs leading-relaxed ${mutedClass(isDark)}`}>
            {subject.description}
          </p>
        )}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {subject.yearId && (
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${accentIconClass(
                isDark,
                "brand",
              )}`}
            >
              <GraduationCap className="h-3 w-3" /> {subject.yearId.name}
            </span>
          )}
          {subject.semesterId && (
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${accentIconClass(
                isDark,
                "sky",
              )}`}
            >
              <Layers className="h-3 w-3" /> {subject.semesterId.name}
            </span>
          )}
        </div>
        <div className={`flex items-center gap-4 border-t pt-3 text-xs font-bold ${dividerClass(isDark)}`}>
          <span className={`flex items-center gap-1.5 ${mutedClass(isDark)}`}>
            <FileText className="h-3.5 w-3.5" />
            {t("subjects.lecturesCount", { count: stats?.lectures?.total ?? 0 })}
          </span>
          <span className={`flex items-center gap-1.5 ${mutedClass(isDark)}`}>
            <BrainCircuit className="h-3.5 w-3.5" />
            {t("subjects.banksCount", { count: stats?.questionBanks?.total ?? 0 })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
