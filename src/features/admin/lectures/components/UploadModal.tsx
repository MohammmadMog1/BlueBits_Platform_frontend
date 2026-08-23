import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import {
  CloudUpload,
  X,
  FileText,
  File as FileIcon,
  AlertCircle,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks";
import { resetLectureState, setUploadProgress } from "../redux/lecturesSlice";
import { uploadLectureThunk } from "../redux/lecturesThunks";
import type { LectureType } from "../types";

interface UploadModalProps {
  onClose: () => void;
  isDark: boolean;
  yearId: string;
  semesterId: string;
  subjectId: string;
  subjectName: string;
  type: LectureType;
}

export function UploadModal({
  onClose,
  isDark,
  subjectId,
  subjectName,
  type,
}: UploadModalProps) {
  const { t } = useTranslation("admin");
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [localError, setLocalError] = useState("");

  const { uploadProgress, uploadStatus, error } = useAppSelector(
    (state) => state.lectures,
  );

  const uploading = uploadStatus === "loading";
  const uploadFailed = uploadStatus === "failed";
  const uploadSucceeded = uploadStatus === "succeeded";

  useEffect(() => {
    return () => {
      dispatch(setUploadProgress(0));
    };
  }, [dispatch]);

  const validateAndSet = (selected: File) => {
    const allowedTypes = [
      "application/pdf",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];
    const maxSize = 200 * 1024 * 1024; // 200 MB

    if (selected.size > maxSize) {
      setLocalError(t("lectureManagement.upload.errors.fileTooLarge"));
      return;
    }
    if (
      !allowedTypes.includes(selected.type) &&
      !selected.type.startsWith("video/")
    ) {
      setLocalError(t("lectureManagement.upload.errors.invalidFileType"));
      return;
    }

    setLocalError("");
    setFile(selected);
    setTitle(selected.name.replace(/\.[^.]+$/i, ""));
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) validateAndSet(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file || !title.trim()) {
      setLocalError(t("lectureManagement.upload.errors.missingFields"));
      return;
    }

    setLocalError("");
    dispatch(setUploadProgress(0));

    // ✅ تم التعديل: إزالة yearId و semesterId من الـ payload
    // لأن الـ Backend يستنتجهما تلقائياً من subjectId
    await dispatch(
      uploadLectureThunk({
        title: title.trim(),
        description: description.trim(),
        file,
        subjectId,
        type,
        isPublished,
      }),
    )
      .unwrap()
      .catch(() => {
        return;
      });
  };

  const handleClose = () => {
    dispatch(resetLectureState());
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden ${
          isDark ? "border border-white/10 bg-[#1a1b1e]" : "bg-white"
        }`}
      >
        <div
          className={`px-7 pt-7 pb-5 border-b ${
            isDark ? "border-white/8" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
                <CloudUpload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3
                  className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {t("lectureManagement.upload.title")}
                </h3>
                <p
                  className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {t("lectureManagement.upload.subjectAndType", {
                    subject: subjectName,
                    type: t(
                      type === "practical"
                        ? "lectureManagement.types.practical"
                        : "lectureManagement.types.theoretical",
                    ),
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                isDark
                  ? "bg-white/10 text-gray-300 hover:bg-white/15"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="px-7 py-6 space-y-5">
          {uploadSucceeded ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8 text-center gap-4"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isDark ? "bg-green-500/15" : "bg-green-500/12"
                }`}
              >
                <CheckCircle2
                  className={`w-8 h-8 ${isDark ? "text-green-400" : "text-green-500"}`}
                />
              </div>
              <div>
                <p
                  className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {t("lectureManagement.upload.successTitle")}
                </p>
                <p
                  className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {t("lectureManagement.upload.successMessage", { title })}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-semibold text-sm shadow-md"
              >
                {t("lectureManagement.upload.done")}
              </button>
            </motion.div>
          ) : (
            <>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !file && fileRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none ${
                  dragOver
                    ? isDark
                      ? "border-[#7fb5e4] bg-[#2376BB]/10 scale-[1.01]"
                      : "border-[#404293] bg-[#404293]/5 scale-[1.01]"
                    : file
                      ? isDark
                        ? "border-green-500/50 bg-green-500/10"
                        : "border-green-400 bg-green-50"
                      : isDark
                        ? "border-white/15 bg-white/5 hover:border-[#2376BB]/50 hover:bg-[#2376BB]/5"
                        : "border-gray-200 bg-gray-50 hover:border-[#404293]/50 hover:bg-[#404293]/3"
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
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isDark ? "bg-red-500/15" : "bg-red-500/10"
                      }`}
                    >
                      <FileText
                        className={`w-7 h-7 ${isDark ? "text-red-400" : "text-red-500"}`}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-800"}`}
                      >
                        {file.name}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setFile(null);
                        setTitle("");
                      }}
                      className={`flex items-center gap-1 text-xs font-semibold ${
                        isDark
                          ? "text-red-400 hover:text-red-300"
                          : "text-red-500 hover:text-red-600"
                      }`}
                    >
                      <X size={12} /> {t("lectureManagement.upload.removeFile")}
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isDark ? "bg-[#2376BB]/15" : "bg-[#404293]/8"
                      }`}
                    >
                      <FileIcon
                        className={`w-7 h-7 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}
                      />
                    </div>
                    <div className="text-center">
                      <p
                        className={`font-semibold text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {dragOver
                          ? t("lectureManagement.upload.dropzone.releaseToUpload")
                          : t("lectureManagement.upload.dropzone.dropTitle")}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {t("lectureManagement.upload.dropzone.or")}{" "}
                        <span
                          className={`font-semibold ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}
                        >
                          {t("lectureManagement.upload.dropzone.browseFiles")}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider ${
                        isDark ? "text-gray-600" : "text-gray-300"
                      }`}
                    >
                      {t("lectureManagement.upload.dropzone.hint")}
                    </span>
                  </>
                )}
              </div>

              {(localError || uploadFailed || error) && (
                <div
                  className={`flex items-center gap-2 text-sm rounded-xl px-4 py-2.5 border ${
                    isDark
                      ? "text-red-400 bg-red-500/10 border-red-500/25"
                      : "text-red-600 bg-red-50 border-red-200"
                  }`}
                >
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>
                    {localError || error || t("lectureManagement.upload.failed")}
                  </span>
                </div>
              )}

              <div>
                <label
                  className={`block text-sm font-semibold mb-1.5 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {t("lectureManagement.upload.titleLabel")}
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t("lectureManagement.upload.titlePlaceholder")}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400 ${
                    isDark
                      ? "border-white/10 bg-white/5 text-gray-100"
                      : "border-gray-200 bg-gray-50 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-1.5 ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {t("lectureManagement.upload.descriptionLabel")}
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400 ${
                    isDark
                      ? "border-white/10 bg-white/5 text-gray-100"
                      : "border-gray-200 bg-gray-50 text-gray-900"
                  }`}
                  placeholder={t(
                    "lectureManagement.upload.descriptionPlaceholder",
                  )}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(event) => setIsPublished(event.target.checked)}
                    className={`w-4 h-4 rounded text-[#404293] focus:ring-[#404293] ${
                      isDark ? "border-white/20 bg-white/5" : "border-gray-300"
                    }`}
                  />
                  {t("lectureManagement.upload.publishCheckbox")}
                </label>
                <span
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {isPublished
                    ? t("lectureManagement.upload.publishedHint")
                    : t("lectureManagement.upload.draftHint")}
                </span>
              </div>

              {uploading && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {t("lectureManagement.upload.uploading")}
                    </span>
                    <span
                      className={`text-xs font-bold ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}
                    >
                      {Math.min(uploadProgress, 100)}%
                    </span>
                  </div>
                  <div
                    className={`h-2 rounded-full overflow-hidden ${
                      isDark ? "bg-white/10" : "bg-gray-100"
                    }`}
                  >
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(uploadProgress, 100)}%` }}
                      transition={{ ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB]"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleClose}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition-colors ${
                    isDark
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t("lectureManagement.upload.cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploading || !file}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-lg shadow-[#404293]/25 hover:shadow-[#404293]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <CloudUpload size={16} />
                    </motion.div>
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploading
                    ? t("lectureManagement.upload.uploading")
                    : t("lectureManagement.upload.submit")}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
