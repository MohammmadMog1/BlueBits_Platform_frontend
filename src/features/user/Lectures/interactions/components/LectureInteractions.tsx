import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, MessageCircle, Send, ThumbsDown, ThumbsUp } from "lucide-react";
import { useAppSelector } from "../../../../../app/store/hooks";
import {
  useGetLectureReactionsQuery,
  useReactToLectureMutation,
} from "../api/reactionsApi";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetLectureCommentsQuery,
  useUpdateCommentMutation,
} from "../api/commentsApi";
import { CommentItem } from "./CommentItem";
import type { ReactionType } from "../types";

interface LectureInteractionsProps {
  lectureId: string;
  isDark: boolean;
}

const errorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      return (data as { message: string }).message;
    }
  }
  return "تعذّر تنفيذ الطلب، حاول مرة أخرى.";
};

export function LectureInteractions({ lectureId, isDark }: LectureInteractionsProps) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState("");
  const [composerError, setComposerError] = useState("");

  const currentUser = useAppSelector((state) => state.auth.user);

  const { data: reactions } = useGetLectureReactionsQuery(lectureId);
  const [react, { isLoading: isReacting }] = useReactToLectureMutation();

  const {
    data: commentsResult,
    isLoading: commentsLoading,
    isFetching: commentsFetching,
  } = useGetLectureCommentsQuery(lectureId, { skip: !expanded });

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const likes = reactions?.likes ?? 0;
  const dislikes = reactions?.dislikes ?? 0;
  const userReaction = reactions?.userReaction ?? null;
  const comments = commentsResult?.comments ?? [];

  const handleReact = (type: ReactionType) => {
    if (isReacting) return;
    react({ lectureId, type });
  };

  const handleSubmitComment = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !currentUser) return;
    setComposerError("");
    try {
      await createComment({ lectureId, userId: currentUser._id, content: trimmed }).unwrap();
      setDraft("");
    } catch (error) {
      setComposerError(errorMessage(error));
    }
  };

  return (
    <div
      dir="rtl"
      className={`mt-3 sm:mt-4 border-t pt-3 sm:pt-4 ${isDark ? "border-white/10" : "border-gray-200/50"}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleReact("like")}
          disabled={isReacting}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm ${
            userReaction === "like"
              ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white"
              : isDark
                ? "bg-white/5 text-gray-300 hover:bg-white/10"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          {likes}
        </button>

        <button
          type="button"
          onClick={() => handleReact("dislike")}
          disabled={isReacting}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm ${
            userReaction === "dislike"
              ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
              : isDark
                ? "bg-white/5 text-gray-300 hover:bg-white/10"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          {dislikes}
        </button>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm ${
            expanded
              ? isDark
                ? "bg-white/15 text-white"
                : "bg-[#404293]/10 text-[#404293]"
              : isDark
                ? "bg-white/5 text-gray-300 hover:bg-white/10"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {expanded && commentsResult ? commentsResult.count : "التعليقات"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex flex-col gap-2.5 sm:mt-4 sm:gap-3">
              <div className="flex max-h-52 flex-col gap-2.5 overflow-y-auto overscroll-contain pr-1 sm:max-h-72 sm:gap-3">
                {commentsLoading ? (
                  <div className="flex items-center justify-center gap-2 py-6 text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs font-medium">جاري تحميل التعليقات...</span>
                  </div>
                ) : comments.length === 0 ? (
                  <p
                    className={`py-3 text-center text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    لا توجد تعليقات بعد، كن أول من يعلّق
                  </p>
                ) : (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      isDark={isDark}
                      isOwner={
                        !!currentUser &&
                        (typeof comment.userId === "object"
                          ? comment.userId._id
                          : comment.userId) === currentUser._id
                      }
                      onSave={async (content) => {
                        await updateComment({ id: comment._id, lectureId, content }).unwrap();
                      }}
                      onDelete={async () => {
                        await deleteComment({ id: comment._id, lectureId }).unwrap();
                      }}
                    />
                  ))
                )}
              </div>

              {currentUser && (
                <div className="flex items-start gap-2 pt-1">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="اكتب تعليقك..."
                    rows={1}
                    className={`flex-1 resize-none rounded-lg border px-2.5 py-1.5 text-xs outline-none focus:border-[#2376BB] sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm ${
                      isDark
                        ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-500"
                        : "border-gray-200 bg-white text-gray-800 placeholder-gray-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleSubmitComment}
                    disabled={isCreating || !draft.trim()}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#404293] to-[#2376BB] text-white disabled:opacity-50 sm:h-9 sm:w-9 sm:rounded-xl"
                  >
                    {isCreating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                    ) : (
                      <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </button>
                </div>
              )}
              {composerError && (
                <p className="text-[11px] font-semibold text-red-500">{composerError}</p>
              )}
              {commentsFetching && !commentsLoading && (
                <span className="text-[10px] text-gray-400">...جاري التحديث</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
