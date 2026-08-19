/**
 * SurveyFormsManagementPage
 *
 * إدارة فورمات استبيان الجدولة: إنشاء مسودة لكل (سنة × فصل)،
 * فتحها للطلاب، إغلاقها نهائياً، وتصفح ردود كل فورم.
 */
import { useTheme } from "next-themes";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FilePlus2,
  Inbox,
  Lock,
  PlayCircle,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import CreateSurveyFormModal from "../components/CreateSurveyFormModal";
import FormResponsesPanel from "../components/FormResponsesPanel";
import SurveyFormCard from "../components/SurveyFormCard";
import { useSurveyFormsManager } from "../hooks/useSurveyFormsManager";
import type { SurveyFormFilter } from "../types";
import {
  errorAlertClass,
  faintClass,
  fieldClass,
  headingClass,
  iconButtonClass,
  mutedClass,
  panelClass,
  primaryButtonClass,
  segmentButtonClass,
  skeletonClass,
  successAlertClass,
} from "../utils/surveyTheme";

const FILTERS: { value: SurveyFormFilter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "draft", label: "مسودات" },
  { value: "open", label: "مفتوحة" },
  { value: "closed", label: "مغلقة" },
];

export default function SurveyFormsManagementPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    visibleForms,
    counts,
    years,
    semesters,
    openedForm,
    describeForm,
    findDuplicate,
    isLoading,
    isFetching,
    listError,
    yearsLoading,
    semestersLoading,
    filter,
    search,
    isCreating,
    isSubmitting,
    createError,
    pendingAction,
    isActionRunning,
    actionError,
    successMessage,
    setFilter,
    setSearch,
    startCreate,
    cancelCreate,
    submitCreate,
    askOpen,
    askClose,
    cancelAction,
    confirmAction,
    viewResponses,
    closeResponses,
    refetch,
    dismissSuccess,
  } = useSurveyFormsManager();

  const pendingInfo = pendingAction ? describeForm(pendingAction.form) : null;
  const isOpening = pendingAction?.type === "open";

  return (
    <div className="mx-auto flex max-w-[1300px] flex-col gap-6">
      {/* ── الترويسة ─────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-lg shadow-[#404293]/25">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1
              className={`text-xl font-black tracking-tight sm:text-2xl ${headingClass(isDark)}`}
            >
              استبيان الجدولة
            </h1>
            <p className={`mt-0.5 text-sm font-medium ${mutedClass(isDark)}`}>
              أنشئ فورماً لكل سنة في كل فصل، افتحه للطلاب، ثم أغلقه قبل توليد
              الجدول
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void refetch()}
            title="تحديث"
            className={iconButtonClass(isDark)}
          >
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={startCreate}
            className={`${primaryButtonClass} px-5 py-2.5`}
          >
            <FilePlus2 size={15} /> فورم جديد
          </button>
        </div>
      </div>

      {/* ── الفلاتر والبحث ───────────────────── */}
      <div className={`${panelClass(isDark)} flex flex-wrap items-center gap-3 p-4`}>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => {
            const isActive = filter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${segmentButtonClass(
                  isDark,
                  isActive,
                )}`}
              >
                {item.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] font-black ${
                    isActive
                      ? "bg-white/20"
                      : isDark
                        ? "bg-white/10 text-gray-400"
                        : "bg-white text-gray-400"
                  }`}
                >
                  {counts[item.value]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[200px] flex-1">
          <Search
            className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${faintClass(isDark)}`}
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث بالسنة أو الفصل أو السنة الأكاديمية..."
            className={`${fieldClass(isDark)} py-2.5 pr-11`}
          />
        </div>
      </div>

      {/* ── التنبيهات ────────────────────────── */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={successAlertClass(isDark)}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="flex-1">{successMessage}</span>
            <button type="button" onClick={dismissSuccess} aria-label="إغلاق">
              <X size={14} className="opacity-60 hover:opacity-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {listError && (
        <div className={errorAlertClass(isDark)}>
          <AlertCircle className="h-4 w-4 shrink-0" />
          {listError}
        </div>
      )}

      {/* ── لوحة الردود ──────────────────────── */}
      <AnimatePresence>
        {openedForm && (
          <FormResponsesPanel
            key={openedForm._id}
            formId={openedForm._id}
            yearName={describeForm(openedForm).yearName}
            semesterName={describeForm(openedForm).semesterName}
            isDark={isDark}
            onClose={closeResponses}
          />
        )}
      </AnimatePresence>

      {/* ── قائمة الفورمات ───────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`${skeletonClass(isDark)} h-64`} />
          ))}
        </div>
      ) : visibleForms.length === 0 ? (
        <div
          className={`${panelClass(isDark)} flex flex-col items-center justify-center py-24 text-center`}
        >
          <div
            className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
              isDark ? "bg-white/5" : "bg-gray-100"
            }`}
          >
            <Inbox className={`h-9 w-9 ${faintClass(isDark)}`} />
          </div>
          <h2 className={`mb-2 text-lg font-black ${headingClass(isDark)}`}>
            {counts.all === 0 ? "لا توجد فورمات بعد" : "لا نتائج مطابقة"}
          </h2>
          <p className={`mb-6 max-w-md text-sm ${mutedClass(isDark)}`}>
            {counts.all === 0
              ? "أنشئ فورماً لكل سنة في الفصل المطلوب ليبدأ الطلاب بالإجابة"
              : "جرّب فلتراً آخر أو امسح كلمة البحث"}
          </p>
          {counts.all === 0 && (
            <button
              type="button"
              onClick={startCreate}
              className={`${primaryButtonClass} px-5 py-2.5`}
            >
              <FilePlus2 size={15} /> إنشاء أول فورم
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {visibleForms.map((form) => {
              const info = describeForm(form);
              return (
                <SurveyFormCard
                  key={form._id}
                  form={form}
                  yearName={info.yearName}
                  semesterName={info.semesterName}
                  isDark={isDark}
                  isBusy={isActionRunning}
                  isOpened={openedForm?._id === form._id}
                  onOpen={() => askOpen(form)}
                  onClose={() => askClose(form)}
                  onViewResponses={() =>
                    openedForm?._id === form._id
                      ? closeResponses()
                      : viewResponses(form)
                  }
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── نافذة الإنشاء ────────────────────── */}
      <AnimatePresence>
        {isCreating && (
          <CreateSurveyFormModal
            years={years}
            semesters={semesters}
            yearsLoading={yearsLoading}
            semestersLoading={semestersLoading}
            isDark={isDark}
            isSubmitting={isSubmitting}
            error={createError}
            findDuplicate={findDuplicate}
            onCancel={cancelCreate}
            onSubmit={submitCreate}
          />
        )}
      </AnimatePresence>

      {/* ── تأكيد الفتح / الإغلاق ────────────── */}
      <AnimatePresence>
        {pendingAction && pendingInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
            onClick={() => !isActionRunning && cancelAction()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              className={`w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl ${
                isDark ? "bg-[#202121] ring-1 ring-white/10" : "bg-white"
              }`}
            >
              <div
                className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isOpening
                    ? isDark
                      ? "bg-[#2376BB]/15"
                      : "bg-[#404293]/10"
                    : isDark
                      ? "bg-red-500/15"
                      : "bg-red-50"
                }`}
              >
                {isOpening ? (
                  <PlayCircle
                    className={`h-6 w-6 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}
                  />
                ) : (
                  <Lock className="h-6 w-6 text-red-500" />
                )}
              </div>

              <h3 className={`mb-2 text-lg font-black ${headingClass(isDark)}`}>
                {isOpening ? "تأكيد الفتح" : "تأكيد الإغلاق النهائي"}
              </h3>
              <p className={`mb-1 text-sm ${mutedClass(isDark)}`}>
                {isOpening
                  ? "سيتمكن طلاب هذه السنة من تعبئة الاستبيان:"
                  : "سيتوقف استقبال الردود نهائياً لفورم:"}
              </p>
              <p
                className={`mb-4 text-sm font-black ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}
              >
                {pendingInfo.yearName} — {pendingInfo.semesterName} —{" "}
                {pendingAction.form.academicYear}
              </p>
              {!isOpening && (
                <p className="mb-6 text-xs font-bold text-red-500">
                  لا يمكن إعادة فتح الفورم بعد إغلاقه.
                </p>
              )}

              {actionError && (
                <p
                  className={`mb-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-right text-xs font-bold ${
                    isDark
                      ? "border-red-500/25 bg-red-500/10 text-red-400"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  <AlertCircle size={13} className="shrink-0" />
                  {actionError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelAction}
                  disabled={isActionRunning}
                  className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-colors disabled:opacity-50 ${
                    isDark
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={confirmAction}
                  disabled={isActionRunning}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-md transition-all disabled:opacity-60 ${
                    isOpening
                      ? "bg-gradient-to-r from-[#404293] to-[#2376BB] shadow-[#404293]/25"
                      : "bg-red-500 shadow-red-500/25 hover:bg-red-600"
                  }`}
                >
                  {isActionRunning
                    ? "جاري التنفيذ..."
                    : isOpening
                      ? "نعم، افتح"
                      : "نعم، أغلق"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
