import { useState } from "react";
import {
  AlertCircle,
  BookMarked,
  CheckCircle2,
  GraduationCap,
  Layers,
  RefreshCcw,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import type { SubjectFormData } from "../types";

interface Option {
  id: string;
  label: string;
}

interface SubjectFormModalProps {
  initial?: SubjectFormData;
  isEdit: boolean;
  isSubmitting: boolean;
  error?: string;
  yearOptions: Option[];
  semesterOptions: Option[];
  onClose: () => void;
  onSubmit: (data: SubjectFormData) => void;
}

export default function SubjectFormModal({
  initial,
  isEdit,
  isSubmitting,
  error,
  yearOptions,
  semesterOptions,
  onClose,
  onSubmit,
}: SubjectFormModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [yearId, setYearId] = useState(initial?.yearId ?? "");
  const [semesterId, setSemesterId] = useState(initial?.semesterId ?? "");
  const [formError, setFormError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return setFormError("اسم المادة مطلوب");
    if (!yearId) return setFormError("يرجى اختيار السنة الدراسية");
    if (!semesterId) return setFormError("يرجى اختيار الفصل الدراسي");
    setFormError("");
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      yearId,
      semesterId,
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
                <BookMarked className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {isEdit ? "تعديل المادة" : "إضافة مادة جديدة"}
                </h3>
                <p className="mt-0.5 text-xs text-gray-400">
                  {isEdit ? "عدّل بيانات المادة" : "أدخل بيانات المادة الجديدة"}
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
        <form onSubmit={handleSubmit} className="space-y-5 px-7 py-6">
          <label className="block text-sm font-bold text-gray-700">
            اسم المادة <span className="text-red-400">*</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="مثال: نمذجة ومحاكاة"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
          <label className="block text-sm font-bold text-gray-700">
            وصف المادة
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="وصف مختصر للمادة..."
              rows={3}
              className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-gray-700">
              السنة الدراسية <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={yearId}
                  onChange={(event) => setYearId(event.target.value)}
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
              الفصل الدراسي <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={semesterId}
                  onChange={(event) => setSemesterId(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                >
                  <option value="">اختر الفصل...</option>
                  {semesterOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Layers className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
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
                  {isEdit ? "حفظ التعديلات" : "إنشاء المادة"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
