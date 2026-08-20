import {
  CalendarDays,
  GraduationCap,
  Layers,
  ListChecks,
  Lock,
  LockOpen,
  PlayCircle,
  User as UserIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import type { SurveyForm } from "../types";
import { getRefName } from "../utils/survey";
import {
  dividerClass,
  faintClass,
  headingClass,
  panelClass,
  softBoxClass,
} from "../utils/surveyTheme";
import SurveyStatusBadge from "./SurveyStatusBadge";

interface SurveyFormCardProps {
  form: SurveyForm;
  yearName: string;
  semesterName: string;
  isDark: boolean;
  isBusy: boolean;
  isOpened: boolean;
  onOpen: () => void;
  onClose: () => void;
  onViewResponses: () => void;
}

export default function SurveyFormCard({
  form,
  yearName,
  semesterName,
  isDark,
  isBusy,
  isOpened,
  onOpen,
  onClose,
  onViewResponses,
}: SurveyFormCardProps) {
  const { t } = useTranslation("admin");
  const { formatDateTimeOrDash } = useFormatters();
  const creatorName = getRefName(
    form.createdBy,
    t("surveys.card.systemCreator"),
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`${panelClass(isDark)} flex flex-col gap-4 p-5 transition-all ${
        isOpened
          ? "ring-2 ring-[#2376BB]/50"
          : "hover:-translate-y-0.5 hover:shadow-2xl"
      }`}
    >
      {/* ── الترويسة ─────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                isDark ? "bg-[#2376BB]/15" : "bg-[#404293]/10"
              }`}
            >
              <GraduationCap
                className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}
              />
            </span>
            <h3 className={`truncate text-sm font-black ${headingClass(isDark)}`}>
              {yearName}
            </h3>
          </div>
          <div
            className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold ${faintClass(isDark)}`}
          >
            <span className="flex items-center gap-1">
              <Layers size={12} /> {semesterName}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={12} /> {form.academicYear}
            </span>
          </div>
        </div>
        <SurveyStatusBadge status={form.status} isDark={isDark} />
      </div>

      {/* ── التوقيتات ────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`${softBoxClass(isDark)} px-3 py-2`}>
          <p
            className={`flex items-center gap-1 text-[10px] font-bold ${faintClass(isDark)}`}
          >
            <LockOpen size={10} /> {t("surveys.card.openedAt")}
          </p>
          <p
            className={`mt-0.5 truncate text-[11px] font-black ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {formatDateTimeOrDash(form.openedAt)}
          </p>
        </div>
        <div className={`${softBoxClass(isDark)} px-3 py-2`}>
          <p
            className={`flex items-center gap-1 text-[10px] font-bold ${faintClass(isDark)}`}
          >
            <Lock size={10} /> {t("surveys.card.closedAt")}
          </p>
          <p
            className={`mt-0.5 truncate text-[11px] font-black ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {formatDateTimeOrDash(form.closedAt)}
          </p>
        </div>
      </div>

      <p
        className={`flex items-center gap-1.5 text-[11px] font-semibold ${faintClass(isDark)}`}
      >
        <UserIcon size={12} />{" "}
        {t("surveys.card.createdBy", { name: creatorName })}
      </p>

      {/* ── الإجراءات ────────────────────────── */}
      <div className={`flex flex-wrap gap-2 border-t pt-3 ${dividerClass(isDark)}`}>
        {form.status === "draft" && (
          <button
            type="button"
            onClick={onOpen}
            disabled={isBusy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#404293]/25 transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
          >
            <PlayCircle size={14} /> {t("surveys.card.openForStudents")}
          </button>
        )}

        {form.status === "open" && (
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-xs font-bold transition-colors disabled:opacity-40 ${
              isDark
                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "border-red-200 text-red-600 hover:bg-red-50"
            }`}
          >
            <Lock size={14} /> {t("surveys.card.closeFinal")}
          </button>
        )}

        <button
          type="button"
          onClick={onViewResponses}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors ${
            isOpened
              ? "border-transparent bg-gradient-to-r from-[#404293] to-[#2376BB] text-white"
              : isDark
                ? "border-white/10 bg-white/5 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#7fb5e4]"
                : "border-gray-200 text-gray-500 hover:border-[#404293]/30 hover:text-[#404293]"
          }`}
        >
          <ListChecks size={14} />{" "}
          {t(
            isOpened
              ? "surveys.card.responsesShown"
              : "surveys.card.viewResponses",
          )}
        </button>
      </div>
    </motion.div>
  );
}
