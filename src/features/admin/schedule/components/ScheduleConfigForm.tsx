import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
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
  FixedSubjectRow,
  ScheduleConfig,
  ScheduleConfigFormValues,
  SubjectConfigRow,
  SubjectGroup,
} from "../types";
import {
  DAYS_OF_WEEK,
  calcCapacity,
  createFixedSubjectRow,
  createSubjectRow,
  defaultAcademicYear,
  getRefId,
  isWithinRange,
  toDateInputValue,
} from "../utils/schedule";
import { useScheduleDates } from "../hooks/useScheduleDates";
import SubjectsConfigEditor from "./SubjectsConfigEditor";
import FixedSubjectsEditor from "./FixedSubjectsEditor";
import {
  brandGradient,
  faintClass,
  fieldClass,
  headingClass,
  mutedClass,
  panelClass,
  primaryButtonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";

interface ScheduleConfigFormProps {
  mode: "create" | "edit";
  semesterLabel: string;
  initial?: ScheduleConfig | null;
  subjects: Subject[];
  subjectsLoading: boolean;
  subjectGroups?: SubjectGroup[];
  isSubmitting: boolean;
  error?: string;
  onCancel: () => void;
  onSubmit: (values: ScheduleConfigFormValues) => void;
  isDark: boolean;
}

const buildRows = (config?: ScheduleConfig | null): SubjectConfigRow[] =>
  (config?.subjectsConfig ?? []).map((item) =>
    createSubjectRow({
      subjectId: getRefId(item.subjectId),
      carriedStudentsCount: String(item.carriedStudentsCount ?? 0),
      examDurationOverride: String(item.examDurationOverride ?? 120),
    }),
  );

const buildFixedRows = (config?: ScheduleConfig | null): FixedSubjectRow[] =>
  (config?.fixedSubjects ?? []).map((item) =>
    createFixedSubjectRow({
      subjectId: getRefId(item.subjectId),
      examDate: toDateInputValue(item.examDate),
      timeslot: String(item.timeslot ?? 1),
    }),
  );

export default function ScheduleConfigForm({
  mode,
  semesterLabel,
  initial,
  subjects,
  subjectsLoading,
  subjectGroups = [],
  isSubmitting,
  error,
  onCancel,
  onSubmit,
  isDark,
}: ScheduleConfigFormProps) {
  const { t } = useTranslation(["admin", "common"]);
  const { dayOfWeekLabel, formatDate, weekdayNames } = useScheduleDates();
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
  const [fixedRows, setFixedRows] = useState<FixedSubjectRow[]>(() => buildFixedRows(initial));
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

    if (!academicYear.trim()) return setFormError(t("schedule.form.errors.academicYearRequired"));
    if (!/^\d{4}-\d{4}$/.test(academicYear.trim()))
      return setFormError(t("schedule.form.errors.academicYearFormat"));
    if (!startDate) return setFormError(t("schedule.form.errors.startRequired"));
    if (!endDate) return setFormError(t("schedule.form.errors.endRequired"));
    if (Date.parse(endDate) < Date.parse(startDate))
      return setFormError(t("schedule.form.errors.endBeforeStart"));
    if (!Number.isFinite(slots) || slots < 1)
      return setFormError(t("schedule.form.errors.timeslotsMin"));
    if (capacity.examDays === 0)
      return setFormError(
        t("schedule.form.errors.noExamDays"),
      );
    if (rows.some((row) => !row.subjectId))
      return setFormError(t("schedule.form.errors.subjectRequired"));

    const ids = rows.map((row) => row.subjectId);
    if (new Set(ids).size !== ids.length)
      return setFormError(t("schedule.form.errors.duplicateSubject"));

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
        t("schedule.form.errors.invalidSubjectNumbers"),
      );

    if (fixedRows.some((row) => !row.subjectId || !row.examDate))
      return setFormError(t("schedule.form.errors.fixedSubjectRequired"));

    const fixedIds = fixedRows.map((row) => row.subjectId);
    if (new Set(fixedIds).size !== fixedIds.length)
      return setFormError(t("schedule.form.errors.duplicateFixedSubject"));

    const invalidFixedSlots = fixedRows.some((row) => {
      const slot = Number(row.timeslot);
      return !Number.isFinite(slot) || slot < 1 || slot > slots;
    });
    if (invalidFixedSlots)
      return setFormError(t("schedule.form.errors.invalidFixedTimeslot"));

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
      fixedSubjects: fixedRows.map((row) => ({
        subjectId: row.subjectId,
        examDate: new Date(`${row.examDate}T00:00:00.000Z`).toISOString(),
        timeslot: Number(row.timeslot),
      })),
    });
  };

  const stats = [
    { label: t("schedule.capacity.examDays"), value: capacity.examDays, color: "#404293" },
    { label: t("schedule.capacity.excludedDays"), value: capacity.excludedDays, color: "#F59E0B" },
    { label: t("schedule.capacity.totalSlots"), value: capacity.totalSlots, color: "#2376BB" },
    { label: t("schedule.capacity.configuredSubjects"), value: configuredSubjects, color: "#059669" },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`space-y-5 p-6 ${panelClass(isDark)}`}
    >
      <div
        className={`flex items-center gap-3 border-b pb-4 ${
          isDark ? "border-white/10" : "border-gray-100"
        }`}
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${brandGradient} shadow-md shadow-[#404293]/25`}>
          <Settings2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className={`text-base font-black ${headingClass(isDark)}`}>
            {t(mode === "edit" ? "schedule.form.editTitle" : "schedule.form.createTitle")}
          </h2>
          <p className={`mt-0.5 text-xs font-semibold ${mutedClass(isDark)}`}>
            {t("schedule.form.semesterLabel", { semester: semesterLabel })}
          </p>
        </div>
      </div>

      {/* ── معلومات عامة ─────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={`block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {t("schedule.form.academicYearLabel")} <span className="text-red-400">*</span>
          <input
            value={academicYear}
            onChange={(event) => setAcademicYear(event.target.value)}
            placeholder="2025-2026"
            className={`mt-1.5 ${fieldClass(isDark)}`}
          />
        </label>
        <label className={`block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {t("schedule.form.timeslotsLabel")} <span className="text-red-400">*</span>
          <div className="relative mt-1.5">
            <input
              type="number"
              min={1}
              max={12}
              value={timeslotsPerDay}
              onChange={(event) => setTimeslotsPerDay(event.target.value)}
              className={`pr-11 ${fieldClass(isDark)}`}
            />
            <Clock
              className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            />
          </div>
        </label>
      </div>

      {/* ── فترة الامتحانات ──────────────────── */}
      <div className={`p-4 ${softBoxClass(isDark)}`}>
        <div className="mb-3 flex items-center gap-2">
          <CalendarRange className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
          <h3 className={`text-sm font-black ${headingClass(isDark)}`}>
            {t("schedule.form.examPeriod")}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {t("schedule.form.startDate")} <span className="text-red-400">*</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className={`mt-1.5 ${fieldClass(isDark)}`}
            />
          </label>
          <label className={`block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {t("schedule.form.endDate")} <span className="text-red-400">*</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className={`mt-1.5 ${fieldClass(isDark)}`}
            />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${
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
            className={`mt-3 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold ${
              isDark
                ? "border-amber-500/25 bg-amber-500/10 text-amber-400"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            <AlertCircle size={13} className="shrink-0" />
            {t("schedule.form.capacityWarning", {
              subjects: configuredSubjects,
              slots: capacity.totalSlots,
            })}
          </p>
        )}
      </div>

      {/* ── أيام الأسبوع المستبعدة ───────────── */}
      <div className={`p-4 ${softBoxClass(isDark)}`}>
        <div className="mb-3 flex items-center gap-2">
          <CalendarOff className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
          <h3 className={`text-sm font-black ${headingClass(isDark)}`}>
            {t("schedule.form.excludedWeekdays")}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const isExcluded = excludedDaysOfWeek.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                  isExcluded
                    ? isDark
                      ? "border-red-500/25 bg-red-500/10 text-red-400"
                      : "border-red-200 bg-red-50 text-red-600"
                    : isDark
                      ? "border-white/10 bg-white/5 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
                      : "border-gray-200 bg-white text-gray-500 hover:border-[#404293]/30 hover:text-[#404293]"
                }`}
              >
                {weekdayNames[day]}
              </button>
            );
          })}
        </div>
        <p className={`mt-2.5 text-[11px] font-semibold ${mutedClass(isDark)}`}>
          {t("schedule.form.excludedWeekdaysHint")}
        </p>
      </div>

      {/* ── تواريخ مستبعدة ───────────────────── */}
      <div className={`p-4 ${softBoxClass(isDark)}`}>
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
          <h3 className={`text-sm font-black ${headingClass(isDark)}`}>
            {t("schedule.form.excludedDates")}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={newExcludedDate}
            onChange={(event) => setNewExcludedDate(event.target.value)}
            className={`min-w-[170px] flex-1 py-2.5 ${fieldClass(isDark)}`}
          />
          <button
            type="button"
            onClick={addExcludedDate}
            disabled={!newExcludedDate}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors disabled:opacity-40 ${
              isDark
                ? "bg-[#2376BB]/15 text-[#7fb5e4] hover:bg-[#2376BB]/25"
                : "bg-[#404293]/10 text-[#404293] hover:bg-[#404293]/20"
            }`}
          >
            <Plus size={14} /> {t("schedule.form.addDate")}
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
                      ? isDark
                        ? "border-amber-500/25 bg-amber-500/10 text-amber-400"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                      : isDark
                        ? "border-white/10 bg-white/5 text-gray-300"
                        : "border-gray-200 bg-white text-gray-600"
                  }`}
                  title={outOfRange ? t("schedule.form.outOfRange") : undefined}
                >
                  {dayOfWeekLabel(day)} · {formatDate(day)}
                  {outOfRange && <AlertCircle size={11} />}
                  <button
                    type="button"
                    onClick={() => removeExcludedDate(day)}
                    aria-label={t("schedule.form.removeDate", { date: day })}
                    className={`transition-colors ${
                      isDark ? "text-gray-600 hover:text-red-400" : "text-gray-300 hover:text-red-500"
                    }`}
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
      <div className={`p-4 ${softBoxClass(isDark)}`}>
        <SubjectsConfigEditor
          rows={rows}
          subjects={subjects}
          subjectGroups={subjectGroups}
          isLoading={subjectsLoading}
          onChange={setRows}
          isDark={isDark}
        />
      </div>

      {/* ── مواد مثبّتة بموعد وفترة يدوياً ───── */}
      <div className={`p-4 ${softBoxClass(isDark)}`}>
        <FixedSubjectsEditor
          rows={fixedRows}
          subjects={subjects}
          startDate={startDate}
          endDate={endDate}
          timeslotsPerDay={slots}
          onChange={setFixedRows}
          isDark={isDark}
        />
      </div>

      {(formError || error) && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
            isDark
              ? "border-red-500/25 bg-red-500/10 text-red-400"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          <AlertCircle size={15} className="shrink-0" />
          {formError || error}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className={`flex-1 rounded-xl border py-3 text-sm font-bold transition-colors disabled:opacity-50 sm:flex-none sm:px-8 ${
            isDark
              ? "border-white/10 text-gray-300 hover:bg-white/5"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {t("common:actions.cancel")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex flex-1 py-3 ${primaryButtonClass}`}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <RefreshCcw size={15} />
              </motion.div>
              {t("schedule.form.saving")}
            </>
          ) : (
            <>
              <CheckCircle2 size={15} />
              {t(mode === "edit" ? "schedule.form.save" : "schedule.form.create")}
            </>
          )}
        </button>
      </div>

      <p className={`flex items-center gap-1.5 text-[11px] font-semibold ${faintClass(isDark)}`}>
        <Layers size={12} />
        {t("schedule.form.footerHint")}
      </p>
    </motion.form>
  );
}
