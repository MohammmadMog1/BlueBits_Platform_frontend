/**
 * QuestionBanksManagementPage
 *
 * إدارة بنوك أسئلة الـ MCQ:
 * year → semester → subject → banks → bank (مراجعة / نشر / نتائج)
 */
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Book,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  FileText,
  FolderOpen,
  GraduationCap,
  Layers,
  ListChecks,
  Loader2,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../shared/i18n/useLanguage";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import { BankCard } from "../components/BankCard";
import { BankReviewPanel } from "../components/BankReviewPanel";
import { UploadQuestionsModal } from "../components/UploadQuestionsModal";
import { useQuestionBankManager } from "../hooks/useQuestionBankManager";
import { useQuestionBankPermissions } from "../hooks/useQuestionBankPermissions";
import { getLectureId } from "../utils/bank";

export default function QuestionBanksManagementPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { isRTL } = useLanguage();
  const isDark = useIsDark();
  const permissions = useQuestionBankPermissions();
  const {
    years,
    semesters,
    subjects,
    banks,
    bank,
    questions,
    yearsLoading,
    semestersLoading,
    subjectsLoading,
    banksLoading,
    bankLoading,
    isMutating,
    actionError,
    step,
    selectedYearId,
    selectedSemesterId,
    selectedSubjectId,
    search,
    setSearch,
    selectYear,
    selectSemester,
    selectSubject,
    openBank,
    goBack,
    navTo,
    handlePublish,
    handleUnpublish,
    handleDeleteBank,
    handleDeleteQuestion,
    handleUpdateQuestion,
    showUpload,
    openUpload,
    closeUpload,
    stats,
  } = useQuestionBankManager();

  const selectedYearName =
    years.find((year) => year._id === selectedYearId)?.name ??
    t("banks.breadcrumb.year");
  const selectedSemesterName =
    semesters.find((semester) => semester._id === selectedSemesterId)?.name ??
    t("banks.breadcrumb.semester");
  const selectedSubjectName =
    subjects.find((subject) => subject._id === selectedSubjectId)?.name ??
    t("banks.breadcrumb.subject");

  const canUpload = Boolean(selectedSubjectId) && permissions.canCreate;

  // ── Breadcrumb ────────────────────────────
  const crumbClass = (active: boolean) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
      active
        ? isDark
          ? "bg-[#404293]/25 text-[#7fb5e4]"
          : "bg-[#404293]/10 text-[#404293]"
        : isDark
          ? "text-gray-400 hover:text-[#7fb5e4] hover:bg-white/5"
          : "text-gray-400 hover:text-[#404293] hover:bg-[#404293]/5"
    }`;

  const breadcrumb = (
    <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
      <button onClick={() => navTo("year")} className={crumbClass(step === "year")}>
        <GraduationCap className="w-4 h-4" />
        {selectedYearId ? selectedYearName : t("banks.breadcrumb.year")}
      </button>

      {selectedYearId && (
        <>
          <ChevronRight
            className={`w-3.5 h-3.5 ${isDark ? "text-gray-600" : "text-gray-300"} ${isRTL ? "rotate-180" : ""}`}
          />
          <button
            onClick={() => navTo("semester")}
            className={crumbClass(step === "semester")}
          >
            <Layers className="w-4 h-4" />
            {selectedSemesterId
              ? selectedSemesterName
              : t("banks.breadcrumb.semester")}
          </button>
        </>
      )}

      {selectedSemesterId && (
        <>
          <ChevronRight
            className={`w-3.5 h-3.5 ${isDark ? "text-gray-600" : "text-gray-300"} ${isRTL ? "rotate-180" : ""}`}
          />
          <button
            onClick={() => navTo("subject")}
            className={crumbClass(step === "subject")}
          >
            <BookOpen className="w-4 h-4" />
            {selectedSubjectId
              ? selectedSubjectName
              : t("banks.breadcrumb.subject")}
          </button>
        </>
      )}

      {selectedSubjectId && (step === "banks" || step === "bank") && (
        <>
          <ChevronRight
            className={`w-3.5 h-3.5 ${isDark ? "text-gray-600" : "text-gray-300"} ${isRTL ? "rotate-180" : ""}`}
          />
          <button
            onClick={() => navTo("banks")}
            className={crumbClass(step === "banks")}
          >
            <Book className="w-4 h-4" /> {t("banks.breadcrumb.banks")}
          </button>
        </>
      )}

      {step === "bank" && (
        <>
          <ChevronRight
            className={`w-3.5 h-3.5 ${isDark ? "text-gray-600" : "text-gray-300"} ${isRTL ? "rotate-180" : ""}`}
          />
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${
              isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-600"
            }`}
          >
            <ListChecks className="w-4 h-4" /> {t("banks.breadcrumb.review")}
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center shadow-md shadow-[#404293]/25">
              <BrainCircuit className="w-[18px] h-[18px] text-white" />
            </div>
            <h1 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("banks.title")}
            </h1>
          </div>
          <p className="text-sm text-gray-400 font-medium ms-0.5">
            {t("banks.subtitle")}
          </p>
        </div>
        <button
          onClick={openUpload}
          disabled={!canUpload}
          title={
            permissions.canCreate ? undefined : t("banks.noCreatePermission")
          }
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-xl shadow-[#404293]/30 hover:shadow-[#404293]/45 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex-shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={17} /> {t("banks.upload.title")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border shadow-sm px-4 py-3.5 flex items-center gap-3 hover:shadow-md transition-shadow ${
              isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-100"
            }`}
          >
            <div
              className="w-1.5 h-8 rounded-full flex-shrink-0"
              style={{
                background: `linear-gradient(180deg,${stat.color},${stat.color}55)`,
              }}
            />
            <div>
              <p className={`text-lg font-black leading-none ${isDark ? "text-white" : "text-gray-900"}`}>
                {stat.value}
              </p>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div
        className={`rounded-3xl border shadow-sm overflow-hidden ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-100"
        }`}
      >
        <div
          className={`flex items-center justify-between gap-4 px-6 py-4 border-b ${
            isDark ? "border-white/10 bg-white/[0.02]" : "border-gray-100 bg-gray-50/60"
          }`}
        >
          {breadcrumb}
          {step !== "year" && (
            <button
              onClick={goBack}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold shadow-sm transition-all flex-shrink-0 ${
                isDark
                  ? "border-white/10 bg-white/5 text-gray-300 hover:text-[#7fb5e4] hover:border-[#2376BB]/40"
                  : "border-gray-200 bg-white text-gray-600 hover:text-[#404293] hover:border-[#404293]/30"
              }`}
            >
              <ArrowLeft
                className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
              />{" "}
              {t("common:actions.back")}
            </button>
          )}
        </div>

        <div className="p-6 min-h-[380px]">
          <AnimatePresence mode="wait">
            {/* ── STEP: year ─────────────────────── */}
            {step === "year" && (
              <motion.div
                key="year"
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                    {t("banks.steps.selectYear")}
                  </h2>
                </div>

                {yearsLoading ? (
                  <LoadingPlaceholder label={t("banks.loading.years")} isDark={isDark} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {years.map((year) => (
                      <button
                        key={year._id}
                        onClick={() => selectYear(year._id)}
                        className={`group py-8 px-4 rounded-2xl border-2 font-bold flex flex-col items-center gap-3 hover:bg-gradient-to-br hover:from-[#404293] hover:to-[#2376BB] hover:text-white hover:border-transparent hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#404293]/20 transition-all duration-300 ${
                          isDark
                            ? "border-white/10 bg-white/5 text-gray-200"
                            : "border-gray-100 bg-gray-50 text-gray-700"
                        }`}
                      >
                        <GraduationCap
                          className={`w-10 h-10 group-hover:text-white/80 transition-colors group-hover:scale-110 duration-300 ${
                            isDark ? "text-gray-600" : "text-gray-300"
                          }`}
                        />
                        <span className="text-sm text-center leading-tight">
                          {year.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── STEP: semester ──────────────────── */}
            {step === "semester" && (
              <motion.div
                key="sem"
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <Layers className="w-5 h-5 text-[#33529F]" />
                  <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                    {t("banks.steps.selectSemester", {
                      year: selectedYearName,
                    })}
                  </h2>
                </div>

                {semestersLoading ? (
                  <LoadingPlaceholder label={t("banks.loading.semesters")} isDark={isDark} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                    {semesters.map((semester) => (
                      <button
                        key={semester._id}
                        onClick={() => selectSemester(semester._id)}
                        className={`group py-12 px-6 rounded-2xl border-2 font-bold flex flex-col items-center gap-4 hover:bg-gradient-to-br hover:from-[#33529F] hover:to-[#2376BB] hover:text-white hover:border-transparent hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#33529F]/20 transition-all duration-300 ${
                          isDark
                            ? "border-white/10 bg-white/5 text-gray-200"
                            : "border-gray-100 bg-gray-50 text-gray-700"
                        }`}
                      >
                        <Layers
                          className={`w-12 h-12 group-hover:text-white/80 transition-colors group-hover:scale-110 duration-300 ${
                            isDark ? "text-gray-600" : "text-gray-300"
                          }`}
                        />
                        <span className="text-lg">{semester.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── STEP: subject ───────────────────── */}
            {step === "subject" && (
              <motion.div
                key="sub"
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <Book className="w-5 h-5 text-[#2376BB]" />
                  <h2 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                    {t("banks.steps.selectSubject", {
                      semester: selectedSemesterName,
                    })}
                  </h2>
                </div>

                {subjectsLoading ? (
                  <LoadingPlaceholder label={t("banks.loading.subjects")} isDark={isDark} />
                ) : subjects.length === 0 ? (
                  <EmptyState
                    icon={<FolderOpen className={`w-7 h-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />}
                    title={t("banks.empty.noSubjectsTitle")}
                    message={t("banks.empty.noSubjectsMessage")}
                    isDark={isDark}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                      <button
                        key={subject._id}
                        onClick={() => selectSubject(subject._id)}
                        className={`group p-5 rounded-2xl border-2 text-start flex flex-col gap-3 hover:bg-gradient-to-br hover:from-[#2376BB] hover:to-[#33529F] hover:text-white hover:border-transparent hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#2376BB]/20 transition-all duration-300 ${
                          isDark
                            ? "border-white/10 bg-white/5"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors ${
                            isDark ? "bg-[#2376BB]/15" : "bg-blue-100"
                          }`}
                        >
                          <FileText className={`w-5 h-5 group-hover:text-white transition-colors ${isDark ? "text-[#7fb5e4]" : "text-[#2376BB]"}`} />
                        </div>
                        <p
                          className={`text-sm font-bold group-hover:text-white transition-colors leading-snug ${
                            isDark ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {subject.name}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── STEP: banks ─────────────────────── */}
            {step === "banks" && (
              <motion.div
                key="banks"
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2.5">
                    <BrainCircuit className="w-5 h-5 text-[#2376BB]" />
                    <h2 className={`text-lg font-bold truncate ${isDark ? "text-white" : "text-gray-800"}`}>
                      {selectedSubjectName}
                    </h2>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isDark ? "bg-[#404293]/25 text-[#7fb5e4]" : "bg-[#404293]/10 text-[#404293]"
                      }`}
                    >
                      {t("banks.bankCount", { count: banks.length })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border shadow-sm ${
                        isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
                      }`}
                    >
                      <Search className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t("banks.searchPlaceholder")}
                        className={`bg-transparent text-sm outline-none w-36 ${
                          isDark ? "text-gray-200 placeholder-gray-500" : "text-gray-700 placeholder-gray-400"
                        }`}
                      />
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          aria-label={t("banks.clearSearch")}
                        >
                          <X
                            size={13}
                            className={isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-300 hover:text-gray-500"}
                          />
                        </button>
                      )}
                    </div>
                    {permissions.canCreate && (
                      <button
                        onClick={openUpload}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-xs font-bold shadow-md hover:-translate-y-0.5 transition-all flex-shrink-0"
                      >
                        <Plus size={14} /> {t("banks.uploadShort")}
                      </button>
                    )}
                  </div>
                </div>

                {actionError && (
                  <div
                    className={`mb-4 rounded-2xl border px-5 py-3.5 text-sm font-medium ${
                      isDark ? "bg-red-500/10 border-red-500/25 text-red-400" : "bg-red-50 border-red-100 text-red-600"
                    }`}
                  >
                    {actionError}
                  </div>
                )}

                {banksLoading ? (
                  <LoadingPlaceholder label={t("banks.loading.banks")} isDark={isDark} />
                ) : banks.length === 0 ? (
                  <EmptyState
                    icon={<FolderOpen className={`w-7 h-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />}
                    title={t("banks.empty.noBanksTitle")}
                    message={t(
                      search ? "banks.empty.noMatches" : "banks.empty.uploadFirst",
                    )}
                    isDark={isDark}
                    action={
                      !search &&
                      permissions.canCreate && (
                        <button
                          onClick={openUpload}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-sm font-bold shadow-md"
                        >
                          <Plus size={14} /> {t("banks.upload.title")}
                        </button>
                      )
                    }
                  />
                ) : (
                  <AnimatePresence mode="popLayout">
                    <div className="space-y-3">
                      {banks.map((item) => (
                        <BankCard
                          key={item._id}
                          bank={item}
                          isDark={isDark}
                          disabled={isMutating}
                          canPublish={permissions.canCreate}
                          canDelete={permissions.canCreate}
                          onOpen={() => openBank(item._id)}
                          onPublish={() => handlePublish(item._id)}
                          onUnpublish={() => handleUnpublish(item._id)}
                          onDelete={() => handleDeleteBank(item._id)}
                        />
                      ))}
                    </div>
                  </AnimatePresence>
                )}
              </motion.div>
            )}

            {/* ── STEP: bank review ───────────────── */}
            {step === "bank" && (
              <motion.div
                key="bank"
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              >
                {bankLoading && !bank ? (
                  <LoadingPlaceholder label={t("banks.loading.bank")} isDark={isDark} />
                ) : !bank ? (
                  <EmptyState
                    icon={<FolderOpen className={`w-7 h-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />}
                    title={t("banks.empty.bankNotFoundTitle")}
                    message={t("banks.empty.bankNotFoundMessage")}
                    isDark={isDark}
                  />
                ) : (
                  <BankReviewPanel
                    bank={bank}
                    questions={questions}
                    isDark={isDark}
                    isLoading={bankLoading}
                    isMutating={isMutating}
                    actionError={actionError}
                    permissions={permissions}
                    onPublish={() => handlePublish(bank._id)}
                    onUnpublish={() => handleUnpublish(bank._id)}
                    onDeleteBank={() => handleDeleteBank(bank._id)}
                    onDeleteQuestion={handleDeleteQuestion}
                    onUpdateQuestion={(questionId, data) =>
                      handleUpdateQuestion({ questionId, data })
                    }
                    onAddQuestions={openUpload}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && selectedSubjectId && (
          <UploadQuestionsModal
            subjectId={selectedSubjectId}
            subjectName={selectedSubjectName}
            isDark={isDark}
            presetLectureId={
              step === "bank" && bank ? getLectureId(bank) || undefined : undefined
            }
            onClose={closeUpload}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────
function LoadingPlaceholder({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-20 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
  action,
  isDark,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
          isDark ? "bg-white/5" : "bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <p className={`font-bold mb-1 ${isDark ? "text-gray-300" : "text-gray-400"}`}>{title}</p>
      <p className={`text-sm mb-4 ${isDark ? "text-gray-500" : "text-gray-300"}`}>{message}</p>
      {action}
    </div>
  );
}
