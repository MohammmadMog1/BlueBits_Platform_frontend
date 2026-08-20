import { Minus, Plus, Repeat2, X } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  MAX_DAYS_BEFORE,
  MIN_DAYS_BEFORE,
} from "../../../admin/surveys/utils/survey";
import {
  DIFFICULTY_SCALE,
  dividerClass,
  headingClass,
  mutedClass,
  softBoxClass,
} from "../../../admin/surveys/utils/surveyTheme";
import type { AnswerRowState } from "../hooks/useSurveyResponse";

interface SubjectAnswerCardProps {
  row: AnswerRowState;
  isDark: boolean;
  onRemove: () => void;
  onToggleCarrying: () => void;
  onDaysChange: (value: number) => void;
  onDifficultyChange: (value: number) => void;
}

/**
 * صف الإعدادات في لوحة اليمين: مستوى الصعوبة وأيام الراحة
 * للمادة التي ضمّنها الطالب في إجابته.
 */
export default function SubjectAnswerCard({
  row,
  isDark,
  onRemove,
  onToggleCarrying,
  onDaysChange,
  onDifficultyChange,
}: SubjectAnswerCardProps) {
  const { t } = useTranslation(["survey", "admin"]);
  const daysPercent =
    ((row.preferredDaysBefore - MIN_DAYS_BEFORE) /
      (MAX_DAYS_BEFORE - MIN_DAYS_BEFORE)) *
    100;

  const stepButtonClass = `flex h-8 w-8 items-center justify-center rounded-lg font-black transition-all disabled:opacity-30 ${
    isDark
      ? "bg-white/10 text-white hover:bg-white/20"
      : "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-100"
  }`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      className={`border-b px-5 py-5 last:border-b-0 ${dividerClass(isDark)}`}
    >
      {/* ── اسم المادة + إزالتها ─────────────── */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className={`text-sm font-black leading-snug ${headingClass(isDark)}`}>
            {row.subjectName}
          </h4>
          <button
            type="button"
            onClick={onToggleCarrying}
            className={`mt-2 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black transition-all ${
              row.isCarrying
                ? "border-transparent bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                : isDark
                  ? "border-white/10 bg-white/5 text-gray-500 hover:border-amber-500/40 hover:text-amber-400"
                  : "border-gray-200 bg-gray-50 text-gray-400 hover:border-amber-300 hover:text-amber-600"
            }`}
          >
            <Repeat2 className="h-3 w-3" />
            {t(
              row.isCarrying ? "answer.isCarrying" : "answer.markAsCarrying",
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label={t("answer.removeSubject")}
          className={`shrink-0 rounded-lg p-1.5 transition-all ${
            isDark
              ? "text-gray-500 hover:bg-white/10 hover:text-red-400"
              : "text-gray-400 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── مستوى الصعوبة ────────────────────── */}
      <div className="mb-4">
        <label className={`mb-2 block text-xs font-bold ${mutedClass(isDark)}`}>
          {t("answer.difficultyLabel")}
        </label>
        <div className="flex gap-1.5">
          {DIFFICULTY_SCALE.map((level) => {
            const isActive = row.difficultyRating === level.value;
            const LevelIcon = level.icon;
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => onDifficultyChange(level.value)}
                title={t(`admin:${level.labelKey}`)}
                aria-label={t(`admin:${level.labelKey}`)}
                aria-pressed={isActive}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl border-2 py-2 transition-all ${
                  isActive
                    ? `border-transparent ${level.active} shadow-md`
                    : isDark
                      ? "border-white/10 bg-white/5 text-gray-500 hover:border-white/25"
                      : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"
                }`}
              >
                <LevelIcon className="h-4 w-4" />
                <span className="text-[10px] font-black">{level.value}</span>
              </button>
            );
          })}
        </div>
        <div
          className={`mt-1.5 flex justify-between text-[10px] font-bold ${
            isDark ? "text-gray-600" : "text-gray-300"
          }`}
        >
          <span>{t("answer.easiest")}</span>
          <span>
            {t(
              `admin:${DIFFICULTY_SCALE[row.difficultyRating - 1]?.labelKey ?? "difficulty.3"}`,
            )}
          </span>
          <span>{t("answer.hardest")}</span>
        </div>
      </div>

      {/* ── أيام الراحة ──────────────────────── */}
      <div>
        <label className={`mb-2 block text-xs font-bold ${mutedClass(isDark)}`}>
          {t("answer.restDaysLabel")}
        </label>
        <div className={`flex items-center gap-3 p-3 ${softBoxClass(isDark)}`}>
          <button
            type="button"
            onClick={() => onDaysChange(row.preferredDaysBefore - 1)}
            disabled={row.preferredDaysBefore <= MIN_DAYS_BEFORE}
            aria-label={t("answer.decreaseDay")}
            className={stepButtonClass}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <div className="flex-1 text-center">
            <motion.span
              key={row.preferredDaysBefore}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`block text-xl font-black ${headingClass(isDark)}`}
            >
              {row.preferredDaysBefore}
            </motion.span>
            <span
              className={`text-[10px] font-semibold ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {t("answer.prepDays", { count: row.preferredDaysBefore })}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onDaysChange(row.preferredDaysBefore + 1)}
            disabled={row.preferredDaysBefore >= MAX_DAYS_BEFORE}
            aria-label={t("answer.increaseDay")}
            className={stepButtonClass}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div
          className={`mt-2 h-1.5 overflow-hidden rounded-full ${
            isDark ? "bg-white/10" : "bg-gray-200"
          }`}
        >
          <motion.div
            animate={{ width: `${daysPercent}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="h-full rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB]"
          />
        </div>
      </div>
    </motion.div>
  );
}
