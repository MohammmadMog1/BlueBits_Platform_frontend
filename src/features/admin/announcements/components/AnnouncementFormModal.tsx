import { useState } from "react";
import { AlertCircle, CheckCircle2, GraduationCap, Megaphone, RefreshCcw, X } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useGetYearsQuery } from "../../academic/api/academicApi";
import type { AnnouncementFormData } from "../types";

interface AnnouncementFormModalProps {
  initial?: AnnouncementFormData;
  isEdit: boolean;
  isSubmitting: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (data: AnnouncementFormData) => void;
}

export default function AnnouncementFormModal({
  initial,
  isEdit,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AnnouncementFormModalProps) {
  const { t } = useTranslation(["announcements", "common"]);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [yearId, setYearId] = useState(initial?.yearId ?? "");
  const [formError, setFormError] = useState("");

  const { data: years = [] } = useGetYearsQuery();
  const yearOptions = years.map((year) => ({ id: year._id, label: year.name }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return setFormError(t("admin.form.titleRequired"));
    if (!content.trim()) return setFormError(t("admin.form.contentRequired"));
    if (!isEdit && !yearId) return setFormError(t("admin.form.yearRequired"));
    setFormError("");
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      yearId,
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
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {t(isEdit ? "admin.form.editTitle" : "admin.form.createTitle")}
                </h3>
                <p className="mt-0.5 text-xs text-gray-400">
                  {t(isEdit ? "admin.form.editSubtitle" : "admin.form.createSubtitle")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200"
              aria-label={t("common:actions.close")}
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
            {t("admin.form.titleLabel")} <span className="text-red-400">*</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("admin.form.titlePlaceholder")}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
          <label className="block text-sm font-bold text-gray-700">
            {t("admin.form.contentLabel")} <span className="text-red-400">*</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={t("admin.form.contentPlaceholder")}
              rows={5}
              className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
          <label className="block text-sm font-bold text-gray-700">
            {t("admin.form.yearLabel")} {!isEdit && <span className="text-red-400">*</span>}
            <div className="relative mt-1.5">
              <select
                value={yearId}
                onChange={(event) => setYearId(event.target.value)}
                disabled={isEdit}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 ps-10 pe-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 disabled:opacity-50"
              >
                <option value="">{t("admin.form.chooseYear")}</option>
                {yearOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <GraduationCap className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            {isEdit && (
              <span className="mt-1 block text-xs font-normal text-gray-400">
                {t("admin.form.yearLocked")}
              </span>
            )}
          </label>
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
              {t("common:actions.cancel")}
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
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCcw size={15} />
                  </motion.div>
                  {t("admin.form.saving")}
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  {t(isEdit ? "admin.form.save" : "admin.form.create")}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
