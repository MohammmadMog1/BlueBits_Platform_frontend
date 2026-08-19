import { CalendarDays, CheckCircle2, Clock, Repeat2 } from "lucide-react";
import { motion } from "motion/react";
import type { SurveyResponse } from "../../../admin/surveys/types";
import {
  MAX_DAYS_BEFORE,
  MIN_DAYS_BEFORE,
  formatDateTime,
  getRefName,
} from "../../../admin/surveys/utils/survey";
import {
  difficultyLevel,
  dividerClass,
  faintClass,
  headingClass,
  mutedClass,
  panelClass,
  softBoxClass,
} from "../../../admin/surveys/utils/surveyTheme";

interface SurveyResponseSummaryProps {
  response: SurveyResponse;
  title: string;
  isDark: boolean;
  /** نص توضيحي أسفل العنوان */
  hint?: string;
}

/** عرض إجابة مُرسلة – للقراءة فقط (لا يسمح الباك بالتعديل) */
export default function SurveyResponseSummary({
  response,
  title,
  isDark,
  hint,
}: SurveyResponseSummaryProps) {
  const yearName = getRefName(response.yearId, "—");
  const semesterName = getRefName(response.semesterId, "—");

  const chipClass = (tone: "brand" | "blue") =>
    tone === "brand"
      ? isDark
        ? "bg-[#404293]/25 text-[#a5a7e0]"
        : "bg-[#404293]/10 text-[#404293]"
      : isDark
        ? "bg-[#2376BB]/20 text-[#7fb5e4]"
        : "bg-[#2376BB]/10 text-[#2376BB]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${panelClass(isDark)} overflow-hidden`}
    >
      {/* ── الترويسة ─────────────────────────── */}
      <div
        className={`flex flex-wrap items-start justify-between gap-3 border-b px-6 py-5 ${dividerClass(isDark)}`}
      >
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                isDark ? "bg-emerald-500/15" : "bg-emerald-50"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </span>
            <h2 className={`text-sm font-black ${headingClass(isDark)}`}>{title}</h2>
          </div>
          {hint && (
            <p className={`text-xs font-medium ${mutedClass(isDark)}`}>{hint}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-black ${chipClass("brand")}`}
          >
            {yearName}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-black ${chipClass("blue")}`}
          >
            {semesterName}
          </span>
        </div>
      </div>

      <div className="p-6">
        <p
          className={`mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold ${faintClass(isDark)}`}
        >
          <CalendarDays className="h-3 w-3" />
          أُرسلت في {formatDateTime(response.submittedAt)}
          <span
            className={`rounded-full px-2 py-0.5 ${
              isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-500"
            }`}
          >
            {response.subjectResponses.length} مادة
          </span>
        </p>

        {/* ── المواد ─────────────────────────── */}
        <div className="space-y-2">
          {response.subjectResponses.map((entry, index) => {
            const level = difficultyLevel(entry.difficultyRating);
            const LevelIcon = level.icon;
            const daysPercent =
              ((Math.min(entry.preferredDaysBefore, MAX_DAYS_BEFORE) -
                MIN_DAYS_BEFORE) /
                (MAX_DAYS_BEFORE - MIN_DAYS_BEFORE)) *
              100;

            return (
              <div
                key={`${getRefName(entry.subjectId, String(index))}-${index}`}
                className={`px-4 py-3 ${softBoxClass(isDark)}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`min-w-0 flex-1 truncate text-sm font-black ${
                      isDark ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {getRefName(entry.subjectId, "مادة غير معروفة")}
                  </span>

                  {entry.isCarrying && (
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${
                        isDark
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <Repeat2 className="h-3 w-3" /> حملة
                    </span>
                  )}

                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${chipClass("blue")}`}
                  >
                    <Clock className="h-3 w-3" /> {entry.preferredDaysBefore} يوم
                  </span>

                  <span
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${level.chip(isDark)}`}
                  >
                    <LevelIcon className="h-3 w-3" /> {level.label}
                  </span>
                </div>

                <div
                  className={`mt-2.5 h-1 overflow-hidden rounded-full ${
                    isDark ? "bg-white/10" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB]"
                    style={{ width: `${Math.max(daysPercent, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
