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
import ConflictsPanel from "../components/ConflictsPanel";
import SemesterPicker from "../components/SemesterPicker";
import TimetableView from "../components/TimetableView";
import { useScheduleGenerator } from "../hooks/useScheduleGenerator";

export default function ScheduleGeneratorPage() {
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
      title: "تجميع البيانات",
      description: "يجمع ردود الطلاب مع إعدادات الجدولة ويحسب التعارضات",
      icon: Database,
      action: runGenerateData,
      loading: isGenerating,
      label: hasGeneratedData ? "إعادة التجميع" : "تجميع البيانات",
      done: hasGeneratedData,
    },
    {
      number: 2,
      title: "توليد الجدول",
      description: "يرسل البيانات إلى المحرك ويعيد أفضل توزيع ممكن",
      icon: Wand2,
      action: runSolve,
      loading: isSolving,
      label: schedule ? "إعادة التوليد" : "توليد الجدول",
      done: Boolean(schedule),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── الترويسة ─────────────────────────── */}
      <div>
        <div className="mb-1 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
            <Sparkles className="h-[18px] w-[18px] text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-gray-900">
            توليد برنامج الفحص
          </h1>
        </div>
        <p className="text-sm font-medium text-gray-400">
          جمّع البيانات، ولّد الجدول، راجع التعارضات، ثم انشره للطلاب
        </p>
      </div>

      <SemesterPicker
        semesters={semesters}
        isLoading={semestersLoading}
        selectedId={selectedSemesterId}
        onSelect={selectSemester}
      />

      {/* ── تحذير غياب الإعدادات ─────────────── */}
      {isConfigMissing && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="flex-1 text-sm font-semibold text-amber-700">
            لا توجد إعدادات جدولة لفصل "{semesterLabel}" – لا يمكن توليد الجدول
            قبل ضبطها.
          </p>
          <Link
            to="/admin/schedule-settings"
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-700"
          >
            <Settings2 size={13} /> اذهب للإعدادات
          </Link>
        </div>
      )}

      {/* ── الخطوات ──────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  step.done
                    ? "bg-emerald-50 text-emerald-600"
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
                <p className="text-sm font-black text-gray-900">
                  {step.number}. {step.title}
                </p>
                <p className="mt-0.5 text-xs font-medium text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={step.action}
              disabled={isBusy || !selectedSemesterId || isConfigMissing}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-2.5 text-xs font-bold text-white shadow-md shadow-[#404293]/25 transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
            >
              {step.loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <step.icon size={13} />
                  </motion.div>
                  جاري التنفيذ...
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
        <p className="flex items-center gap-2 rounded-2xl border border-[#404293]/20 bg-[#404293]/5 px-5 py-3.5 text-sm font-semibold text-[#404293]">
          <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
          المحرك يبحث عن أفضل توزيع – قد تستغرق العملية دقيقة أو أكثر، لا تغلق
          الصفحة.
        </p>
      )}

      {/* ── التنبيهات ────────────────────────── */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="flex-1">{successMessage}</span>
            <button type="button" onClick={dismissSuccess} aria-label="إغلاق">
              <X size={14} className="text-emerald-400 hover:text-emerald-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {[generateError, solveError, resultError]
        .filter(Boolean)
        .map((message) => (
          <div
            key={message}
            className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-semibold text-red-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {message}
          </div>
        ))}

      {/* ── النتائج ──────────────────────────── */}
      {hasGeneratedData && <ConflictsPanel conflicts={conflicts} />}

      {resultLoading ? (
        <div className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="h-10 w-1/3 animate-pulse rounded-xl bg-gray-100" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      ) : schedule ? (
        <TimetableView
          schedule={schedule}
          isPublishing={isPublishing}
          publishError={publishError}
          onPublish={askPublish}
        />
      ) : (
        !isSolving && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white py-20 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <Wand2 className="h-7 w-7 text-gray-300" />
            </div>
            <p className="mb-1 font-bold text-gray-400">لا يوجد جدول بعد</p>
            <p className="text-sm text-gray-300">
              نفّذ الخطوتين أعلاه لتوليد برنامج الفحص
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
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#404293]/10">
                <Send className="h-6 w-6 text-[#404293]" />
              </div>
              <h3 className="mb-2 text-lg font-black text-gray-900">
                تأكيد النشر
              </h3>
              <p className="mb-1 text-sm text-gray-500">
                سيصبح برنامج الفحص مرئياً للطلاب في فصل:
              </p>
              <p className="mb-6 text-sm font-black text-[#404293]">
                "{semesterLabel}"
              </p>

              {publishError && (
                <p className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-right text-xs font-bold text-red-600">
                  <AlertCircle size={13} className="shrink-0" />
                  {publishError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelPublish}
                  disabled={isPublishing}
                  className="flex-1 rounded-xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={confirmPublish}
                  disabled={isPublishing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] py-3 text-sm font-bold text-white shadow-md shadow-[#404293]/25 transition-all disabled:opacity-60"
                >
                  {isPublishing ? "جاري النشر..." : "نعم، انشر"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
