import {
  AlertCircle,
  BookMarked,
  CalendarDays,
  CalendarOff,
  CalendarRange,
  CheckCircle2,
  Clock,
  Pencil,
  Pin,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { Subject } from "../../subjects/types";
import type { FixedSubjectConfig, ScheduleConfig, SubjectConfig } from "../types";
import {
  calcCapacity,
  getRefId,
  toDateInputValue,
} from "../utils/schedule";
import { useScheduleDates } from "../hooks/useScheduleDates";
import {
  brandGradient,
  dividerClass,
  emptyBoxClass,
  headingClass,
  mutedClass,
  panelClass,
  softBoxClass,
} from "../../../../shared/utils/theme";

interface ScheduleConfigSummaryProps {
  config: ScheduleConfig;
  semesterLabel: string;
  subjects: Subject[];
  onEdit: () => void;
  onDelete: () => void;
  isDark: boolean;
}

/**
 * اسم المادة من الإعداد. الحالات التي لا اسم فيها تُرجَع كمفتاح ترجمة
 * لأن الدالة نقيّة ولا تعرف اللغة الحالية.
 */
const subjectName = (
  item: SubjectConfig | FixedSubjectConfig,
  subjects: Subject[],
): { name: string } | { key: "deleted" } | { key: "unknown"; id: string } => {
  if (item.subjectId && typeof item.subjectId === "object") {
    return { name: item.subjectId.name };
  }
  const id = getRefId(item.subjectId);
  if (!id) return { key: "deleted" };
  const found = subjects.find((subject) => subject._id === id)?.name;
  return found ? { name: found } : { key: "unknown", id };
};

export default function ScheduleConfigSummary({
  config,
  semesterLabel,
  subjects,
  onEdit,
  onDelete,
  isDark,
}: ScheduleConfigSummaryProps) {
  const { t } = useTranslation("admin");
  const { dayOfWeekLabel, formatDate, weekdayNames } = useScheduleDates();
  const excludedDates = (config.excludedDates ?? []).map(toDateInputValue);
  const capacity = calcCapacity(
    config.startDate,
    config.endDate,
    config.excludedDaysOfWeek ?? [],
    excludedDates,
    config.timeslotsPerDay,
  );
  const subjectsConfig = config.subjectsConfig ?? [];
  const fixedSubjects = config.fixedSubjects ?? [];
  const isOverCapacity =
    capacity.totalSlots > 0 && subjectsConfig.length > capacity.totalSlots;

  const stats = [
    { label: t("schedule.capacity.examDays"), value: capacity.examDays, color: "#404293" },
    { label: t("schedule.capacity.excludedDays"), value: capacity.excludedDays, color: "#F59E0B" },
    { label: t("schedule.capacity.totalSlots"), value: capacity.totalSlots, color: "#2376BB" },
    { label: t("schedule.capacity.configuredSubjects"), value: subjectsConfig.length, color: "#059669" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-5 p-6 ${panelClass(isDark)}`}
    >
      <div className={`flex flex-wrap items-start justify-between gap-4 border-b pb-4 ${dividerClass(isDark)}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/25">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-black ${headingClass(isDark)}`}>
                {t("schedule.summary.configured")}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {config.academicYear}
              </span>
            </div>
            <p className={`mt-0.5 text-xs font-semibold ${mutedClass(isDark)}`}>
              {t("schedule.summary.semesterAndUpdated", {
                semester: semesterLabel,
                date: formatDate(config.updatedAt),
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs ${brandGradient} rounded-xl font-bold text-white shadow-md shadow-[#404293]/25 transition-all hover:-translate-y-0.5`}
          >
            <Pencil size={13} /> {t("schedule.summary.edit")}
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={t("schedule.summary.deleteConfig")}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
              isDark
                ? "border-white/10 text-gray-400 hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-400"
                : "border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className={`flex items-center gap-3 px-4 py-3.5 ${softBoxClass(isDark)}`}>
          <CalendarRange className={`h-4 w-4 shrink-0 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
          <div>
            <p className={`text-[11px] font-bold ${mutedClass(isDark)}`}>
              {t("schedule.summary.examPeriod")}
            </p>
            <p className={`text-sm font-black ${headingClass(isDark)}`}>
              {formatDate(config.startDate)} ← {formatDate(config.endDate)}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-3 px-4 py-3.5 ${softBoxClass(isDark)}`}>
          <Clock className={`h-4 w-4 shrink-0 ${isDark ? "text-[#7fb5e4]" : "text-[#2376BB]"}`} />
          <div>
            <p className={`text-[11px] font-bold ${mutedClass(isDark)}`}>
              {t("schedule.summary.dailySlots")}
            </p>
            <p className={`text-sm font-black ${headingClass(isDark)}`}>
              {t("schedule.summary.slotsPerDay", {
                count: config.timeslotsPerDay,
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 shadow-sm ${
              isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
            }`}
          >
            <div
              className="h-7 w-1.5 shrink-0 rounded-full"
              style={{
                background: `linear-gradient(180deg,${stat.color},${stat.color}55)`,
              }}
            />
            <div>
              <p className={`text-base font-black leading-none ${headingClass(isDark)}`}>
                {stat.value}
              </p>
              <p className={`mt-0.5 text-[10px] font-bold ${mutedClass(isDark)}`}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isOverCapacity && (
        <p
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${
            isDark
              ? "border-amber-500/25 bg-amber-500/10 text-amber-400"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <AlertCircle size={13} className="shrink-0" />
          {t("schedule.summary.capacityWarning", {
            subjects: subjectsConfig.length,
            slots: capacity.totalSlots,
          })}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className={`p-4 ${softBoxClass(isDark)}`}>
          <div className="mb-2.5 flex items-center gap-2">
            <CalendarOff className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
            <h3 className={`text-xs font-black ${headingClass(isDark)}`}>
              {t("schedule.summary.excludedWeekdays")}
            </h3>
          </div>
          {config.excludedDaysOfWeek?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {config.excludedDaysOfWeek.map((day) => (
                <span
                  key={day}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                    isDark
                      ? "border-red-500/25 bg-red-500/10 text-red-400"
                      : "border-red-100 bg-red-50 text-red-600"
                  }`}
                >
                  {weekdayNames[day] ?? day}
                </span>
              ))}
            </div>
          ) : (
            <p className={`text-[11px] font-semibold ${mutedClass(isDark)}`}>
              {t("schedule.summary.noExcludedWeekdays")}
            </p>
          )}
        </div>

        <div className={`p-4 ${softBoxClass(isDark)}`}>
          <div className="mb-2.5 flex items-center gap-2">
            <CalendarDays className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
            <h3 className={`text-xs font-black ${headingClass(isDark)}`}>
              {t("schedule.summary.excludedDates")}
            </h3>
          </div>
          {excludedDates.length ? (
            <div className="flex flex-wrap gap-1.5">
              {excludedDates.map((day) => (
                <span
                  key={day}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                    isDark
                      ? "border-white/10 bg-white/5 text-gray-300"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {dayOfWeekLabel(day)} · {formatDate(day)}
                </span>
              ))}
            </div>
          ) : (
            <p className={`text-[11px] font-semibold ${mutedClass(isDark)}`}>
              {t("schedule.summary.noExcludedDates")}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <BookMarked className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#2376BB]"}`} />
          <h3 className={`text-xs font-black ${headingClass(isDark)}`}>
            {t("schedule.summary.subjectsConfig")}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#2376BB]/10 text-[#2376BB]"
            }`}
          >
            {subjectsConfig.length}
          </span>
        </div>

        {subjectsConfig.length === 0 ? (
          <p className={`py-6 text-center text-xs font-bold ${mutedClass(isDark)} ${emptyBoxClass(isDark)}`}>
            {t("schedule.summary.noSubjectsConfigured")}
          </p>
        ) : (
          <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-white/10" : "border-gray-100"}`}>
            <table className="w-full text-right text-xs">
              <thead
                className={`text-[11px] font-black ${
                  isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500"
                }`}
              >
                <tr>
                  <th className="px-4 py-2.5">{t("schedule.summary.colSubject")}</th>
                  <th className="px-4 py-2.5">{t("schedule.summary.colCarried")}</th>
                  <th className="px-4 py-2.5">{t("schedule.summary.colDuration")}</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark ? "divide-white/10 bg-white/[0.02]" : "divide-gray-100 bg-white"
                }`}
              >
                {subjectsConfig.map((item, index) => (
                  <tr key={`${getRefId(item.subjectId)}-${index}`}>
                    <td className={`px-4 py-2.5 font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                      {(() => {
                        const result = subjectName(item, subjects);
                        if ("name" in result) return result.name;
                        return result.key === "deleted"
                          ? t("schedule.summary.deletedSubject")
                          : t("schedule.summary.unknownSubject", {
                              id: result.id.slice(0, 8),
                            });
                      })()}
                    </td>
                    <td className={`px-4 py-2.5 font-semibold ${mutedClass(isDark)}`}>
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={12} className={isDark ? "text-gray-600" : "text-gray-300"} />
                        {item.carriedStudentsCount}
                      </span>
                    </td>
                    <td className={`px-4 py-2.5 font-semibold ${mutedClass(isDark)}`}>
                      {t("schedule.summary.minutes", {
                        count: item.examDurationOverride,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <Pin className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#2376BB]"}`} />
          <h3 className={`text-xs font-black ${headingClass(isDark)}`}>
            {t("schedule.fixedSubjects.title")}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#2376BB]/10 text-[#2376BB]"
            }`}
          >
            {fixedSubjects.length}
          </span>
        </div>

        {fixedSubjects.length === 0 ? (
          <p className={`py-6 text-center text-xs font-bold ${mutedClass(isDark)} ${emptyBoxClass(isDark)}`}>
            {t("schedule.fixedSubjects.noneConfigured")}
          </p>
        ) : (
          <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-white/10" : "border-gray-100"}`}>
            <table className="w-full text-right text-xs">
              <thead
                className={`text-[11px] font-black ${
                  isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500"
                }`}
              >
                <tr>
                  <th className="px-4 py-2.5">{t("schedule.summary.colSubject")}</th>
                  <th className="px-4 py-2.5">{t("schedule.fixedSubjects.colDate")}</th>
                  <th className="px-4 py-2.5">{t("schedule.fixedSubjects.colTimeslot")}</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark ? "divide-white/10 bg-white/[0.02]" : "divide-gray-100 bg-white"
                }`}
              >
                {fixedSubjects.map((item, index) => (
                  <tr key={`${getRefId(item.subjectId)}-${index}`}>
                    <td className={`px-4 py-2.5 font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                      {(() => {
                        const result = subjectName(item, subjects);
                        if ("name" in result) return result.name;
                        return result.key === "deleted"
                          ? t("schedule.summary.deletedSubject")
                          : t("schedule.summary.unknownSubject", {
                              id: result.id.slice(0, 8),
                            });
                      })()}
                    </td>
                    <td className={`px-4 py-2.5 font-semibold ${mutedClass(isDark)}`}>
                      {formatDate(item.examDate)}
                    </td>
                    <td className={`px-4 py-2.5 font-semibold ${mutedClass(isDark)}`}>
                      {t("schedule.timetable.slotLabel", { number: item.timeslot })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
