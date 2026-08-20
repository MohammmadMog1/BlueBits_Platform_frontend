import {
  AlertCircle,
  BookMarked,
  CalendarDays,
  CalendarOff,
  CalendarRange,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { Subject } from "../../subjects/types";
import type { ScheduleConfig, SubjectConfig } from "../types";
import {
  calcCapacity,
  getRefId,
  toDateInputValue,
} from "../utils/schedule";
import { useScheduleDates } from "../hooks/useScheduleDates";

interface ScheduleConfigSummaryProps {
  config: ScheduleConfig;
  semesterLabel: string;
  subjects: Subject[];
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * اسم المادة من الإعداد. الحالات التي لا اسم فيها تُرجَع كمفتاح ترجمة
 * لأن الدالة نقيّة ولا تعرف اللغة الحالية.
 */
const subjectName = (
  item: SubjectConfig,
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
      className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/25">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-gray-900">
                {t("schedule.summary.configured")}
              </h2>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                {config.academicYear}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-gray-400">
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
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#404293]/25 transition-all hover:-translate-y-0.5"
          >
            <Pencil size={13} /> {t("schedule.summary.edit")}
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={t("schedule.summary.deleteConfig")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3.5">
          <CalendarRange className="h-4 w-4 shrink-0 text-[#404293]" />
          <div>
            <p className="text-[11px] font-bold text-gray-400">
              {t("schedule.summary.examPeriod")}
            </p>
            <p className="text-sm font-black text-gray-900">
              {formatDate(config.startDate)} ← {formatDate(config.endDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3.5">
          <Clock className="h-4 w-4 shrink-0 text-[#2376BB]" />
          <div>
            <p className="text-[11px] font-bold text-gray-400">
              {t("schedule.summary.dailySlots")}
            </p>
            <p className="text-sm font-black text-gray-900">
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
            className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-sm"
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

      {isOverCapacity && (
        <p className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
          <AlertCircle size={13} className="shrink-0" />
          {t("schedule.summary.capacityWarning", {
            subjects: subjectsConfig.length,
            slots: capacity.totalSlots,
          })}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
          <div className="mb-2.5 flex items-center gap-2">
            <CalendarOff className="h-4 w-4 text-[#404293]" />
            <h3 className="text-xs font-black text-gray-900">
              {t("schedule.summary.excludedWeekdays")}
            </h3>
          </div>
          {config.excludedDaysOfWeek?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {config.excludedDaysOfWeek.map((day) => (
                <span
                  key={day}
                  className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600"
                >
                  {weekdayNames[day] ?? day}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] font-semibold text-gray-400">
              {t("schedule.summary.noExcludedWeekdays")}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
          <div className="mb-2.5 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#404293]" />
            <h3 className="text-xs font-black text-gray-900">
              {t("schedule.summary.excludedDates")}
            </h3>
          </div>
          {excludedDates.length ? (
            <div className="flex flex-wrap gap-1.5">
              {excludedDates.map((day) => (
                <span
                  key={day}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-gray-600"
                >
                  {dayOfWeekLabel(day)} · {formatDate(day)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] font-semibold text-gray-400">
              {t("schedule.summary.noExcludedDates")}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-[#2376BB]" />
          <h3 className="text-xs font-black text-gray-900">
            {t("schedule.summary.subjectsConfig")}
          </h3>
          <span className="rounded-full bg-[#2376BB]/10 px-2 py-0.5 text-[10px] font-bold text-[#2376BB]">
            {subjectsConfig.length}
          </span>
        </div>

        {subjectsConfig.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-6 text-center text-xs font-bold text-gray-400">
            {t("schedule.summary.noSubjectsConfigured")}
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-[11px] font-black text-gray-500">
                <tr>
                  <th className="px-4 py-2.5">{t("schedule.summary.colSubject")}</th>
                  <th className="px-4 py-2.5">{t("schedule.summary.colCarried")}</th>
                  <th className="px-4 py-2.5">{t("schedule.summary.colDuration")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {subjectsConfig.map((item, index) => (
                  <tr key={`${getRefId(item.subjectId)}-${index}`}>
                    <td className="px-4 py-2.5 font-bold text-gray-800">
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
                    <td className="px-4 py-2.5 font-semibold text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={12} className="text-gray-300" />
                        {item.carriedStudentsCount}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-gray-500">
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
    </motion.div>
  );
}
