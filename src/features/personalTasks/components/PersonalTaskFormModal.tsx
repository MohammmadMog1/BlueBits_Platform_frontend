import { useState } from "react";
import { AlertCircle, Calendar, CheckCircle2, ClipboardList, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import BottomSheetModal from "../../../shared/components/BottomSheetModal/BottomSheetModal";
import type { PersonalTaskFormData } from "../types";

interface PersonalTaskFormModalProps {
  initial?: PersonalTaskFormData;
  isEdit: boolean;
  isSubmitting: boolean;
  error?: string;
  isDark: boolean;
  onClose: () => void;
  onSubmit: (data: PersonalTaskFormData) => void;
}

const toDateInputValue = (iso?: string) => (iso ? iso.slice(0, 10) : "");

export default function PersonalTaskFormModal({
  initial,
  isEdit,
  isSubmitting,
  error,
  isDark,
  onClose,
  onSubmit,
}: PersonalTaskFormModalProps) {
  const { t } = useTranslation("tasks");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState(toDateInputValue(initial?.dueDate));
  const [formError, setFormError] = useState("");

  const inputClass = `mt-1.5 w-full rounded-xl border px-4 py-3 text-sm font-normal outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] ${
    isDark
      ? "border-white/10 bg-white/5 text-white placeholder-gray-600"
      : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
  }`;
  const labelClass = `block text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-700"}`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return setFormError(t("personal.form.titleRequired"));
    if (!dueDate) return setFormError(t("personal.form.dueDateRequired"));
    setFormError("");
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate,
    });
  };

  return (
    <BottomSheetModal
      onClose={onClose}
      isDark={isDark}
      icon={<ClipboardList className="h-5 w-5 text-white" />}
      title={t(isEdit ? "personal.form.editTitle" : "personal.form.createTitle")}
      subtitle={t(
        isEdit ? "personal.form.editSubtitle" : "personal.form.createSubtitle",
      )}
      footer={
        <button
          type="submit"
          form="personal-task-form"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#404293]/25 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <RefreshCcw size={15} />
              </motion.div>
              {t("personal.form.saving")}
            </>
          ) : (
            <>
              <CheckCircle2 size={15} />
              {t(isEdit ? "personal.form.save" : "personal.form.create")}
            </>
          )}
        </button>
      }
    >
      <form id="personal-task-form" onSubmit={handleSubmit} className="space-y-4">
        <label className={labelClass}>
          {t("personal.form.titleLabel")} <span className="text-red-400">*</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("personal.form.titlePlaceholder")}
            autoFocus
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          {t("personal.form.descriptionLabel")}
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("personal.form.descriptionPlaceholder")}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </label>
        <label className={labelClass}>
          {t("personal.form.dueDateLabel")} <span className="text-red-400">*</span>
          <div className="relative mt-1.5">
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className={`w-full appearance-none rounded-xl border py-3 ps-10 pe-4 text-sm font-normal outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 ${
                isDark
                  ? "border-white/10 bg-white/5 text-white"
                  : "border-gray-200 bg-gray-50 text-gray-900"
              }`}
            />
            <Calendar
              className={`pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            />
          </div>
        </label>
        {(formError || error) && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle size={14} className="shrink-0" />
            {formError || error}
          </div>
        )}
      </form>
    </BottomSheetModal>
  );
}
