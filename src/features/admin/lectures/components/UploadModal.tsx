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
  yearId: string;
  semesterId: string;
  subjectId: string;
  subjectName: string;
  type: LectureType;
}

export function UploadModal({
  onClose,
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
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-7 pt-7 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
                <CloudUpload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {t("lectureManagement.upload.title")}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
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
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={15} className="text-gray-500" />
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
              <div className="w-16 h-16 rounded-full bg-green-500/12 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">
                  {t("lectureManagement.upload.successTitle")}
                </p>
                <p className="text-sm text-gray-400 mt-1">
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
                    ? "border-[#404293] bg-[#404293]/5 scale-[1.01]"
                    : file
                      ? "border-green-400 bg-green-50"
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
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                      <FileText className="w-7 h-7 text-red-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-800 text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setFile(null);
                        setTitle("");
                      }}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold"
                    >
                      <X size={12} /> {t("lectureManagement.upload.removeFile")}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-[#404293]/8 flex items-center justify-center">
                      <FileIcon className="w-7 h-7 text-[#404293]" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-700 text-sm">
                        {dragOver
                          ? t("lectureManagement.upload.dropzone.releaseToUpload")
                          : t("lectureManagement.upload.dropzone.dropTitle")}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {t("lectureManagement.upload.dropzone.or")}{" "}
                        <span className="text-[#404293] font-semibold">
                          {t("lectureManagement.upload.dropzone.browseFiles")}
                        </span>
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">
                      {t("lectureManagement.upload.dropzone.hint")}
                    </span>
                  </>
                )}
              </div>

              {(localError || uploadFailed || error) && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>
                    {localError || error || t("lectureManagement.upload.failed")}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t("lectureManagement.upload.titleLabel")}
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t("lectureManagement.upload.titlePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t("lectureManagement.upload.descriptionLabel")}
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400"
                  placeholder={t(
                    "lectureManagement.upload.descriptionPlaceholder",
                  )}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(event) => setIsPublished(event.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#404293] focus:ring-[#404293]"
                  />
                  {t("lectureManagement.upload.publishCheckbox")}
                </label>
                <span className="text-xs text-gray-400">
                  {isPublished
                    ? t("lectureManagement.upload.publishedHint")
                    : t("lectureManagement.upload.draftHint")}
                </span>
              </div>

              {uploading && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500 font-medium">
                      {t("lectureManagement.upload.uploading")}
                    </span>
                    <span className="text-xs font-bold text-[#404293]">
                      {Math.min(uploadProgress, 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
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