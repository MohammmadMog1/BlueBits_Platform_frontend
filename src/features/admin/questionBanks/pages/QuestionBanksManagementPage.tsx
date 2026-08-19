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
import { BankCard } from "../components/BankCard";
import { BankReviewPanel } from "../components/BankReviewPanel";
import { UploadQuestionsModal } from "../components/UploadQuestionsModal";
import { useQuestionBankManager } from "../hooks/useQuestionBankManager";
import { useQuestionBankPermissions } from "../hooks/useQuestionBankPermissions";
import { getLectureId } from "../utils/bank";

export default function QuestionBanksManagementPage() {
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
    years.find((year) => year._id === selectedYearId)?.name ?? "Year";
  const selectedSemesterName =
    semesters.find((semester) => semester._id === selectedSemesterId)?.name ??
    "Semester";
  const selectedSubjectName =
    subjects.find((subject) => subject._id === selectedSubjectId)?.name ?? "Subject";

  const canUpload = Boolean(selectedSubjectId) && permissions.canCreate;

  // ── Breadcrumb ────────────────────────────
  const breadcrumb = (
    <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
      <button
        onClick={() => navTo("year")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
          step === "year"
            ? "bg-[#404293]/10 text-[#404293]"
            : "text-gray-400 hover:text-[#404293] hover:bg-[#404293]/5"
        }`}
      >
        <GraduationCap className="w-4 h-4" />
        {selectedYearId ? selectedYearName : "Year"}
      </button>

      {selectedYearId && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <button
            onClick={() => navTo("semester")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              step === "semester"
                ? "bg-[#33529F]/10 text-[#33529F]"
                : "text-gray-400 hover:text-[#404293] hover:bg-[#404293]/5"
            }`}
          >
            <Layers className="w-4 h-4" />
            {selectedSemesterId ? selectedSemesterName : "Semester"}
          </button>
        </>
      )}

      {selectedSemesterId && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <button
            onClick={() => navTo("subject")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              step === "subject"
                ? "bg-[#2376BB]/10 text-[#2376BB]"
                : "text-gray-400 hover:text-[#404293] hover:bg-[#404293]/5"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {selectedSubjectId ? selectedSubjectName : "Subject"}
          </button>
        </>
      )}

      {selectedSubjectId && (step === "banks" || step === "bank") && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <button
            onClick={() => navTo("banks")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              step === "banks"
                ? "bg-[#2376BB]/10 text-[#2376BB]"
                : "text-gray-400 hover:text-[#404293] hover:bg-[#404293]/5"
            }`}
          >
            <Book className="w-4 h-4" /> Banks
          </button>
        </>
      )}

      {step === "bank" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600">
            <ListChecks className="w-4 h-4" /> Review
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
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Question Banks (MCQ)
            </h1>
          </div>
          <p className="text-sm text-gray-400 font-medium ml-0.5">
            Navigate by year → semester → subject to upload, review and publish banks
          </p>
        </div>
        <button
          onClick={openUpload}
          disabled={!canUpload}
          title={permissions.canCreate ? undefined : "لا تملك صلاحية إنشاء بنك أسئلة"}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white font-bold text-sm shadow-xl shadow-[#404293]/30 hover:shadow-[#404293]/45 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex-shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={17} /> Upload Questions
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3 hover:shadow-md transition-shadow"
          >
            <div
              className="w-1.5 h-8 rounded-full flex-shrink-0"
              style={{
                background: `linear-gradient(180deg,${stat.color},${stat.color}55)`,
              }}
            />
            <div>
              <p className="text-lg font-black text-gray-900 leading-none">
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
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          {breadcrumb}
          {step !== "year" && (
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:text-[#404293] hover:border-[#404293]/30 shadow-sm transition-all flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Back
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
                  <h2 className="text-lg font-bold text-gray-800">
                    Select Academic Year
                  </h2>
                </div>

                {yearsLoading ? (
                  <LoadingPlaceholder label="Loading years…" />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {years.map((year) => (
                      <button
                        key={year._id}
                        onClick={() => selectYear(year._id)}
                        className="group py-8 px-4 rounded-2xl border-2 border-gray-100 bg-gray-50 font-bold text-gray-700 flex flex-col items-center gap-3 hover:border-[#404293]/40 hover:bg-gradient-to-br hover:from-[#404293] hover:to-[#2376BB] hover:text-white hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#404293]/20 transition-all duration-300"
                      >
                        <GraduationCap className="w-10 h-10 text-gray-300 group-hover:text-white/80 transition-colors group-hover:scale-110 duration-300" />
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
                  <h2 className="text-lg font-bold text-gray-800">
                    Select Semester —{" "}
                    <span className="text-[#404293]">{selectedYearName}</span>
                  </h2>
                </div>

                {semestersLoading ? (
                  <LoadingPlaceholder label="Loading semesters…" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                    {semesters.map((semester) => (
                      <button
                        key={semester._id}
                        onClick={() => selectSemester(semester._id)}
                        className="group py-12 px-6 rounded-2xl border-2 border-gray-100 bg-gray-50 font-bold text-gray-700 flex flex-col items-center gap-4 hover:border-[#33529F]/40 hover:bg-gradient-to-br hover:from-[#33529F] hover:to-[#2376BB] hover:text-white hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#33529F]/20 transition-all duration-300"
                      >
                        <Layers className="w-12 h-12 text-gray-300 group-hover:text-white/80 transition-colors group-hover:scale-110 duration-300" />
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
                  <h2 className="text-lg font-bold text-gray-800">
                    Select Subject —{" "}
                    <span className="text-[#33529F]">{selectedSemesterName}</span>
                  </h2>
                </div>

                {subjectsLoading ? (
                  <LoadingPlaceholder label="Loading subjects…" />
                ) : subjects.length === 0 ? (
                  <EmptyState
                    icon={<FolderOpen className="w-7 h-7 text-gray-300" />}
                    title="No subjects found"
                    message="No subjects exist for this year and semester."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                      <button
                        key={subject._id}
                        onClick={() => selectSubject(subject._id)}
                        className="group p-5 rounded-2xl border-2 border-gray-100 bg-gray-50 text-left flex flex-col gap-3 hover:border-[#2376BB]/40 hover:bg-gradient-to-br hover:from-[#2376BB] hover:to-[#33529F] hover:text-white hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#2376BB]/20 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <FileText className="w-5 h-5 text-[#2376BB] group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-gray-800 group-hover:text-white transition-colors leading-snug">
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
                    <h2 className="text-lg font-bold text-gray-800 truncate">
                      {selectedSubjectName}
                    </h2>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#404293]/10 text-[#404293]">
                      {banks.length} bank{banks.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white shadow-sm">
                      <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search..."
                        className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-36"
                      />
                      {search && (
                        <button onClick={() => setSearch("")}>
                          <X size={13} className="text-gray-300 hover:text-gray-500" />
                        </button>
                      )}
                    </div>
                    {permissions.canCreate && (
                      <button
                        onClick={openUpload}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-xs font-bold shadow-md hover:-translate-y-0.5 transition-all flex-shrink-0"
                      >
                        <Plus size={14} /> Upload
                      </button>
                    )}
                  </div>
                </div>

                {actionError && (
                  <div className="mb-4 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 text-sm text-red-600 font-medium">
                    {actionError}
                  </div>
                )}

                {banksLoading ? (
                  <LoadingPlaceholder label="Loading question banks…" />
                ) : banks.length === 0 ? (
                  <EmptyState
                    icon={<FolderOpen className="w-7 h-7 text-gray-300" />}
                    title="No question banks yet"
                    message={
                      search
                        ? "No matches found."
                        : "ارفع أول بنك أسئلة لمحاضرات هذه المادة."
                    }
                    action={
                      !search &&
                      permissions.canCreate && (
                        <button
                          onClick={openUpload}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] text-white text-sm font-bold shadow-md"
                        >
                          <Plus size={14} /> Upload Questions
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
                  <LoadingPlaceholder label="Loading bank…" />
                ) : !bank ? (
                  <EmptyState
                    icon={<FolderOpen className="w-7 h-7 text-gray-300" />}
                    title="Bank not found"
                    message="قد يكون البنك محذوفاً — ارجع لقائمة البنوك."
                  />
                ) : (
                  <BankReviewPanel
                    bank={bank}
                    questions={questions}
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
function LoadingPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-gray-400">
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
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="font-bold text-gray-400 mb-1">{title}</p>
      <p className="text-sm text-gray-300 mb-4">{message}</p>
      {action}
    </div>
  );
}
