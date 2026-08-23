import { BookMarked, Calendar, FileText, UploadCloud } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../shared/i18n/useFormatters";
import type { AcademicTask } from "../../admin/tasks";

interface StudentAcademicTaskCardProps {
  task: AcademicTask;
  isDark: boolean;
  onOpenSubmission: (task: AcademicTask) => void;
}

function StatusDot({ task }: { task: AcademicTask }) {
  const color = task.status === "open" ? "bg-[#2376BB]" : "bg-gray-400";
  return <div className={`h-2 w-2 shrink-0 rounded-full ${color}`} />;
}

function MobileTaskCard({ task, isDark, onOpenSubmission }: StudentAcademicTaskCardProps) {
  const { t } = useTranslation("tasks");
  const { formatDateTimeOrDash } = useFormatters();
  const isOpen = task.status === "open";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`flex flex-col gap-3 rounded-2xl border p-3.5 transition-all active:scale-[0.99] ${
        isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-1.5">
          <StatusDot task={task} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold leading-snug ${isDark ? "text-white" : "text-gray-900"}`}>
            {task.title}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[10px] font-semibold ${
                isDark ? "border border-white/10 bg-white/8 text-gray-400" : "border border-gray-200 bg-gray-100 text-gray-500"
              }`}
            >
              <Calendar className="h-2.5 w-2.5" />{" "}
              {t("academic.closesAt", {
                date: formatDateTimeOrDash(task.closesAt),
              })}
            </span>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            isOpen ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-500/10 text-gray-500"
          }`}
        >
          {t(isOpen ? "academic.statusOpen" : "academic.statusClosed")}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onOpenSubmission(task)}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-2 text-xs font-bold text-white"
      >
        <UploadCloud size={13} /> {t("academic.submitSolution")}
      </button>
    </motion.div>
  );
}

function DesktopTaskCard({ task, isDark, onOpenSubmission }: StudentAcademicTaskCardProps) {
  const { t } = useTranslation("tasks");
  const { formatDateTimeOrDash } = useFormatters();
  const isOpen = task.status === "open";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`overflow-hidden rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1 ${
        isDark
          ? "border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-lg"
          : "border-gray-100 bg-white hover:border-[#404293]/20 hover:shadow-xl hover:shadow-[#404293]/8"
      }`}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
      <div className="p-5">
        <div className="mb-2 flex items-start gap-2.5">
          <div className="mt-1.5">
            <StatusDot task={task} />
          </div>
          <h3
            className={`line-clamp-2 flex-1 text-base font-black leading-snug ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isOpen ? "bg-emerald-500/10 text-emerald-500" : "bg-gray-500/10 text-gray-500"
            }`}
          >
            {t(isOpen ? "academic.statusOpen" : "academic.statusClosed")}
          </span>
        </div>
        {task.description && (
          <p className={`mb-4 line-clamp-2 text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-400"}`}>
            {task.description}
          </p>
        )}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-[#33529F]/10 px-2.5 py-1 text-[11px] font-bold text-[#33529F] dark:text-[#7d94d1]">
            <BookMarked className="h-3 w-3" /> {task.subjectId?.name ?? "—"}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-[#2376BB]/10 px-2.5 py-1 text-[11px] font-bold text-[#2376BB]">
            <FileText className="h-3 w-3" /> {task.lectureId?.title ?? "—"}
          </span>
        </div>
        <div className={`mb-4 space-y-1 text-[11px] font-semibold ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />{" "}
            {t("academic.opensAtLabel", {
              date: formatDateTimeOrDash(task.opensAt),
            })}
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />{" "}
            {t("academic.closesAtLabel", {
              date: formatDateTimeOrDash(task.closesAt),
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenSubmission(task)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-2.5 text-xs font-bold text-white shadow-md shadow-[#404293]/20 transition-all hover:-translate-y-0.5"
        >
          <UploadCloud size={13} /> {t("academic.submitSolution")}
        </button>
      </div>
    </motion.div>
  );
}

export default function StudentAcademicTaskCard(props: StudentAcademicTaskCardProps) {
  return (
    <>
      <div className="sm:hidden">
        <MobileTaskCard {...props} />
      </div>
      <div className="hidden sm:block">
        <DesktopTaskCard {...props} />
      </div>
    </>
  );
}
