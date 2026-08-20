import { Clock } from "lucide-react";
import type { DayGroup } from "../types";
import { useTranslation } from "react-i18next";
import { useScheduleDates } from "../hooks/useScheduleDates";

interface TimetableDayCardsProps {
  days: DayGroup[];
}

/** عرض البطاقات: بطاقة لكل يوم، مفيد للقراءة السريعة على الشاشات الصغيرة */
export default function TimetableDayCards({ days }: TimetableDayCardsProps) {
  const { t } = useTranslation("admin");
  const { dayOfWeekLabel, formatDate } = useScheduleDates();
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {days.map((day) => (
        <div
          key={day.day}
          className="overflow-hidden rounded-2xl border border-gray-100"
        >
          <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5">
            <p className="text-xs font-black text-gray-800">
              {dayOfWeekLabel(day.day)} · {formatDate(day.day)}
            </p>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-400">
              {t("schedule.timetable.subjectsCount", {
                count: day.slots.reduce(
                  (total, slot) => total + slot.entries.length,
                  0,
                ),
              })}
            </span>
          </div>

          <div className="divide-y divide-gray-100 bg-white">
            {day.slots.map((slot) => {
              const isClash = slot.entries.length > 1;
              return (
                <div
                  key={slot.timeslot}
                  className={`flex items-start gap-3 px-4 py-2.5 ${
                    isClash ? "bg-red-50/60" : ""
                  }`}
                >
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-black ${
                      isClash
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  >
                    <Clock size={10} />
                    {t("schedule.timetable.slotLabel", { number: slot.timeslot })}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {slot.entries.map((entry) => (
                      <span
                        key={entry._id}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                          isClash
                            ? "bg-red-100 text-red-700"
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
