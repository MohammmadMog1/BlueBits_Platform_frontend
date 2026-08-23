import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
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
import {
  cardClass,
  emptyBoxClass,
  faintClass,
  fieldClass,
  headingClass,
  mutedClass,
  skeletonClass,
} from "../../../../shared/utils/theme";

type FormState = { name: string; order: string };

function YearModal({
  initial,
  title,
  isDark,
  onClose,
  onSubmit,
  submitting,
}: {
  initial: FormState;
  title: string;
  isDark: boolean;
  onClose: () => void;
  onSubmit: (values: FormState) => void;
  submitting: boolean;
}) {
  const { t } = useTranslation(["admin", "common"]);
  const [values, setValues] = useState(initial);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
      <motion.form
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(values);
        }}
        className={`w-full max-w-md rounded-3xl p-6 shadow-2xl ${
          isDark ? "bg-[#202121] ring-1 ring-white/10" : "bg-white"
        }`}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              isDark ? "bg-[#2376BB]/15" : "bg-[#404293]/10"
            }`}
          >
            <GraduationCap className={isDark ? "text-[#7fb5e4]" : "text-[#404293]"} />
          </div>
          <div>
            <h2 className={`font-black ${headingClass(isDark)}`}>{title}</h2>
            <p className={`text-sm ${mutedClass(isDark)}`}>
              {t("academic.years.modalHint")}
            </p>
          </div>
        </div>
        <label className={`mb-4 block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {t("academic.years.nameLabel")}
          <input
            required
            value={values.name}
            onChange={(event) =>
              setValues({ ...values, name: event.target.value })
            }
            placeholder={t("academic.years.namePlaceholder")}
            className={`mt-1.5 ${fieldClass(isDark)}`}
          />
        </label>
        {!initial.order && (
          <label className={`mb-5 block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {t("academic.years.orderInputLabel")}
            <input
              type="number"
              value={values.order}
              onChange={(event) =>
                setValues({ ...values, order: event.target.value })
              }
              placeholder={t("academic.years.orderPlaceholder")}
              className={`mt-1.5 ${fieldClass(isDark)}`}
            />
          </label>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-bold ${
              isDark
                ? "border-white/10 text-gray-300 hover:bg-white/5"
                : "border-gray-200 text-gray-500"
            }`}
          >
            {t("common:actions.cancel")}
          </button>
          <button
            disabled={submitting}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {t(submitting ? "academic.saving" : "academic.save")}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

function DeleteConfirm({
  label,
  isDark,
  onClose,
  onConfirm,
  deleting,
}: {
  label: string;
  isDark: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl ${
          isDark ? "bg-[#202121] ring-1 ring-white/10" : "bg-white"
        }`}
      >
        <Trash2 className={`mx-auto mb-3 ${isDark ? "text-red-400" : "text-red-500"}`} />
        <h2 className={`font-black ${headingClass(isDark)}`}>
          {t("academic.years.deleteTitle")}
        </h2>
        <p className={`mt-2 text-sm ${mutedClass(isDark)}`}>
          {t("academic.years.deleteBody", { name: label })}
        </p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-bold ${
              isDark
                ? "border-white/10 text-gray-300 hover:bg-white/5"
                : "border-gray-200 text-gray-500"
            }`}
          >
            {t("common:actions.cancel")}
          </button>
          <button
            disabled={deleting}
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {t(deleting ? "academic.deleting" : "academic.delete")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function YearsPanel({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation(["admin", "common"]);
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
        t(modal === "add" ? "academic.years.created" : "academic.saved"),
      );
      setModal(null);
    } catch {
      showToast(t("academic.actionFailed"));
    }
  };
  const remove = async () => {
    if (!deletingItem) return;
    try {
      await deleteYear(deletingItem._id).unwrap();
      showToast(t("academic.deleted"));
      setDeletingItem(null);
    } catch {
      showToast(t("academic.years.deleteFailed"));
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className={`text-sm font-semibold ${mutedClass(isDark)}`}>
          {t("academic.years.count", { count: years.length })}
        </p>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            title={t("common:actions.refresh")}
            aria-label={t("common:actions.refresh")}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
              isDark
                ? "border-white/10 bg-white/5 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
                : "border-gray-200 bg-white text-gray-400 shadow-sm hover:border-[#404293]/30 hover:text-[#404293]"
            }`}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setModal("add")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5"
          >
            <Plus size={15} /> {t("academic.years.add")}
          </button>
        </div>
      </div>
      {isError && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            isDark
              ? "border-amber-500/25 bg-amber-500/10 text-amber-400"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <AlertCircle size={15} /> {t("academic.connectionFailed")}
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={`h-32 p-5 ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : sortedYears.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center rounded-3xl py-20 text-center ${emptyBoxClass(isDark)}`}
        >
          <GraduationCap className={`mb-3 h-10 w-10 ${faintClass(isDark)}`} />
          <p className={`font-bold ${mutedClass(isDark)}`}>{t("academic.years.empty")}</p>
          <button
            onClick={() => setModal("add")}
            className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus size={14} /> {t("academic.years.add")}
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
                className={`group overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#404293]/10 ${cardClass(isDark)}`}
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-[#404293] to-[#2376BB]" />
                <div className="p-4 text-center">
                  <div
                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${
                      isDark ? "bg-[#2376BB]/15" : "bg-[#404293]/10"
                    }`}
                  >
                    <GraduationCap className={`h-6 w-6 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
                  </div>
                  <p
                    className={`text-sm font-black leading-snug group-hover:text-[#404293] ${headingClass(isDark)}`}
                  >
                    {year.name}
                  </p>
                  {year.order !== undefined && (
                    <p className={`mt-0.5 text-[11px] font-semibold ${mutedClass(isDark)}`}>
                      {t("academic.years.orderLabel", { order: year.order })}
                    </p>
                  )}
                  <div className="mt-3 flex gap-1.5">
                    <button
                      onClick={() => setModal(year)}
                      className={`flex-1 rounded-xl py-1.5 text-[11px] font-semibold hover:bg-[#404293]/[.06] hover:text-[#404293] ${mutedClass(isDark)}`}
                    >
                      <Edit3 size={11} className="mx-1 inline" />
                      {t("academic.edit")}
                    </button>
                    <button
                      onClick={() => setDeletingItem(year)}
                      className={`flex-1 rounded-xl py-1.5 text-[11px] font-semibold hover:bg-red-50 hover:text-red-500 ${faintClass(isDark)}`}
                    >
                      <Trash2 size={11} className="mx-1 inline" />
                      {t("academic.delete")}
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
            title={t(
              modal === "add"
                ? "academic.years.addTitle"
                : "academic.years.editTitle",
            )}
            isDark={isDark}
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
            isDark={isDark}
            onClose={() => setDeletingItem(null)}
            onConfirm={remove}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
      {toast && (
        <div
          className={`fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0))] left-1/2 z-60 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-xl lg:bottom-6 ${
            isDark ? "bg-black" : "bg-gray-900"
          }`}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
