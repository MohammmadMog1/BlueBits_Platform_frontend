import { useState } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { Question, QuestionOption, QuestionType } from "../types";

const TRUE_FALSE_LABELS = ["صح", "خطأ"] as const;

interface QuestionEditorModalProps {
  question: Question;
  saving?: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (data: {
    questionText: string;
    explanation?: string;
    options: QuestionOption[];
    type: QuestionType;
  }) => Promise<boolean>;
}

export function QuestionEditorModal({
  question,
  saving,
  error,
  onClose,
  onSave,
}: QuestionEditorModalProps) {
  const [type, setType] = useState<QuestionType>(question.type);
  const [questionText, setQuestionText] = useState(question.questionText);
  const [explanation, setExplanation] = useState(question.explanation ?? "");
  const [localError, setLocalError] = useState("");

  const [mcqOptions, setMcqOptions] = useState<QuestionOption[]>(() => {
    if (question.type === "mcq" && question.options?.length) {
      return question.options.map((option) => ({ ...option }));
    }
    return [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ];
  });

  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean>(() => {
    if (question.type === "true_false") {
      const correctIndex = question.options?.findIndex((option) => option.isCorrect);
      return correctIndex === 0;
    }
    return true;
  });

  const setCorrectOption = (index: number) =>
    setMcqOptions((options) =>
      options.map((option, optionIndex) => ({
        ...option,
        isCorrect: optionIndex === index,
      })),
    );

  const updateOptionText = (index: number, text: string) =>
    setMcqOptions((options) =>
      options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, text } : option,
      ),
    );

  const addOption = () =>
    setMcqOptions((options) => [...options, { text: "", isCorrect: false }]);

  const removeOption = (index: number) =>
    setMcqOptions((options) => {
      if (options.length <= 2) return options;
      const next = options.filter((_, optionIndex) => optionIndex !== index);
      if (!next.some((option) => option.isCorrect)) next[0].isCorrect = true;
      return next;
    });

  const handleSave = async () => {
    setLocalError("");

    if (!questionText.trim()) {
      setLocalError("نص السؤال مطلوب.");
      return;
    }

    let options: QuestionOption[];

    if (type === "true_false") {
      options = [
        { text: TRUE_FALSE_LABELS[0], isCorrect: trueFalseAnswer },
        { text: TRUE_FALSE_LABELS[1], isCorrect: !trueFalseAnswer },
      ];
    } else {
      const cleaned = mcqOptions.map((option) => ({
        text: option.text.trim(),
        isCorrect: option.isCorrect,
      }));
      if (cleaned.length < 2) {
        setLocalError("السؤال يحتاج خيارين على الأقل.");
        return;
      }
      if (cleaned.some((option) => !option.text)) {
        setLocalError("لا يمكن ترك خيار بدون نص.");
        return;
      }
      if (cleaned.filter((option) => option.isCorrect).length !== 1) {
        setLocalError("حدّد إجابة صحيحة واحدة.");
        return;
      }
      options = cleaned;
    }

    const saved = await onSave({
      questionText: questionText.trim(),
      explanation: explanation.trim() || undefined,
      options,
      type,
    });

    if (saved) onClose();
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[320] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
      >
        <div className="px-7 pt-7 pb-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
              <Pencil className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">تعديل السؤال</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                التعديل يُطبَّق مباشرة على بنك الأسئلة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">
          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              نوع السؤال
            </label>
            <div className="flex gap-2 p-1 rounded-2xl bg-gray-100">
              {(
                [
                  { value: "mcq", label: "اختيار من متعدد" },
                  { value: "true_false", label: "صح / خطأ" },
                ] as { value: QuestionType; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setType(value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    type === value
                      ? "bg-white text-[#404293] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Question text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              نص السؤال
            </label>
            <textarea
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293]"
            />
          </div>

          {/* Options */}
          {type === "mcq" ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  الخيارات
                </label>
                <button
                  onClick={addOption}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-[#404293] hover:text-[#2376BB] transition-colors"
                >
                  <Plus size={12} /> إضافة خيار
                </button>
              </div>
              <div className="space-y-2">
                {mcqOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <button
                      onClick={() => setCorrectOption(index)}
                      title="تحديد كإجابة صحيحة"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
                        option.isCorrect
                          ? "bg-green-500/12 border-green-500/30 text-green-600"
                          : "bg-gray-50 border-gray-200 text-gray-300 hover:text-gray-400"
                      }`}
                    >
                      <CheckCircle2 size={16} />
                    </button>
                    <input
                      value={option.text}
                      onChange={(event) => updateOptionText(index, event.target.value)}
                      placeholder={`الخيار ${index + 1}`}
                      className={inputClass}
                    />
                    <button
                      onClick={() => removeOption(index)}
                      disabled={mcqOptions.length <= 2}
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:hover:text-gray-300 disabled:hover:bg-transparent transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الإجابة الصحيحة
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    onClick={() => setTrueFalseAnswer(value)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      trueFalseAnswer === value
                        ? "bg-green-500/10 border-green-500/30 text-green-600"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {value ? "صح" : "خطأ"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              التفسير (اختياري)
            </label>
            <textarea
              value={explanation}
              onChange={(event) => setExplanation(event.target.value)}
              rows={2}
              placeholder="سبب كون الإجابة صحيحة"
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#404293]/20 focus:border-[#404293] placeholder-gray-400"
            />
          </div>

          {(localError || error) && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-lg shadow-[#404293]/25 hover:shadow-[#404293]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              حفظ التعديل
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
