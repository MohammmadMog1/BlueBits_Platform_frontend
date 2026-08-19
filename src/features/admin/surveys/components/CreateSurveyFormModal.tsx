import { useState } from "react";
import { AlertCircle, CalendarDays, FilePlus2, X } from "lucide-react";
import { motion } from "motion/react";
import type { AcademicYear, Semester } from "../../academic/types";
import type { SurveyForm, SurveyFormValues } from "../types";
import { defaultAcademicYear, isValidAcademicYear } from "../utils/survey";
import {
  faintClass,
  fieldClass,
  headingClass,
  mutedClass,
} from "../utils/surveyTheme";

interface CreateSurveyFormModalProps {
  years: AcademicYear[];
  semesters: Semester[];
  yearsLoading: boolean;
  semestersLoading: boolean;
  isDark: boolean;
  isSubmitting: boolean;
  error: string;
  /** يرجّع الفورم الموجود مسبقاً لنفس السنة/الفصل/السنة الأكاديمية */
  findDuplicate: (values: SurveyFormValues) => SurveyForm | undefined;
  onCancel: () => void;
  onSubmit: (values: SurveyFormValues) => void;
}

export default function CreateSurveyFormModal({
  years,
  semesters,
  yearsLoading,
  semestersLoading,
  isDark,
  isSubmitting,
  error,
  findDuplicate,
  onCancel,
  onSubmit,
}: CreateSurveyFormModalProps) {
  const [values, setValues] = useState<SurveyFormValues>({
    yearId: "",
    semesterId: "",
    academicYear: defaultAcademicYear(),
  });
  const [touched, setTouched] = useState(false);

  const patch = (next: Partial<SurveyFormValues>) =>
    setValues((current) => ({ ...current, ...next }));

  const yearMissing = !values.yearId;
  const semesterMissing = !values.semesterId;
  const academicYearInvalid = !isValidAcademicYear(values.academicYear);
  const duplicate =
    !yearMissing && !semesterMissing && !academicYearInvalid
      ? findDuplicate(values)
      : undefined;

  const isInvalid =
    yearMissing || semesterMissing || academicYearInvalid || Boolean(duplicate);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (isInvalid) return;
    onSubmit(values);
  };

  const input = fieldClass(isDark);
  const labelClass = `mb-1.5 block text-xs font-black ${
    isDark ? "text-gray-300" : "text-gray-600"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
      onClick={() => !isSubmitting && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-md rounded-3xl p-7 shadow-2xl ${
          isDark ? "bg-[#202121] ring-1 ring-white/10" : "bg-white"
        }`}
      >
        {/* ── الترويسة ─────────────────────────── */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
              <FilePlus2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className={`text-base font-black ${headingClass(isDark)}`}>
                إنشاء فورم استبيان
              </h3>
              <p className={`mt-0.5 text-xs font-medium ${mutedClass(isDark)}`}>
                فورم واحد لكل سنة في كل فصل دراسي
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="إغلاق"
            className={`transition-colors disabled:opacity-40 ${
              isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-300 hover:text-gray-500"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── السنة ──────────────────────────── */}
          <div>
            <label className={labelClass}>السنة الدراسية</label>
            <select
              value={values.yearId}
              onChange={(event) => patch({ yearId: event.target.value })}
              disabled={yearsLoading}
              className={input}
            >
              <option value="">
                {yearsLoading ? "جاري التحميل..." : "اختر السنة..."}
              </option>
              {years.map((year) => (
                <option key={year._id} value={year._id}>
                  {year.name}
                </option>
              ))}
            </select>
            {touched && yearMissing && (
              <p className="mt-1.5 text-[11px] font-bold text-red-500">
                اختر السنة الدراسية
              </p>
            )}
          </div>

          {/* ── الفصل ──────────────────────────── */}
          <div>
            <label className={labelClass}>الفصل الدراسي</label>
            <select
              value={values.semesterId}
              onChange={(event) => patch({ semesterId: event.target.value })}
              disabled={semestersLoading}
              className={input}
            >
              <option value="">
                {semestersLoading ? "جاري التحميل..." : "اختر الفصل..."}
              </option>
              {semesters.map((semester) => (
                <option key={semester._id} value={semester._id}>
                  {semester.name}
                </option>
              ))}
            </select>
            {touched && semesterMissing && (
              <p className="mt-1.5 text-[11px] font-bold text-red-500">
                اختر الفصل الدراسي
              </p>
            )}
          </div>

          {/* ── السنة الأكاديمية ───────────────── */}
          <div>
            <label className={labelClass}>السنة الأكاديمية</label>
            <div className="relative">
              <CalendarDays
                className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${faintClass(isDark)}`}
              />
              <input
                type="text"
                value={values.academicYear}
                onChange={(event) => patch({ academicYear: event.target.value })}
                placeholder="2026-2027"
                dir="ltr"
                className={`${input} pr-11 text-right`}
              />
            </div>
            {touched && academicYearInvalid && (
              <p className="mt-1.5 text-[11px] font-bold text-red-500">
                الصيغة المطلوبة: 2026-2027 (سنتان متتاليتان)
              </p>
            )}
          </div>

          {/* ── تنبيه التكرار ──────────────────── */}
          {duplicate && (
            <p
              className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[11px] font-bold ${
                isDark
                  ? "border-amber-500/25 bg-amber-500/10 text-amber-400"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              يوجد فورم بهذه السنة والفصل والسنة الأكاديمية بالفعل (حالته:{" "}
              {duplicate.status}). عدّل أحد الحقول أو استخدم الفورم الموجود.
            </p>
          )}

          {error && (
            <p
              className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[11px] font-bold ${
                isDark
                  ? "border-red-500/25 bg-red-500/10 text-red-400"
                  : "border-red-200 bg-red-50 text-red-600"
              }`}
            >
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          {/* ── الأزرار ────────────────────────── */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-colors disabled:opacity-50 ${
                isDark
                  ? "border-white/10 text-gray-300 hover:bg-white/5"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (touched && isInvalid)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-3 text-sm font-bold text-white shadow-md shadow-[#404293]/25 transition-all disabled:opacity-60"
            >
              {isSubmitting ? "جاري الإنشاء..." : "إنشاء المسودة"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
