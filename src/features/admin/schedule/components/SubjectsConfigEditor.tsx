import { AlertCircle, BookMarked, ListPlus, Plus, Trash2, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Subject } from "../../subjects/types";
import type { SubjectConfigRow } from "../types";
import { createSubjectRow } from "../utils/schedule";

interface SubjectsConfigEditorProps {
  rows: SubjectConfigRow[];
  subjects: Subject[];
  isLoading: boolean;
  onChange: (rows: SubjectConfigRow[]) => void;
}

export default function SubjectsConfigEditor({
  rows,
  subjects,
  isLoading,
  onChange,
}: SubjectsConfigEditorProps) {
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
          <BookMarked className="h-4 w-4 text-[#2376BB]" />
          <h3 className="text-sm font-black text-gray-900">إعدادات المواد</h3>
          <span className="rounded-full bg-[#2376BB]/10 px-2 py-0.5 text-[11px] font-bold text-[#2376BB]">
            {rows.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {remaining.length > 0 && (
            <button
              type="button"
              onClick={addAllRemaining}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-500 transition-colors hover:border-[#404293]/30 hover:text-[#404293]"
            >
              <ListPlus size={14} /> إضافة كل المواد ({remaining.length})
            </button>
          )}
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1.5 rounded-xl bg-[#404293]/10 px-3 py-2 text-xs font-bold text-[#404293] transition-colors hover:bg-[#404293]/20"
          >
            <Plus size={14} /> إضافة مادة
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
            />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-10 text-center">
          <BookMarked className="h-6 w-6 text-gray-300" />
          <p className="text-sm font-bold text-gray-400">لم تُضف أي مادة بعد</p>
          <p className="text-xs text-gray-400">
            أضف المواد التي سيشملها برنامج الفحص مع عدد الطلاب المحمّلين ومدة الامتحان
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
                  className={`rounded-2xl border bg-white p-3 shadow-sm ${
                    isDuplicate ? "border-red-200" : "border-gray-100"
                  }`}
                >
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_130px_130px_40px]">
                    <select
                      value={row.subjectId}
                      onChange={(event) =>
                        updateRow(row.key, { subjectId: event.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                    >
                      <option value="">اختر المادة...</option>
                      {isUnknown && (
                        <option value={row.subjectId}>
                          مادة غير معروفة ({row.subjectId.slice(0, 8)}…)
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
                      <Users className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" />
                      <input
                        type="number"
                        min={0}
                        value={row.carriedStudentsCount}
                        onChange={(event) =>
                          updateRow(row.key, {
                            carriedStudentsCount: event.target.value,
                          })
                        }
                        placeholder="محمّلون"
                        title="عدد الطلاب المحمّلين"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-9 text-sm font-semibold text-gray-800 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                      />
                    </label>

                    <label className="relative block">
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">
                        دقيقة
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
                        placeholder="المدة"
                        title="مدة الامتحان بالدقائق"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-12 text-sm font-semibold text-gray-800 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => removeRow(row.key)}
                      aria-label="حذف المادة"
                      className="flex h-10 w-10 items-center justify-center justify-self-end rounded-xl border border-transparent text-gray-300 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {(isDuplicate || isUnknown) && (
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
                      <AlertCircle size={12} />
                      {isDuplicate
                        ? "هذه المادة مكرّرة – احذف أحد الصفين"
                        : "هذه المادة غير موجودة ضمن مواد الفصل الحالي"}
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
