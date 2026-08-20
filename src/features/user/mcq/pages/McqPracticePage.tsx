import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Book,
  BookOpen,
  BrainCircuit,
  Calendar,
  ChevronRight,
  FolderOpen,
  GraduationCap,
  Layers,
  ListChecks,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../shared/i18n/useLanguage";
import { useMcqBrowser } from "../hooks/useMcqBrowser";
import { McqBankCard } from "../components/McqBankCard";
import { QuizSession } from "../components/QuizSession";
import type { McqStep } from "../hooks/useMcqBrowser";

const STEP_ORDER: McqStep[] = ["year", "semester", "subject", "banks", "quiz"];

export function McqPracticePage() {
  const { t } = useTranslation(["mcq", "common"]);
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    years,
    semesters,
    subjects,
    banks,
    unpublishedCount,
    yearsLoading,
    semestersLoading,
    subjectsLoading,
    banksLoading,
    step,
    selectedYearId,
    selectedSemesterId,
    selectedSubjectId,
    selectedBankId,
    search,
    setSearch,
    selectYear,
    selectSemester,
    selectSubject,
    openBank,
    goBack,
    navTo,
  } = useMcqBrowser();

  const currentStepIndex = STEP_ORDER.indexOf(step);

  const selectedYearName = years.find((year) => year._id === selectedYearId)?.name;
  const selectedSemesterName = semesters.find(
    (semester) => semester._id === selectedSemesterId,
  )?.name;
  const selectedSubjectName = subjects.find(
    (subject) => subject._id === selectedSubjectId,
  )?.name;

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 },
  };

  const tileHoverLight =
    "[@media(hover:hover)]:hover:bg-gradient-to-r [@media(hover:hover)]:hover:from-[#404293] [@media(hover:hover)]:hover:to-[#2376BB] [@media(hover:hover)]:hover:text-white [@media(hover:hover)]:hover:border-transparent [@media(hover:hover)]:hover:-translate-y-1 sm:[@media(hover:hover)]:hover:-translate-y-2 [@media(hover:hover)]:hover:shadow-[#404293]/30 [@media(hover:hover)]:hover:shadow-xl";
  const tileHoverDark =
    "[@media(hover:hover)]:hover:bg-gradient-to-r [@media(hover:hover)]:hover:from-[#404293] [@media(hover:hover)]:hover:to-[#2376BB] [@media(hover:hover)]:hover:text-white [@media(hover:hover)]:hover:border-transparent [@media(hover:hover)]:hover:-translate-y-1 sm:[@media(hover:hover)]:hover:-translate-y-2 [@media(hover:hover)]:hover:shadow-xl";
  const tileHoverBrLight =
    "[@media(hover:hover)]:hover:bg-gradient-to-br [@media(hover:hover)]:hover:from-[#404293] [@media(hover:hover)]:hover:to-[#2376BB] [@media(hover:hover)]:hover:text-white [@media(hover:hover)]:hover:border-transparent [@media(hover:hover)]:hover:-translate-y-1 sm:[@media(hover:hover)]:hover:-translate-y-2 [@media(hover:hover)]:hover:shadow-[#404293]/30 [@media(hover:hover)]:hover:shadow-xl";
  const tileHoverBrDark =
    "[@media(hover:hover)]:hover:bg-gradient-to-br [@media(hover:hover)]:hover:from-[#404293] [@media(hover:hover)]:hover:to-[#2376BB] [@media(hover:hover)]:hover:text-white [@media(hover:hover)]:hover:border-transparent [@media(hover:hover)]:hover:-translate-y-1 sm:[@media(hover:hover)]:hover:-translate-y-2 [@media(hover:hover)]:hover:shadow-xl";
  const iconHover =
    "[@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:scale-110";

  const crumbClass = (active: boolean, disabled = false) =>
    `flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 md:py-2 rounded-lg sm:rounded-xl transition-all ${
      active
        ? isDark
          ? "bg-[#404293]/30 text-white shadow-sm"
          : "bg-[#404293]/10 text-[#404293] shadow-sm"
        : disabled
          ? "opacity-50 cursor-not-allowed text-gray-400"
          : isDark
            ? "text-gray-400 [@media(hover:hover)]:hover:text-white [@media(hover:hover)]:hover:bg-white/10"
            : "text-gray-500 [@media(hover:hover)]:hover:text-[#404293] [@media(hover:hover)]:hover:bg-[#404293]/5"
    }`;

  const renderBreadcrumb = () => (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 text-xs sm:text-sm md:text-base font-semibold">
      <button onClick={() => navTo("year")} className={crumbClass(step === "year")}>
        <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        <span className="hidden sm:inline">
          {selectedYearName || t("breadcrumb.selectYear")}
        </span>
        <span className="sm:hidden">
          {selectedYearName || t("breadcrumb.year")}
        </span>
      </button>

      {currentStepIndex >= 1 && (
        <>
          <ChevronRight
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0 ${isRTL ? "rotate-180" : ""} ${isDark ? "text-gray-600" : "text-gray-300"}`}
          />
          <button
            onClick={() => navTo("semester")}
            disabled={!selectedYearId}
            className={crumbClass(step === "semester", !selectedYearId)}
          >
            <Layers className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            {selectedSemesterName || t("breadcrumb.semester")}
          </button>
        </>
      )}

      {currentStepIndex >= 2 && (
        <>
          <ChevronRight
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0 ${isRTL ? "rotate-180" : ""} ${isDark ? "text-gray-600" : "text-gray-300"}`}
          />
          <button
            onClick={() => navTo("subject")}
            disabled={!selectedSemesterId}
            className={crumbClass(step === "subject", !selectedSemesterId)}
          >
            <Book className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <span className="truncate max-w-[100px] sm:max-w-[150px]">
              {selectedSubjectName || t("breadcrumb.subject")}
            </span>
          </button>
        </>
      )}

      {currentStepIndex >= 3 && (
        <>
          <ChevronRight
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0 ${isRTL ? "rotate-180" : ""} ${isDark ? "text-gray-600" : "text-gray-300"}`}
          />
          <button
            onClick={() => navTo("banks")}
            className={crumbClass(step === "banks")}
          >
            <ListChecks className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            {t("breadcrumb.banks")}
          </button>
        </>
      )}

      {currentStepIndex >= 4 && (
        <>
          <ChevronRight
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0 ${isRTL ? "rotate-180" : ""} ${isDark ? "text-gray-600" : "text-gray-300"}`}
          />
          <span
            className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 md:py-2 rounded-lg sm:rounded-xl ${isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"}`}
          >
            <BrainCircuit className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            {t("breadcrumb.quiz")}
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-10 min-h-full flex flex-col bg-transparent">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3 md:gap-4 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          <div className="p-2 sm:p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] text-white shadow-lg">
            <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </div>
          {t("title")}
        </h1>
        <p
          className={`text-xs sm:text-sm md:text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          {t("subtitle")}
        </p>
      </div>

      <div
        className={`flex-1 flex flex-col rounded-xl sm:rounded-2xl md:rounded-[2rem] border shadow-xl transition-colors backdrop-blur-xl ${isDark ? "bg-white/5 border-white/10" : "bg-white/90 border-gray-200"}`}
      >
        <div
          className={`p-3 sm:p-4 md:p-6 sm:px-4 md:px-8 rounded-t-xl sm:rounded-t-2xl md:rounded-t-[2rem] border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 md:gap-6 ${isDark ? "border-white/10 bg-white/[0.02]" : "border-gray-200 bg-white/50"}`}
        >
          {renderBreadcrumb()}

          {step !== "year" && (
            <button
              onClick={goBack}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 md:px-4 py-1.5 md:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all border shadow-sm ${isDark ? "bg-white/5 border-white/20 [@media(hover:hover)]:hover:bg-white/10 text-gray-200" : "bg-white border-gray-300 [@media(hover:hover)]:hover:bg-gray-50 text-gray-800"}`}
            >
              <ArrowLeft
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isRTL ? "rotate-180" : ""}`}
              />
              {t("common:actions.back")}
            </button>
          )}
        </div>

        <div className="p-3 sm:p-4 md:p-6 lg:p-8 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] relative">
          <AnimatePresence mode="wait">
            {/* STEP 1: YEAR */}
            {step === "year" && (
              <motion.div
                key="year-step"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-4 sm:mb-6 md:mb-8">
                  <Calendar
                    className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  />
                  <h2
                    className={`text-lg sm:text-xl md:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {t("steps.selectYear")}
                  </h2>
                </div>
                {yearsLoading ? (
                  <LoadingPlaceholder label={t("loading.years")} />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                    {years.map((year) => (
                      <button
                        key={year._id}
                        onClick={() => selectYear(year._id)}
                        className={`py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] font-bold text-sm sm:text-lg md:text-xl transition-all duration-300 shadow-sm flex flex-col items-center justify-center gap-1.5 sm:gap-3 md:gap-4 group backdrop-blur-md
                          ${isDark ? `bg-white/5 text-gray-200 border border-white/10 ${tileHoverDark}` : `bg-white/80 text-gray-700 border border-gray-200 ${tileHoverLight}`}`}
                      >
                        <GraduationCap
                          className={`w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 opacity-40 transition-opacity duration-500 ${iconHover}`}
                        />
                        {year.name}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: SEMESTER */}
            {step === "semester" && (
              <motion.div
                key="semester-step"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-4 sm:mb-6 md:mb-8">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#404293]" />
                  <h2
                    className={`text-lg sm:text-xl md:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {t("steps.selectSemester")}
                  </h2>
                </div>
                {semestersLoading ? (
                  <LoadingPlaceholder label={t("loading.semesters")} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-4xl">
                    {semesters.map((semester) => (
                      <button
                        key={semester._id}
                        onClick={() => selectSemester(semester._id)}
                        className={`py-5 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl md:rounded-[2rem] font-bold text-base sm:text-xl md:text-2xl transition-all duration-300 shadow-sm flex flex-col items-center justify-center gap-2 sm:gap-4 md:gap-5 group backdrop-blur-md
                          ${isDark ? `bg-white/5 text-gray-200 border border-white/10 ${tileHoverDark}` : `bg-white/80 text-gray-700 border border-gray-200 ${tileHoverLight}`}`}
                      >
                        <Layers
                          className={`w-7 h-7 sm:w-12 sm:h-12 md:w-14 md:h-14 opacity-50 transition-opacity duration-500 ${iconHover}`}
                        />
                        {semester.name}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: SUBJECT */}
            {step === "subject" && (
              <motion.div
                key="subject-step"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
              >
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-4 sm:mb-6 md:mb-8">
                  <Book className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#404293]" />
                  <h2
                    className={`text-lg sm:text-xl md:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {t("steps.selectSubject")}
                  </h2>
                </div>
                {subjectsLoading ? (
                  <LoadingPlaceholder label={t("loading.subjects")} />
                ) : subjects.length === 0 ? (
                  <EmptyState
                    icon={
                      <FolderOpen
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${isDark ? "text-gray-500" : "text-gray-300"}`}
                      />
                    }
                    title={t("empty.noSubjectsTitle")}
                    message={t("empty.noSubjectsMessage")}
                    isDark={isDark}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    {subjects.map((subject) => (
                      <button
                        key={subject._id}
                        onClick={() => selectSubject(subject._id)}
                        className={`p-3 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-[2rem] font-semibold transition-all duration-300 shadow-sm flex flex-col items-start gap-2 sm:gap-4 md:gap-5 group text-start backdrop-blur-md
                          ${isDark ? `bg-white/5 text-gray-200 border border-white/10 ${tileHoverBrDark}` : `bg-white/80 text-gray-800 border border-gray-200 ${tileHoverBrLight}`}`}
                      >
                        <div
                          className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl transition-colors ${isDark ? "bg-white/10 text-white" : "bg-blue-50 text-[#404293] [@media(hover:hover)]:group-hover:bg-white/20 [@media(hover:hover)]:group-hover:text-white"}`}
                        >
                          <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                        </div>
                        <span className="text-sm sm:text-lg md:text-xl leading-tight font-bold">
                          {subject.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: BANKS */}
            {step === "banks" && (
              <motion.div
                key="banks-step"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                  <h2
                    className={`text-base sm:text-lg md:text-2xl font-bold flex items-center gap-2 sm:gap-2.5 md:gap-3 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-[#404293]" />
                    <span className="truncate">
                      {t("banksFor", { subject: selectedSubjectName })}
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span
                      className={`self-start sm:self-auto px-3 sm:px-3.5 md:px-4 py-1 md:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm ${isDark ? "bg-[#2376BB]/20 text-blue-300 border border-blue-500/20" : "bg-blue-50 text-[#404293] border border-blue-200"}`}
                    >
                      {t("totalCount", { count: banks.length })}
                    </span>
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl border shadow-sm ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}
                    >
                      <Search
                        className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className={`bg-transparent text-xs sm:text-sm outline-none w-24 sm:w-36 ${isDark ? "text-gray-200 placeholder-gray-500" : "text-gray-700 placeholder-gray-400"}`}
                      />
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          aria-label={t("clearSearch")}
                        >
                          <X
                            size={13}
                            className={
                              isDark
                                ? "text-gray-500 hover:text-gray-300"
                                : "text-gray-300 hover:text-gray-500"
                            }
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {banksLoading ? (
                  <LoadingPlaceholder label={t("loading.banks")} />
                ) : banks.length === 0 ? (
                  <EmptyState
                    icon={
                      <BrainCircuit
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${isDark ? "text-gray-500" : "text-gray-300"}`}
                      />
                    }
                    title={t("empty.noBanksTitle")}
                    message={
                      search
                        ? t("empty.noMatches")
                        : unpublishedCount > 0
                          ? t("empty.unpublishedHint", {
                              count: unpublishedCount,
                            })
                          : t("empty.noBanksPublished")
                    }
                    isDark={isDark}
                  />
                ) : (
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {banks.map((bank) => (
                      <McqBankCard
                        key={bank._id}
                        bank={bank}
                        onStart={() => openBank(bank._id)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5: QUIZ */}
            {step === "quiz" && selectedBankId && (
              <motion.div
                key="quiz-step"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
              >
                <QuizSession bankId={selectedBankId} onBackToList={goBack} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LoadingPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 sm:py-20 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
  isDark,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  isDark: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 sm:py-16 text-center">
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-white/5" : "bg-gray-100"}`}
      >
        {icon}
      </div>
      <p className={`font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
        {title}
      </p>
      <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        {message}
      </p>
    </div>
  );
}

export default McqPracticePage;
