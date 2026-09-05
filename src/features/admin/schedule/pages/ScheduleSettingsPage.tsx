/**
 * ScheduleSettingsPage
 *
 * إعدادات الجدولة للأدمن: يختار الفصل ثم يضبط مدى الامتحانات،
 * الفترات اليومية، أيام وتواريخ العطل، وإعدادات كل مادة.
 * هذه الإعدادات هي المدخل الأول لتوليد برنامج الفحص.
 */
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Layers,
  Plus,
  RefreshCcw,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import ScheduleConfigForm from "../components/ScheduleConfigForm";
import ScheduleConfigSummary from "../components/ScheduleConfigSummary";
import SemesterPicker from "../components/SemesterPicker";
import { useScheduleConfigManager } from "../hooks/useScheduleConfigManager";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import {
  brandGradient,
  cardClass,
  headingClass,
  iconButtonClass,
  mutedClass,
  skeletonClass,
  successAlertClass,
} from "../../../../shared/utils/theme";

export default function ScheduleSettingsPage() {
  const { t } = useTranslation(["admin", "common"]);
  const isDark = useIsDark();
  const {
    semesters,
    semestersLoading,
    selectedSemesterId,
    semesterLabel,
    config,
    subjects,
    subjectsLoading,
    subjectGroups,
    configLoading,
    configFetching,
    configError,
    mode,
    isSubmitting,
    submitError,
    successMessage,
    isConfirmingDelete,
    isDeleting,
    deleteError,
    selectSemester,
    startCreate,
    startEdit,
    cancelForm,
    submit,
    askDelete,
    cancelDelete,
    confirmDelete,
    refetch,
    dismissSuccess,
  } = useScheduleConfigManager();

  const isFormOpen = mode === "create" || mode === "edit";

  return (
    <div className="flex flex-col gap-6">
      {/* ── الترويسة ─────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${brandGradient} shadow-md shadow-[#404293]/25`}>
              <CalendarClock className="h-[18px] w-[18px] text-white" />
            </div>
            <h1 className={`text-xl font-black tracking-tight ${headingClass(isDark)}`}>
              {t("schedule.settings.title")}
            </h1>
          </div>
          <p className={`text-sm font-medium ${mutedClass(isDark)}`}>
            {t("schedule.settings.subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={refetch}
          disabled={!selectedSemesterId}
          title={t("common:actions.update")}
          className={`disabled:opacity-40 ${iconButtonClass(isDark)}`}
        >
          <RefreshCcw
            className={`h-4 w-4 ${configFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* ── اختيار الفصل ─────────────────────── */}
      <SemesterPicker
        semesters={semesters}
        isLoading={semestersLoading}
        selectedId={selectedSemesterId}
        onSelect={selectSemester}
        isDark={isDark}
      />

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

      {configError && !isFormOpen && (
        <div
          className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold ${
            isDark
              ? "border-amber-500/25 bg-amber-500/10 text-amber-400"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {configError}
        </div>
      )}

      {/* ── المحتوى ──────────────────────────── */}
      {!selectedSemesterId ? (
        <div className={`flex flex-col items-center justify-center py-24 text-center ${cardClass(isDark)}`}>
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
            <Layers className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          </div>
          <p className={`mb-1 font-bold ${mutedClass(isDark)}`}>
            {t("schedule.settings.pickSemester")}
          </p>
          <p className={`text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}>
            {t("schedule.settings.pickSemesterHint")}
          </p>
        </div>
      ) : configLoading ? (
        <div className={`space-y-4 p-6 ${cardClass(isDark)}`}>
          <div className={`h-10 w-1/3 ${skeletonClass(isDark)}`} />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={`h-16 ${skeletonClass(isDark)}`} />
            ))}
          </div>
          <div className={`h-40 ${skeletonClass(isDark)}`} />
        </div>
      ) : isFormOpen ? (
        <ScheduleConfigForm
          key={`${mode}-${config?._id ?? "new"}-${selectedSemesterId}`}
          mode={mode === "edit" ? "edit" : "create"}
          semesterLabel={semesterLabel}
          initial={mode === "edit" ? config : null}
          subjects={subjects}
          subjectsLoading={subjectsLoading}
          subjectGroups={subjectGroups}
          isSubmitting={isSubmitting}
          error={submitError}
          onCancel={cancelForm}
          onSubmit={submit}
          isDark={isDark}
        />
      ) : config ? (
        <ScheduleConfigSummary
          config={config}
          semesterLabel={semesterLabel}
          subjects={subjects}
          onEdit={startEdit}
          onDelete={askDelete}
          isDark={isDark}
        />
      ) : (
        <div className={`flex flex-col items-center justify-center py-24 text-center ${cardClass(isDark)}`}>
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
            <CalendarClock className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          </div>
          <p className={`mb-1 font-bold ${mutedClass(isDark)}`}>
            {t("schedule.settings.noConfig", { semester: semesterLabel })}
          </p>
          <p className={`mb-4 text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}>
            {t("schedule.settings.noConfigHint")}
          </p>
          <button
            type="button"
            onClick={startCreate}
            className={`flex items-center gap-2 rounded-xl ${brandGradient} px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#404293]/25 transition-all hover:-translate-y-0.5`}
          >
            <Plus size={15} /> {t("schedule.settings.createConfig")}
          </button>
        </div>
      )}

      {/* ── تأكيد الحذف ──────────────────────── */}
      <AnimatePresence>
        {isConfirmingDelete && config && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            onClick={() => !isDeleting && cancelDelete()}
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
                  isDark ? "bg-red-500/10" : "bg-red-50"
                }`}
              >
                <Trash2 className={`h-7 w-7 ${isDark ? "text-red-400" : "text-red-500"}`} />
              </div>
              <h3 className={`mb-2 text-lg font-black ${headingClass(isDark)}`}>
                {t("schedule.settings.confirmDelete.title")}
              </h3>
              <p className={`mb-1 text-sm ${mutedClass(isDark)}`}>
                {t("schedule.settings.confirmDelete.body")}
              </p>
              <p className={`mb-6 text-sm font-black ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}>
                "{semesterLabel}"
              </p>
              <p className={`mb-6 text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                {t("schedule.settings.confirmDelete.irreversible")}
              </p>

              {deleteError && (
                <p
                  className={`mb-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-right text-xs font-bold ${
                    isDark
                      ? "border-red-500/25 bg-red-500/10 text-red-400"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  <AlertCircle size={13} className="shrink-0" />
                  {deleteError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={isDeleting}
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
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-md shadow-red-200 transition-all hover:bg-red-600 disabled:opacity-60"
                >
                  {isDeleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                      >
                        <RefreshCcw size={14} />
                      </motion.div>
                      {t("schedule.settings.confirmDelete.working")}
                    </>
                  ) : (
                    t("schedule.settings.confirmDelete.yes")
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
