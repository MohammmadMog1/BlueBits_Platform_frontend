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
import type { Subject } from "../../subjects/types";
import type { ScheduleConfig, SubjectConfig } from "../types";
import {
  DAYS_OF_WEEK,
  calcCapacity,
  dayOfWeekLabel,
  formatDate,
  getRefId,
  toDateInputValue,
} from "../utils/schedule";

interface ScheduleConfigSummaryProps {
  config: ScheduleConfig;
  semesterLabel: string;
  subjects: Subject[];
  onEdit: () => void;
  onDelete: () => void;
}

const subjectName = (item: SubjectConfig, subjects: Subject[]): string => {
  if (item.subjectId && typeof item.subjectId === "object") {
    return item.subjectId.name;
  }
  const id = getRefId(item.subjectId);
  if (!id) return "مادة محذوفة";
  return subjects.find((subject) => subject._id === id)?.name ?? `مادة (${id.slice(0, 8)}…)`;
};

export default function ScheduleConfigSummary({
  config,
  semesterLabel,
  subjects,
  onEdit,
  onDelete,
}: ScheduleConfigSummaryProps) {
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
    { label: "أيام الفحص المتاحة", value: capacity.examDays, color: "#404293" },
    { label: "أيام مستبعدة", value: capacity.excludedDays, color: "#F59E0B" },
    { label: "إجمالي الفترات", value: capacity.totalSlots, color: "#2376BB" },
    { label: "المواد المهيأة", value: subjectsConfig.length, color: "#059669" },
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
                الإعدادات مضبوطة
              </h2>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                {config.academicYear}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-gray-400">
              الفصل: {semesterLabel} · آخر تحديث: {formatDate(config.updatedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#404293]/25 transition-all hover:-translate-y-0.5"
          >
            <Pencil size={13} /> تعديل
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="حذف الإعدادات"
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
            <p className="text-[11px] font-bold text-gray-400">فترة الامتحانات</p>
            <p className="text-sm font-black text-gray-900">
              {formatDate(config.startDate)} ← {formatDate(config.endDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3.5">
          <Clock className="h-4 w-4 shrink-0 text-[#2376BB]" />
          <div>
            <p className="text-[11px] font-bold text-gray-400">الفترات اليومية</p>
            <p className="text-sm font-black text-gray-900">
              {config.timeslotsPerDay} فترات / يوم
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
          عدد المواد ({subjectsConfig.length}) أكبر من الفترات المتاحة (
          {capacity.totalSlots}) – قد يفشل توليد الجدول.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
          <div className="mb-2.5 flex items-center gap-2">
            <CalendarOff className="h-4 w-4 text-[#404293]" />
            <h3 className="text-xs font-black text-gray-900">
              أيام الأسبوع المستبعدة
            </h3>
          </div>
          {config.excludedDaysOfWeek?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {config.excludedDaysOfWeek.map((day) => (
                <span
                  key={day}
                  className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600"
                >
                  {DAYS_OF_WEEK[day]?.label ?? day}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] font-semibold text-gray-400">
              لا توجد أيام مستبعدة
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
          <div className="mb-2.5 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#404293]" />
            <h3 className="text-xs font-black text-gray-900">تواريخ مستبعدة</h3>
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
              لا توجد تواريخ مستبعدة
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-[#2376BB]" />
          <h3 className="text-xs font-black text-gray-900">إعدادات المواد</h3>
          <span className="rounded-full bg-[#2376BB]/10 px-2 py-0.5 text-[10px] font-bold text-[#2376BB]">
            {subjectsConfig.length}
          </span>
        </div>

        {subjectsConfig.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-6 text-center text-xs font-bold text-gray-400">
            لم تُضبط أي مادة – اضغط تعديل لإضافة المواد
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 text-[11px] font-black text-gray-500">
                <tr>
                  <th className="px-4 py-2.5">المادة</th>
                  <th className="px-4 py-2.5">الطلاب المحمّلون</th>
                  <th className="px-4 py-2.5">مدة الامتحان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {subjectsConfig.map((item, index) => (
                  <tr key={`${getRefId(item.subjectId)}-${index}`}>
                    <td className="px-4 py-2.5 font-bold text-gray-800">
                      {subjectName(item, subjects)}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={12} className="text-gray-300" />
                        {item.carriedStudentsCount}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-gray-500">
                      {item.examDurationOverride} دقيقة
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
