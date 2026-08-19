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
import { useSubjectLectures } from "../hooks/useSubjectLectures";
import {
  QUESTIONS_JSON_TEMPLATE,
  getApiErrorMessage,
  parseQuestionsJson,
} from "../utils/bank";

type UploadMode = "json" | "docx";

interface UploadQuestionsModalProps {
  subjectId: string;
  subjectName: string;
  /** يُمرَّر عند رفع أسئلة إضافية لبنك موجود */
  presetLectureId?: string;
  onClose: () => void;
  onUploaded?: (bankId: string) => void;
}

export function UploadQuestionsModal({
  subjectId,
  subjectName,
  presetLectureId,
  onClose,
  onUploaded,
}: UploadQuestionsModalProps) {
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

  const mcqCount =
    parsed?.questions.filter((question) => question.type === "mcq").length ?? 0;
  const trueFalseCount =
    parsed?.questions.filter((question) => question.type === "true_false").length ??
    0;

  const readJsonFile = (file: File) => {
    if (!/\.json$/i.test(file.name)) {
      setLocalError("الملف يجب أن يكون بصيغة .json");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setJsonText(String(reader.result ?? ""));
      setJsonFileName(file.name);
      setLocalError("");
    };
    reader.onerror = () => setLocalError("تعذّر قراءة الملف.");
    reader.readAsText(file);
  };

  const setDocx = (file: File) => {
    if (!/\.docx?$/i.test(file.name)) {
      setLocalError("الملف يجب أن يكون بصيغة .docx");
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
      setLocalError("اختر المحاضرة التي سيُربط بها بنك الأسئلة.");
      return;
    }

    try {
      if (mode === "json") {
        if (!parsed || parsed.questions.length === 0) {
          setLocalError("لا توجد أسئلة صالحة للرفع.");
          return;
        }
        if (parsed.errors.length > 0) {
          setLocalError("صحّح الأخطاء الظاهرة أدناه قبل الرفع.");
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
        setLocalError("اختر ملف الوورد أولاً.");
        return;
      }
      const result = await uploadDocx({ lectureId, file: docxFile }).unwrap();
      setSuccessCount(result.questionsCount ?? 0);
      onUploaded?.(result.bank?._id ?? "");
    } catch (error) {
      setServerError(getApiErrorMessage(error, "تعذّر رفع الأسئلة."));
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400";

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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Upload Questions
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{subjectName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={15} className="text-gray-500" />
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
              <div className="w-16 h-16 rounded-full bg-green-500/12 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">
                  تم رفع {successCount} سؤال بنجاح
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  البنك محفوظ كمسودة — راجع الأسئلة ثم انشره للطلاب.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-semibold text-sm shadow-md"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <>
              {/* Lecture select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Lecture
                </label>
                <select
                  value={lectureId}
                  onChange={(event) => setLectureId(event.target.value)}
                  disabled={lecturesLoading || !!presetLectureId}
                  className={`${inputClass} disabled:opacity-60`}
                >
                  <option value="">
                    {lecturesLoading
                      ? "جارٍ تحميل المحاضرات…"
                      : lectures.length === 0
                        ? "لا توجد محاضرات في هذه المادة"
                        : "اختر المحاضرة"}
                  </option>
                  {lectures.map((lecture) => (
                    <option key={lecture._id} value={lecture._id}>
                      {lecture.title} · {lecture.type === "practical" ? "عملي" : "نظري"}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  إذا كان للمحاضرة بنك موجود، تُضاف الأسئلة إليه.
                </p>
              </div>

              {/* Mode tabs */}
              <div className="flex gap-2 p-1 rounded-2xl bg-gray-100">
                {(
                  [
                    { value: "json", label: "JSON", icon: FileJson },
                    { value: "docx", label: "Word (.docx)", icon: FileText },
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
                        ? "bg-white text-[#404293] shadow-sm"
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
                    ? "border-[#404293] bg-[#404293]/5 scale-[1.01]"
                    : (mode === "json" && jsonFileName) || (mode === "docx" && docxFile)
                      ? "border-green-400 bg-green-50"
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

                <div className="w-12 h-12 rounded-2xl bg-[#404293]/8 flex items-center justify-center">
                  {mode === "json" ? (
                    <FileJson className="w-6 h-6 text-[#404293]" />
                  ) : (
                    <FileText className="w-6 h-6 text-[#404293]" />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-700 text-sm">
                    {mode === "json"
                      ? jsonFileName || "أفلت ملف الأسئلة (.json) هنا"
                      : docxFile?.name || "أفلت ملف الوورد (.docx) هنا"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    أو{" "}
                    <span className="text-[#404293] font-semibold">
                      اختر ملفاً من جهازك
                    </span>
                  </p>
                </div>
                {mode === "docx" && docxFile && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setDocxFile(null);
                    }}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold"
                  >
                    <X size={12} /> إزالة الملف
                  </button>
                )}
              </div>

              {/* JSON editor */}
              {mode === "json" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      أو الصق الأسئلة كـ JSON
                    </label>
                    <button
                      onClick={() => {
                        setJsonText(QUESTIONS_JSON_TEMPLATE);
                        setJsonFileName("");
                        setLocalError("");
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-[#404293] hover:text-[#2376BB] transition-colors"
                    >
                      <ClipboardPaste size={12} /> إدراج نموذج
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
                    placeholder={QUESTIONS_JSON_TEMPLATE}
                    className="w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-mono text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-300"
                  />

                  {jsonText.trim() && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                      <span className="px-2.5 py-1 rounded-full bg-[#404293]/10 text-[#404293]">
                        {parsed?.questions.length ?? 0} سؤال صالح
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#2376BB]/10 text-[#2376BB]">
                        {mcqCount} اختيار من متعدد
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                        {trueFalseCount} صح / خطأ
                      </span>
                      {(parsed?.errors.length ?? 0) > 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-600">
                          {parsed?.errors.length} خطأ
                        </span>
                      )}
                    </div>
                  )}

                  {jsonText.trim() && (parsed?.errors.length ?? 0) > 0 && (
                    <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto rounded-xl bg-red-50 border border-red-100 px-4 py-2.5">
                      {parsed?.errors.map((error) => (
                        <li key={error} className="text-xs text-red-600">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Docx format hint */}
              {mode === "docx" && (
                <div className="flex gap-2.5 rounded-2xl bg-[#2376BB]/6 border border-[#2376BB]/15 px-4 py-3">
                  <Info size={15} className="text-[#2376BB] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    ملف الوورد يجب أن يلتزم بالصيغة المتفق عليها مع الباك (سؤال ثم
                    خياراته وتحديد الإجابة الصحيحة). إذا لم يتعرّف السيرفر على
                    الأسئلة سترى رسالة{" "}
                    <span className="font-semibold">
                      «تأكد إنو الملف ملتزم بالصيغة المطلوبة»
                    </span>
                    .
                  </p>
                </div>
              )}

              {(localError || serverError) && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{localError || serverError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
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
                  {uploading ? "جارٍ الرفع…" : "رفع الأسئلة"}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
