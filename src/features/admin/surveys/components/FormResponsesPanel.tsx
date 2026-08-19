import { useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Clock,
  Inbox,
  ListChecks,
  RefreshCcw,
  Repeat2,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useGetFormResponsesQuery } from "../api/surveysApi";
import type { SurveyResponse } from "../types";
import { errorMessage, formatDateTime, getRefName } from "../utils/survey";
import {
  difficultyLevel,
  dividerClass,
  emptyBoxClass,
  errorAlertClass,
  faintClass,
  headingClass,
  iconButtonClass,
  mutedClass,
  panelClass,
  skeletonClass,
  softBoxClass,
} from "../utils/surveyTheme";
import SurveyStatusBadge from "./SurveyStatusBadge";

interface FormResponsesPanelProps {
  formId: string;
  yearName: string;
  semesterName: string;
  isDark: boolean;
  onClose: () => void;
}

/** بطاقة إجابة طالب واحد – قابلة للطي */
function ResponseRow({
  response,
  isDark,
}: {
  response: SurveyResponse;
  isDark: boolean;
}) {
  const [isExpanded, setExpanded] = useState(false);
  const studentName = getRefName(response.userId, "طالب غير معروف");
  const email =
    typeof response.userId === "object" && response.userId
      ? (response.userId.email ?? "")
      : "";
  const carryingCount = response.subjectResponses.filter(
    (entry) => entry.isCarrying,
  ).length;

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={isExpanded}
        className={`flex w-full items-center gap-3 px-4 py-3 text-right transition-colors ${
          isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] text-xs font-black text-white">
          {studentName.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-black ${headingClass(isDark)}`}>
            {studentName}
          </p>
          <p
            className={`truncate text-[11px] font-semibold ${faintClass(isDark)}`}
            dir="ltr"
          >
            {email || formatDateTime(response.submittedAt)}
          </p>
        </div>

        {carryingCount > 0 && (
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${
              isDark
                ? "bg-amber-500/15 text-amber-400"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {carryingCount} حملة
          </span>
        )}
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${
            isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-500"
          }`}
        >
          {response.subjectResponses.length} مادة
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${faintClass(isDark)} ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`overflow-hidden border-t ${dividerClass(isDark)} ${
              isDark ? "bg-white/[0.02]" : "bg-gray-50/60"
            }`}
          >
            <div className="space-y-2 p-3">
              <p className={`px-1 text-[11px] font-bold ${faintClass(isDark)}`}>
                أُرسلت في {formatDateTime(response.submittedAt)}
              </p>
              {response.subjectResponses.map((entry, index) => {
                const level = difficultyLevel(entry.difficultyRating);
                const LevelIcon = level.icon;
                return (
                  <div
                    key={`${getRefName(entry.subjectId, String(index))}-${index}`}
                    className={`flex flex-wrap items-center gap-2 px-3.5 py-2.5 ${softBoxClass(isDark)}`}
                  >
                    <span
                      className={`min-w-0 flex-1 truncate text-xs font-black ${
                        isDark ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {getRefName(entry.subjectId, "مادة غير معروفة")}
                    </span>
                    {entry.isCarrying && (
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                          isDark
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        <Repeat2 size={11} /> حملة
                      </span>
                    )}
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                        isDark
                          ? "bg-[#2376BB]/20 text-[#7fb5e4]"
                          : "bg-[#2376BB]/10 text-[#2376BB]"
                      }`}
                    >
                      <Clock size={11} /> {entry.preferredDaysBefore} يوم
                    </span>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${level.chip(isDark)}`}
                    >
                      <LevelIcon size={11} /> {level.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FormResponsesPanel({
  formId,
  yearName,
  semesterName,
  isDark,
  onClose,
}: FormResponsesPanelProps) {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetFormResponsesQuery(formId);

  const responses = data?.responses ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${panelClass(isDark)} overflow-hidden`}
    >
      {/* ── الترويسة ─────────────────────────── */}
      <div
        className={`flex flex-wrap items-start justify-between gap-3 border-b px-6 py-5 ${dividerClass(isDark)}`}
      >
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <ListChecks
              className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}
            />
            <h2 className={`text-sm font-black ${headingClass(isDark)}`}>
              ردود {yearName} — {semesterName}
            </h2>
            {data?.form && (
              <SurveyStatusBadge status={data.form.status} isDark={isDark} />
            )}
          </div>
          <p
            className={`flex items-center gap-1.5 text-xs font-medium ${mutedClass(isDark)}`}
          >
            <Users size={12} />
            {isLoading
              ? "جاري تحميل الردود..."
              : `${data?.totalResponses ?? 0} رد من الطلاب`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void refetch()}
            title="تحديث"
            className={`${iconButtonClass(isDark)} h-9 w-9`}
          >
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="إغلاق"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              isDark
                ? "border-white/10 bg-white/5 text-gray-400 hover:border-red-500/40 hover:text-red-400"
                : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── المحتوى ──────────────────────────── */}
      <div className="p-6">
        {isError ? (
          <div className={errorAlertClass(isDark)}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMessage(error)}
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`${skeletonClass(isDark)} h-14`} />
            ))}
          </div>
        ) : responses.length === 0 ? (
          <div
            className={`${emptyBoxClass(isDark)} flex flex-col items-center justify-center py-14 text-center`}
          >
            <Inbox className={`mb-3 h-7 w-7 ${faintClass(isDark)}`} />
            <p className={`mb-1 text-sm font-bold ${mutedClass(isDark)}`}>
              لا توجد ردود بعد
            </p>
            <p className={`text-xs ${faintClass(isDark)}`}>
              ستظهر الردود هنا فور بدء الطلاب بتعبئة الفورم
            </p>
          </div>
        ) : (
          <div className="custom-scrollbar max-h-[560px] space-y-2 overflow-y-auto pl-1">
            {responses.map((response) => (
              <ResponseRow
                key={response._id}
                response={response}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
