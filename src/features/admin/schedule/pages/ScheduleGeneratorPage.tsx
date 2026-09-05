/**
 * ScheduleGeneratorPage
 *
 * توليد برنامج الفحص: تجميع البيانات (ردود الطلاب + إعدادات الأدمن)
 * ← تشغيل الـ solver ← مراجعة الجدول ← النشر.
 */
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Send,
  Settings2,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import ConflictsPanel from "../components/ConflictsPanel";
import SemesterPicker from "../components/SemesterPicker";
import TimetableView from "../components/TimetableView";
import { useScheduleGenerator } from "../hooks/useScheduleGenerator";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import {
  brandGradient,
  cardClass,
  errorAlertClass,
  headingClass,
  infoAlertClass,
  mutedClass,
  skeletonClass,
  successAlertClass,
} from "../../../../shared/utils/theme";

export default function ScheduleGeneratorPage() {
  const { t } = useTranslation(["admin", "common"]);
  const isDark = useIsDark();
  const {
    semesters,
    semestersLoading,
    selectedSemesterId,
    semesterLabel,
    config,
    configLoading,
    conflicts,
    hasGeneratedData,
    schedule,
    resultLoading,
    subjectGroupIndex,
    isGenerating,
    isSolving,
    isPublishing,
    generateError,
    solveError,
    publishError,
    resultError,
    successMessage,
    isConfirmingPublish,
    selectSemester,
    runGenerateData,
    runSolve,
    askPublish,
    cancelPublish,
    confirmPublish,
    dismissSuccess,
  } = useScheduleGenerator();

  const isBusy = isGenerating || isSolving;
  const isConfigMissing = !configLoading && !config && Boolean(selectedSemesterId);

  const steps = [
    {
      number: 1,
      title: t("schedule.generator.collectTitle"),
      description: t("schedule.generator.collectDescription"),
      icon: Database,
      action: runGenerateData,
      loading: isGenerating,
      label: t(
        hasGeneratedData
          ? "schedule.generator.recollect"
          : "schedule.generator.collect",
      ),
      done: hasGeneratedData,
    },
    {
      number: 2,
      title: t("schedule.generator.solveTitle"),
      description: t("schedule.generator.solveDescription"),
      icon: Wand2,
      action: runSolve,
      loading: isSolving,
      label: t(
        schedule ? "schedule.generator.resolve" : "schedule.generator.solve",
      ),
      done: Boolean(schedule),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── الترويسة ─────────────────────────── */}
      <div>
        <div className="mb-1 flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${brandGradient} shadow-md shadow-[#404293]/25`}>
            <Sparkles className="h-[18px] w-[18px] text-white" />
          </div>
          <h1 className={`text-xl font-black tracking-tight ${headingClass(isDark)}`}>
            {t("schedule.generator.title")}
          </h1>
        </div>
        <p className={`text-sm font-medium ${mutedClass(isDark)}`}>
          {t("schedule.generator.subtitle")}
        </p>
      </div>

      <SemesterPicker
        semesters={semesters}
        isLoading={semestersLoading}
        selectedId={selectedSemesterId}
        onSelect={selectSemester}
        isDark={isDark}
      />

      {/* ── تحذير غياب الإعدادات ─────────────── */}
      {isConfigMissing && (
        <div
          className={`flex flex-wrap items-center gap-3 rounded-2xl border px-5 py-4 ${
            isDark
              ? "border-amber-500/25 bg-amber-500/10"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <AlertCircle className={`h-4 w-4 shrink-0 ${isDark ? "text-amber-400" : "text-amber-600"}`} />
          <p className={`flex-1 text-sm font-semibold ${isDark ? "text-amber-400" : "text-amber-700"}`}>
            {t("schedule.generator.noConfigWarning", {
              semester: semesterLabel,
            })}
          </p>
          <Link
            to="/admin/schedule-settings"
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-700"
          >
            <Settings2 size={13} /> {t("schedule.generator.goToSettings")}
          </Link>
        </div>
      )}

      {/* ── الخطوات ──────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <div key={step.number} className={`flex flex-col gap-3 p-5 ${cardClass(isDark)}`}>
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  step.done
                    ? isDark
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
                    : isDark
                      ? "bg-[#2376BB]/15 text-[#7fb5e4]"
                      : "bg-[#404293]/10 text-[#404293]"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className={`text-sm font-black ${headingClass(isDark)}`}>
                  {step.number}. {step.title}
                </p>
                <p className={`mt-0.5 text-xs font-medium ${mutedClass(isDark)}`}>
                  {step.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={step.action}
              disabled={isBusy || !selectedSemesterId || isConfigMissing}
              className={`flex items-center justify-center gap-2 rounded-xl ${brandGradient} py-2.5 text-xs font-bold text-white shadow-md shadow-[#404293]/25 transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40`}
            >
              {step.loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <step.icon size={13} />
                  </motion.div>
                  {t("schedule.generator.running")}
                </>
              ) : (
                <>
                  <step.icon size={13} /> {step.label}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {isSolving && (
        <p className={`flex items-center gap-2 text-sm font-semibold ${infoAlertClass(isDark)}`}>
          <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
          {t("schedule.generator.solvingHint")}
        </p>
      )}

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
            <button
              type="button"
              onClick={dismissSuccess}
              aria-label={t("common:actions.close")}
            >
              <X
                size={14}
                className={isDark ? "text-emerald-500 hover:text-emerald-300" : "text-emerald-400 hover:text-emerald-600"}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {[generateError, solveError, resultError]
        .filter(Boolean)
        .map((message) => (
          <div key={message} className={errorAlertClass(isDark)}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            {message}
          </div>
        ))}

      {/* ── النتائج ──────────────────────────── */}
      {hasGeneratedData && (
        <ConflictsPanel
          conflicts={conflicts}
          isDark={isDark}
          subjectGroupIndex={subjectGroupIndex}
        />
      )}

      {resultLoading ? (
        <div className={`space-y-4 p-6 ${cardClass(isDark)}`}>
          <div className={`h-10 w-1/3 ${skeletonClass(isDark)}`} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`h-24 ${skeletonClass(isDark)}`} />
            ))}
          </div>
        </div>
      ) : schedule ? (
        <TimetableView
          schedule={schedule}
          isPublishing={isPublishing}
          publishError={publishError}
          onPublish={askPublish}
          isDark={isDark}
          subjectGroupIndex={subjectGroupIndex}
        />
      ) : (
        !isSolving && (
          <div className={`flex flex-col items-center justify-center py-20 text-center ${cardClass(isDark)}`}>
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
              <Wand2 className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
            </div>
            <p className={`mb-1 font-bold ${mutedClass(isDark)}`}>
              {t("schedule.generator.emptyTitle")}
            </p>
            <p className={`text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}>
              {t("schedule.generator.emptyHint")}
            </p>
          </div>
        )
      )}

      {/* ── تأكيد النشر ──────────────────────── */}
      <AnimatePresence>
        {isConfirmingPublish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            onClick={() => !isPublishing && cancelPublish()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              className={`w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl ${
                isDark ? "bg-[#1e1f22]" : "bg-white"
              }`}
            >
              <div
                className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isDark ? "bg-[#2376BB]/15" : "bg-[#404293]/10"
                }`}
              >
                <Send className={`h-6 w-6 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
              </div>
              <h3 className={`mb-2 text-lg font-black ${headingClass(isDark)}`}>
                {t("schedule.generator.confirmPublish.title")}
              </h3>
              <p className={`mb-1 text-sm ${mutedClass(isDark)}`}>
                {t("schedule.generator.confirmPublish.body")}
              </p>
              <p className={`mb-6 text-sm font-black ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}>
                "{semesterLabel}"
              </p>

              {publishError && (
                <p
                  className={`mb-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-right text-xs font-bold ${
                    isDark
                      ? "border-red-500/25 bg-red-500/10 text-red-400"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  <AlertCircle size={13} className="shrink-0" />
                  {publishError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelPublish}
                  disabled={isPublishing}
                  className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-colors disabled:opacity-50 ${
                    isDark
                      ? "border-white/10 text-gray-300 hover:bg-white/5"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t("common:actions.cancel")}
                </button>
                <button
                  type="button"
                  onClick={confirmPublish}
                  disabled={isPublishing}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl ${brandGradient} py-3 text-sm font-bold text-white shadow-md shadow-[#404293]/25 transition-all disabled:opacity-60`}
                >
                  {isPublishing
                    ? t("schedule.generator.confirmPublish.publishing")
                    : t("schedule.generator.confirmPublish.yes")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
