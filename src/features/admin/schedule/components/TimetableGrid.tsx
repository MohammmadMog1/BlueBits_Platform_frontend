import { AlertTriangle } from "lucide-react";
import type { DayGroup } from "../types";
import { dayOfWeekLabel, formatDate } from "../utils/schedule";

interface TimetableGridProps {
  days: DayGroup[];
  timeslots: number[];
}

/**
 * الجدول الكبير: صف لكل يوم امتحان، وعمود لكل فترة.
 * الخلية التي تحوي أكثر من مادة تعني تصادماً فتُبرز بالأحمر.
 */
export default function TimetableGrid({ days, timeslots }: TimetableGridProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full min-w-[640px] border-collapse text-right">
        <thead>
          <tr className="bg-gradient-to-l from-[#404293] to-[#2376BB] text-white">
            <th className="sticky right-0 z-10 bg-[#404293] px-4 py-3 text-xs font-black">
              اليوم
            </th>
            {timeslots.map((timeslot) => (
              <th
                key={timeslot}
                className="border-r border-white/15 px-4 py-3 text-center text-xs font-black"
              >
                الفترة {timeslot}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {days.map((day, index) => (
            <tr
              key={day.day}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
            >
              <th
                scope="row"
                className={`sticky right-0 z-10 border-l border-gray-100 px-4 py-3 text-right align-top ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <p className="text-xs font-black text-gray-900">
                  {dayOfWeekLabel(day.day)}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
                  {formatDate(day.day)}
                </p>
              </th>

              {timeslots.map((timeslot) => {
                const slot = day.slots.find((item) => item.timeslot === timeslot);
                const entries = slot?.entries ?? [];
                const isClash = entries.length > 1;

                return (
                  <td
                    key={timeslot}
                    className={`border-r border-gray-100 px-3 py-3 align-top ${
                      isClash ? "bg-red-50" : ""
                    }`}
                  >
                    {entries.length === 0 ? (
                      <span className="block text-center text-xs font-bold text-gray-200">
                        —
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {isClash && (
                          <span className="flex items-center gap-1 text-[10px] font-black text-red-600">
                            <AlertTriangle size={10} />
                            تصادم ({entries.length})
                          </span>
                        )}
                        {entries.map((entry) => (
                          <span
                            key={entry._id}
                            className={`rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold leading-tight ${
                              isClash
                                ? "bg-red-100 text-red-700"
                                : "bg-[#404293]/8 text-[#404293]"
                            }`}
                          >
                            {entry.subjectName}
                          </span>
                        ))}
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
