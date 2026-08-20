import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Edit3,
  Layers,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import {
  useAddSemesterMutation,
  useDeleteSemesterMutation,
  useGetSemestersQuery,
  useUpdateSemesterMutation,
} from "../api/academicApi";
import type { Semester } from "../types";

function SemesterModal({
  initial,
  title,
  onClose,
  onSubmit,
  submitting,
}: {
  initial: string;
  title: string;
  onClose: () => void;
  onSubmit: (name: string) => void;
  submitting: boolean;
}) {
  const { t } = useTranslation(["admin", "common"]);
  const [name, setName] = useState(initial);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(name);
        }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#33529F]/10">
            <Layers className="text-[#33529F]" />
          </div>
          <div>
            <h2 className="font-black text-gray-900">{title}</h2>
            <p className="text-sm text-gray-400">{t("academic.semesters.modalHint")}</p>
          </div>
        </div>
        <label className="mb-5 block text-sm font-bold text-gray-600">
          {t("academic.semesters.nameLabel")}
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("academic.semesters.namePlaceholder")}
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[#33529F]"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-500"
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
  onClose,
  onConfirm,
  deleting,
}: {
  label: string;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
      >
        <Trash2 className="mx-auto mb-3 text-red-500" />
        <h2 className="font-black text-gray-900">
          {t("academic.semesters.deleteTitle")}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {t("academic.semesters.deleteBody", { name: label })}
        </p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-500"
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

export default function SemestersPanel() {
  const { t } = useTranslation(["admin", "common"]);
  const {
    data: semesters = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetSemestersQuery();
  const [addSemester, { isLoading: adding }] = useAddSemesterMutation();
  const [updateSemester, { isLoading: updating }] = useUpdateSemesterMutation();
  const [deleteSemester, { isLoading: deleting }] = useDeleteSemesterMutation();
  const [modal, setModal] = useState<"add" | Semester | null>(null);
  const [deletingItem, setDeletingItem] = useState<Semester | null>(null);
  const [toast, setToast] = useState("");
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };
  const submit = async (name: string) => {
    try {
      if (modal === "add") await addSemester({ name }).unwrap();
      else if (modal) await updateSemester({ id: modal._id, name }).unwrap();
      showToast(
        t(modal === "add" ? "academic.semesters.created" : "academic.saved"),
      );
      setModal(null);
    } catch {
      showToast(t("academic.actionFailed"));
    }
  };
  const remove = async () => {
    if (!deletingItem) return;
    try {
      await deleteSemester(deletingItem._id).unwrap();
      showToast(t("academic.deleted"));
      setDeletingItem(null);
    } catch {
      showToast(t("academic.semesters.deleteFailed"));
    }
  };
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500">
          {t("academic.semesters.count", { count: semesters.length })}
        </p>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            title={t("common:actions.refresh")}
            aria-label={t("common:actions.refresh")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 shadow-sm hover:text-[#404293]"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setModal("add")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-sm font-bold text-white shadow-md hover:-translate-y-0.5"
          >
            <Plus size={15} /> {t("academic.semesters.add")}
          </button>
        </div>
      </div>
      {isError && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          <AlertCircle size={15} /> {t("academic.connectionFailed")}
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-white"
            />
          ))}
        </div>
      ) : semesters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white py-20 text-center">
          <Layers className="mb-3 h-10 w-10 text-gray-200" />
          <p className="font-bold text-gray-400">{t("academic.semesters.empty")}</p>
          <button
            onClick={() => setModal("add")}
            className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-sm font-bold text-white"
          >
            <Plus size={14} /> {t("academic.semesters.add")}
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {semesters.map((semester, index) => (
              <motion.div
                key={semester._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: index * 0.04 }}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#33529F]/10"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-[#33529F] to-[#2376BB]" />
                <div className="p-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#33529F]/10">
                    <Layers className="h-6 w-6 text-[#33529F]" />
                  </div>
                  <p className="text-sm font-black leading-snug text-gray-900 group-hover:text-[#33529F]">
                    {semester.name}
                  </p>
                  <div className="mt-3 flex gap-1.5">
                    <button
                      onClick={() => setModal(semester)}
                      className="flex-1 rounded-xl py-1.5 text-[11px] font-semibold text-gray-500 hover:bg-[#404293]/[.06] hover:text-[#404293]"
                    >
                      <Edit3 size={11} className="mx-1 inline" />
                      {t("academic.edit")}
                    </button>
                    <button
                      onClick={() => setDeletingItem(semester)}
                      className="flex-1 rounded-xl py-1.5 text-[11px] font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500"
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
          <SemesterModal
            title={t(
              modal === "add"
                ? "academic.semesters.addTitle"
                : "academic.semesters.editTitle",
            )}
            initial={modal === "add" ? "" : modal.name}
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
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0))] left-1/2 z-60 -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-xl lg:bottom-6">
          {toast}
        </div>
      )}
    </div>
  );
}
