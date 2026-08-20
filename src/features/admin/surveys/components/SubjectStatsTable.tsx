import {
  BookMarked,
  CalendarDays,
  Clock,
  Gauge,
  Repeat2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { SubjectStats, YearStats } from "../types";
import { MAX_DIFFICULTY, responseShare, roundTo } from "../utils/survey";
import {
  difficultyLevel,
  dividerClass,
  emptyBoxClass,
  faintClass,
  headingClass,
  mutedClass,
  panelClass,
  softBoxClass,
} from "../utils/surveyTheme";
import SurveyStatusBadge from "./SurveyStatusBadge";

interface SubjectStatsTableProps {
  block: YearStats;
  isDark: boolean;
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  isDark,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  hint?: string;
  isDark: boolean;
}) {
  return (
    <div className={`${softBoxClass(isDark)} px-4 py-3`}>
      <div
        className={`mb-1 flex items-center gap-1.5 text-[10px] font-bold ${faintClass(isDark)}`}
      >
        <Icon size={12} /> {label}
      </div>
      <p className={`text-lg font-black ${headingClass(isDark)}`}>{value}</p>
      {hint && (
        <p className={`mt-0.5 truncate text-[10px] font-semibold ${faintClass(isDark)}`}>
          {hint}
        </p>
      )}
    </div>
  );
}

function SubjectRow({
  row,
  total,
  isDark,
  index,
}: {
  row: SubjectStats;
  total: number;
  isDark: boolean;
  index: number;
}) {
  const { t } = useTranslation("admin");
  const share = responseShare(row, total);
  const level = difficultyLevel(row.avgDifficultyRating);
  const LevelIcon = level.icon;
  const difficultyPercent = Math.round(
    (row.avgDifficultyRating / MAX_DIFFICULTY) * 100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.25) }}
      className={`grid grid-cols-1 gap-3 rounded-2xl border p-4 transition-all sm:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] sm:items-center ${
        isDark
          ? "border-white/10 bg-white/5 hover:border-white/20"
          : "border-gray-200 bg-white hover:border-[#404293]/25 hover:shadow-sm"
      }`}
    >
      {/* اسم المادة + نسبة المشاركة */}
      <div className="min-w-0">
        <p className={`truncate text-sm font-black ${headingClass(isDark)}`}>
          {row.subjectName}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <div
            className={`h-1.5 flex-1 overflow-hidden rounded-full ${
              isDark ? "bg-white/10" : "bg-gray-100"
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${share}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB]"
            />
          </div>
          <span className={`shrink-0 text-[10px] font-bold ${faintClass(isDark)}`}>
            {row.totalResponsesForSubject}/{total || "—"}
          </span>
        </div>
      </div>

      {/* الحملة */}
      <div className="flex items-center gap-1.5">
        <Repeat2 size={13} className="shrink-0 text-amber-500" />
        <span className={`text-[11px] font-bold ${faintClass(isDark)}`}>
          {t("surveys.stats.carrying")}
        </span>
        <span
          className={`ms-auto rounded-full px-2 py-0.5 text-[11px] font-black ${
            row.carryingCount > 0
              ? isDark
                ? "bg-amber-500/15 text-amber-400"
                : "bg-amber-50 text-amber-600"
              : isDark
                ? "bg-white/10 text-gray-500"
                : "bg-gray-100 text-gray-400"
          }`}
        >
          {row.carryingCount}
        </span>
      </div>

      {/* أيام الراحة المفضّلة */}
      <div className="flex items-center gap-1.5">
        <Clock size={13} className="shrink-0 text-[#2376BB]" />
        <span className={`text-[11px] font-bold ${faintClass(isDark)}`}>
          {t("surveys.stats.rest")}
        </span>
        <span
          className={`ms-auto rounded-full px-2 py-0.5 text-[11px] font-black ${
            isDark
              ? "bg-[#2376BB]/20 text-[#7fb5e4]"
              : "bg-[#2376BB]/10 text-[#2376BB]"
          }`}
        >
          {t("surveys.stats.daysValue", {
            count: roundTo(row.avgPreferredDaysBefore),
          })}
        </span>
      </div>

      {/* الصعوبة */}
      <div>
        <div className="mb-1 flex items-center gap-1.5">
          <LevelIcon size={13} className="shrink-0 opacity-70" />
          <span className={`text-[11px] font-bold ${faintClass(isDark)}`}>
            {t(level.labelKey)}
          </span>
          <span
            className={`ms-auto text-[11px] font-black ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {roundTo(row.avgDifficultyRating)}/{MAX_DIFFICULTY}
          </span>
        </div>
        <div
          className={`h-1.5 overflow-hidden rounded-full ${
            isDark ? "bg-white/10" : "bg-gray-100"
          }`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${difficultyPercent}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`h-full rounded-full ${level.bar}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function SubjectStatsTable({
  block,
  isDark,
}: SubjectStatsTableProps) {
  const { t } = useTranslation("admin");
  const total = block.totalStudentsResponded;

  /** المواد الأساسية للسنة: أجاب عليها أكثر من نصف المشاركين */
  const coreCount = block.subjects.filter(
    (row) => total > 0 && row.totalResponsesForSubject >= total / 2,
  ).length;

  const hardest = block.subjects.reduce<SubjectStats | null>(
    (top, row) =>
      !top || row.avgDifficultyRating > top.avgDifficultyRating ? row : top,
    null,
  );

  return (
    <div className={`${panelClass(isDark)} overflow-hidden`}>
      {/* ── ترويسة السنة ─────────────────────── */}
      <div
        className={`flex flex-wrap items-start justify-between gap-3 border-b px-6 py-5 ${dividerClass(isDark)}`}
      >
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h2 className={`text-sm font-black ${headingClass(isDark)}`}>
              {block.yearName ?? "—"}
            </h2>
            {block.formStatus && (
              <SurveyStatusBadge status={block.formStatus} isDark={isDark} />
            )}
          </div>
          <p
            className={`flex items-center gap-1.5 text-xs font-medium ${mutedClass(isDark)}`}
          >
            <CalendarDays size={12} /> {block.academicYear}
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* ── مؤشرات سريعة ───────────────────── */}
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            icon={Users}
            label={t("surveys.stats.studentsAnswered")}
            value={total}
            isDark={isDark}
          />
          <StatTile
            icon={BookMarked}
            label={t("surveys.stats.subjectsAppeared")}
            value={block.subjects.length}
            isDark={isDark}
          />
          <StatTile
            icon={BookMarked}
            label={t("surveys.stats.coreSubjects")}
            value={coreCount}
            hint={t("surveys.stats.coreSubjectsHint")}
            isDark={isDark}
          />
          <StatTile
            icon={Gauge}
            label={t("surveys.stats.hardest")}
            value={hardest ? roundTo(hardest.avgDifficultyRating) : "—"}
            hint={hardest?.subjectName}
            isDark={isDark}
          />
        </div>

        {/* ── الصفوف ─────────────────────────── */}
        {block.subjects.length === 0 ? (
          <div
            className={`${emptyBoxClass(isDark)} flex flex-col items-center justify-center py-12 text-center`}
          >
            <BookMarked className={`mb-3 h-6 w-6 ${faintClass(isDark)}`} />
            <p className={`text-sm font-bold ${mutedClass(isDark)}`}>
              {t("surveys.stats.noMatchingSubjects")}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {block.subjects.map((row, index) => (
              <SubjectRow
                key={row.subjectId}
                row={row}
                total={total}
                isDark={isDark}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
