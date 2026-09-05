import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  CloudUpload,
  File as FileIcon,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useUpdateLectureMutation, useUploadLectureMutation } from "../../api/doctorApi";
import type { MySubject } from "../../../admin/subjects/types";
import type { LectureType, LecturePopulated } from "../../../admin/lectures/types";

interface DoctorLectureFormModalProps {
  isDark: boolean;
  subjects: MySubject[];
  isSubjectsLoading?: boolean;
  defaultSubjectId?: string;
  lecture?: LecturePopulated | null;
  onClose: () => void;
}

const ALLOWED_TYPES = ["application/pdf", "video/mp4", "video/webm", "video/quicktime"];
const MAX_SIZE = 200 * 1024 * 1024;

export function DoctorLectureFormModal({
  isDark,
  subjects,
  isSubjectsLoading = false,
  defaultSubjectId,
  lecture,
  onClose,
}: DoctorLectureFormModalProps) {
  const { t } = useTranslation(["doctor", "common"]);
  const errorMessage = useErrorMessage();
  const isEdit = Boolean(lecture);
  const fileRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(lecture?.title ?? "");
  const [description, setDescription] = useState(lecture?.description ?? "");
  // subjects قد تصل بعد أول رندر (الصفحة لم تُنهِ تحميل my-subjects بعد)، لذا
  // نشتقّ الافتراضي وقت الرندر بدل تخزينه في state تُهيَّأ مرّة واحدة فقط
  const [subjectIdOverride, setSubjectIdOverride] = useState<string | null>(null);
  const subjectId = subjectIdOverride ?? defaultSubjectId ?? subjects[0]?._id ?? "";
  const setSubjectId = setSubjectIdOverride;
  const [type, setType] = useState<LectureType>(lecture?.type ?? "theoretical");
  const [isPublished, setIsPublished] = useState(lecture?.isPublished ?? true);
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const [uploadLecture, uploadState] = useUploadLectureMutation();
  const [updateLecture, updateState] = useUpdateLectureMutation();
  const isSubmitting = uploadState.isLoading || updateState.isLoading;
  const serverError = uploadState.error ?? updateState.error;

  const validateAndSet = (selected: File) => {
    if (selected.size > MAX_SIZE) {
      setLocalError(t("lectures.form.errors.fileTooLarge"));
      return;
    }
    if (!ALLOWED_TYPES.includes(selected.type) && !selected.type.startsWith("video/")) {
      setLocalError(t("lectures.form.errors.invalidFileType"));
      return;
    }
    setLocalError("");
    setFile(selected);
    if (!isEdit && !title.trim()) {
      setTitle(selected.name.replace(/\.[^.]+$/i, ""));
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped) validateAndSet(dropped);
  };

  const handleSubmit = async () => {
    setLocalError("");

    if (!title.trim() || (!isEdit && (!subjectId || !file))) {
      setLocalError(t("lectures.form.errors.missingFields"));
      return;
    }

    try {
      if (isEdit && lecture) {
        await updateLecture({
          id: lecture._id,
          data: {
            title: title.trim(),
            description: description.trim(),
            isPublished,
            ...(file ? { lecture: file } : {}),
          },
        }).unwrap();
      } else if (file) {
        await uploadLecture({
          title: title.trim(),
          description: description.trim(),
          subjectId,
          type,
          isPublished,
          file,
        }).unwrap();
      }
      setSuccess(true);
    } catch {
      return;
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] ${
    isDark
      ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-500"
      : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
          isDark ? "border border-white/10 bg-[#1a1b1e]" : "bg-white"
        }`}
      >
        <div className={`px-7 pt-7 pb-5 border-b ${isDark ? "border-white/8" : "border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
                <CloudUpload className="w-5 h-5 text-white" />
              </div>
              <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                {t(isEdit ? "lectures.form.editTitle" : "lectures.form.uploadTitle")}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                isDark ? "bg-white/10 text-gray-300 hover:bg-white/15" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="px-7 py-6 space-y-5">
          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8 text-center gap-4"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? "bg-green-500/15" : "bg-green-500/12"}`}>
                <CheckCircle2 className={`w-8 h-8 ${isDark ? "text-green-400" : "text-green-500"}`} />
              </div>
              <div>
                <p className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                  {t(isEdit ? "lectures.form.updatedTitle" : "lectures.form.successTitle")}
                </p>
                {!isEdit && (
                  <p className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {t("lectures.form.successMessage", { title })}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-semibold text-sm shadow-md"
              >
                {t("lectures.form.done")}
              </button>
            </motion.div>
          ) : (
            <>
              {!isEdit && (
                <>
                  <div>
                    <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      {t("lectures.form.subjectLabel")}
                    </label>
                    <select
                      value={subjectId}
                      onChange={(event) => setSubjectId(event.target.value)}
                      disabled={isSubjectsLoading}
                      className={`${inputClass} disabled:opacity-60`}
                    >
                      {isSubjectsLoading ? (
                        <option value="">{t("common:states.loading")}</option>
                      ) : (
                        <>
                          <option value="">{t("lectures.form.chooseSubject")}</option>
                          {subjects.map((subject) => (
                            <option key={subject._id} value={subject._id}>
                              {subject.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      {t("lectures.form.typeLabel")}
                    </label>
                    <div className={`flex gap-2 p-1 rounded-2xl ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                      {(["theoretical", "practical"] as LectureType[]).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setType(value)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            type === value
                              ? isDark
                                ? "bg-white/10 text-[#7fb5e4] shadow-sm"
                                : "bg-white text-[#404293] shadow-sm"
                              : isDark
                                ? "text-gray-400 hover:text-gray-200"
                                : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {t(`lectures.types.${value}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none ${
                  dragOver
                    ? isDark
                      ? "border-[#7fb5e4] bg-[#2376BB]/10 scale-[1.01]"
                      : "border-[#404293] bg-[#404293]/5 scale-[1.01]"
                    : file
                      ? isDark
                        ? "border-green-500/50 bg-green-500/10"
                        : "border-green-400 bg-green-50"
                      : isDark
                        ? "border-white/15 bg-white/5 hover:border-[#2376BB]/50"
                        : "border-gray-200 bg-gray-50 hover:border-[#404293]/50"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf,video/*"
                  className="hidden"
                  onChange={(event) => {
                    const selected = event.target.files?.[0];
                    if (selected) validateAndSet(selected);
                  }}
                />
                {file ? (
                  <>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? "bg-red-500/15" : "bg-red-500/10"}`}>
                      <FileText className={`w-6 h-6 ${isDark ? "text-red-400" : "text-red-500"}`} />
                    </div>
                    <p className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                      {file.name}
                    </p>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setFile(null);
                      }}
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        isDark ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"
                      }`}
                    >
                      <X size={12} /> {t("lectures.form.removeFile")}
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? "bg-[#2376BB]/15" : "bg-[#404293]/8"}`}>
                      <FileIcon className={`w-6 h-6 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
                    </div>
                    <p className={`font-semibold text-sm text-center ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {dragOver ? t("lectures.form.dropzone.releaseToUpload") : t("lectures.form.dropzone.dropTitle")}
                    </p>
                    <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {t("lectures.form.dropzone.or")}{" "}
                      <span className={isDark ? "text-[#7fb5e4] font-semibold" : "text-[#404293] font-semibold"}>
                        {t("lectures.form.dropzone.browseFiles")}
                      </span>
                    </p>
                    <span className={`text-[10px] uppercase tracking-wider ${isDark ? "text-gray-600" : "text-gray-300"}`}>
                      {t("lectures.form.dropzone.hint")}
                    </span>
                    {isEdit && (
                      <span className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                        {t("lectures.form.replaceFileHint")}
                      </span>
                    )}
                  </>
                )}
              </div>

              {(localError || serverError) && (
                <div
                  className={`flex items-center gap-2 text-sm rounded-xl px-4 py-2.5 border ${
                    isDark
                      ? "text-red-400 bg-red-500/10 border-red-500/25"
                      : "text-red-600 bg-red-50 border-red-200"
                  }`}
                >
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>
                    {localError ||
                      (serverError ? errorMessage(serverError) : "") ||
                      t(isEdit ? "lectures.form.errors.updateFailed" : "lectures.form.errors.uploadFailed")}
                  </span>
                </div>
              )}

              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  {t("lectures.form.titleLabel")}
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t("lectures.form.titlePlaceholder")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  {t("lectures.form.descriptionLabel")}
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  placeholder={t("lectures.form.descriptionPlaceholder")}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className={`flex items-center gap-2 text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(event) => setIsPublished(event.target.checked)}
                    className="w-4 h-4 rounded text-[#404293] focus:ring-[#404293]"
                  />
                  {t("lectures.form.publishCheckbox")}
                </label>
                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {t(isPublished ? "lectures.form.publishedHint" : "lectures.form.draftHint")}
                </span>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition-colors ${
                    isDark ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t("lectures.form.cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-lg shadow-[#404293]/25 hover:shadow-[#404293]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <CloudUpload size={16} />
                    </motion.div>
                  ) : (
                    <Upload size={16} />
                  )}
                  {isSubmitting
                    ? t("lectures.form.uploading")
                    : t(isEdit ? "lectures.form.saveChanges" : "lectures.form.submit")}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
