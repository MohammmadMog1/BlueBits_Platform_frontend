import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CalendarDays,
  CalendarOff,
  CalendarRange,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  RefreshCcw,
  Settings2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import type { Subject } from "../../subjects/types";
import type {
  ScheduleConfig,
  ScheduleConfigFormValues,
  SubjectConfigRow,
} from "../types";
import {
  DAYS_OF_WEEK,
  calcCapacity,
  createSubjectRow,
  dayOfWeekLabel,
  defaultAcademicYear,
  formatDate,
  getRefId,
  isWithinRange,
  toDateInputValue,
} from "../utils/schedule";
import SubjectsConfigEditor from "./SubjectsConfigEditor";

interface ScheduleConfigFormProps {
  mode: "create" | "edit";
  semesterLabel: string;
  initial?: ScheduleConfig | null;
  subjects: Subject[];
  subjectsLoading: boolean;
  isSubmitting: boolean;
  error?: string;
  onCancel: () => void;
  onSubmit: (values: ScheduleConfigFormValues) => void;
}

const buildRows = (config?: ScheduleConfig | null): SubjectConfigRow[] =>
  (config?.subjectsConfig ?? []).map((item) =>
    createSubjectRow({
      subjectId: getRefId(item.subjectId),
      carriedStudentsCount: String(item.carriedStudentsCount ?? 0),
      examDurationOverride: String(item.examDurationOverride ?? 120),
    }),
  );

export default function ScheduleConfigForm({
  mode,
  semesterLabel,
  initial,
  subjects,
  subjectsLoading,
  isSubmitting,
  error,
  onCancel,
  onSubmit,
}: ScheduleConfigFormProps) {
  const [academicYear, setAcademicYear] = useState(
    initial?.academicYear ?? defaultAcademicYear(),
  );
  const [startDate, setStartDate] = useState(toDateInputValue(initial?.startDate));
  const [endDate, setEndDate] = useState(toDateInputValue(initial?.endDate));
  const [timeslotsPerDay, setTimeslotsPerDay] = useState(
    String(initial?.timeslotsPerDay ?? 3),
  );
  const [excludedDaysOfWeek, setExcludedDaysOfWeek] = useState<number[]>(
    initial?.excludedDaysOfWeek ?? [5, 6],
  );
  const [excludedDates, setExcludedDates] = useState<string[]>(
    (initial?.excludedDates ?? []).map(toDateInputValue),
  );
  const [newExcludedDate, setNewExcludedDate] = useState("");
  const [rows, setRows] = useState<SubjectConfigRow[]>(() => buildRows(initial));
  const [formError, setFormError] = useState("");

  const slots = Number(timeslotsPerDay);
  const capacity = useMemo(
    () =>
      calcCapacity(
        startDate,
        endDate,
        excludedDaysOfWeek,
        excludedDates,
        Number.isFinite(slots) ? slots : 0,
      ),
    [startDate, endDate, excludedDaysOfWeek, excludedDates, slots],
  );

  const configuredSubjects = rows.filter((row) => row.subjectId).length;
  const isOverCapacity =
    capacity.totalSlots > 0 && configuredSubjects > capacity.totalSlots;

  const toggleDay = (day: number) =>
    setExcludedDaysOfWeek((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day].sort((a, b) => a - b),
    );

  const addExcludedDate = () => {
    const day = toDateInputValue(newExcludedDate);
    if (!day || excludedDates.includes(day)) return;
    setExcludedDates((current) => [...current, day].sort());
    setNewExcludedDate("");
  };

  const removeExcludedDate = (day: string) =>
    setExcludedDates((current) => current.filter((item) => item !== day));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!academicYear.trim()) return setFormError("السنة الأكاديمية مطلوبة");
    if (!/^\d{4}-\d{4}$/.test(academicYear.trim()))
      return setFormError("صيغة السنة الأكاديمية يجب أن تكون مثل 2025-2026");
    if (!startDate) return setFormError("تاريخ بداية الامتحانات مطلوب");
    if (!endDate) return setFormError("تاريخ نهاية الامتحانات مطلوب");
    if (Date.parse(endDate) < Date.parse(startDate))
      return setFormError("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
    if (!Number.isFinite(slots) || slots < 1)
      return setFormError("عدد الفترات اليومية يجب أن يكون 1 على الأقل");
    if (capacity.examDays === 0)
      return setFormError(
        "لا توجد أيام فحص متاحة – راجع مدى التواريخ والأيام المستبعدة",
      );
    if (rows.some((row) => !row.subjectId))
      return setFormError("اختر المادة في كل صف أو احذف الصفوف الفارغة");

    const ids = rows.map((row) => row.subjectId);
    if (new Set(ids).size !== ids.length)
      return setFormError("لا يمكن تكرار المادة نفسها أكثر من مرة");

    const invalidNumbers = rows.some((row) => {
      const carried = Number(row.carriedStudentsCount);
      const duration = Number(row.examDurationOverride);
      return (
        !Number.isFinite(carried) ||
        carried < 0 ||
        !Number.isFinite(duration) ||
        duration < 1
      );
    });
    if (invalidNumbers)
      return setFormError(
        "تأكد من أن عدد المحمّلين ≥ 0 وأن مدة الامتحان ≥ 1 دقيقة",
      );

    setFormError("");
    onSubmit({
      academicYear: academicYear.trim(),
      startDate,
      endDate,
      excludedDates,
      excludedDaysOfWeek: [...excludedDaysOfWeek].sort((a, b) => a - b),
      timeslotsPerDay: slots,
      subjectsConfig: rows.map((row) => ({
        subjectId: row.subjectId,
        carriedStudentsCount: Number(row.carriedStudentsCount),
        examDurationOverride: Number(row.examDurationOverride),
      })),
    });
  };

  const stats = [
    { label: "أيام الفحص المتاحة", value: capacity.examDays, color: "#404293" },
    { label: "أيام مستبعدة", value: capacity.excludedDays, color: "#F59E0B" },
    { label: "إجمالي الفترات", value: capacity.totalSlots, color: "#2376BB" },
    { label: "المواد المهيأة", value: configuredSubjects, color: "#059669" },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
          <Settings2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-black text-gray-900">
            {mode === "edit" ? "تعديل إعدادات الجدولة" : "إنشاء إعدادات الجدولة"}
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-gray-400">
            الفصل: {semesterLabel}
          </p>
        </div>
      </div>

      {/* ── معلومات عامة ─────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold text-gray-700">
          السنة الأكاديمية <span className="text-red-400">*</span>
          <input
            value={academicYear}
            onChange={(event) => setAcademicYear(event.target.value)}
            placeholder="2025-2026"
            className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
          />
        </label>
        <label className="block text-sm font-bold text-gray-700">
          عدد الفترات في اليوم <span className="text-red-400">*</span>
          <div className="relative mt-1.5">
            <input
              type="number"
              min={1}
              max={12}
              value={timeslotsPerDay}
              onChange={(event) => setTimeslotsPerDay(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-11 text-sm font-semibold text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
            <Clock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </label>
      </div>

      {/* ── فترة الامتحانات ──────────────────── */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-[#404293]" />
          <h3 className="text-sm font-black text-gray-900">فترة الامتحانات</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-gray-700">
            تاريخ البداية <span className="text-red-400">*</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
          <label className="block text-sm font-bold text-gray-700">
            تاريخ النهاية <span className="text-red-400">*</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-3 py-2.5"
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
          <p className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-bold text-amber-700">
            <AlertCircle size={13} className="shrink-0" />
            عدد المواد ({configuredSubjects}) أكبر من الفترات المتاحة (
            {capacity.totalSlots}) – وسّع المدى أو زد الفترات اليومية.
          </p>
        )}
      </div>

      {/* ── أيام الأسبوع المستبعدة ───────────── */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <CalendarOff className="h-4 w-4 text-[#404293]" />
          <h3 className="text-sm font-black text-gray-900">
            أيام الأسبوع المستبعدة
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const isExcluded = excludedDaysOfWeek.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                  isExcluded
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-200 bg-white text-gray-500 hover:border-[#404293]/30 hover:text-[#404293]"
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2.5 text-[11px] font-semibold text-gray-400">
          الأيام المحدّدة بالأحمر لن تُجدول فيها أي امتحانات.
        </p>
      </div>

      {/* ── تواريخ مستبعدة ───────────────────── */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#404293]" />
          <h3 className="text-sm font-black text-gray-900">
            تواريخ مستبعدة (عطل رسمية)
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={newExcludedDate}
            onChange={(event) => setNewExcludedDate(event.target.value)}
            className="min-w-[170px] flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
          />
          <button
            type="button"
            onClick={addExcludedDate}
            disabled={!newExcludedDate}
            className="flex items-center gap-1.5 rounded-xl bg-[#404293]/10 px-4 py-2.5 text-xs font-bold text-[#404293] transition-colors hover:bg-[#404293]/20 disabled:opacity-40"
          >
            <Plus size={14} /> إضافة
          </button>
        </div>

        {excludedDates.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {excludedDates.map((day) => {
              const outOfRange =
                Boolean(startDate && endDate) &&
                !isWithinRange(day, startDate, endDate);
              return (
                <span
                  key={day}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[11px] font-bold ${
                    outOfRange
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-gray-200 bg-white text-gray-600"
                  }`}
                  title={outOfRange ? "خارج مدى فترة الامتحانات" : undefined}
                >
                  {dayOfWeekLabel(day)} · {formatDate(day)}
                  {outOfRange && <AlertCircle size={11} />}
                  <button
                    type="button"
                    onClick={() => removeExcludedDate(day)}
                    aria-label={`حذف ${day}`}
                    className="text-gray-300 transition-colors hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── إعدادات المواد ───────────────────── */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
        <SubjectsConfigEditor
          rows={rows}
          subjects={subjects}
          isLoading={subjectsLoading}
          onChange={setRows}
        />
      </div>

      {(formError || error) && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          <AlertCircle size={15} className="shrink-0" />
          {formError || error}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 sm:flex-none sm:px-8"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-3 text-sm font-bold text-white shadow-lg shadow-[#404293]/25 transition-all hover:-translate-y-0.5 hover:shadow-[#404293]/40 disabled:translate-y-0 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <RefreshCcw size={15} />
              </motion.div>
              جاري الحفظ...
            </>
          ) : (
            <>
              <CheckCircle2 size={15} />
              {mode === "edit" ? "حفظ التعديلات" : "إنشاء الإعدادات"}
            </>
          )}
        </button>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-300">
        <Layers size={12} />
        تُستخدم هذه الإعدادات مع ردود الطلاب لتوليد برنامج الفحص.
      </p>
    </motion.form>
  );
}
