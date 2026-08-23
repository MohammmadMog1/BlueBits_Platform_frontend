import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  Book,
  BookOpen,
  Check,
  FlaskConical,
  FolderOpen,
  GraduationCap,
  Layers,
  Loader2,
  MonitorPlay,
  Search,
  X,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../shared/i18n/useLanguage";
import {
  brandGradient,
  brandGradientBr,
  dividerClass,
  faintClass,
  ghostButtonClass,
  headingClass,
  mutedClass,
  panelClass,
} from "../../../../shared/utils/theme";
import { useLectures } from "../hooks/useLectures";
import { LectureCard } from "../components/LectureCard";
import { LatestLecturesSection } from "../components/LatestLecturesSection";
import { RecentDownloadsSection } from "../components/RecentDownloadsSection";
import type { LectureType } from "../types";
import type { LectureStep } from "../hooks/useLectures";

const STEP_ORDER: LectureStep[] = ["year", "semester", "subject", "type", "lectures"];

const STEP_ICONS: Record<LectureStep, React.ElementType> = {
  year: GraduationCap,
  semester: Layers,
  subject: Book,
  type: FlaskConical,
  lectures: MonitorPlay,
};

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

export function UserLectureManager() {
  const { t } = useTranslation(["lectures", "common"]);
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    years,
    semesters,
    subjects,
    contextLectures,
    yearsLoading,
    semestersLoading,
    subjectsLoading,
    fetchStatus,
    step,
    selectedYearId,
    selectedSemesterId,
    selectedSubjectId,
    selectedType,
    search,
    setSearch,
    selectYear,
    selectSemester,
    selectSubject,
    selectType,
    goBack,
    navTo,
    handleDownload,
    handleView,
  } = useLectures();

  const currentStepIndex = STEP_ORDER.indexOf(step);

  const selectedYearName = years.find((y) => y._id === selectedYearId)?.name;
  const selectedSemesterName = semesters.find(
    (s) => s._id === selectedSemesterId,
  )?.name;
  const selectedSubjectName = subjects.find(
    (s) => s._id === selectedSubjectId,
  )?.name;

  const stepLabels: Record<LectureStep, string> = {
    year: selectedYearName || t("breadcrumb.year"),
    semester: selectedSemesterName || t("breadcrumb.semester"),
    subject: selectedSubjectName || t("breadcrumb.subject"),
    type:
      step === "lectures"
        ? t(selectedType === "practical" ? "type.practical" : "type.theoretical")
        : t("breadcrumb.type"),
    lectures: t("breadcrumb.lectures"),
  };

  const stepReachable: Record<LectureStep, boolean> = {
    year: true,
    semester: Boolean(selectedYearId),
    subject: Boolean(selectedSemesterId),
    type: Boolean(selectedSubjectId),
    lectures: false,
  };

  const renderStepper = () => (
    <div className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-hide sm:gap-1.5">
      {STEP_ORDER.map((key, index) => {
        const Icon = STEP_ICONS[key];
        const status =
          index < currentStepIndex ? "done" : index === currentStepIndex ? "current" : "upcoming";
        const clickable = status !== "current" && key !== "lectures" && stepReachable[key];

        return (
          <div key={key} className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={clickable ? () => navTo(key) : undefined}
              disabled={!clickable}
              aria-current={status === "current" ? "step" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-10 sm:w-10 ${
                status === "done"
                  ? `border-transparent ${brandGradientBr} text-white shadow-sm ${clickable ? "hover:scale-105" : ""}`
                  : status === "current"
                    ? isDark
                      ? "border-[#2376BB] bg-[#2376BB]/15 text-[#7fb5e4] shadow-[0_0_0_4px_rgba(35,118,187,0.14)]"
                      : "border-[#2376BB] bg-[#2376BB]/10 text-[#2376BB] shadow-[0_0_0_4px_rgba(35,118,187,0.1)]"
                    : isDark
                      ? "cursor-not-allowed border-white/10 bg-white/5 text-gray-600"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
              }`}
            >
              {status === "done" ? (
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </button>

            <span
              className={`hidden max-w-[90px] truncate text-xs font-bold sm:inline sm:text-sm md:max-w-[140px] ${
                status === "upcoming"
                  ? isDark
                    ? "text-gray-600"
                    : "text-gray-300"
                  : status === "current"
                    ? headingClass(isDark)
                    : mutedClass(isDark)
              }`}
            >
              {stepLabels[key]}
            </span>

            {index < STEP_ORDER.length - 1 && (
              <span
                className={`h-0.5 w-4 shrink-0 rounded-full transition-colors duration-300 sm:w-8 md:w-10 ${
                  index < currentStepIndex ? brandGradient : isDark ? "bg-white/10" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex min-h-full flex-col gap-6 p-3 sm:gap-8 sm:p-4 md:gap-10 md:p-6 lg:p-10">
      <div>
        <h1
          className={`mb-2 flex items-center gap-2.5 text-2xl font-black tracking-tight sm:gap-3 sm:text-3xl md:gap-4 md:text-4xl ${headingClass(isDark)}`}
        >
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 md:h-14 md:w-14 ${brandGradientBr} text-white shadow-lg shadow-[#404293]/25`}>
            <Book className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
          </div>
          {t("title")}
        </h1>
        <p className={`text-xs font-medium sm:text-sm md:text-base ${mutedClass(isDark)}`}>
          {t("subtitle")}
        </p>
      </div>

      <RecentDownloadsSection onOpenLecture={handleView} />
      <LatestLecturesSection onOpenLecture={handleView} />

      <div className={`flex flex-1 flex-col ${panelClass(isDark)}`}>
        <div
          className={`flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4 md:px-6 md:py-5 ${dividerClass(isDark)}`}
        >
          {renderStepper()}

          {step !== "year" && (
            <button
              onClick={goBack}
              className={`shrink-0 self-start sm:self-auto ${ghostButtonClass(isDark)}`}
            >
              <ArrowLeft className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isRTL ? "rotate-180" : ""}`} />
              {t("common:actions.back")}
            </button>
          )}
        </div>

        <div className="relative min-h-[300px] p-3 sm:min-h-[350px] sm:p-4 md:min-h-[400px] md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: YEAR */}
            {step === "year" && (
              <motion.div
                key="year-step"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                className="flex h-full flex-col"
              >
                <StepHeading icon={GraduationCap} label={t("steps.selectYear")} isDark={isDark} />
                {yearsLoading ? (
                  <LoadingPlaceholder label={t("loading.years")} isDark={isDark} />
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
                    {years.map((year) => (
                      <SelectionTile
                        key={year._id}
                        label={year.name}
                        icon={GraduationCap}
                        onClick={() => selectYear(year._id)}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: SEMESTER */}
            {step === "semester" && (
              <motion.div key="semester-step" initial="initial" animate="in" exit="out" variants={pageVariants}>
                <StepHeading icon={Layers} label={t("steps.selectSemester")} isDark={isDark} />
                {semestersLoading ? (
                  <LoadingPlaceholder label={t("loading.semesters")} isDark={isDark} />
                ) : (
                  <div className="grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5">
                    {semesters.map((semester) => (
                      <SelectionTile
                        key={semester._id}
                        label={semester.name}
                        icon={Layers}
                        onClick={() => selectSemester(semester._id)}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: SUBJECT */}
            {step === "subject" && (
              <motion.div key="subject-step" initial="initial" animate="in" exit="out" variants={pageVariants}>
                <StepHeading icon={Book} label={t("steps.selectSubject")} isDark={isDark} />
                {subjectsLoading ? (
                  <LoadingPlaceholder label={t("loading.subjects")} isDark={isDark} />
                ) : subjects.length === 0 ? (
                  <EmptyState
                    icon={<FolderOpen className={`h-6 w-6 sm:h-7 sm:w-7 ${faintClass(isDark)}`} />}
                    title={t("empty.noSubjectsTitle")}
                    message={t("empty.noSubjectsMessage")}
                    isDark={isDark}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-3">
                    {subjects.map((subject) => (
                      <SubjectTile
                        key={subject._id}
                        name={subject.name}
                        onClick={() => selectSubject(subject._id)}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: TYPE */}
            {step === "type" && (
              <motion.div key="type-step" initial="initial" animate="in" exit="out" variants={pageVariants}>
                <StepHeading icon={FlaskConical} label={t("steps.selectType")} isDark={isDark} />
                <div className="grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5">
                  {(
                    [
                      { value: "theoretical", icon: BookOpen },
                      { value: "practical", icon: FlaskConical },
                    ] as { value: LectureType; icon: typeof BookOpen }[]
                  ).map(({ value, icon: Icon }) => (
                    <SelectionTile
                      key={value}
                      label={t(`type.${value}`)}
                      icon={Icon}
                      onClick={() => selectType(value)}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: LECTURES */}
            {step === "lectures" && (
              <motion.div key="lectures-step" initial="initial" animate="in" exit="out" variants={pageVariants}>
                <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center md:mb-8 md:gap-4">
                  <h2
                    className={`flex items-center gap-2 text-base font-bold sm:gap-2.5 sm:text-lg md:gap-3 md:text-2xl ${headingClass(isDark)}`}
                  >
                    <MonitorPlay className="h-4 w-4 text-[#404293] sm:h-5 sm:w-5 md:h-7 md:w-7" />
                    <span className="truncate">
                      {t("lecturesFor", { subject: selectedSubjectName })}
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span
                      className={`self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold sm:self-auto sm:px-3.5 sm:py-1 md:px-4 md:py-1.5 md:text-sm ${
                        isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#404293]/8 text-[#404293]"
                      }`}
                    >
                      {t("totalCount", { count: contextLectures.length })}
                    </span>
                    <div
                      className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 sm:py-2 ${
                        isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
                      }`}
                    >
                      <Search className={`h-3.5 w-3.5 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className={`w-24 bg-transparent text-xs outline-none sm:w-36 sm:text-sm ${
                          isDark ? "text-gray-200 placeholder-gray-500" : "text-gray-700 placeholder-gray-400"
                        }`}
                      />
                      {search && (
                        <button onClick={() => setSearch("")} aria-label={t("clearSearch")}>
                          <X size={13} className={isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-300 hover:text-gray-500"} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {fetchStatus === "loading" ? (
                  <LoadingPlaceholder label={t("loading.lectures")} isDark={isDark} />
                ) : contextLectures.length === 0 ? (
                  <EmptyState
                    icon={<MonitorPlay className={`h-6 w-6 sm:h-7 sm:w-7 ${faintClass(isDark)}`} />}
                    title={t("empty.noLecturesTitle")}
                    message={search ? t("empty.noMatches") : t("empty.noLecturesMessage")}
                    isDark={isDark}
                  />
                ) : (
                  <div className="flex flex-col gap-2.5 sm:gap-3">
                    {contextLectures.map((lecture) => (
                      <LectureCard
                        key={lecture._id}
                        lecture={lecture}
                        onView={handleView}
                        onDownload={handleDownload}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StepHeading({
  icon: Icon,
  label,
  isDark,
}: {
  icon: React.ElementType;
  label: string;
  isDark: boolean;
}) {
  return (
    <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-2.5 md:mb-8 md:gap-3">
      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${mutedClass(isDark)}`} />
      <h2 className={`text-lg font-bold sm:text-xl md:text-2xl ${headingClass(isDark)}`}>{label}</h2>
    </div>
  );
}

function SelectionTile({
  label,
  icon: Icon,
  onClick,
  isDark,
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:gap-3.5 sm:rounded-[1.75rem] sm:p-7 sm:hover:-translate-y-1.5 [@media(hover:hover)]:hover:border-transparent [@media(hover:hover)]:hover:bg-gradient-to-br [@media(hover:hover)]:hover:from-[#404293] [@media(hover:hover)]:hover:to-[#2376BB] [@media(hover:hover)]:hover:text-white ${
        isDark
          ? "border-white/10 bg-white/5 text-gray-200 [@media(hover:hover)]:hover:shadow-black/30"
          : "border-gray-200 bg-white/80 text-gray-700 [@media(hover:hover)]:hover:shadow-[#404293]/25"
      }`}
    >
      <Icon className="h-7 w-7 opacity-45 transition-opacity duration-300 group-hover:opacity-100 sm:h-11 sm:w-11" />
      <span className="text-sm font-bold sm:text-lg">{label}</span>
    </button>
  );
}

function SubjectTile({
  name,
  onClick,
  isDark,
}: {
  name: string;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-start gap-3 rounded-2xl border p-4 text-start font-semibold shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:gap-4 sm:rounded-[1.75rem] sm:p-6 [@media(hover:hover)]:hover:border-transparent [@media(hover:hover)]:hover:bg-gradient-to-br [@media(hover:hover)]:hover:from-[#404293] [@media(hover:hover)]:hover:to-[#2376BB] [@media(hover:hover)]:hover:text-white ${
        isDark
          ? "border-white/10 bg-white/5 text-gray-200 [@media(hover:hover)]:hover:shadow-black/30"
          : "border-gray-200 bg-white/80 text-gray-800 [@media(hover:hover)]:hover:shadow-[#404293]/25"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12 sm:rounded-2xl ${
          isDark
            ? "bg-white/10 text-white"
            : "bg-[#404293]/8 text-[#404293] group-hover:bg-white/20 group-hover:text-white"
        }`}
      >
        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <span className="text-sm font-bold leading-tight sm:text-lg">{name}</span>
    </button>
  );
}

function LoadingPlaceholder({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-16 sm:py-20 ${mutedClass(isDark)}`}>
      <Loader2 className="h-5 w-5 animate-spin" />
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
    <div className="flex flex-col items-center justify-center py-14 text-center sm:py-16">
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl sm:h-16 sm:w-16 ${isDark ? "bg-white/5" : "bg-gray-100"}`}
      >
        {icon}
      </div>
      <p className={`mb-1 font-bold ${mutedClass(isDark)}`}>{title}</p>
      <p className={`text-sm ${faintClass(isDark)}`}>{message}</p>
    </div>
  );
}
