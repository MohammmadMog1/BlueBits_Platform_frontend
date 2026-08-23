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
import { useTranslation } from "react-i18next";
import {
  dividerClass,
  errorAlertClass,
  faintClass,
  headingClass,
  mutedClass,
} from "../../../../shared/utils/theme";
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
  isDark: boolean;
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
  isDark,
  onClose,
  onSubmit,
}: SubjectFormModalProps) {
  const { t } = useTranslation(["admin", "common"]);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [yearId, setYearId] = useState(initial?.yearId ?? "");
  const [semesterId, setSemesterId] = useState(initial?.semesterId ?? "");
  const [formError, setFormError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return setFormError(t("subjects.form.nameRequired"));
    if (!yearId) return setFormError(t("subjects.form.yearRequired"));
    if (!semesterId) return setFormError(t("subjects.form.semesterRequired"));
    setFormError("");
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      yearId,
      semesterId,
    });
  };

  const inputClass = `mt-1.5 w-full rounded-xl border px-4 py-3 text-sm font-normal outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 ${
    isDark
      ? "border-white/10 bg-white/5 text-white placeholder-gray-600"
      : "border-gray-200 bg-gray-50 text-gray-900"
  }`;
  const selectClass = `w-full appearance-none rounded-xl border py-3 ps-10 pe-4 text-sm font-normal outline-none transition-all focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 ${
    isDark ? "border-white/10 bg-white/5 text-white" : "border-gray-200 bg-gray-50 text-gray-900"
  }`;
  const labelClass = `block text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-700"}`;

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
        <div className={`border-b px-7 pb-5 pt-7 ${dividerClass(isDark)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
                <BookMarked className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${headingClass(isDark)}`}>
                  {t(isEdit ? "subjects.form.editTitle" : "subjects.form.createTitle")}
                </h3>
                <p className={`mt-0.5 text-xs ${mutedClass(isDark)}`}>
                  {t(isEdit ? "subjects.form.editSubtitle" : "subjects.form.createSubtitle")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                isDark ? "bg-white/10 hover:bg-white/15" : "bg-gray-100 hover:bg-gray-200"
              }`}
              aria-label={t("common:actions.close")}
            >
              <X size={15} className={mutedClass(isDark)} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 px-7 py-6">
          <label className={labelClass}>
            {t("subjects.form.nameLabel")} <span className="text-red-400">*</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("subjects.form.namePlaceholder")}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            {t("subjects.form.descriptionLabel")}
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("subjects.form.descriptionPlaceholder")}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              {t("subjects.form.yearLabel")} <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={yearId}
                  onChange={(event) => setYearId(event.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("subjects.form.chooseYear")}</option>
                  {yearOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <GraduationCap
                  className={`pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 ${faintClass(isDark)}`}
                />
              </div>
            </label>
            <label className={labelClass}>
              {t("subjects.form.semesterLabel")} <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={semesterId}
                  onChange={(event) => setSemesterId(event.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("subjects.form.chooseSemester")}</option>
                  {semesterOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Layers
                  className={`pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 ${faintClass(isDark)}`}
                />
              </div>
            </label>
          </div>
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
                  ? "border-white/15 text-gray-300 hover:bg-white/5"
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
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <RefreshCcw size={15} />
                  </motion.div>
                  {t("subjects.form.saving")}
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  {t(isEdit ? "subjects.form.save" : "subjects.form.create")}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
