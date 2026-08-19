import { useEffect, useState } from "react";
import {
  AlertCircle,
  BookMarked,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Layers,
  RefreshCcw,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetYearsQuery } from "../../academic/api/academicApi";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsApi";
import { getLecture } from "../../lectures/api/lecturesService";
import { useGetLecturesBySubjectQuery } from "../api/academicTasksApi";
import type { AcademicTaskFormData, LectureType } from "../types";

const lectureTypeOptions: { id: LectureType; label: string }[] = [
  { id: "theoretical", label: "نظري" },
  { id: "practical", label: "عملي" },
];

interface AcademicTaskFormModalProps {
  initial?: AcademicTaskFormData;
  isEdit: boolean;
  isSubmitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (data: AcademicTaskFormData) => void;
}

export default function AcademicTaskFormModal({
  initial,
  isEdit,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AcademicTaskFormModalProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [yearId, setYearId] = useState(initial?.yearId ?? "");
  const [subjectId, setSubjectId] = useState(initial?.subjectId ?? "");
  const [lectureType, setLectureType] = useState<LectureType | "">("");
  const [lectureId, setLectureId] = useState(initial?.lectureId ?? "");
  const [durationDays, setDurationDays] = useState(initial?.durationDays ?? 0);
  const [durationHours, setDurationHours] = useState(initial?.durationHours ?? 1);
  const [durationMinutes, setDurationMinutes] = useState(
    initial?.durationMinutes ?? 0,
  );
  const [formError, setFormError] = useState("");

  const { data: years = [] } = useGetYearsQuery();
  const { data: subjects = [] } = useGetSubjectsQuery(
    { yearId: yearId || undefined },
    { skip: !yearId },
  );
  const { data: lectures = [] } = useGetLecturesBySubjectQuery(
    { subjectId, type: lectureType as LectureType },
    { skip: !subjectId || !lectureType },
  );

  // عند التعديل: لا يحتوي التاسك على نوع المحاضرة، لذا نجلبه من بيانات المحاضرة نفسها لتعبئة الفلتر
  useEffect(() => {
    if (isEdit && initial?.lectureId && !lectureType) {
      let cancelled = false;
      getLecture(initial.lectureId)
        .then((lecture) => {
          if (!cancelled && lecture?.type) setLectureType(lecture.type);
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }
  }, [isEdit, initial?.lectureId]);

  const yearOptions = years.map((year) => ({ id: year._id, label: year.name }));
  const subjectOptions = subjects.map((subject) => ({
    id: subject._id,
    label: subject.name,
  }));
  const lectureOptions = lectures.map((lecture) => ({
    id: lecture._id,
    label: lecture.title,
  }));

  const handleYearChange = (value: string) => {
    setYearId(value);
    setSubjectId("");
    setLectureType("");
    setLectureId("");
  };

  const handleSubjectChange = (value: string) => {
    setSubjectId(value);
    setLectureType("");
    setLectureId("");
  };

  const handleLectureTypeChange = (value: LectureType | "") => {
    setLectureType(value);
    setLectureId("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return setFormError("عنوان التاسك مطلوب");
    if (!yearId) return setFormError("يرجى اختيار السنة الدراسية");
    if (!subjectId) return setFormError("يرجى اختيار المادة");
    if (!lectureType) return setFormError("يرجى اختيار نوع المحاضرة");
    if (!lectureId) return setFormError("يرجى اختيار المحاضرة");
    if (durationDays + durationHours + durationMinutes <= 0)
      return setFormError("يرجى تحديد مدة التاسك");
    setFormError("");
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      yearId,
      subjectId,
      lectureId,
      durationDays: Number(durationDays) || 0,
      durationHours: Number(durationHours) || 0,
      durationMinutes: Number(durationMinutes) || 0,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="border-b border-gray-100 px-7 pb-5 pt-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
                <ClipboardList className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {isEdit ? "تعديل التاسك" : "إنشاء تاسك أكاديمي"}
                </h3>
                <p className="mt-0.5 text-xs text-gray-400">
                  {isEdit ? "عدّل بيانات التاسك" : "أدخل بيانات التاسك الجديد"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200"
              aria-label="إغلاق"
            >
              <X size={15} className="text-gray-500" />
            </button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] space-y-5 overflow-y-auto px-7 py-6"
        >
          <label className="block text-sm font-bold text-gray-700">
            عنوان التاسك <span className="text-red-400">*</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="مثال: حل تمارين الفصل الأول"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
          <label className="block text-sm font-bold text-gray-700">
            الوصف
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="وصف مختصر للتاسك..."
              rows={3}
              className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-gray-700">
              السنة <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={yearId}
                  onChange={(event) => handleYearChange(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                >
                  <option value="">اختر السنة...</option>
                  {yearOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
            <label className="block text-sm font-bold text-gray-700">
              المادة <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={subjectId}
                  onChange={(event) => handleSubjectChange(event.target.value)}
                  disabled={!yearId}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 disabled:opacity-50"
                >
                  <option value="">اختر المادة...</option>
                  {subjectOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <BookMarked className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
            <label className="block text-sm font-bold text-gray-700">
              نوع المحاضرة <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={lectureType}
                  onChange={(event) =>
                    handleLectureTypeChange(event.target.value as LectureType | "")
                  }
                  disabled={!subjectId}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 disabled:opacity-50"
                >
                  <option value="">اختر النوع...</option>
                  {lectureTypeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Layers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
            <label className="block text-sm font-bold text-gray-700 sm:col-span-2">
              المحاضرة <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={lectureId}
                  onChange={(event) => setLectureId(event.target.value)}
                  disabled={!lectureType}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 disabled:opacity-50"
                >
                  <option value="">اختر المحاضرة...</option>
                  {lectureOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-bold text-gray-700">
              مدة التاسك <span className="text-red-400">*</span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              <label className="block text-xs font-semibold text-gray-500">
                أيام
                <input
                  type="number"
                  min={0}
                  value={durationDays}
                  onChange={(event) => setDurationDays(Number(event.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-500">
                ساعات
                <input
                  type="number"
                  min={0}
                  value={durationHours}
                  onChange={(event) => setDurationHours(Number(event.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-500">
                دقائق
                <input
                  type="number"
                  min={0}
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(Number(event.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                />
              </label>
            </div>
          </div>
          {(formError || error) && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle size={14} className="shrink-0" />
              {formError || error}
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
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
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <RefreshCcw size={15} />
                  </motion.div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  {isEdit ? "حفظ التعديلات" : "إنشاء التاسك"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
