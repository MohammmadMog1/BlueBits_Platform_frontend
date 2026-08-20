import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  LayoutGrid,
  Send,
  ShieldCheck,
  Table2,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { AdminKey } from "../../../../shared/i18n/types";
import type { GeneratedSchedule, TimetableViewMode } from "../types";
import {
  countClashes,
  groupTimetableByDay,
  listTimeslots,
} from "../utils/schedule";
import { useScheduleDates } from "../hooks/useScheduleDates";
import TimetableDayCards from "./TimetableDayCards";
import TimetableGrid from "./TimetableGrid";

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
}

export default function TimetableView({
  schedule,
  isPublishing,
  publishError,
  onPublish,
}: TimetableViewProps) {
  const { t } = useTranslation("admin");
  const { formatDate } = useScheduleDates();
  const [viewMode, setViewMode] = useState<TimetableViewMode>("grid");

  const days = useMemo(
    () => groupTimetableByDay(schedule.timetable ?? []),
    [schedule.timetable],
  );
  const timeslots = useMemo(
    () => listTimeslots(schedule.timetable ?? []),
    [schedule.timetable],
  );

  const clashes = countClashes(days);
  const isPublished = schedule.status === "published";
  const hardScore = schedule.score?.hardScore ?? 0;
  const hasHardViolations = hardScore < 0;

  const stats = [
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      {/* ── الترويسة + النشر ─────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
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
              <h2 className="text-base font-black text-gray-900">
                {t("schedule.timetable.heading")}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isPublished
                    ? "bg-emerald-50 text-emerald-600"
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
            <p className="mt-0.5 text-xs font-semibold text-gray-400">
              {t("schedule.timetable.yearAndUpdated", {
                year: schedule.academicYear,
                date: formatDate(schedule.updatedAt),
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* مُبدّل طريقة العرض */}
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
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
                      ? "bg-white text-[#404293] shadow-sm"
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
        <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
          <AlertCircle size={13} className="shrink-0" />
          {publishError}
        </p>
      )}

      {/* ── النتيجة والإحصاءات ───────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 ${
            hasHardViolations
              ? "border-red-200 bg-red-50"
              : "border-emerald-200 bg-emerald-50"
          }`}
        >
          {hasHardViolations ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          ) : (
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <div>
            <p
              className={`text-[11px] font-bold ${
                hasHardViolations ? "text-red-500" : "text-emerald-600"
              }`}
            >
              {t(
                hasHardViolations
                  ? "schedule.timetable.hardViolated"
                  : "schedule.timetable.hardSatisfied",
              )}
            </p>
            <p
              className={`text-sm font-black ${
                hasHardViolations ? "text-red-700" : "text-emerald-700"
              }`}
              dir="ltr"
            >
              {schedule.score?.raw ??
                `${hardScore}hard/${schedule.score?.softScore ?? 0}soft`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50/60 px-3 py-2.5"
            >
              <div
                className="h-7 w-1.5 shrink-0 rounded-full"
                style={{
                  background: `linear-gradient(180deg,${stat.color},${stat.color}55)`,
                }}
              />
              <div>
                <p className="text-base font-black leading-none text-gray-900">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-gray-400">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {clashes > 0 && (
        <p className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
          <AlertTriangle size={13} className="shrink-0" />
          {t("schedule.timetable.clashesNotice", { count: clashes })}
        </p>
      )}

      {/* ── الجدول ───────────────────────────── */}
      {days.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-10 text-center text-xs font-bold text-gray-400">
          {t("schedule.timetable.empty")}
        </p>
      ) : viewMode === "grid" ? (
        <TimetableGrid days={days} timeslots={timeslots} />
      ) : (
        <TimetableDayCards days={days} />
      )}

      {isPublished && (
        <p className="flex items-center gap-2 text-[11px] font-bold text-emerald-600">
          <CheckCircle2 size={12} />
          {t("schedule.timetable.publishedNotice")}
        </p>
      )}
    </motion.div>
  );
}
