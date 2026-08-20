import { useTheme } from "next-themes";
import { motion } from "motion/react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  History,
  Loader2,
  Play,
  Send,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFormatters } from "../../../../shared/i18n/useFormatters";
import { useLanguage } from "../../../../shared/i18n/useLanguage";
import {
  getLectureTitle,
  getSubjectName,
  scoreColor,
} from "../../../admin/questionBanks/utils/bank";
import { QuizResultView } from "./QuizResultView";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { useQuizRunner } from "../hooks/useQuizRunner";

interface QuizSessionProps {
  bankId: string;
  onBackToList: () => void;
}

export function QuizSession({ bankId, onBackToList }: QuizSessionProps) {
  const { t } = useTranslation("mcq");
  const { formatDateTimeOrDash } = useFormatters();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    bank,
    questions,
    pageQuestions,
    attempts,
    isLoading,
    attemptsLoading,
    submitting,
    error,
    phase,
    page,
    totalPages,
    selectedIndexes,
    answeredCount,
    correctCount,
    wrongCount,
    progressPercent,
    isComplete,
    result,
    bestScore,
    questionNumber,
    correctIndexOf,
    start,
    selectOption,
    goToPage,
    nextPage,
    previousPage,
    submit,
    restart,
  } = useQuizRunner(bankId);

  const cardClass = `rounded-2xl sm:rounded-3xl border backdrop-blur-md ${
    isDark ? "bg-white/5 border-white/10" : "bg-white/90 border-gray-200"
  }`;

  if (isLoading && !bank) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">{t("loading.bank")}</span>
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-gray-100"}`}
        >
          <BrainCircuit className="w-7 h-7 text-gray-300" />
        </div>
        <p className={`font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
          {t("unavailable.title")}
        </p>
        <button
          onClick={onBackToList}
          className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-sm font-bold shadow-md"
        >
          <ArrowLeft size={14} className={isRTL ? "rotate-180" : ""} />{" "}
          {t("unavailable.back")}
        </button>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────
  if (phase === "result" && result) {
    return (
      <QuizResultView
        result={result}
        questions={questions}
        onRetry={start}
        onBackToList={onBackToList}
      />
    );
  }

  // ── INTRO ─────────────────────────────────
  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div className={`${cardClass} p-5 sm:p-8`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-lg shadow-[#404293]/30 flex-shrink-0">
              <BrainCircuit className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                className={`text-lg sm:text-2xl font-black mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {getLectureTitle(bank) || bank.title}
              </h2>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {t("intro.subjectAndCount", {
                  subject: getSubjectName(bank),
                  count: questions.length,
                })}
              </p>
            </div>
            <button
              onClick={start}
              disabled={questions.length === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-lg shadow-[#404293]/25 hover:shadow-[#404293]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 transition-all flex-shrink-0"
            >
              <Play size={16} /> {t("intro.start")}
            </button>
          </div>

          {questions.length === 0 && (
            <div
              className={`mt-5 flex items-center gap-2.5 rounded-2xl px-4 py-3 border ${
                isDark
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-amber-50 border-amber-100"
              }`}
            >
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
              <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {t("intro.emptyBank")}
              </p>
            </div>
          )}

          {bestScore !== null && (
            <div
              className={`mt-5 flex items-center gap-2.5 rounded-2xl px-4 py-3 border ${
                isDark
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-amber-50 border-amber-100"
              }`}
            >
              <Trophy size={16} className="text-amber-500 flex-shrink-0" />
              <p className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {t("intro.bestScore")}{" "}
                <span className="font-black" style={{ color: scoreColor(bestScore) }}>
                  {bestScore}%
                </span>{" "}
                {t("intro.outOfAttempts", { count: attempts.length })}
              </p>
            </div>
          )}
        </div>

        {/* Previous attempts */}
        <div className={`${cardClass} p-5 sm:p-6`}>
          <div className="flex items-center gap-2 mb-4">
            <History size={17} className="text-[#2376BB]" />
            <h3
              className={`font-bold text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {t("intro.previousAttempts")}
            </h3>
          </div>

          {attemptsLoading ? (
            <div className="flex items-center gap-2 py-6 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{t("loading.generic")}</span>
            </div>
          ) : attempts.length === 0 ? (
            <p className={`text-sm py-4 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
              {t("intro.noAttempts")}
            </p>
          ) : (
            <div className="space-y-2">
              {attempts.map((attempt, index) => (
                <div
                  key={attempt._id}
                  className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 border ${
                    isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isDark ? "bg-white/10 text-gray-300" : "bg-white text-gray-500"
                      }`}
                    >
                      {attempts.length - index}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
                      >
                        {t("intro.correctOfTotal", {
                          correct: attempt.correctCount,
                          total: attempt.totalQuestions,
                        })}
                      </p>
                      <p
                        className={`text-[11px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {formatDateTimeOrDash(attempt.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-black flex-shrink-0"
                    style={{
                      color: scoreColor(attempt.scorePercentage ?? 0),
                      backgroundColor: `${scoreColor(attempt.scorePercentage ?? 0)}18`,
                    }}
                  >
                    {attempt.scorePercentage ?? 0}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ── RUNNING ───────────────────────────────
  const stats = [
    {
      label: t("session.total"),
      value: questions.length,
      icon: Activity,
      tone: isDark
        ? "bg-white/5 border-white/10"
        : "bg-white/80 border-gray-200 shadow-sm",
      valueClass: isDark ? "text-white" : "text-gray-900",
      labelClass: isDark ? "text-gray-400" : "text-gray-500",
      iconClass: "text-[#2376BB]",
    },
    {
      label: t("session.done"),
      value: answeredCount,
      icon: Target,
      tone: isDark
        ? "bg-[#404293]/20 border-[#404293]/30"
        : "bg-blue-50/80 border-blue-100 shadow-sm",
      valueClass: isDark ? "text-blue-300" : "text-[#404293]",
      labelClass: isDark ? "text-blue-300" : "text-[#404293]",
      iconClass: isDark ? "text-blue-300" : "text-[#404293]",
    },
    {
      label: t("session.correct"),
      value: correctCount,
      icon: Check,
      tone: isDark
        ? "bg-green-500/10 border-green-500/20"
        : "bg-green-50/80 border-green-100 shadow-sm",
      valueClass: isDark ? "text-green-400" : "text-green-600",
      labelClass: isDark ? "text-green-500" : "text-green-600",
      iconClass: isDark ? "text-green-400" : "text-green-600",
    },
    {
      label: t("session.wrong"),
      value: wrongCount,
      icon: X,
      tone: isDark
        ? "bg-red-500/10 border-red-500/20"
        : "bg-red-50/80 border-red-100 shadow-sm",
      valueClass: isDark ? "text-red-400" : "text-red-600",
      labelClass: isDark ? "text-red-500" : "text-red-600",
      iconClass: isDark ? "text-red-400" : "text-red-600",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Sticky stats header */}
      <div
        className={`sticky top-0 z-20 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 px-3 sm:px-4 md:px-6 lg:px-8 pt-1 pb-3 sm:pb-4 mb-4 sm:mb-5 border-b backdrop-blur-2xl ${
          isDark ? "bg-[#202121]/85 border-white/10" : "bg-white/85 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={restart}
              title={t("session.backToBank")}
              aria-label={t("session.backToBank")}
              className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-colors flex-shrink-0 ${
                isDark
                  ? "hover:bg-white/10 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <ArrowLeft
                className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? "rotate-180" : ""}`}
              />
            </button>
            <h2
              className={`font-extrabold text-sm sm:text-lg md:text-xl truncate ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {getLectureTitle(bank) || bank.title}
            </h2>
          </div>

          {isComplete && (
            <button
              onClick={submit}
              disabled={submitting}
              className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all flex-shrink-0"
            >
              {submitting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCircle2 size={15} />
              )}
              <span>
                {t(submitting ? "session.submitting" : "session.submit")}
              </span>
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-3">
          {stats.map(
            ({ label, value, icon: Icon, tone, valueClass, labelClass, iconClass }) => (
              <div
                key={label}
                className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col items-center justify-center border backdrop-blur-md ${tone}`}
              >
                <span
                  className={`text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-wider mb-1 sm:mb-1.5 ${labelClass}`}
                >
                  {label}
                </span>
                <div
                  className={`text-base sm:text-lg md:text-2xl font-black flex items-center gap-1.5 ${valueClass}`}
                >
                  <Icon className={`w-3.5 h-3.5 md:w-5 md:h-5 hidden sm:inline ${iconClass}`} />
                  {value}
                </div>
              </div>
            ),
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div
            className={`flex-1 h-1.5 sm:h-2 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-100"}`}
          >
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB]"
            />
          </div>
          <span
            className={`text-[11px] sm:text-xs font-bold flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Questions of current page */}
      <div className="space-y-3 sm:space-y-4">
        {pageQuestions.map((question) => (
          <QuizQuestionCard
            key={question._id}
            question={question}
            number={questionNumber(question)}
            selectedIndex={selectedIndexes[question._id]}
            correctIndex={correctIndexOf(question)}
            onSelect={(optionIndex) => selectOption(question._id, optionIndex)}
          />
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3 mt-5 sm:mt-6">
        <button
          onClick={previousPage}
          disabled={page === 1}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl border font-semibold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            isDark
              ? "bg-white/5 border-white/20 text-gray-200 hover:bg-white/10"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ArrowRight size={15} className={isRTL ? "" : "rotate-180"} />{" "}
          {t("session.previous")}
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            const isCurrent = pageNumber === page;
            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-md"
                    : isDark
                      ? "bg-white/5 text-gray-400 hover:bg-white/10"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {page === totalPages ? (
          <button
            onClick={submit}
            disabled={submitting || answeredCount === 0}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#404293]/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 transition-all"
          >
            {submitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            {t("session.submit")}
          </button>
        ) : (
          <button
            onClick={nextPage}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl border font-semibold text-xs sm:text-sm transition-all ${
              isDark
                ? "bg-white/5 border-white/20 text-gray-200 hover:bg-white/10"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t("session.next")}{" "}
            <ArrowLeft size={15} className={isRTL ? "" : "rotate-180"} />
          </button>
        )}
      </div>
    </div>
  );
}
