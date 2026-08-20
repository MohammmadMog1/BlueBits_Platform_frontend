import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Paperclip,
  RefreshCcw,
  UploadCloud,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../shared/i18n/useErrorMessage";
import BottomSheetModal from "../../../shared/components/BottomSheetModal/BottomSheetModal";
import {
  useGetMySubmissionQuery,
  useSubmitSolutionMutation,
} from "../../admin/tasks";
import type { AcademicTask, SubmissionStatus } from "../../admin/tasks";

interface SubmissionModalProps {
  task: AcademicTask;
  isDark: boolean;
  onClose: () => void;
}

/** أنماط الشارة فقط – التسمية تُترجَم عند العرض عبر `tasks:submissionStatus.*` */
const statusClassName: Record<SubmissionStatus, string> = {
  pending: "border border-amber-500/20 bg-amber-500/10 text-amber-500",
  approved: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  rejected: "border border-red-500/20 bg-red-500/10 text-red-500",
};

export default function SubmissionModal({ task, isDark, onClose }: SubmissionModalProps) {
  const { t } = useTranslation("tasks");
  const errorMessage = useErrorMessage();
  const isOpen = task.status === "open";
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");

  const mySubmissionQuery = useGetMySubmissionQuery(task._id);
  const [submitSolution, submitState] = useSubmitSolutionMutation();

  const submission = mySubmissionQuery.data;
  const canResubmit = isOpen && (!submission || submission.status !== "approved");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return setFormError(t("submission.fileRequired"));
    setFormError("");
    try {
      const formData = new FormData();
      formData.append("solution", file);
      if (note.trim()) formData.append("note", note.trim());
      await submitSolution({ taskId: task._id, formData }).unwrap();
      setFile(null);
      setNote("");
    } catch (error) {
      setFormError(errorMessage(error));
    }
  };

  const inputClass = `mt-1.5 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 ${
    isDark
      ? "border-white/10 bg-white/5 text-white placeholder-gray-600"
      : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
  }`;

  return (
    <BottomSheetModal
      onClose={onClose}
      isDark={isDark}
      icon={<UploadCloud className="h-5 w-5 text-white" />}
      title={t("submission.title")}
      subtitle={`"${task.title}"`}
      footer={
        canResubmit ? (
          <button
            type="submit"
            form="submission-form"
            disabled={submitState.isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#404293]/25 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-60"
          >
            {submitState.isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RefreshCcw size={15} />
                </motion.div>
                {t("submission.uploading")}
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                {t(submission ? "submission.resubmit" : "submission.submit")}
              </>
            )}
          </button>
        ) : undefined
      }
    >
      <div className="space-y-5">
        {submission && (
          <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"}`}>
            <div className="mb-2 flex items-center justify-between">
              <p className={`text-xs font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {t("submission.current")}
              </p>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClassName[submission.status]}`}>
                {t(`submissionStatus.${submission.status}`)}
              </span>
            </div>
            {submission.note && (
              <p className={`mb-2 text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>{submission.note}</p>
            )}
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#2376BB] hover:underline"
            >
              <FileText className="h-3.5 w-3.5" /> {t("submission.viewFile")}
            </a>
            {submission.status === "rejected" && submission.reviewNote && (
              <p className="mt-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-500">
                {t("submission.rejectionReason", {
                  reason: submission.reviewNote,
                })}
              </p>
            )}
          </div>
        )}

        {!isOpen && (
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
              isDark ? "border-white/10 bg-white/5 text-gray-400" : "border-gray-200 bg-gray-50 text-gray-500"
            }`}
          >
            <AlertCircle size={14} className="shrink-0" />{" "}
            {t("submission.closedNotice")}
          </div>
        )}

        {canResubmit && (
          <form id="submission-form" onSubmit={handleSubmit} className="space-y-4">
            <label className={`block text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {t("submission.fileLabel")} <span className="text-red-400">*</span>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`mt-1.5 flex w-full items-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-start text-sm transition-colors ${
                  isDark
                    ? "border-white/15 bg-white/5 text-gray-400 hover:border-[#2376BB]/50"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-[#404293]/40"
                }`}
              >
                {file ? (
                  <>
                    <Paperclip className="h-4 w-4 shrink-0 text-[#2376BB]" />
                    <span className={`truncate font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      {file.name}
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className={`h-4 w-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                    {t("submission.chooseFile")}
                  </>
                )}
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <label className={`block text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {t("submission.noteLabel")}
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={t("submission.notePlaceholder")}
                rows={3}
                className={inputClass}
              />
            </label>
            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={14} className="shrink-0" />
                {formError}
              </div>
            )}
          </form>
        )}
      </div>
    </BottomSheetModal>
  );
}
