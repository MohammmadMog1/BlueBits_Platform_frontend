import { Check, Plus, Repeat2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { difficultyLevel } from "../../../admin/surveys/utils/surveyTheme";
import type { AnswerRowState } from "../hooks/useSurveyResponse";

interface SubjectPickerCardProps {
  row: AnswerRowState;
  index: number;
  isDark: boolean;
  onToggle: () => void;
}

/**
 * بطاقة المادة في لوحة الاختيار (يسار الشاشة).
 * النقر عليها يضمّن المادة أو يستبعدها؛ تفاصيل الإجابة تُضبط في لوحة اليمين.
 */
export default function SubjectPickerCard({
  row,
  index,
  isDark,
  onToggle,
}: SubjectPickerCardProps) {
  const { t } = useTranslation(["survey", "admin"]);
  const level = difficultyLevel(row.difficultyRating);
  const LevelIcon = level.icon;

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.2 }}
      onClick={onToggle}
      className={`group relative w-full rounded-2xl border-2 p-4 text-start transition-all duration-200 ${
        row.isSelected
          ? `border-[#2376BB] shadow-lg shadow-[#404293]/10 ${
              isDark ? "bg-[#2376BB]/12" : "bg-[#404293]/5"
            }`
          : isDark
            ? "border-white/8 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]"
            : "border-gray-200 bg-white shadow-sm hover:border-[#404293]/40 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-sm font-bold leading-snug ${
            row.isSelected
              ? isDark
                ? "text-[#7fb5e4]"
                : "text-[#404293]"
              : isDark
                ? "text-gray-200"
                : "text-gray-800"
          }`}
        >
          {row.subjectName}
        </span>

        <motion.span
          animate={{ scale: row.isSelected ? 1 : 0.85, opacity: row.isSelected ? 1 : 0.4 }}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
            row.isSelected
              ? "border-transparent bg-gradient-to-br from-[#404293] to-[#2376BB]"
              : isDark
                ? "border-gray-600"
                : "border-gray-300"
          }`}
        >
          {row.isSelected ? (
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          ) : (
            <Plus className="h-3.5 w-3.5 text-gray-400" />
          )}
        </motion.span>
      </div>

      {/* ── ملخّص الإعدادات الحالية ─────────── */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {row.isSelected ? (
          <>
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${level.chip(isDark)}`}
            >
              <LevelIcon className="h-3 w-3" /> {t(`admin:${level.labelKey}`)}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                isDark
                  ? "bg-[#2376BB]/15 text-[#7fb5e4]"
                  : "bg-[#2376BB]/10 text-[#2376BB]"
              }`}
            >
              {t("picker.restDays", { count: row.preferredDaysBefore })}
            </span>
            {row.isCarrying && (
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                  isDark
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <Repeat2 className="h-3 w-3" /> {t("summary.carrying")}
              </span>
            )}
          </>
        ) : (
          <span
            className={`text-[11px] font-semibold ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {t("picker.tapToInclude")}
          </span>
        )}
      </div>
    </motion.button>
  );
}
