import { useState } from "react";
import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { getProfileImageUrl, getUserInitials } from "../../../../../shared/utils/user";
import { timeAgoArabic } from "../utils/timeAgo";
import type { LectureComment } from "../types";

interface CommentItemProps {
  comment: LectureComment;
  isOwner: boolean;
  isDark: boolean;
  onSave: (content: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function CommentItem({ comment, isOwner, isDark, onSave, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const author =
    typeof comment.userId === "object"
      ? comment.userId
      : { _id: comment.userId, name: "مستخدم", profile_image: "" };

  const avatarUrl = getProfileImageUrl(author.profile_image);

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setIsSaving(true);
    setError("");
    try {
      await onSave(trimmed);
      setIsEditing(false);
    } catch {
      setError("تعذّر حفظ التعديل، حاول مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch {
      setError("تعذّر حذف التعليق، حاول مرة أخرى.");
      setIsDeleting(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <div className="flex items-start gap-2 sm:gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#404293] to-[#2376BB] text-[10px] font-bold text-white sm:h-8 sm:w-8 sm:text-[11px]">
        {avatarUrl ? (
          <img src={avatarUrl} alt={author.name} className="h-full w-full object-cover" />
        ) : (
          getUserInitials(author.name)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={`rounded-xl rounded-tr-sm px-3 py-2 sm:rounded-2xl sm:px-3.5 sm:py-2.5 ${
            isDark ? "bg-white/5" : "bg-gray-100"
          }`}
        >
          <div className="mb-0.5 flex items-center justify-between gap-2">
            <span className={`text-xs font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              {author.name}
            </span>
            <span className={`text-[10px] font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {timeAgoArabic(comment.updatedAt)}
              {comment.updatedAt !== comment.createdAt ? " (معدّل)" : ""}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-1.5 flex flex-col gap-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={2}
                autoFocus
                className={`w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:border-[#2376BB] ${
                  isDark
                    ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-500"
                    : "border-gray-200 bg-white text-gray-800 placeholder-gray-400"
                }`}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !draft.trim()}
                  className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#404293] to-[#2376BB] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setDraft(comment.content);
                    setError("");
                  }}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold ${
                    isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <X className="h-3 w-3" />
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            <p className={`whitespace-pre-line text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {comment.content}
            </p>
          )}
        </div>

        {error && <p className="mt-1 text-[11px] font-semibold text-red-500">{error}</p>}

        {isOwner && !isEditing && (
          <div className="mt-1 flex items-center gap-3 px-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`flex items-center gap-1 text-[11px] font-bold ${
                isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Pencil className="h-3 w-3" />
              تعديل
            </button>

            {confirmingDelete ? (
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>تأكيد الحذف؟</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "نعم"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className={isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className={`flex items-center gap-1 text-[11px] font-bold ${
                  isDark ? "text-gray-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"
                }`}
              >
                <Trash2 className="h-3 w-3" />
                حذف
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
