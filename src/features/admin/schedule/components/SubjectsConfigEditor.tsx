import { AlertCircle, BookMarked, ListPlus, Plus, Trash2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import type { Subject } from "../../subjects/types";
import type { SubjectConfigRow } from "../types";
import { createSubjectRow } from "../utils/schedule";
import {
  emptyBoxClass,
  fieldClass,
  headingClass,
  mutedClass,
  skeletonClass,
} from "../../../../shared/utils/theme";

interface SubjectsConfigEditorProps {
  rows: SubjectConfigRow[];
  subjects: Subject[];
  isLoading: boolean;
  onChange: (rows: SubjectConfigRow[]) => void;
  isDark: boolean;
}

export default function SubjectsConfigEditor({
  rows,
  subjects,
  isLoading,
  onChange,
  isDark,
}: SubjectsConfigEditorProps) {
  const { t } = useTranslation("admin");
  const usedIds = new Set(rows.map((row) => row.subjectId).filter(Boolean));
  const remaining = subjects.filter((subject) => !usedIds.has(subject._id));

  const updateRow = (key: string, patch: Partial<SubjectConfigRow>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  const removeRow = (key: string) =>
    onChange(rows.filter((row) => row.key !== key));

  const addRow = () => onChange([...rows, createSubjectRow()]);

  /** إضافة كل المواد المتبقية دفعة واحدة – الفصل قد يحوي عشرات المواد */
  const addAllRemaining = () =>
    onChange([
      ...rows,
      ...remaining.map((subject) => createSubjectRow({ subjectId: subject._id })),
    ]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookMarked className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#2376BB]"}`} />
          <h3 className={`text-sm font-black ${headingClass(isDark)}`}>
            {t("schedule.subjectsEditor.title")}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#2376BB]/10 text-[#2376BB]"
            }`}
          >
            {rows.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {remaining.length > 0 && (
            <button
              type="button"
              onClick={addAllRemaining}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                isDark
                  ? "border-white/10 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
                  : "border-gray-200 text-gray-500 hover:border-[#404293]/30 hover:text-[#404293]"
              }`}
            >
              <ListPlus size={14} />{" "}
              {t("schedule.subjectsEditor.addAll", { count: remaining.length })}
            </button>
          )}
          <button
            type="button"
            onClick={addRow}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              isDark
                ? "bg-[#2376BB]/15 text-[#7fb5e4] hover:bg-[#2376BB]/25"
                : "bg-[#404293]/10 text-[#404293] hover:bg-[#404293]/20"
            }`}
          >
            <Plus size={14} /> {t("schedule.subjectsEditor.addSubject")}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`h-14 ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className={`flex flex-col items-center gap-2 py-10 text-center ${emptyBoxClass(isDark)}`}>
          <BookMarked className={`h-6 w-6 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          <p className={`text-sm font-bold ${mutedClass(isDark)}`}>
            {t("schedule.subjectsEditor.empty")}
          </p>
          <p className={`text-xs ${mutedClass(isDark)}`}>
            {t("schedule.subjectsEditor.emptyHint")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {rows.map((row) => {
              const isUnknown =
                Boolean(row.subjectId) &&
                !subjects.some((subject) => subject._id === row.subjectId);
              const isDuplicate =
                Boolean(row.subjectId) &&
                rows.filter((item) => item.subjectId === row.subjectId).length > 1;

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
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_130px_130px_40px]">
                    <select
                      value={row.subjectId}
                      onChange={(event) =>
                        updateRow(row.key, { subjectId: event.target.value })
                      }
                      className={`w-full px-3 py-2.5 ${fieldClass(isDark)}`}
                    >
                      <option value="">{t("schedule.subjectsEditor.chooseSubject")}</option>
                      {isUnknown && (
                        <option value={row.subjectId}>
                          {t("schedule.subjectsEditor.unknownSubject", {
                            id: row.subjectId.slice(0, 8),
                          })}
                        </option>
                      )}
                      {subjects.map((subject) => (
                        <option
                          key={subject._id}
                          value={subject._id}
                          disabled={
                            usedIds.has(subject._id) && subject._id !== row.subjectId
                          }
                        >
                          {subject.name}
                        </option>
                      ))}
                    </select>

                    <label className="relative block">
                      <Users
                        className={`pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
                          isDark ? "text-gray-600" : "text-gray-300"
                        }`}
                      />
                      <input
                        type="number"
                        min={0}
                        value={row.carriedStudentsCount}
                        onChange={(event) =>
                          updateRow(row.key, {
                            carriedStudentsCount: event.target.value,
                          })
                        }
                        placeholder={t("schedule.subjectsEditor.carriedPlaceholder")}
                        title={t("schedule.subjectsEditor.carriedTitle")}
                        className={`py-2.5 pl-3 pr-9 ${fieldClass(isDark)}`}
                      />
                    </label>

                    <label className="relative block">
                      <span
                        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold ${
                          isDark ? "text-gray-600" : "text-gray-300"
                        }`}
                      >
                        {t("schedule.subjectsEditor.minutes")}
                      </span>
                      <input
                        type="number"
                        min={1}
                        step={5}
                        value={row.examDurationOverride}
                        onChange={(event) =>
                          updateRow(row.key, {
                            examDurationOverride: event.target.value,
                          })
                        }
                        placeholder={t("schedule.subjectsEditor.durationPlaceholder")}
                        title={t("schedule.subjectsEditor.durationTitle")}
                        className={`py-2.5 pl-3 pr-12 ${fieldClass(isDark)}`}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => removeRow(row.key)}
                      aria-label={t("schedule.subjectsEditor.removeSubject")}
                      className={`flex h-10 w-10 items-center justify-center justify-self-end rounded-xl border border-transparent transition-colors ${
                        isDark
                          ? "text-gray-600 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                          : "text-gray-300 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {(isDuplicate || isUnknown) && (
                    <p
                      className={`mt-2 flex items-center gap-1.5 text-[11px] font-bold ${
                        isDark ? "text-amber-400" : "text-amber-600"
                      }`}
                    >
                      <AlertCircle size={12} />
                      {isDuplicate
                        ? t("schedule.subjectsEditor.duplicateWarning")
                        : t("schedule.subjectsEditor.notInSemesterWarning")}
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
