/**
 * SubjectGroupsManagementPage
 *
 * إدارة غروبات المواد الاختيارية: مواد اختيارية ينقسم الطلاب بينها
 * (كل طالب يختار واحدة فقط) ويجب أن تُجدول جميعها في نفس الفترة
 * الامتحانية. الصفحة تنشئ الغروبات وتضيف/تزيل موادها، ثم صفحة
 * "إعدادات الجدولة" تستهلكها لإضافة كل مواد الغروب دفعة واحدة.
 */
import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Layers,
  ListChecks,
  Plus,
  RefreshCcw,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useIsDark } from "../../../../shared/hooks/useIsDark";
import {
  brandGradient,
  cardClass,
  errorAlertClass,
  fieldClass,
  ghostButtonClass,
  headingClass,
  infoAlertClass,
  mutedClass,
  primaryButtonClass,
  skeletonClass,
  successAlertClass,
} from "../../../../shared/utils/theme";
import { useSubjectGroupsManager } from "../hooks/useSubjectGroupsManager";
import SubjectGroupCard from "../components/SubjectGroupCard";

export default function SubjectGroupsManagementPage() {
  const { t } = useTranslation(["admin", "common"]);
  const isDark = useIsDark();
  const [newGroupName, setNewGroupName] = useState("");

  const {
    years,
    yearsLoading,
    semesters,
    semestersLoading,
    selectedYearId,
    selectedSemesterId,
    selectYear,
    selectSemester,
    groups,
    groupsLoading,
    groupsError,
    ungroupedSubjects,
    successMessage,
    dismissSuccess,
    createGroup,
    isCreating,
    createError,
    renameGroup,
    groupPendingDelete,
    askDeleteGroup,
    cancelDeleteGroup,
    confirmDeleteGroup,
    isDeleting,
    deleteError,
    addSubject,
    removeSubject,
  } = useSubjectGroupsManager();

  const canPick = Boolean(selectedYearId && selectedSemesterId);
  const groupPendingDeleteName = groups.find((group) => group._id === groupPendingDelete)?.name ?? "";

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newGroupName.trim()) return;
    createGroup(newGroupName.trim());
    setNewGroupName("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── الترويسة ─────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${brandGradient} shadow-md shadow-[#404293]/25`}>
              <Layers className="h-[18px] w-[18px] text-white" />
            </div>
            <h1 className={`text-xl font-black tracking-tight ${headingClass(isDark)}`}>
              {t("schedule.groups.title")}
            </h1>
          </div>
          <p className={`text-sm font-medium ${mutedClass(isDark)}`}>
            {t("schedule.groups.subtitle")}
          </p>
        </div>
        <Link
          to="/admin/schedule-settings"
          className={`flex items-center gap-1.5 ${ghostButtonClass(isDark)}`}
        >
          <Settings2 size={13} /> {t("schedule.groups.goToSettings")}
        </Link>
      </div>

      {/* ── تعليمات الاستخدام ────────────────── */}
      <div className={infoAlertClass(isDark)}>
        <div className="flex w-full items-start gap-3">
          <ListChecks className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="mb-2 text-sm font-black">{t("schedule.groups.instructionsTitle")}</p>
            <ol className="list-decimal space-y-1 ps-4 text-xs font-semibold leading-relaxed">
              {(t("schedule.groups.instructions", { returnObjects: true }) as string[]).map(
                (line, index) => (
                  <li key={index}>{line}</li>
                ),
              )}
            </ol>
          </div>
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
            <button type="button" onClick={dismissSuccess} aria-label={t("common:actions.close")}>
              <X
                size={14}
                className={isDark ? "text-emerald-500 hover:text-emerald-300" : "text-emerald-400 hover:text-emerald-600"}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── اختيار السنة والفصل ──────────────── */}
      <div className={`p-4 ${cardClass(isDark)}`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {t("schedule.groups.pickYear")}
            <div className="relative mt-1.5">
              <select
                value={selectedYearId}
                onChange={(event) => selectYear(event.target.value)}
                disabled={yearsLoading}
                className={`pe-4 ps-9 ${fieldClass(isDark)}`}
              >
                {yearsLoading ? (
                  <option value="">{t("common:states.loading")}</option>
                ) : (
                  <>
                    <option value="">{t("schedule.groups.chooseYear")}</option>
                    {years.map((year) => (
                      <option key={year._id} value={year._id}>
                        {year.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <GraduationCap
                className={`pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 ${mutedClass(isDark)}`}
              />
            </div>
          </label>
          <label className={`block text-sm font-bold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {t("schedule.groups.choosePicker")}
            <div className="relative mt-1.5">
              <select
                value={selectedSemesterId}
                onChange={(event) => selectSemester(event.target.value)}
                disabled={semestersLoading}
                className={`pe-4 ps-9 ${fieldClass(isDark)}`}
              >
                {semestersLoading ? (
                  <option value="">{t("common:states.loading")}</option>
                ) : (
                  <>
                    <option value="">{t("schedule.groups.chooseSemester")}</option>
                    {semesters.map((semester) => (
                      <option key={semester._id} value={semester._id}>
                        {semester.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <Layers
                className={`pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 ${mutedClass(isDark)}`}
              />
            </div>
          </label>
        </div>
      </div>

      {!canPick ? (
        <p className={`text-sm font-semibold ${mutedClass(isDark)}`}>
          {t("schedule.groups.pickYearAndSemesterHint")}
        </p>
      ) : (
        <>
          {/* ── إنشاء غروب جديد ────────────────── */}
          <form onSubmit={handleCreate} className={`space-y-3 p-4 ${cardClass(isDark)}`}>
            <h2 className={`text-sm font-black ${headingClass(isDark)}`}>
              {t("schedule.groups.createTitle")}
            </h2>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input
                value={newGroupName}
                onChange={(event) => setNewGroupName(event.target.value)}
                placeholder={t("schedule.groups.namePlaceholder")}
                className={`flex-1 ${fieldClass(isDark)}`}
              />
              <button
                type="submit"
                disabled={isCreating || !newGroupName.trim()}
                className={`px-5 py-3 sm:w-auto ${primaryButtonClass}`}
              >
                {isCreating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCcw size={15} />
                  </motion.div>
                ) : (
                  <Plus size={15} />
                )}
                {t(isCreating ? "schedule.groups.creating" : "schedule.groups.create")}
              </button>
            </div>
            {createError && (
              <div className={errorAlertClass(isDark)}>
                <AlertCircle size={14} className="shrink-0" />
                {createError}
              </div>
            )}
          </form>

          {/* ── قائمة الغروبات ──────────────────── */}
          <div className="space-y-3">
            <h2 className={`text-sm font-black ${headingClass(isDark)}`}>
              {t("schedule.groups.listTitle")}
            </h2>

            {groupsError && (
              <div className={errorAlertClass(isDark)}>
                <AlertCircle size={14} className="shrink-0" />
                {groupsError}
              </div>
            )}

            {groupsLoading ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className={`h-40 ${skeletonClass(isDark)}`} />
                ))}
              </div>
            ) : groups.length === 0 ? (
              <div className={`flex flex-col items-center justify-center gap-2 py-16 text-center ${cardClass(isDark)}`}>
                <Layers className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                <p className={`font-bold ${mutedClass(isDark)}`}>{t("schedule.groups.empty")}</p>
                <p className={`text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}>
                  {t("schedule.groups.emptyHint")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {groups.map((group) => (
                  <SubjectGroupCard
                    key={group._id}
                    group={group}
                    availableSubjects={ungroupedSubjects}
                    onRename={(name) => renameGroup(group._id, name)}
                    onDelete={() => askDeleteGroup(group._id)}
                    onAddSubject={(subjectId) => addSubject(group._id, subjectId)}
                    onRemoveSubject={(subjectId) => removeSubject(group._id, subjectId)}
                    isDark={isDark}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── تأكيد الحذف ──────────────────────── */}
      <AnimatePresence>
        {groupPendingDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            onClick={() => !isDeleting && cancelDeleteGroup()}
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
                {t("schedule.groups.confirmDelete.title")}
              </h3>
              <p className={`mb-1 text-sm ${mutedClass(isDark)}`}>
                {t("schedule.groups.confirmDelete.body")}
              </p>
              <p className={`mb-6 text-sm font-black ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`}>
                "{groupPendingDeleteName}"
              </p>
              <p className={`mb-6 text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                {t("schedule.groups.confirmDelete.irreversible")}
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
                  onClick={cancelDeleteGroup}
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
                  onClick={confirmDeleteGroup}
                  disabled={isDeleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-md shadow-red-200 transition-all hover:bg-red-600 disabled:opacity-60"
                >
                  {isDeleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RefreshCcw size={14} />
                      </motion.div>
                      {t("schedule.groups.confirmDelete.working")}
                    </>
                  ) : (
                    t("schedule.groups.confirmDelete.yes")
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
