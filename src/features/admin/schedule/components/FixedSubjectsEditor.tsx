import { AlertCircle, CalendarCheck2, Info, Pin, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import type { Subject } from "../../subjects/types";
import type { FixedSubjectRow } from "../types";
import { createFixedSubjectRow, isWithinRange } from "../utils/schedule";
import {
  emptyBoxClass,
  fieldClass,
  headingClass,
  mutedClass,
} from "../../../../shared/utils/theme";

interface FixedSubjectsEditorProps {
  rows: FixedSubjectRow[];
  subjects: Subject[];
  startDate: string;
  endDate: string;
  timeslotsPerDay: number;
  onChange: (rows: FixedSubjectRow[]) => void;
  isDark: boolean;
}

/**
 * مواد "مثبّتة": موعدها وفترتها اليومية محدَّدان يدوياً ولا يُغيّرهما
 * مولّد الجدول التلقائي (مثال: مادة يجب أن تبقى في يوم بعينه لتعارضها
 * مع جدول قاعة أو محاضر خارجي).
 */
export default function FixedSubjectsEditor({
  rows,
  subjects,
  startDate,
  endDate,
  timeslotsPerDay,
  onChange,
  isDark,
}: FixedSubjectsEditorProps) {
  const { t } = useTranslation("admin");

  const updateRow = (key: string, patch: Partial<FixedSubjectRow>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  const removeRow = (key: string) => onChange(rows.filter((row) => row.key !== key));

  const addRow = () => onChange([...rows, createFixedSubjectRow()]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Pin className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#2376BB]"}`} />
          <h3 className={`text-sm font-black ${headingClass(isDark)}`}>
            {t("schedule.fixedSubjects.title")}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#2376BB]/10 text-[#2376BB]"
            }`}
          >
            {rows.length}
          </span>
        </div>
        <button
          type="button"
          onClick={addRow}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
            isDark
              ? "bg-[#2376BB]/15 text-[#7fb5e4] hover:bg-[#2376BB]/25"
              : "bg-[#404293]/10 text-[#404293] hover:bg-[#404293]/20"
          }`}
        >
          <Plus size={14} /> {t("schedule.fixedSubjects.addFixedSubject")}
        </button>
      </div>

      <p className={`flex items-start gap-1.5 text-[11px] font-semibold ${mutedClass(isDark)}`}>
        <Info size={13} className="mt-0.5 shrink-0" />
        {t("schedule.fixedSubjects.hint")}
      </p>

      {rows.length === 0 ? (
        <div className={`flex flex-col items-center gap-2 py-8 text-center ${emptyBoxClass(isDark)}`}>
          <CalendarCheck2 className={`h-6 w-6 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          <p className={`text-sm font-bold ${mutedClass(isDark)}`}>
            {t("schedule.fixedSubjects.empty")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {rows.map((row) => {
              const isDuplicate =
                Boolean(row.subjectId) &&
                rows.filter((item) => item.subjectId === row.subjectId).length > 1;
              const outOfRange =
                Boolean(row.examDate && startDate && endDate) &&
                !isWithinRange(row.examDate, startDate, endDate);
              const slot = Number(row.timeslot);
              const invalidSlot =
                !Number.isFinite(slot) || slot < 1 || (timeslotsPerDay > 0 && slot > timeslotsPerDay);

              return (
                <motion.div
                  key={row.key}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-2xl border p-3 shadow-sm ${
                    isDark ? "bg-white/5" : "bg-white"
                  } ${
                    isDuplicate
                      ? isDark
                        ? "border-red-500/25"
                        : "border-red-200"
                      : isDark
                        ? "border-white/10"
                        : "border-gray-100"
                  }`}
                >
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_150px_100px_40px]">
                    <select
                      value={row.subjectId}
                      onChange={(event) => updateRow(row.key, { subjectId: event.target.value })}
                      className={`w-full px-3 py-2.5 ${fieldClass(isDark)}`}
                    >
                      <option value="">{t("schedule.subjectsEditor.chooseSubject")}</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={row.examDate}
                      min={startDate || undefined}
                      max={endDate || undefined}
                      onChange={(event) => updateRow(row.key, { examDate: event.target.value })}
                      className={`py-2.5 ${fieldClass(isDark)}`}
                    />

                    <input
                      type="number"
                      min={1}
                      max={timeslotsPerDay || undefined}
                      value={row.timeslot}
                      onChange={(event) => updateRow(row.key, { timeslot: event.target.value })}
                      placeholder={t("schedule.fixedSubjects.timeslotPlaceholder")}
                      title={t("schedule.fixedSubjects.timeslotTitle")}
                      className={`py-2.5 ${fieldClass(isDark)}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeRow(row.key)}
                      aria-label={t("schedule.fixedSubjects.removeFixedSubject")}
                      className={`flex h-10 w-10 items-center justify-center justify-self-end rounded-xl border border-transparent transition-colors ${
                        isDark
                          ? "text-gray-600 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                          : "text-gray-300 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {(isDuplicate || outOfRange || invalidSlot) && (
                    <p
                      className={`mt-2 flex items-center gap-1.5 text-[11px] font-bold ${
                        isDark ? "text-amber-400" : "text-amber-600"
                      }`}
                    >
                      <AlertCircle size={12} />
                      {isDuplicate
                        ? t("schedule.fixedSubjects.duplicateWarning")
                        : outOfRange
                          ? t("schedule.fixedSubjects.outOfRangeWarning")
                          : t("schedule.fixedSubjects.invalidSlotWarning", {
                              max: timeslotsPerDay,
                            })}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
