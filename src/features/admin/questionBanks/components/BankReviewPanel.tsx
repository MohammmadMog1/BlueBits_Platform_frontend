import { useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  BrainCircuit,
  CalendarCheck,
  GraduationCap,
  ListChecks,
  Loader2,
  Plus,
  Send,
  Trash2,
  Undo2,
  Users,
} from "lucide-react";
import { QuestionReviewCard } from "./QuestionReviewCard";
import { QuestionEditorModal } from "./QuestionEditorModal";
import { BankResultsPanel } from "./BankResultsPanel";
import type { Question, QuestionBank, QuestionOption, QuestionType } from "../types";
import {
  formatDateTime,
  getLectureTitle,
  getSubjectName,
  getYearName,
} from "../utils/bank";
import type { QuestionBankPermissions } from "../hooks/useQuestionBankPermissions";

type ReviewTab = "questions" | "results";

interface BankReviewPanelProps {
  bank: QuestionBank;
  questions: Question[];
  isLoading?: boolean;
  isMutating?: boolean;
  actionError?: string | null;
  permissions: QuestionBankPermissions;
  onPublish: () => void;
  onUnpublish: () => void;
  onDeleteBank: () => void;
  onDeleteQuestion: (questionId: string) => void;
  onUpdateQuestion: (
    questionId: string,
    data: {
      questionText: string;
      explanation?: string;
      options: QuestionOption[];
      type: QuestionType;
    },
  ) => Promise<boolean>;
  onAddQuestions: () => void;
}

export function BankReviewPanel({
  bank,
  questions,
  isLoading,
  isMutating,
  actionError,
  permissions,
  onPublish,
  onUnpublish,
  onDeleteBank,
  onDeleteQuestion,
  onUpdateQuestion,
  onAddQuestions,
}: BankReviewPanelProps) {
  const [tab, setTab] = useState<ReviewTab>("questions");
  const [editing, setEditing] = useState<Question | null>(null);
  const [confirmDeleteBank, setConfirmDeleteBank] = useState(false);

  const isPublished = bank.status === "published";

  return (
    <div className="space-y-5">
      {/* Bank header */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25 flex-shrink-0">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-gray-900 text-base truncate">
                  {getLectureTitle(bank) || bank.title}
                </h3>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isPublished
                      ? "bg-green-500/12 text-green-600"
                      : "bg-amber-500/12 text-amber-600"
                  }`}
                >
                  {isPublished ? "PUBLISHED" : "DRAFT"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <GraduationCap size={12} className="text-gray-300" />
                  {getYearName(bank)} · {getSubjectName(bank)}
                </span>
                <span className="flex items-center gap-1">
                  <ListChecks size={12} className="text-gray-300" />
                  {bank.questionCount ?? questions.length} questions
                </span>
                <span className="flex items-center gap-1">
                  <CalendarCheck size={12} className="text-gray-300" />
                  {isPublished
                    ? `نُشر ${formatDateTime(bank.publishedAt)}`
                    : `أُنشئ ${formatDateTime(bank.createdAt)}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {permissions.canCreate && (
              <button
                onClick={onAddQuestions}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:text-[#404293] hover:border-[#404293]/30 shadow-sm transition-all"
              >
                <Plus size={14} /> إضافة أسئلة
              </button>
            )}
            <button
              onClick={isPublished ? onUnpublish : onPublish}
              disabled={isMutating}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 ${
                isPublished
                  ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/25"
                  : "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-[#404293]/25 hover:-translate-y-0.5"
              }`}
            >
              {isMutating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isPublished ? (
                <Undo2 size={14} />
              ) : (
                <Send size={14} />
              )}
              {isPublished ? "إلغاء النشر" : "نشر للطلاب"}
            </button>
            {confirmDeleteBank ? (
              <span className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setConfirmDeleteBank(false);
                    onDeleteBank();
                  }}
                  disabled={isMutating}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  تأكيد الحذف
                </button>
                <button
                  onClick={() => setConfirmDeleteBank(false)}
                  className="px-2 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-600"
                >
                  إلغاء
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDeleteBank(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
              >
                <Trash2 size={14} /> حذف البنك
              </button>
            )}
          </div>
        </div>
      </div>

      {actionError && (
        <div className="rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 text-sm text-red-600 font-medium">
          {actionError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl bg-gray-100 max-w-md">
        {(
          [
            { value: "questions", label: "الأسئلة", icon: ListChecks },
            { value: "results", label: "نتائج الطلاب", icon: Users },
          ] as { value: ReviewTab; label: string; icon: typeof ListChecks }[]
        ).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === value
                ? "bg-white text-[#404293] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Body */}
      {tab === "questions" ? (
        isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">جارٍ تحميل الأسئلة…</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <ListChecks className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-bold text-gray-400 mb-1">لا توجد أسئلة في هذا البنك</p>
            <p className="text-sm text-gray-300 mb-4">
              ارفع أسئلة عبر ملف JSON أو ملف وورد.
            </p>
            {permissions.canCreate && (
              <button
                onClick={onAddQuestions}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-sm font-bold shadow-md"
              >
                <Plus size={14} /> إضافة أسئلة
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {questions.map((question, index) => (
                <QuestionReviewCard
                  key={question._id}
                  question={question}
                  index={index + 1}
                  disabled={isMutating}
                  canUpdate={permissions.canUpdateQuestion}
                  canDelete={permissions.canDeleteQuestion}
                  onEdit={() => setEditing(question)}
                  onDelete={() => onDeleteQuestion(question._id)}
                />
              ))}
            </div>
          </AnimatePresence>
        )
      ) : (
        <BankResultsPanel bankId={bank._id} />
      )}

      {/* Question editor */}
      <AnimatePresence>
        {editing && (
          <QuestionEditorModal
            key={editing._id}
            question={editing}
            saving={isMutating}
            error={actionError}
            onClose={() => setEditing(null)}
            onSave={(data) => onUpdateQuestion(editing._id, data)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
