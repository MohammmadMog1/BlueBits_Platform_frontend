import { AlertTriangle, Layers } from "lucide-react";
import type { DayGroup, SubjectGroupIndex, SubjectYearIndex } from "../types";
import { useTranslation } from "react-i18next";
import { useScheduleDates } from "../hooks/useScheduleDates";
import { isExpectedGroupOverlap } from "../utils/schedule";

interface TimetableGridProps {
  days: DayGroup[];
  timeslots: number[];
  isDark: boolean;
  /** subjectId → عضويته في غروب اختياري – لتمييز التداخل المتوقع عن التصادم الفعلي */
  subjectGroupIndex?: SubjectGroupIndex;
  /** subjectId → اسم السنة الدراسية التابعة لها المادة، إن أمكن معرفتها */
  subjectYearIndex?: SubjectYearIndex;
}

/**
 * الجدول الكبير: صف لكل يوم امتحان، وعمود لكل فترة.
 * الخلية التي تحوي أكثر من مادة تعني تصادماً فتُبرز بالأحمر، إلا إذا كانت
 * كل موادها من نفس الغروب الاختياري فهذا تداخل متوقع (يُبرز بلون محايد).
 */
export default function TimetableGrid({
  days,
  timeslots,
  isDark,
  subjectGroupIndex,
  subjectYearIndex,
}: TimetableGridProps) {
  const { t } = useTranslation("admin");
  const { dayOfWeekLabel, formatDate } = useScheduleDates();
  return (
    <div
      className={`overflow-x-auto rounded-2xl border ${
        isDark ? "border-white/10" : "border-gray-100"
      }`}
    >
      <table className="w-full min-w-[640px] border-collapse text-right">
        <thead>
          <tr className="bg-gradient-to-l from-[#404293] to-[#2376BB] text-white">
            <th
              className={`sticky right-0 z-10 px-4 py-3 text-xs font-black ${
                isDark ? "bg-[#2f3140]" : "bg-[#404293]"
              }`}
            >
              {t("schedule.timetable.dayHeader")}
            </th>
            {timeslots.map((timeslot) => (
              <th
                key={timeslot}
                className="border-r border-white/15 px-4 py-3 text-center text-xs font-black"
              >
                {t("schedule.timetable.slotHeader", { number: timeslot })}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={isDark ? "divide-y divide-white/10" : "divide-y divide-gray-100"}>
          {days.map((day, index) => (
            <tr
              key={day.day}
              className={
                index % 2 === 0
                  ? isDark
                    ? "bg-[#202121]"
                    : "bg-white"
                  : isDark
                    ? "bg-white/[0.03]"
                    : "bg-gray-50/60"
              }
            >
              <th
                scope="row"
                className={`sticky right-0 z-10 border-l px-4 py-3 text-right align-top ${
                  isDark ? "border-white/10" : "border-gray-100"
                } ${
                  index % 2 === 0
                    ? isDark
                      ? "bg-[#202121]"
                      : "bg-white"
                    : isDark
                      ? "bg-[#242525]"
                      : "bg-gray-50"
                }`}
              >
                <p className={`text-xs font-black ${isDark ? "text-white" : "text-gray-900"}`}>
                  {dayOfWeekLabel(day.day)}
                </p>
                <p
                  className={`mt-0.5 text-[11px] font-semibold ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {formatDate(day.day)}
                </p>
              </th>

              {timeslots.map((timeslot) => {
                const slot = day.slots.find((item) => item.timeslot === timeslot);
                const entries = slot?.entries ?? [];
                const isExpected =
                  entries.length > 1 &&
                  Boolean(subjectGroupIndex) &&
                  isExpectedGroupOverlap(entries, subjectGroupIndex!);
                const isClash = entries.length > 1 && !isExpected;

                return (
                  <td
                    key={timeslot}
                    className={`border-r px-3 py-3 align-top ${
                      isDark ? "border-white/10" : "border-gray-100"
                    } ${
                      isClash
                        ? isDark
                          ? "bg-red-500/10"
                          : "bg-red-50"
                        : isExpected
                          ? isDark
                            ? "bg-emerald-500/[0.06]"
                            : "bg-emerald-50/60"
                          : ""
                    }`}
                  >
                    {entries.length === 0 ? (
                      <span
                        className={`block text-center text-xs font-bold ${
                          isDark ? "text-gray-700" : "text-gray-200"
                        }`}
                      >
                        —
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {isClash && (
                          <span
                            className={`flex items-center gap-1 text-[10px] font-black ${
                              isDark ? "text-red-400" : "text-red-600"
                            }`}
                          >
                            <AlertTriangle size={10} />
                            {t("schedule.timetable.clash", { count: entries.length })}
                          </span>
                        )}
                        {isExpected && (
                          <span
                            className={`flex items-center gap-1 text-[10px] font-black ${
                              isDark ? "text-emerald-400" : "text-emerald-600"
                            }`}
                          >
                            <Layers size={10} />
                            {t("schedule.timetable.expectedGroup", { count: entries.length })}
                          </span>
                        )}
                        {entries.map((entry) => {
                          const yearName = subjectYearIndex?.get(entry.subjectId);
                          return (
                            <span
                              key={entry._id}
                              className={`flex flex-col rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold leading-tight ${
                                isClash
                                  ? isDark
                                    ? "bg-red-500/15 text-red-400"
                                    : "bg-red-100 text-red-700"
                                  : isExpected
                                    ? isDark
                                      ? "bg-emerald-500/15 text-emerald-400"
                                      : "bg-emerald-100 text-emerald-700"
                                    : isDark
                                      ? "bg-[#2376BB]/15 text-[#7fb5e4]"
                                      : "bg-[#404293]/8 text-[#404293]"
                              }`}
                            >
                              {entry.subjectName}
                              {yearName && (
                                <span className="mt-0.5 text-[9px] font-semibold opacity-70">
                                  {yearName}
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
