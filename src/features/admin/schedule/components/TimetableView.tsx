import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Download,
  LayoutGrid,
  Send,
  ShieldCheck,
  Table2,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { AdminKey } from "../../../../shared/i18n/types";
import type {
  GeneratedSchedule,
  SubjectGroupIndex,
  SubjectYearIndex,
  TimetableViewMode,
} from "../types";
import {
  countClashes,
  downloadTextFile,
  groupTimetableByDay,
  listTimeslots,
  rowsToCsv,
} from "../utils/schedule";
import { useScheduleDates } from "../hooks/useScheduleDates";
import TimetableDayCards from "./TimetableDayCards";
import TimetableGrid from "./TimetableGrid";
import {
  dividerClass,
  emptyBoxClass,
  headingClass,
  mutedClass,
  panelClass,
} from "../../../../shared/utils/theme";

const VIEW_OPTIONS: {
  mode: TimetableViewMode;
  labelKey: AdminKey;
  icon: typeof Table2;
}[] = [
  { mode: "grid", labelKey: "schedule.timetable.viewGrid", icon: Table2 },
  { mode: "cards", labelKey: "schedule.timetable.viewCards", icon: LayoutGrid },
];

interface TimetableViewProps {
  schedule: GeneratedSchedule;
  isPublishing: boolean;
  publishError?: string;
  onPublish: () => void;
  isDark: boolean;
  /** subjectId → عضويته في غروب اختياري – لتمييز التداخل المتوقع عن التصادم الفعلي */
  subjectGroupIndex?: SubjectGroupIndex;
  /** subjectId → اسم السنة الدراسية التابعة لها المادة، إن أمكن معرفتها */
  subjectYearIndex?: SubjectYearIndex;
}

export default function TimetableView({
  schedule,
  isPublishing,
  publishError,
  onPublish,
  isDark,
  subjectGroupIndex,
  subjectYearIndex,
}: TimetableViewProps) {
  const { t } = useTranslation("admin");
  const { formatDate, dayOfWeekLabel } = useScheduleDates();
  const [viewMode, setViewMode] = useState<TimetableViewMode>("grid");

  const days = useMemo(
    () => groupTimetableByDay(schedule.timetable ?? []),
    [schedule.timetable],
  );
  const timeslots = useMemo(
    () => listTimeslots(schedule.timetable ?? []),
    [schedule.timetable],
  );

  const clashes = countClashes(days, subjectGroupIndex);
  const isPublished = schedule.status === "published";
  const hardScore = schedule.score?.hardScore ?? 0;
  const softScore = schedule.score?.softScore ?? 0;
  const hasHardViolations = hardScore < 0;

  const stats = [
    {
      label: t("schedule.timetable.academicYearLabel"),
      value: schedule.academicYear,
      color: "#8B5CF6",
    },
    {
      label: t("schedule.timetable.scheduledSubjects"),
      value: schedule.timetable?.length ?? 0,
      color: "#404293",
    },
    {
      label: t("schedule.timetable.examDays"),
      value: days.length,
      color: "#2376BB",
    },
    {
      label: t("schedule.timetable.clashingSlots"),
      value: clashes,
      color: clashes ? "#EF4444" : "#059669",
    },
  ];

  /** يصدّر الإحصائيات الكاملة وجدول الفحص كملف CSV (يُفتح مباشرة في Excel) */
  const handleExportCsv = () => {
    const rows: (string | number)[][] = [
      [t("schedule.timetable.exportSummaryTitle")],
      [t("schedule.timetable.academicYearLabel"), schedule.academicYear],
      [
        t("schedule.timetable.statusLabel"),
        t(isPublished ? "schedule.timetable.published" : "schedule.timetable.draft"),
      ],
      [t("schedule.timetable.hardScoreLabel"), hardScore],
      [t("schedule.timetable.softScoreLabel"), softScore],
      [t("schedule.timetable.scheduledSubjects"), schedule.timetable?.length ?? 0],
      [t("schedule.timetable.examDays"), days.length],
      [t("schedule.timetable.clashingSlots"), clashes],
      [t("schedule.timetable.updatedAtLabel"), formatDate(schedule.updatedAt)],
      [],
      [t("schedule.timetable.exportTimetableTitle")],
      [
        t("schedule.timetable.colDay"),
        t("schedule.timetable.colWeekday"),
        t("schedule.timetable.colTimeslot"),
        t("schedule.timetable.colSubject"),
        t("schedule.timetable.colYear"),
      ],
    ];

    days.forEach((day) => {
      day.slots.forEach((slot) => {
        slot.entries.forEach((entry) => {
          rows.push([
            day.day,
            dayOfWeekLabel(day.day),
            slot.timeslot,
            entry.subjectName,
            subjectYearIndex?.get(entry.subjectId) ?? "",
          ]);
        });
      });
    });

    downloadTextFile(`exam-schedule-${schedule.academicYear}.csv`, rowsToCsv(rows));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-5 p-6 ${panelClass(isDark)}`}
    >
      {/* ── الترويسة + النشر ─────────────────── */}
      <div className={`flex flex-wrap items-start justify-between gap-4 border-b pb-4 ${dividerClass(isDark)}`}>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-md ${
              isPublished
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/25"
                : "bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-[#404293]/25"
            }`}
          >
            <CalendarCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-black ${headingClass(isDark)}`}>
                {t("schedule.timetable.heading")}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isPublished
                    ? isDark
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
                    : isDark
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-amber-50 text-amber-600"
                }`}
              >
                {t(
                  isPublished
                    ? "schedule.timetable.published"
                    : "schedule.timetable.draft",
                )}
              </span>
            </div>
            <p className={`mt-0.5 text-xs font-semibold ${mutedClass(isDark)}`}>
              {t("schedule.timetable.yearAndUpdated", {
                year: schedule.academicYear,
                date: formatDate(schedule.updatedAt),
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* مُبدّل طريقة العرض */}
          <div
            className={`flex items-center gap-1 rounded-xl border p-1 ${
              isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
            }`}
          >
            {VIEW_OPTIONS.map((option) => {
              const isActive = viewMode === option.mode;
              return (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => setViewMode(option.mode)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                    isActive
                      ? isDark
                        ? "bg-white/10 text-[#7fb5e4] shadow-sm"
                        : "bg-white text-[#404293] shadow-sm"
                      : isDark
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <option.icon size={13} />
                  {t(option.labelKey)}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-colors ${
              isDark
                ? "border-white/10 text-gray-300 hover:border-[#2376BB]/40 hover:text-[#7fb5e4]"
                : "border-gray-200 text-gray-600 hover:border-[#404293]/30 hover:text-[#404293]"
            }`}
          >
            <Download size={13} />
            {t("schedule.timetable.exportCsv")}
          </button>

          <button
            type="button"
            onClick={onPublish}
            disabled={isPublishing}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60 ${
              isPublished
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25"
                : "bg-gradient-to-r from-[#404293] to-[#2376BB] shadow-[#404293]/25"
            }`}
          >
            <Send size={13} />
            {isPublishing
              ? t("schedule.timetable.publishing")
              : isPublished
                ? t("schedule.timetable.republish")
                : t("schedule.timetable.publish")}
          </button>
        </div>
      </div>

      {publishError && (
        <p
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${
            isDark
              ? "border-red-500/25 bg-red-500/10 text-red-400"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          <AlertCircle size={13} className="shrink-0" />
          {publishError}
        </p>
      )}

      {/* ── النتيجة والإحصاءات ───────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 ${
            hasHardViolations
              ? isDark
                ? "border-red-500/25 bg-red-500/10"
                : "border-red-200 bg-red-50"
              : isDark
                ? "border-emerald-500/25 bg-emerald-500/10"
                : "border-emerald-200 bg-emerald-50"
          }`}
        >
          {hasHardViolations ? (
            <AlertTriangle className={`h-4 w-4 shrink-0 ${isDark ? "text-red-400" : "text-red-500"}`} />
          ) : (
            <ShieldCheck className={`h-4 w-4 shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} />
          )}
          <div className="min-w-0 flex-1">
            <p
              className={`text-[11px] font-bold ${
                hasHardViolations
                  ? isDark
                    ? "text-red-400"
                    : "text-red-500"
                  : isDark
                    ? "text-emerald-400"
                    : "text-emerald-600"
              }`}
            >
              {t(
                hasHardViolations
                  ? "schedule.timetable.hardViolated"
                  : "schedule.timetable.hardSatisfied",
              )}
            </p>
            <div
              className={`mt-1 flex items-center gap-3 ${
                hasHardViolations
                  ? isDark
                    ? "text-red-300"
                    : "text-red-700"
                  : isDark
                    ? "text-emerald-300"
                    : "text-emerald-700"
              }`}
            >
              <div className="flex items-baseline gap-1.5" dir="ltr">
                <span className="text-base font-black tabular-nums">{hardScore}</span>
                <span className="text-[10px] font-bold opacity-70">
                  {t("schedule.timetable.hardScoreLabel")}
                </span>
              </div>
              <div
                className={`h-4 w-px shrink-0 ${
                  hasHardViolations
                    ? isDark
                      ? "bg-red-400/30"
                      : "bg-red-500/30"
                    : isDark
                      ? "bg-emerald-400/30"
                      : "bg-emerald-600/30"
                }`}
              />
              <div className="flex items-baseline gap-1.5" dir="ltr">
                <span className="text-base font-black tabular-nums">{softScore}</span>
                <span className="text-[10px] font-bold opacity-70">
                  {t("schedule.timetable.softScoreLabel")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 ${
                isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50/60"
              }`}
            >
              <div
                className="h-7 w-1.5 shrink-0 rounded-full"
                style={{
                  background: `linear-gradient(180deg,${stat.color},${stat.color}55)`,
                }}
              />
              <div>
                <p className={`text-base font-black leading-none ${headingClass(isDark)}`} dir="ltr">
                  {stat.value}
                </p>
                <p className={`mt-0.5 text-[10px] font-bold ${mutedClass(isDark)}`}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {clashes > 0 && (
        <p
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${
            isDark
              ? "border-amber-500/25 bg-amber-500/10 text-amber-400"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <AlertTriangle size={13} className="shrink-0" />
          {t("schedule.timetable.clashesNotice", { count: clashes })}
        </p>
      )}

      {/* ── الجدول ───────────────────────────── */}
      {days.length === 0 ? (
        <p className={`py-10 text-center text-xs font-bold ${mutedClass(isDark)} ${emptyBoxClass(isDark)}`}>
          {t("schedule.timetable.empty")}
        </p>
      ) : viewMode === "grid" ? (
        <TimetableGrid
          days={days}
          timeslots={timeslots}
          isDark={isDark}
          subjectGroupIndex={subjectGroupIndex}
          subjectYearIndex={subjectYearIndex}
        />
      ) : (
        <TimetableDayCards
          days={days}
          isDark={isDark}
          subjectGroupIndex={subjectGroupIndex}
          subjectYearIndex={subjectYearIndex}
        />
      )}

      {isPublished && (
        <p className={`flex items-center gap-2 text-[11px] font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
          <CheckCircle2 size={12} />
          {t("schedule.timetable.publishedNotice")}
        </p>
      )}
    </motion.div>
  );
}
