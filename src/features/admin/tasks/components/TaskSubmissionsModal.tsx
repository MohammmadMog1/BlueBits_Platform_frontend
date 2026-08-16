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
import {
  useGetTaskSubmissionsQuery,
  useReviewSubmissionMutation,
} from "../api/academicTasksApi";
import type { AcademicTask, SubmissionStatus, TaskSubmission } from "../types";

interface TaskSubmissionsModalProps {
  task: AcademicTask;
  onClose: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });

const statusMeta: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  pending: { label: "بانتظار المراجعة", className: "bg-amber-50 text-amber-600" },
  approved: { label: "مقبول", className: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "مرفوض", className: "bg-red-50 text-red-500" },
};

const errorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    )
      return (data as { message: string }).message;
  }
  return "تعذّر تنفيذ الطلب. حاول مرة أخرى.";
};

function SubmissionRow({ submission }: { submission: TaskSubmission }) {
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

  const meta = statusMeta[submission.status];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{submission.userId?.name}</p>
            <p className="text-[11px] text-gray-400">{submission.userId?.email}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.className}`}
        >
          {meta.label}
        </span>
      </div>

      {submission.note && (
        <p className="mb-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600">
          {submission.note}
        </p>
      )}

      <a
        href={submission.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#2376BB] hover:underline"
      >
        <FileText className="h-3.5 w-3.5" /> عرض الملف المرفوع
      </a>

      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
        <Clock className="h-3 w-3" /> {formatDate(submission.createdAt)}
      </p>

      {submission.status !== "pending" && submission.reviewNote && (
        <p className="mb-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
          ملاحظة المراجعة: {submission.reviewNote}
        </p>
      )}

      {reviewState.error && (
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle size={13} className="shrink-0" />
          {errorMessage(reviewState.error)}
        </div>
      )}

      {submission.status === "pending" && (
        <div className="border-t border-gray-100 pt-3">
          {rejecting ? (
            <div className="space-y-2">
              <textarea
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                placeholder="سبب الرفض (اختياري)..."
                rows={2}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejecting(false)}
                  disabled={reviewState.isLoading}
                  className="flex-1 rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                >
                  إلغاء
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
                  تأكيد الرفض
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejecting(true)}
                disabled={reviewState.isLoading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-100 py-2 text-xs font-bold text-red-500 hover:bg-red-50 disabled:opacity-60"
              >
                <ThumbsDown size={13} /> رفض
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
                قبول
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TaskSubmissionsModal({ task, onClose }: TaskSubmissionsModalProps) {
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
        className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="border-b border-gray-100 px-7 pb-5 pt-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">حلول الطلاب</h3>
              <p className="mt-0.5 text-xs text-gray-400">"{task.title}"</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200"
              aria-label="إغلاق"
            >
              <X size={15} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="max-h-[65vh] space-y-3 overflow-y-auto px-7 py-6" dir="rtl">
          {submissionsQuery.isError && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMessage(submissionsQuery.error)}
            </div>
          )}

          {submissionsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4"
                >
                  <div className="mb-3 h-4 w-1/2 rounded-full bg-gray-100" />
                  <div className="h-3 w-full rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <CheckCircle2 className="h-6 w-6 text-gray-300" />
              </div>
              <p className="font-bold text-gray-400">لا توجد حلول مُسلَّمة بعد</p>
            </div>
          ) : (
            submissions.map((submission) => (
              <SubmissionRow key={submission._id} submission={submission} />
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
