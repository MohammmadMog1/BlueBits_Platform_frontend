import { useState } from "react";
import { AlertCircle, CheckCircle2, GraduationCap, Loader2, Megaphone, RefreshCcw, X } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useGetYearsQuery } from "../../academic/api/academicApi";
import { errorAlertClass, faintClass, fieldClass, headingClass } from "../../../../shared/utils/theme";
import type { AnnouncementFormData } from "../types";

interface AnnouncementFormModalProps {
  initial?: AnnouncementFormData;
  isEdit: boolean;
  isSubmitting: boolean;
  error?: string;
  isDark: boolean;
  onClose: () => void;
  onSubmit: (data: AnnouncementFormData) => void;
}

export default function AnnouncementFormModal({
  initial,
  isEdit,
  isSubmitting,
  error,
  isDark,
  onClose,
  onSubmit,
}: AnnouncementFormModalProps) {
  const { t } = useTranslation(["announcements", "common"]);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [yearId, setYearId] = useState(initial?.yearId ?? "");
  const [formError, setFormError] = useState("");

  const { data: years = [], isLoading: yearsLoading } = useGetYearsQuery();
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
        className={`w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl ${
          isDark ? "border border-white/10 bg-[#1a1b1e]" : "border border-gray-200 bg-white"
        }`}
      >
        <div className={`border-b px-7 pb-5 pt-7 ${isDark ? "border-white/8" : "border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${headingClass(isDark)}`}>
                  {t(isEdit ? "admin.form.editTitle" : "admin.form.createTitle")}
                </h3>
                <p className={`mt-0.5 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {t(isEdit ? "admin.form.editSubtitle" : "admin.form.createSubtitle")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                isDark ? "bg-white/10 text-gray-300 hover:bg-white/15" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              aria-label={t("common:actions.close")}
            >
              <X size={15} />
            </button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-h-[70vh] space-y-5 overflow-y-auto px-7 py-6"
        >
          <label className={`block text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {t("admin.form.titleLabel")} <span className="text-red-400">*</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("admin.form.titlePlaceholder")}
              className={`mt-1.5 ${fieldClass(isDark)}`}
            />
          </label>
          <label className={`block text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {t("admin.form.contentLabel")} <span className="text-red-400">*</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={t("admin.form.contentPlaceholder")}
              rows={5}
              className={`mt-1.5 resize-none ${fieldClass(isDark)}`}
            />
          </label>
          <label className={`block text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            {t("admin.form.yearLabel")} {!isEdit && <span className="text-red-400">*</span>}
            <div className="relative mt-1.5">
              <select
                value={yearId}
                onChange={(event) => setYearId(event.target.value)}
                disabled={isEdit || yearsLoading}
                className={`w-full appearance-none rounded-xl border py-3 ps-10 pe-4 text-sm font-semibold outline-none transition-colors focus:border-[#2376BB] focus:ring-2 focus:ring-[#2376BB]/20 disabled:opacity-50 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-gray-100"
                    : "border-gray-200 bg-gray-50 text-gray-800"
                }`}
              >
                {yearsLoading ? (
                  <option value="">{t("common:states.loading")}</option>
                ) : (
                  <>
                    <option value="">{t("admin.form.chooseYear")}</option>
                    {yearOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {yearsLoading ? (
                <Loader2
                  className={`pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              ) : (
                <GraduationCap
                  className={`pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              )}
            </div>
            {isEdit && (
              <span className={`mt-1 block text-xs font-normal ${faintClass(isDark)}`}>
                {t("admin.form.yearLocked")}
              </span>
            )}
          </label>
          {(formError || error) && (
            <div className={errorAlertClass(isDark)}>
              <AlertCircle size={14} className="shrink-0" />
              {formError || error}
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                isDark
                  ? "border-white/10 text-gray-300 hover:bg-white/5"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
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
