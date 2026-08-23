import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle2,
  ClipboardPaste,
  CloudUpload,
  FileJson,
  FileText,
  Info,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import {
  useBulkUploadQuestionsMutation,
  useUploadQuestionsDocxMutation,
} from "../api/questionBanksApi";
import { useTranslation } from "react-i18next";
import { useSubjectLectures } from "../hooks/useSubjectLectures";
import {
  getApiErrorMessage,
  parseQuestionsJson,
  questionsJsonTemplate,
} from "../utils/bank";

type UploadMode = "json" | "docx";

interface UploadQuestionsModalProps {
  subjectId: string;
  subjectName: string;
  isDark: boolean;
  /** يُمرَّر عند رفع أسئلة إضافية لبنك موجود */
  presetLectureId?: string;
  onClose: () => void;
  onUploaded?: (bankId: string) => void;
}

export function UploadQuestionsModal({
  subjectId,
  subjectName,
  isDark,
  presetLectureId,
  onClose,
  onUploaded,
}: UploadQuestionsModalProps) {
  const { t } = useTranslation(["admin", "common", "lectures"]);
  const jsonFileRef = useRef<HTMLInputElement>(null);
  const docxFileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<UploadMode>("json");
  const [lectureId, setLectureId] = useState(presetLectureId ?? "");
  const [jsonText, setJsonText] = useState("");
  const [jsonFileName, setJsonFileName] = useState("");
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const { lectures, isLoading: lecturesLoading } = useSubjectLectures(subjectId);

  const [bulkUpload, { isLoading: uploadingJson }] =
    useBulkUploadQuestionsMutation();
  const [uploadDocx, { isLoading: uploadingDocx }] =
    useUploadQuestionsDocxMutation();

  const uploading = uploadingJson || uploadingDocx;

  const parsed = useMemo(
    () => (mode === "json" ? parseQuestionsJson(jsonText) : null),
    [mode, jsonText],
  );

  /** القالب يحمل نصوصاً توضيحية مترجَمة، فيُعاد بناؤه عند تبديل اللغة */
  const jsonTemplate = useMemo(
    () =>
      questionsJsonTemplate({
        mcqQuestion: t("banks.upload.sample.mcqQuestion"),
        mcqExplanation: t("banks.upload.sample.mcqExplanation"),
        trueFalseQuestion: t("banks.upload.sample.trueFalseQuestion"),
      }),
    [t],
  );

  const mcqCount =
    parsed?.questions.filter((question) => question.type === "mcq").length ?? 0;
  const trueFalseCount =
    parsed?.questions.filter((question) => question.type === "true_false").length ??
    0;

  const readJsonFile = (file: File) => {
    if (!/\.json$/i.test(file.name)) {
      setLocalError(t("banks.upload.errors.jsonExtension"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setJsonText(String(reader.result ?? ""));
      setJsonFileName(file.name);
      setLocalError("");
    };
    reader.onerror = () => setLocalError(t("banks.upload.errors.readFailed"));
    reader.readAsText(file);
  };

  const setDocx = (file: File) => {
    if (!/\.docx?$/i.test(file.name)) {
      setLocalError(t("banks.upload.errors.docxExtension"));
      return;
    }
    setLocalError("");
    setDocxFile(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (!file) return;
    if (mode === "json") readJsonFile(file);
    else setDocx(file);
  };

  const handleSubmit = async () => {
    setLocalError("");
    setServerError("");

    if (!lectureId) {
      setLocalError(t("banks.upload.errors.lectureRequired"));
      return;
    }

    try {
      if (mode === "json") {
        if (!parsed || parsed.questions.length === 0) {
          setLocalError(t("banks.upload.errors.noValidQuestions"));
          return;
        }
        if (parsed.errors.length > 0) {
          setLocalError(t("banks.upload.errors.fixErrors"));
          return;
        }
        const result = await bulkUpload({
          lectureId,
          questions: parsed.questions,
        }).unwrap();
        setSuccessCount(result.questionsCount ?? parsed.questions.length);
        onUploaded?.(result.bank?._id ?? "");
        return;
      }

      if (!docxFile) {
        setLocalError(t("banks.upload.errors.docxRequired"));
        return;
      }
      const result = await uploadDocx({ lectureId, file: docxFile }).unwrap();
      setSuccessCount(result.questionsCount ?? 0);
      onUploaded?.(result.bank?._id ?? "");
    } catch (error) {
      setServerError(
        getApiErrorMessage(error) ?? t("banks.upload.errors.uploadFailed"),
      );
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
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
          isDark ? "border border-white/10 bg-[#1a1b1e]" : "border border-gray-200 bg-white"
        }`}
      >
        {/* Header */}
        <div className={`px-7 pt-7 pb-5 border-b ${isDark ? "border-white/8" : "border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                  {t("banks.upload.title")}
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{subjectName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label={t("common:actions.close")}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                isDark ? "bg-white/10 text-gray-300 hover:bg-white/15" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="px-7 py-6 space-y-5">
          {successCount !== null ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8 text-center gap-4"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isDark ? "bg-emerald-500/15" : "bg-green-500/12"
                }`}
              >
                <CheckCircle2 className={`w-8 h-8 ${isDark ? "text-emerald-400" : "text-green-500"}`} />
              </div>
              <div>
                <p className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                  {t("banks.upload.successCount", { count: successCount })}
                </p>
                <p className="text-sm mt-1 text-gray-400">
                  {t("banks.upload.successHint")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-semibold text-sm shadow-md"
              >
                {t("banks.upload.done")}
              </button>
            </motion.div>
          ) : (
            <>
              {/* Lecture select */}
              <div>
                <label className={`block text-sm font-semibold mb-1.5 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  {t("banks.upload.lectureLabel")}
                </label>
                <select
                  value={lectureId}
                  onChange={(event) => setLectureId(event.target.value)}
                  disabled={lecturesLoading || !!presetLectureId}
                  className={`${inputClass} disabled:opacity-60`}
                >
                  <option value="">
                    {t(
                      lecturesLoading
                        ? "banks.loading.lectures"
                        : lectures.length === 0
                          ? "banks.upload.noLectures"
                          : "banks.upload.chooseLecture",
                    )}
                  </option>
                  {lectures.map((lecture) => (
                    <option key={lecture._id} value={lecture._id}>
                      {lecture.title} ·{" "}
                      {t(
                        lecture.type === "practical"
                          ? "lectures:type.practical"
                          : "lectures:type.theoretical",
                      )}
                    </option>
                  ))}
                </select>
                <p className={`text-[11px] mt-1.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {t("banks.upload.lectureHint")}
                </p>
              </div>

              {/* Mode tabs */}
              <div className={`flex gap-2 p-1 rounded-2xl ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                {(
                  [
                    {
                      value: "json",
                      label: t("banks.upload.modeJson"),
                      icon: FileJson,
                    },
                    {
                      value: "docx",
                      label: t("banks.upload.modeDocx"),
                      icon: FileText,
                    },
                  ] as { value: UploadMode; label: string; icon: typeof FileJson }[]
                ).map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setMode(value);
                      setLocalError("");
                      setServerError("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      mode === value
                        ? isDark
                          ? "bg-white/10 text-[#7fb5e4] shadow-sm"
                          : "bg-white text-[#404293] shadow-sm"
                        : isDark
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>

              {/* Dropzone */}
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() =>
                  mode === "json"
                    ? jsonFileRef.current?.click()
                    : docxFileRef.current?.click()
                }
                className={`relative flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none ${
                  dragOver
                    ? isDark
                      ? "border-[#2376BB] bg-[#2376BB]/10 scale-[1.01]"
                      : "border-[#404293] bg-[#404293]/5 scale-[1.01]"
                    : (mode === "json" && jsonFileName) || (mode === "docx" && docxFile)
                      ? isDark
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-green-400 bg-green-50"
                      : isDark
                        ? "border-white/15 bg-white/5 hover:border-[#2376BB]/50"
                        : "border-gray-200 bg-gray-50 hover:border-[#404293]/50"
                }`}
              >
                <input
                  ref={jsonFileRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) readJsonFile(file);
                  }}
                />
                <input
                  ref={docxFileRef}
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setDocx(file);
                  }}
                />

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isDark ? "bg-[#2376BB]/15" : "bg-[#404293]/8"
                  }`}
                >
                  {mode === "json" ? (
                    <FileJson className={`w-6 h-6 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
                  ) : (
                    <FileText className={`w-6 h-6 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
                  )}
                </div>
                <div className="text-center">
                  <p className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    {mode === "json"
                      ? jsonFileName || t("banks.upload.dropJson")
                      : docxFile?.name || t("banks.upload.dropDocx")}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {t("banks.upload.or")}{" "}
                    <span className={isDark ? "text-[#7fb5e4] font-semibold" : "text-[#404293] font-semibold"}>
                      {t("banks.upload.chooseFile")}
                    </span>
                  </p>
                </div>
                {mode === "docx" && docxFile && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setDocxFile(null);
                    }}
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      isDark ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"
                    }`}
                  >
                    <X size={12} /> {t("banks.upload.removeFile")}
                  </button>
                )}
              </div>

              {/* JSON editor */}
              {mode === "json" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      {t("banks.upload.pasteLabel")}
                    </label>
                    <button
                      onClick={() => {
                        setJsonText(jsonTemplate);
                        setJsonFileName("");
                        setLocalError("");
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-[#404293] hover:text-[#2376BB] transition-colors"
                    >
                      <ClipboardPaste size={12} />{" "}
                      {t("banks.upload.insertTemplate")}
                    </button>
                  </div>
                  <textarea
                    value={jsonText}
                    onChange={(event) => {
                      setJsonText(event.target.value);
                      setJsonFileName("");
                    }}
                    rows={8}
                    dir="ltr"
                    spellCheck={false}
                    placeholder={jsonTemplate}
                    className={`w-full resize-y rounded-2xl border px-4 py-3 text-xs font-mono outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] ${
                      isDark
                        ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-600"
                        : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-300"
                    }`}
                  />

                  {jsonText.trim() && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                      <span
                        className={`px-2.5 py-1 rounded-full ${
                          isDark ? "bg-[#2376BB]/20 text-[#7fb5e4]" : "bg-[#404293]/10 text-[#404293]"
                        }`}
                      >
                        {t("banks.upload.validQuestions", {
                          count: parsed?.questions.length ?? 0,
                        })}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full ${
                          isDark ? "bg-[#2376BB]/20 text-[#7fb5e4]" : "bg-[#2376BB]/10 text-[#2376BB]"
                        }`}
                      >
                        {t("banks.upload.mcqCount", { count: mcqCount })}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full ${
                          isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        {t("banks.upload.trueFalseCount", {
                          count: trueFalseCount,
                        })}
                      </span>
                      {(parsed?.errors.length ?? 0) > 0 && (
                        <span
                          className={`px-2.5 py-1 rounded-full ${
                            isDark ? "bg-red-500/15 text-red-400" : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {t("banks.upload.errorsCount", {
                            count: parsed?.errors.length ?? 0,
                          })}
                        </span>
                      )}
                    </div>
                  )}

                  {jsonText.trim() && (parsed?.errors.length ?? 0) > 0 && (
                    <ul
                      className={`mt-2 space-y-1 max-h-32 overflow-y-auto rounded-xl border px-4 py-2.5 ${
                        isDark ? "bg-red-500/10 border-red-500/25" : "bg-red-50 border-red-100"
                      }`}
                    >
                      {parsed?.errors.map((parseError, index) => (
                        <li
                          key={`${parseError.code}-${index}`}
                          className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                        >
                          •{" "}
                          {t(
                            `banks.parseErrors.${parseError.code}`,
                            "position" in parseError
                              ? { position: parseError.position }
                              : undefined,
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Docx format hint */}
              {mode === "docx" && (
                <div
                  className={`flex gap-2.5 rounded-2xl border px-4 py-3 ${
                    isDark ? "bg-[#2376BB]/10 border-[#2376BB]/25" : "bg-[#2376BB]/6 border-[#2376BB]/15"
                  }`}
                >
                  <Info size={15} className="text-[#2376BB] flex-shrink-0 mt-0.5" />
                  <p className={`text-xs leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    {t("banks.upload.docxHint")}
                  </p>
                </div>
              )}

              {(localError || serverError) && (
                <div
                  className={`flex items-start gap-2 text-sm border rounded-xl px-4 py-2.5 ${
                    isDark ? "text-red-400 bg-red-500/10 border-red-500/25" : "text-red-600 bg-red-50 border-red-200"
                  }`}
                >
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{localError || serverError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-sm transition-colors ${
                    isDark
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t("common:actions.cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-lg shadow-[#404293]/25 hover:shadow-[#404293]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : mode === "json" ? (
                    <Upload size={16} />
                  ) : (
                    <CloudUpload size={16} />
                  )}
                  {t(
                    uploading
                      ? "banks.upload.submitting"
                      : "banks.upload.submit",
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
