import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  Edit3,
  GraduationCap,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import {
  useAddYearMutation,
  useDeleteYearMutation,
  useGetYearsQuery,
  useUpdateYearMutation,
} from "../api/academicApi";
import type { AcademicYear } from "../types";

type FormState = { name: string; order: string };

function YearModal({
  initial,
  title,
  onClose,
  onSubmit,
  submitting,
}: {
  initial: FormState;
  title: string;
  onClose: () => void;
  onSubmit: (values: FormState) => void;
  submitting: boolean;
}) {
  const [values, setValues] = useState(initial);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
      dir="rtl"
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(values);
        }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#404293]/10">
            <GraduationCap className="text-[#404293]" />
          </div>
          <div>
            <h2 className="font-black text-gray-900">{title}</h2>
            <p className="text-sm text-gray-400">أدخل بيانات السنة الدراسية</p>
          </div>
        </div>
        <label className="mb-4 block text-sm font-bold text-gray-600">
          اسم السنة
          <input
            required
            value={values.name}
            onChange={(event) =>
              setValues({ ...values, name: event.target.value })
            }
            placeholder="مثال: Year 1"
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#404293]"
          />
        </label>
        {!initial.order && (
          <label className="mb-5 block text-sm font-bold text-gray-600">
            الترتيب
            <input
              type="number"
              value={values.order}
              onChange={(event) =>
                setValues({ ...values, order: event.target.value })
              }
              placeholder="مثال: 1"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#404293]"
            />
          </label>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-500"
          >
            إلغاء
          </button>
          <button
            disabled={submitting}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {submitting ? "جارٍ الحفظ..." : "حفظ"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

function DeleteConfirm({
  label,
  onClose,
  onConfirm,
  deleting,
}: {
  label: string;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
      >
        <Trash2 className="mx-auto mb-3 text-red-500" />
        <h2 className="font-black text-gray-900">حذف السنة الدراسية؟</h2>
        <p className="mt-2 text-sm text-gray-500">
          سيتم حذف «{label}» نهائياً.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-500"
          >
            إلغاء
          </button>
          <button
            disabled={deleting}
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {deleting ? "جارٍ الحذف..." : "حذف"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function YearsPanel() {
  const {
    data: years = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetYearsQuery();
  const [addYear, { isLoading: adding }] = useAddYearMutation();
  const [updateYear, { isLoading: updating }] = useUpdateYearMutation();
  const [deleteYear, { isLoading: deleting }] = useDeleteYearMutation();
  const [modal, setModal] = useState<"add" | AcademicYear | null>(null);
  const [deletingItem, setDeletingItem] = useState<AcademicYear | null>(null);
  const [toast, setToast] = useState("");
  const sortedYears = [...years].sort(
    (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0),
  );
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };
  const submit = async (values: FormState) => {
    try {
      if (modal === "add")
        await addYear({
          name: values.name,
          ...(values.order ? { order: Number(values.order) } : {}),
        }).unwrap();
      else if (modal)
        await updateYear({ id: modal._id, name: values.name }).unwrap();
      showToast(
        modal === "add" ? "تم إنشاء السنة بنجاح ✓" : "تم حفظ التعديلات ✓",
      );
      setModal(null);
    } catch {
      showToast("تعذّر تنفيذ العملية");
    }
  };
  const remove = async () => {
    if (!deletingItem) return;
    try {
      await deleteYear(deletingItem._id).unwrap();
      showToast("تم الحذف");
      setDeletingItem(null);
    } catch {
      showToast("تعذّر حذف السنة");
    }
  };

  return (
    <div dir="rtl">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500">
          {years.length} سنة مسجّلة
        </p>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            title="تحديث"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:text-[#404293]"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setModal("add")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5"
          >
            <Plus size={15} /> إضافة سنة
          </button>
        </div>
      </div>
      {isError && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          <AlertCircle size={15} /> تعذّر الاتصال بالخادم
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
            />
          ))}
        </div>
      ) : sortedYears.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white py-20 text-center">
          <GraduationCap className="mb-3 h-10 w-10 text-gray-200" />
          <p className="font-bold text-gray-400">لا توجد سنوات بعد</p>
          <button
            onClick={() => setModal("add")}
            className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus size={14} /> إضافة سنة
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {sortedYears.map((year, index) => (
              <motion.div
                key={year._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: index * 0.04 }}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#404293]/10"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
                <div className="p-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#404293]/10">
                    <GraduationCap className="h-6 w-6 text-[#404293]" />
                  </div>
                  <p className="text-sm font-black leading-snug text-gray-900 group-hover:text-[#404293]">
                    {year.name}
                  </p>
                  {year.order !== undefined && (
                    <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
                      الترتيب: {year.order}
                    </p>
                  )}
                  <div className="mt-3 flex gap-1.5">
                    <button
                      onClick={() => setModal(year)}
                      className="flex-1 rounded-xl py-1.5 text-[11px] font-semibold text-gray-500 hover:bg-[#404293]/[.06] hover:text-[#404293]"
                    >
                      <Edit3 size={11} className="mx-1 inline" />
                      تعديل
                    </button>
                    <button
                      onClick={() => setDeletingItem(year)}
                      className="flex-1 rounded-xl py-1.5 text-[11px] font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={11} className="mx-1 inline" />
                      حذف
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
      <AnimatePresence>
        {modal && (
          <YearModal
            title={
              modal === "add" ? "إضافة سنة دراسية" : "تعديل السنة الدراسية"
            }
            initial={
              modal === "add"
                ? { name: "", order: "" }
                : { name: modal.name, order: "edit" }
            }
            onClose={() => setModal(null)}
            onSubmit={submit}
            submitting={adding || updating}
          />
        )}
        {deletingItem && (
          <DeleteConfirm
            label={deletingItem.name}
            onClose={() => setDeletingItem(null)}
            onConfirm={remove}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
