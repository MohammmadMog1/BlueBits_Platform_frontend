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
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import type { Question, QuestionBank, QuestionOption, QuestionType } from "../types";
import {
  getLectureTitle,
  getSubjectName,
  getYearName,
} from "../utils/bank";
import type { QuestionBankPermissions } from "../hooks/useQuestionBankPermissions";

type ReviewTab = "questions" | "results";

interface BankReviewPanelProps {
  bank: QuestionBank;
  questions: Question[];
  isDark: boolean;
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
  isDark,
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
  const { t } = useTranslation("admin");
  const { formatDateTimeOrDash } = useFormatters();
  const [tab, setTab] = useState<ReviewTab>("questions");
  const [editing, setEditing] = useState<Question | null>(null);
  const [confirmDeleteBank, setConfirmDeleteBank] = useState(false);

  const isPublished = bank.status === "published";

  return (
    <div className="space-y-5">
      {/* Bank header */}
      <div className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50/60"}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25 flex-shrink-0">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-black text-base truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                  {getLectureTitle(bank) || bank.title}
                </h3>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isPublished
                      ? isDark
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-green-500/12 text-green-600"
                      : isDark
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-amber-500/12 text-amber-600"
                  }`}
                >
                  {t(
                    isPublished ? "banks.card.published" : "banks.card.draft",
                  )}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <GraduationCap size={12} className={isDark ? "text-gray-600" : "text-gray-300"} />
                  {getYearName(bank)} · {getSubjectName(bank)}
                </span>
                <span className="flex items-center gap-1">
                  <ListChecks size={12} className={isDark ? "text-gray-600" : "text-gray-300"} />
                  {t("banks.review.questionsCount", {
                    count: bank.questionCount ?? questions.length,
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarCheck size={12} className={isDark ? "text-gray-600" : "text-gray-300"} />
                  {isPublished
                    ? t("banks.review.publishedOn", {
                        date: formatDateTimeOrDash(bank.publishedAt),
                      })
                    : t("banks.review.createdOn", {
                        date: formatDateTimeOrDash(bank.createdAt),
                      })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {permissions.canCreate && (
              <button
                onClick={onAddQuestions}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold shadow-sm transition-all ${
                  isDark
                    ? "border-white/10 bg-white/5 text-gray-300 hover:text-[#7fb5e4] hover:border-[#2376BB]/40"
                    : "border-gray-200 bg-white text-gray-600 hover:text-[#404293] hover:border-[#404293]/30"
                }`}
              >
                <Plus size={14} /> {t("banks.review.addQuestions")}
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
              {t(
                isPublished ? "banks.review.unpublish" : "banks.review.publish",
              )}
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
                  {t("banks.review.confirmDeleteBank")}
                </button>
                <button
                  onClick={() => setConfirmDeleteBank(false)}
                  className={`px-2 py-2 rounded-xl text-xs font-semibold ${
                    isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t("banks.card.cancel")}
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDeleteBank(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-transparent transition-all ${
                  isDark
                    ? "text-gray-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                    : "text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100"
                }`}
              >
                <Trash2 size={14} /> {t("banks.review.deleteBank")}
              </button>
            )}
          </div>
        </div>
      </div>

      {actionError && (
        <div
          className={`rounded-2xl border px-5 py-3.5 text-sm font-medium ${
            isDark ? "bg-red-500/10 border-red-500/25 text-red-400" : "bg-red-50 border-red-100 text-red-600"
          }`}
        >
          {actionError}
        </div>
      )}

      {/* Tabs */}
      <div className={`flex gap-2 p-1 rounded-2xl max-w-md ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
        {(
          [
            {
              value: "questions",
              label: t("banks.review.tabQuestions"),
              icon: ListChecks,
            },
            {
              value: "results",
              label: t("banks.review.tabResults"),
              icon: Users,
            },
          ] as { value: ReviewTab; label: string; icon: typeof ListChecks }[]
        ).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === value
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

      {/* Body */}
      {tab === "questions" ? (
        isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">
              {t("banks.loading.questions")}
            </span>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                isDark ? "bg-white/5" : "bg-gray-100"
              }`}
            >
              <ListChecks className={`w-7 h-7 ${isDark ? "text-gray-500" : "text-gray-300"}`} />
            </div>
            <p className={`font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-400"}`}>
              {t("banks.review.noQuestionsTitle")}
            </p>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-500" : "text-gray-300"}`}>
              {t("banks.review.noQuestionsHint")}
            </p>
            {permissions.canCreate && (
              <button
                onClick={onAddQuestions}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-sm font-bold shadow-md"
              >
                <Plus size={14} /> {t("banks.review.addQuestions")}
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
                  isDark={isDark}
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
        <BankResultsPanel bankId={bank._id} isDark={isDark} />
      )}

      {/* Question editor */}
      <AnimatePresence>
        {editing && (
          <QuestionEditorModal
            key={editing._id}
            question={editing}
            isDark={isDark}
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
