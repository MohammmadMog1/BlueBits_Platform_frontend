/**
 * SurveyPage
 *
 * استبيان الجدولة للطالب: لوحة يسار لاختيار مواد الفصل المفتوح،
 * ولوحة يمين ثابتة لضبط صعوبة كل مادة وأيام الراحة قبل امتحانها.
 */
import { useTheme } from "next-themes";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Inbox,
  Lock,
  RefreshCcw,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import SubjectAnswerCard from "../components/SubjectAnswerCard";
import SubjectPickerCard from "../components/SubjectPickerCard";
import SurveyResponseSummary from "../components/SurveyResponseSummary";
import SurveySuccessState from "../components/SurveySuccessState";
import { useSurveyResponse, type PickerTab } from "../hooks/useSurveyResponse";
import {
  dividerClass,
  errorAlertClass,
  faintClass,
  fieldClass,
  headingClass,
  iconButtonClass,
  infoAlertClass,
  mutedClass,
  panelClass,
  skeletonClass,
} from "../../../admin/surveys/utils/surveyTheme";

const STEPS = [
  "اختر المواد التي ستتقدّم لامتحانها",
  "حدّد صعوبة كل مادة وأيام الراحة",
  "أرسل إجابتك ونحن نتكفّل بالباقي",
];

export default function SurveyPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    form,
    alreadySubmitted,
    rows,
    visibleRows,
    selectedRows,
    selectedCount,
    carryingCount,
    subjectsCount,
    myResponse,
    lastResponse,
    yearName,
    semesterName,
    isLoading,
    isFetching,
    activeError,
    subjectsLoading,
    subjectsError,
    myResponseLoading,
    lastResponseLoading,
    isSubmitting,
    submitError,
    successMessage,
    isConfirming,
    tab,
    search,
    canSubmit,
    setTab,
    setSearch,
    toggleSubject,
    toggleCarrying,
    setDaysBefore,
    setDifficulty,
    selectAll,
    clearAll,
    askSubmit,
    cancelSubmit,
    confirmSubmit,
    dismissSuccess,
    refetch,
  } = useSurveyResponse();

  // شاشة الاحتفال بعد الإرسال – تسبق كل شيء
  if (successMessage) {
    return (
      <div>
        <SurveySuccessState
          isDark={isDark}
          subjectsCount={selectedCount}
          onViewResponse={dismissSuccess}
        />
      </div>
    );
  }

  const tabs: { value: PickerTab; label: string; count: number }[] = [
    { value: "all", label: "كل المواد", count: rows.length },
    { value: "selected", label: "المحددة", count: selectedCount },
    { value: "carrying", label: "الحملة", count: carryingCount },
  ];

  return (
    <div className="mx-auto flex max-w-[1300px] flex-col gap-6 pb-8">
      {/* ── الترويسة ─────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            className={`mb-1.5 text-2xl font-black tracking-tight sm:text-3xl ${headingClass(isDark)}`}
          >
            استبيان برنامج الفحص
          </h1>
          <p className={`text-sm font-medium sm:text-base ${mutedClass(isDark)}`}>
            رأيك يحدّد ترتيب امتحاناتك — حدّد لكل مادة صعوبتها وأيام الراحة التي
            تحتاجها
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          title="تحديث"
          className={iconButtonClass(isDark)}
        >
          <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* ── كيف يعمل ─────────────────────────── */}
      {form && !alreadySubmitted && (
        <div className={`flex flex-wrap gap-2.5 text-sm ${mutedClass(isDark)}`}>
          {STEPS.map((text, index) => (
            <div
              key={text}
              className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs font-medium sm:text-sm ${
                isDark
                  ? "border-white/10 bg-white/5"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#404293] to-[#2376BB] text-[10px] font-black text-white">
                {index + 1}
              </span>
              {text}
              {index < STEPS.length - 1 && (
                <ArrowLeft className="h-3.5 w-3.5 shrink-0 opacity-40" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── التنبيهات ────────────────────────── */}
      {[activeError, subjectsError].filter(Boolean).map((message) => (
        <div key={message} className={errorAlertClass(isDark)}>
          <AlertCircle className="h-4 w-4 shrink-0" />
          {message}
        </div>
      ))}

      {/* ── المحتوى ──────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">
          <div className={`${skeletonClass(isDark)} h-[520px]`} />
          <div className={`${skeletonClass(isDark)} h-[420px]`} />
        </div>
      ) : !form ? (
        <>
          <div
            className={`${panelClass(isDark)} flex flex-col items-center justify-center py-20 text-center`}
          >
            <div
              className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
                isDark ? "bg-white/5" : "bg-gray-100"
              }`}
            >
              <Lock className={`h-9 w-9 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
            </div>
            <h2 className={`mb-2 text-xl font-black ${headingClass(isDark)}`}>
              لا يوجد استبيان مفتوح حالياً
            </h2>
            <p className={`max-w-md text-sm ${mutedClass(isDark)}`}>
              سيظهر الاستبيان هنا فور فتحه لسنتك الدراسية من قِبل الإدارة.
            </p>
          </div>

          {!lastResponseLoading && lastResponse && (
            <SurveyResponseSummary
              response={lastResponse}
              isDark={isDark}
              title="آخر إجابة عبّأتها"
              hint="محفوظة من استبيان سابق"
            />
          )}
        </>
      ) : alreadySubmitted ? (
        myResponseLoading ? (
          <div className={`${skeletonClass(isDark)} h-64`} />
        ) : myResponse ? (
          <SurveyResponseSummary
            response={myResponse}
            isDark={isDark}
            title="تم استلام إجابتك على هذا الاستبيان"
            hint="لا يمكن تعديل الإجابة بعد إرسالها"
          />
        ) : (
          <div
            className={`flex flex-col items-center justify-center rounded-3xl border py-20 text-center ${
              isDark
                ? "border-emerald-500/25 bg-emerald-500/10"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-500" />
            <p
              className={`mb-1 text-lg font-black ${isDark ? "text-emerald-400" : "text-emerald-700"}`}
            >
              أجبت على هذا الاستبيان مسبقاً
            </p>
            <p className={isDark ? "text-emerald-500" : "text-emerald-600"}>
              شكراً لمشاركتك
            </p>
          </div>
        )
      ) : (
        <>
          {/* ── معلومات الفورم ───────────────── */}
          <div className={infoAlertClass(isDark)}>
            <CalendarClock className="h-4 w-4 shrink-0" />
            <p className="flex-1 text-sm font-bold">
              استبيان {yearName} — {semesterName} — {form.academicYear}
            </p>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-black ${
                isDark ? "bg-white/10 text-white" : "bg-white text-[#404293]"
              }`}
            >
              {selectedCount} من {subjectsCount} مادة
            </span>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_420px]">
            {/* ══ يسار: اختيار المواد ══════════ */}
            <div className={`${panelClass(isDark)} overflow-hidden`}>
              <div className={`border-b px-6 pb-0 pt-6 ${dividerClass(isDark)}`}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className={`text-base font-black ${headingClass(isDark)}`}>
                    اختر موادك
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className={`text-xs font-bold transition-colors ${
                        isDark
                          ? "text-gray-500 hover:text-[#7fb5e4]"
                          : "text-gray-400 hover:text-[#404293]"
                      }`}
                    >
                      تحديد الكل
                    </button>
                    <span className={faintClass(isDark)}>·</span>
                    <button
                      type="button"
                      onClick={clearAll}
                      className={`text-xs font-bold transition-colors ${
                        isDark
                          ? "text-gray-500 hover:text-red-400"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      إلغاء الكل
                    </button>
                  </div>
                </div>

                <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                  {tabs.map((item) => {
                    const isActive = tab === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setTab(item.value)}
                        className={`relative shrink-0 rounded-t-xl border-b-2 px-4 py-2.5 text-sm font-bold transition-all ${
                          isActive
                            ? `border-[#2376BB] ${isDark ? "bg-[#2376BB]/10 text-[#7fb5e4]" : "bg-[#404293]/5 text-[#404293]"}`
                            : `border-transparent ${
                                isDark
                                  ? "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                              }`
                        }`}
                      >
                        {item.label}
                        {item.count > 0 && (
                          <span
                            className={`mr-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                              isActive
                                ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white"
                                : isDark
                                  ? "bg-white/10 text-gray-400"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-6">
                <div className="relative mb-4">
                  <Search
                    className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${faintClass(isDark)}`}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="ابحث عن مادة..."
                    className={`${fieldClass(isDark)} py-2.5 pr-11`}
                  />
                </div>

                {subjectsLoading ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className={`${skeletonClass(isDark)} h-24`} />
                    ))}
                  </div>
                ) : visibleRows.length === 0 ? (
                  <div
                    className={`flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center ${
                      isDark
                        ? "border-white/12 bg-white/[0.03]"
                        : "border-gray-200 bg-gray-50/60"
                    }`}
                  >
                    <Inbox className={`mb-3 h-7 w-7 ${faintClass(isDark)}`} />
                    <p className={`text-sm font-bold ${mutedClass(isDark)}`}>
                      {rows.length === 0
                        ? "لا توجد مواد لسنتك في هذا الفصل"
                        : "لا نتائج مطابقة"}
                    </p>
                    <p className={`mt-1 text-xs ${faintClass(isDark)}`}>
                      {rows.length === 0
                        ? "راجع الإدارة لإضافة مواد الفصل قبل تعبئة الاستبيان"
                        : "جرّب تبويباً آخر أو امسح كلمة البحث"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {visibleRows.map((row, index) => (
                        <SubjectPickerCard
                          key={row.subjectId}
                          row={row}
                          index={index}
                          isDark={isDark}
                          onToggle={() => toggleSubject(row.subjectId)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* ══ يمين: لوحة الإعدادات ═════════ */}
            <div className="space-y-4 xl:sticky xl:top-4">
              <div className={`${panelClass(isDark)} overflow-hidden`}>
                <div
                  className={`flex items-center justify-between gap-3 border-b px-6 py-5 ${dividerClass(isDark)}`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen
                      className={`h-5 w-5 ${
                        selectedCount > 0
                          ? "text-[#2376BB]"
                          : isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                      }`}
                    />
                    <span className={`text-sm font-black ${headingClass(isDark)}`}>
                      إجابتك
                    </span>
                    {selectedCount > 0 && (
                      <motion.span
                        key={selectedCount}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="rounded-full bg-gradient-to-r from-[#404293] to-[#2376BB] px-2 py-0.5 text-xs font-black text-white"
                      >
                        {selectedCount}
                      </motion.span>
                    )}
                  </div>
                  {selectedCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className={`text-xs font-bold transition-colors ${
                        isDark
                          ? "text-gray-500 hover:text-red-400"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      مسح الكل
                    </button>
                  )}
                </div>

                <div className="custom-scrollbar max-h-[520px] overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {selectedRows.length === 0 ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-6 py-14 text-center"
                      >
                        <div
                          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                            isDark ? "bg-white/5" : "bg-gray-100"
                          }`}
                        >
                          <BookOpen className={`h-7 w-7 ${faintClass(isDark)}`} />
                        </div>
                        <p className={`text-sm font-medium ${mutedClass(isDark)}`}>
                          لم تختر أي مادة بعد.
                          <br />
                          اختر من القائمة على اليسار.
                        </p>
                      </motion.div>
                    ) : (
                      selectedRows.map((row) => (
                        <SubjectAnswerCard
                          key={row.subjectId}
                          row={row}
                          isDark={isDark}
                          onRemove={() => toggleSubject(row.subjectId)}
                          onToggleCarrying={() => toggleCarrying(row.subjectId)}
                          onDaysChange={(value) => setDaysBefore(row.subjectId, value)}
                          onDifficultyChange={(value) =>
                            setDifficulty(row.subjectId, value)
                          }
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── زر الإرسال ─────────────────── */}
              <motion.button
                type="button"
                onClick={askSubmit}
                disabled={!canSubmit}
                whileHover={canSubmit ? { y: -2 } : undefined}
                whileTap={canSubmit ? { scale: 0.97 } : undefined}
                className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-base font-black transition-all duration-200 ${
                  canSubmit
                    ? "bg-gradient-to-r from-[#404293] to-[#2376BB] text-white shadow-xl shadow-[#404293]/25 hover:shadow-2xl hover:shadow-[#404293]/35"
                    : isDark
                      ? "cursor-not-allowed border border-white/8 bg-white/5 text-gray-600"
                      : "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
                }`}
              >
                <Send className="h-5 w-5" />
                إرسال الإجابة
                {selectedCount > 0 && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-black">
                    {selectedCount}
                  </span>
                )}
              </motion.button>

              <p className={`text-center text-xs font-medium ${faintClass(isDark)}`}>
                {selectedCount === 0
                  ? "اختر مادة واحدة على الأقل لتتمكّن من الإرسال"
                  : "راجع إعداداتك جيداً — لا يمكن تعديل الإجابة بعد إرسالها"}
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── تأكيد الإرسال ────────────────────── */}
      <AnimatePresence>
        {isConfirming && form && !alreadySubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
            onClick={() => !isSubmitting && cancelSubmit()}
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
                  isDark ? "bg-[#2376BB]/15" : "bg-[#404293]/10"
                }`}
              >
                <Sparkles
                  className={`h-6 w-6 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}
                />
              </div>
              <h3 className={`mb-2 text-lg font-black ${headingClass(isDark)}`}>
                تأكيد الإرسال
              </h3>
              <p className={`mb-1 text-sm ${mutedClass(isDark)}`}>
                ستُرسل إجابتك على {selectedCount} مادة
                {carryingCount > 0 ? ` (منها ${carryingCount} حملة)` : ""}.
              </p>
              <p className="mb-6 text-xs font-bold text-amber-600">
                لا يمكن تعديل الإجابة بعد إرسالها.
              </p>

              {submitError && (
                <p
                  className={`mb-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-right text-xs font-bold ${
                    isDark
                      ? "border-red-500/25 bg-red-500/10 text-red-400"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  <AlertCircle size={13} className="shrink-0" />
                  {submitError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-colors disabled:opacity-50 ${
                    isDark
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  مراجعة
                </button>
                <button
                  type="button"
                  onClick={confirmSubmit}
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-3 text-sm font-bold text-white shadow-md shadow-[#404293]/25 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                      />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> نعم، أرسل
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
