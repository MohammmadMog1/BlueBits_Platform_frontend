import { Clock, Layers } from "lucide-react";
import type { DayGroup, SubjectGroupIndex } from "../types";
import { useTranslation } from "react-i18next";
import { useScheduleDates } from "../hooks/useScheduleDates";
import { isExpectedGroupOverlap } from "../utils/schedule";

interface TimetableDayCardsProps {
  days: DayGroup[];
  isDark: boolean;
  /** subjectId → عضويته في غروب اختياري – لتمييز التداخل المتوقع عن التصادم الفعلي */
  subjectGroupIndex?: SubjectGroupIndex;
}

/** عرض البطاقات: بطاقة لكل يوم، مفيد للقراءة السريعة على الشاشات الصغيرة */
export default function TimetableDayCards({
  days,
  isDark,
  subjectGroupIndex,
}: TimetableDayCardsProps) {
  const { t } = useTranslation("admin");
  const { dayOfWeekLabel, formatDate } = useScheduleDates();
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {days.map((day) => (
        <div
          key={day.day}
          className={`overflow-hidden rounded-2xl border ${
            isDark ? "border-white/10" : "border-gray-100"
          }`}
        >
          <div
            className={`flex items-center justify-between px-4 py-2.5 ${
              isDark ? "bg-white/5" : "bg-gray-50"
            }`}
          >
            <p className={`text-xs font-black ${isDark ? "text-gray-100" : "text-gray-800"}`}>
              {dayOfWeekLabel(day.day)} · {formatDate(day.day)}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                isDark ? "bg-white/10 text-gray-400" : "bg-white text-gray-400"
              }`}
            >
              {t("schedule.timetable.subjectsCount", {
                count: day.slots.reduce(
                  (total, slot) => total + slot.entries.length,
                  0,
                ),
              })}
            </span>
          </div>

          <div
            className={`divide-y ${
              isDark ? "divide-white/10 bg-[#202121]" : "divide-gray-100 bg-white"
            }`}
          >
            {day.slots.map((slot) => {
              const isExpected =
                slot.entries.length > 1 &&
                Boolean(subjectGroupIndex) &&
                isExpectedGroupOverlap(slot.entries, subjectGroupIndex!);
              const isClash = slot.entries.length > 1 && !isExpected;
              return (
                <div
                  key={slot.timeslot}
                  className={`flex items-start gap-3 px-4 py-2.5 ${
                    isClash
                      ? isDark
                        ? "bg-red-500/10"
                        : "bg-red-50/60"
                      : isExpected
                        ? isDark
                          ? "bg-emerald-500/10"
                          : "bg-emerald-50/60"
                        : ""
                  }`}
                >
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-black ${
                      isClash
                        ? isDark
                          ? "border-red-500/25 bg-red-500/10 text-red-400"
                          : "border-red-200 bg-red-50 text-red-600"
                        : isExpected
                          ? isDark
                            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                            : "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : isDark
                            ? "border-white/10 bg-white/5 text-gray-400"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  >
                    {isExpected ? <Layers size={10} /> : <Clock size={10} />}
                    {t("schedule.timetable.slotLabel", { number: slot.timeslot })}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {slot.entries.map((entry) => (
                      <span
                        key={entry._id}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
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
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
