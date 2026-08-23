import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
  User,
  X,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import { dividerClass, errorAlertClass, skeletonClass } from "../../../../shared/utils/theme";
import {
  useGetTaskSubmissionsQuery,
  useReviewSubmissionMutation,
} from "../api/academicTasksApi";
import type { AcademicTask, SubmissionStatus, TaskSubmission } from "../types";

interface TaskSubmissionsModalProps {
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

function SubmissionRow({ submission, isDark }: { submission: TaskSubmission; isDark: boolean }) {
  const { t } = useTranslation(["admin", "tasks", "common"]);
  const errorMessage = useErrorMessage();
  const { formatDateTimeOrDash } = useFormatters();
  const [rejecting, setRejecting] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewSubmission, reviewState] = useReviewSubmissionMutation();

  const handleApprove = async () => {
    try {
      await reviewSubmission({ id: submission._id, status: "approved" }).unwrap();
    } catch {
      // error surfaced inline below
    }
  };

  const handleReject = async () => {
    try {
      await reviewSubmission({
        id: submission._id,
        status: "rejected",
        reviewNote: reviewNote.trim() || undefined,
      }).unwrap();
      setRejecting(false);
      setReviewNote("");
    } catch {
      // error surfaced inline below
    }
  };

  const badgeClass = statusClassName[submission.status];

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              isDark ? "bg-white/10" : "bg-gray-100"
            }`}
          >
            <User className={`h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          </div>
          <div>
            <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {submission.userId?.name}
            </p>
            <p className={`text-[11px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {submission.userId?.email}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeClass}`}
        >
          {t(`tasks:submissionStatus.${submission.status}`)}
        </span>
      </div>

      {submission.note && (
        <p
          className={`mb-2 rounded-xl px-3 py-2 text-xs ${
            isDark ? "bg-white/5 text-gray-300" : "bg-gray-50 text-gray-600"
          }`}
        >
          {submission.note}
        </p>
      )}

      <a
        href={submission.fileUrl}
        target="_blank"
        rel="noreferrer"
        className={`mb-2 flex items-center gap-1.5 text-xs font-semibold hover:underline ${
          isDark ? "text-[#7fb5e4]" : "text-[#2376BB]"
        }`}
      >
        <FileText className="h-3.5 w-3.5" /> {t("tasks.submissions.viewFile")}
      </a>

      <p
        className={`mb-2 flex items-center gap-1.5 text-[11px] font-semibold ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <Clock className="h-3 w-3" /> {formatDateTimeOrDash(submission.createdAt)}
      </p>

      {submission.status !== "pending" && submission.reviewNote && (
        <p
          className={`mb-2 rounded-xl px-3 py-2 text-xs ${
            isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500"
          }`}
        >
          {t("tasks.submissions.reviewNote", { note: submission.reviewNote })}
        </p>
      )}

      {reviewState.error && (
        <div className={`mb-2 ${errorAlertClass(isDark)} px-3 py-2 text-xs`}>
          <AlertCircle size={13} className="shrink-0" />
          {errorMessage(reviewState.error)}
        </div>
      )}

      {submission.status === "pending" && (
        <div className={`border-t pt-3 ${dividerClass(isDark)}`}>
          {rejecting ? (
            <div className="space-y-2">
              <textarea
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                placeholder={t("tasks.submissions.rejectReasonPlaceholder")}
                rows={2}
                className={`w-full resize-none rounded-xl border px-3 py-2 text-xs outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 ${
                  isDark
                    ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-500"
                    : "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                }`}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejecting(false)}
                  disabled={reviewState.isLoading}
                  className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-colors ${
                    isDark
                      ? "border-white/10 text-gray-400 hover:bg-white/5"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {t("common:actions.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={reviewState.isLoading}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2 text-xs font-bold text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {reviewState.isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <RefreshCcw size={12} />
                    </motion.div>
                  ) : (
                    <XCircle size={12} />
                  )}
                  {t("tasks.submissions.confirmReject")}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejecting(true)}
                disabled={reviewState.isLoading}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-colors disabled:opacity-60 ${
                  isDark
                    ? "border-red-500/25 text-red-400 hover:bg-red-500/10"
                    : "border-red-100 text-red-500 hover:bg-red-50"
                }`}
              >
                <ThumbsDown size={13} /> {t("tasks.submissions.reject")}
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={reviewState.isLoading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                {reviewState.isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCcw size={13} />
                  </motion.div>
                ) : (
                  <ThumbsUp size={13} />
                )}
                {t("tasks.submissions.approve")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TaskSubmissionsModal({
  task,
  isDark,
  onClose,
}: TaskSubmissionsModalProps) {
  const { t } = useTranslation(["admin", "common"]);
  const errorMessage = useErrorMessage();
  const submissionsQuery = useGetTaskSubmissionsQuery(task._id);
  const submissions = submissionsQuery.data ?? [];

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
        className={`w-full max-w-xl overflow-hidden rounded-3xl shadow-2xl ${
          isDark ? "border border-white/10 bg-[#1a1b1e]" : "bg-white"
        }`}
      >
        <div className={`border-b px-7 pb-5 pt-7 ${dividerClass(isDark)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {t("tasks.submissions.title")}
              </h3>
              <p className={`mt-0.5 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                "{task.title}"
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                isDark ? "bg-white/10 text-gray-300 hover:bg-white/15" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              aria-label={t("common:actions.close")}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="max-h-[65vh] space-y-3 overflow-y-auto px-7 py-6">
          {submissionsQuery.isError && (
            <div className={errorAlertClass(isDark)}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMessage(submissionsQuery.error)}
            </div>
          )}

          {submissionsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className={`p-4 ${skeletonClass(isDark)}`}
                >
                  <div className={`mb-3 h-4 w-1/2 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
                  <div className={`h-3 w-full rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
                </div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isDark ? "bg-white/10" : "bg-gray-100"
                }`}
              >
                <CheckCircle2 className={`h-6 w-6 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
              </div>
              <p className={`font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {t("tasks.submissions.empty")}
              </p>
            </div>
          ) : (
            submissions.map((submission) => (
              <SubmissionRow key={submission._id} submission={submission} isDark={isDark} />
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
