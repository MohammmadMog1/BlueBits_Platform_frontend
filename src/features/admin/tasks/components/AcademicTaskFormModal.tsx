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
import { useTranslation } from "react-i18next";
import { useGetYearsQuery } from "../../academic/api/academicApi";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsApi";
import { getLecture } from "../../lectures/api/lecturesService";
import { useGetLecturesBySubjectQuery } from "../api/academicTasksApi";
import type { AcademicTaskFormData, LectureType } from "../types";

const LECTURE_TYPES: LectureType[] = ["theoretical", "practical"];

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
  const { t } = useTranslation(["admin", "common", "lectures"]);
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
    if (!title.trim()) return setFormError(t("tasks.form.titleRequired"));
    if (!yearId) return setFormError(t("tasks.form.yearRequired"));
    if (!subjectId) return setFormError(t("tasks.form.subjectRequired"));
    if (!lectureType) return setFormError(t("tasks.form.lectureTypeRequired"));
    if (!lectureId) return setFormError(t("tasks.form.lectureRequired"));
    if (durationDays + durationHours + durationMinutes <= 0)
      return setFormError(t("tasks.form.durationRequired"));
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
                  {t(isEdit ? "tasks.form.editTitle" : "tasks.form.createTitle")}
                </h3>
                <p className="mt-0.5 text-xs text-gray-400">
                  {t(isEdit ? "tasks.form.editSubtitle" : "tasks.form.createSubtitle")}
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
            {t("tasks.form.titleLabel")} <span className="text-red-400">*</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("tasks.form.titlePlaceholder")}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
          <label className="block text-sm font-bold text-gray-700">
            {t("tasks.form.descriptionLabel")}
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t("tasks.form.descriptionPlaceholder")}
              rows={3}
              className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all placeholder-gray-400 focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
            />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-gray-700">
              {t("tasks.form.yearLabel")} <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={yearId}
                  onChange={(event) => handleYearChange(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 ps-10 pe-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                >
                  <option value="">{t("tasks.form.chooseYear")}</option>
                  {yearOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <GraduationCap className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
            <label className="block text-sm font-bold text-gray-700">
              {t("tasks.form.subjectLabel")} <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={subjectId}
                  onChange={(event) => handleSubjectChange(event.target.value)}
                  disabled={!yearId}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 ps-10 pe-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 disabled:opacity-50"
                >
                  <option value="">{t("tasks.form.chooseSubject")}</option>
                  {subjectOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <BookMarked className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
            <label className="block text-sm font-bold text-gray-700">
              {t("tasks.form.lectureTypeLabel")} <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={lectureType}
                  onChange={(event) =>
                    handleLectureTypeChange(event.target.value as LectureType | "")
                  }
                  disabled={!subjectId}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 ps-10 pe-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 disabled:opacity-50"
                >
                  <option value="">{t("tasks.form.chooseType")}</option>
                  {LECTURE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {t(`lectures:type.${type}`)}
                    </option>
                  ))}
                </select>
                <Layers className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
            <label className="block text-sm font-bold text-gray-700 sm:col-span-2">
              {t("tasks.form.lectureLabel")} <span className="text-red-400">*</span>
              <div className="relative mt-1.5">
                <select
                  value={lectureId}
                  onChange={(event) => setLectureId(event.target.value)}
                  disabled={!lectureType}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 ps-10 pe-4 text-sm font-normal text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 disabled:opacity-50"
                >
                  <option value="">{t("tasks.form.chooseLecture")}</option>
                  {lectureOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FileText className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </label>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-bold text-gray-700">
              {t("tasks.form.durationLabel")} <span className="text-red-400">*</span>
            </p>
            <div className="grid grid-cols-3 gap-3">
              <label className="block text-xs font-semibold text-gray-500">
                {t("tasks.form.days")}
                <input
                  type="number"
                  min={0}
                  value={durationDays}
                  onChange={(event) => setDurationDays(Number(event.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-500">
                {t("tasks.form.hours")}
                <input
                  type="number"
                  min={0}
                  value={durationHours}
                  onChange={(event) => setDurationHours(Number(event.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-900 outline-none transition-all focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
                />
              </label>
              <label className="block text-xs font-semibold text-gray-500">
                {t("tasks.form.minutes")}
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
                  {t("tasks.form.saving")}
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  {t(isEdit ? "tasks.form.save" : "tasks.form.create")}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
