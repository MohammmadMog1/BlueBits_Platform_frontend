import { useState } from "react";
import {
  AlertCircle,
  ClipboardList,
  GraduationCap,
  Lock,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useGetYearsQuery } from "../../academic/api/academicApi";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../../shared/i18n/useErrorMessage";
import { useGetSubjectsQuery } from "../../subjects/api/subjectsApi";
import AcademicTaskCard from "../components/AcademicTaskCard";
import AcademicTaskFormModal from "../components/AcademicTaskFormModal";
import TaskSubmissionsModal from "../components/TaskSubmissionsModal";
import {
  useCloseAcademicTaskMutation,
  useCreateAcademicTaskMutation,
  useDeleteAcademicTaskMutation,
  useGetAcademicTasksQuery,
  useUpdateAcademicTaskMutation,
} from "../api/academicTasksApi";
import type { AcademicTask, AcademicTaskFormData } from "../types";

const toastDuration = 3000;

export default function AcademicTasksManagementPage() {
  const { t } = useTranslation(["admin", "common"]);
  const errorMessage = useErrorMessage();
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<AcademicTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<AcademicTask | null>(null);
  const [closingTask, setClosingTask] = useState<AcademicTask | null>(null);
  const [submissionsTask, setSubmissionsTask] = useState<AcademicTask | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(
    null,
  );

  const tasksQuery = useGetAcademicTasksQuery();
  const { data: years = [] } = useGetYearsQuery();
  const { data: subjects = [] } = useGetSubjectsQuery({
    yearId: filterYear || undefined,
  });
  const [createTask, createState] = useCreateAcademicTaskMutation();
  const [updateTask, updateState] = useUpdateAcademicTaskMutation();
  const [deleteTask, deleteState] = useDeleteAcademicTaskMutation();
  const [closeTask, closeState] = useCloseAcademicTaskMutation();

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), toastDuration);
  };

  const tasks = tasksQuery.data ?? [];
  const yearOptions = years.map((year) => ({ id: year._id, label: year.name }));
  const subjectOptions = subjects.map((subject) => ({
    id: subject._id,
    label: subject.name,
  }));

  const filteredTasks = tasks.filter((task) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      task.title.toLowerCase().includes(term) ||
      (task.description ?? "").toLowerCase().includes(term);
    const matchesYear = !filterYear || task.yearId?._id === filterYear;
    const matchesSubject = !filterSubject || task.subjectId?._id === filterSubject;
    const matchesStatus = !filterStatus || task.status === filterStatus;
    return matchesSearch && matchesYear && matchesSubject && matchesStatus;
  });

  const modalError = createState.error
    ? errorMessage(createState.error)
    : updateState.error
      ? errorMessage(updateState.error)
      : undefined;

  const handleSubmit = async (data: AcademicTaskFormData) => {
    try {
      if (editTask) {
        await updateTask({ id: editTask._id, data }).unwrap();
        setEditTask(null);
        showToast(t("tasks.messages.updated"), "success");
      } else {
        await createTask(data).unwrap();
        setShowModal(false);
        showToast(t("tasks.messages.created"), "success");
      }
    } catch (error) {
      showToast(errorMessage(error), "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask._id).unwrap();
      setDeletingTask(null);
      showToast(t("tasks.messages.deleted"), "success");
    } catch (error) {
      showToast(errorMessage(error), "error");
    }
  };

  const handleClose = async () => {
    if (!closingTask) return;
    try {
      await closeTask(closingTask._id).unwrap();
      setClosingTask(null);
      showToast(t("tasks.messages.closed"), "success");
    } catch (error) {
      showToast(errorMessage(error), "error");
    }
  };

  const stats = [
    { label: t("tasks.totalTasks"), value: tasks.length, color: "#404293" },
    {
      label: t("tasks.statusOpen"),
      value: tasks.filter((task) => task.status === "open").length,
      color: "#059669",
    },
    {
      label: t("tasks.statusClosed"),
      value: tasks.filter((task) => task.status === "closed").length,
      color: "#6b7280",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#404293] to-[#2376BB] shadow-md shadow-[#404293]/25">
              <ClipboardList className="h-[18px] w-[18px] text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              {t("tasks.title")}
            </h1>
          </div>
          <p className="text-sm font-medium text-gray-400">
            {t("tasks.subtitle")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => tasksQuery.refetch()}
            title={t("common:actions.refresh")}
            aria-label={t("common:actions.refresh")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:border-[#404293]/30 hover:text-[#404293]"
          >
            <RefreshCcw
              className={`h-4 w-4 ${tasksQuery.isFetching ? "animate-spin" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-[#404293]/30 transition-all hover:-translate-y-0.5 hover:shadow-[#404293]/45 active:scale-[0.98]"
          >
            <Plus size={17} /> {t("tasks.new")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className="h-8 w-1.5 shrink-0 rounded-full"
              style={{
                background: `linear-gradient(180deg,${stat.color},${stat.color}55)`,
              }}
            />
            <div>
              <p className="text-lg font-black leading-none text-gray-900">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-gray-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("tasks.searchPlaceholder")}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label={t("tasks.clearSearch")}>
              <X size={13} className="text-gray-300 hover:text-gray-500" />
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={filterYear}
            onChange={(event) => {
              setFilterYear(event.target.value);
              setFilterSubject("");
            }}
            className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 ps-10 pe-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
          >
            <option value="">{t("tasks.allYears")}</option>
            {yearOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <GraduationCap className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={filterSubject}
            onChange={(event) => setFilterSubject(event.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 ps-10 pe-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
          >
            <option value="">{t("tasks.allSubjects")}</option>
            {subjectOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-4 text-sm font-semibold text-gray-700 outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20"
          >
            <option value="">{t("tasks.allStatuses")}</option>
            <option value="open">{t("tasks.statusOpen")}</option>
            <option value="closed">{t("tasks.statusClosed")}</option>
          </select>
        </div>
        {(filterYear || filterSubject || filterStatus) && (
          <button
            type="button"
            onClick={() => {
              setFilterYear("");
              setFilterSubject("");
              setFilterStatus("");
            }}
            className="flex items-center gap-1.5 rounded-xl border border-transparent px-3.5 py-2.5 text-xs font-bold text-red-500 transition-colors hover:border-red-100 hover:bg-red-50"
          >
            <X size={13} /> {t("tasks.clearFilters")}
          </button>
        )}
      </div>

      {tasksQuery.isError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm font-semibold text-amber-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage(tasksQuery.error)}
        </motion.div>
      )}

      {tasksQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
            >
              <div className="mb-5 h-1 w-full rounded-full bg-gray-100" />
              <div className="mb-3 h-4 w-3/4 rounded-full bg-gray-100" />
              <div className="mb-2 h-3 w-full rounded-full bg-gray-100" />
              <div className="mb-5 h-3 w-2/3 rounded-full bg-gray-100" />
              <div className="flex gap-2">
                <div className="h-7 flex-1 rounded-full bg-gray-100" />
                <div className="h-7 flex-1 rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white py-24 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <ClipboardList className="h-7 w-7 text-gray-300" />
          </div>
          <p className="mb-1 font-bold text-gray-400">
            {t(search ? "tasks.emptyNoResults" : "tasks.emptyNone")}
          </p>
          <p className="mb-4 text-sm text-gray-300">
            {t(search ? "tasks.emptySearchHint" : "tasks.emptyHint")}
          </p>
          {!search && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-sm font-bold text-white shadow-md"
            >
              <Plus size={14} /> {t("tasks.createFirst")}
            </button>
          )}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <AcademicTaskCard
                key={task._id}
                task={task}
                onEdit={setEditTask}
                onDelete={setDeletingTask}
                onClose={setClosingTask}
                onViewSubmissions={setSubmissionsTask}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {(showModal || editTask) && (
          <AcademicTaskFormModal
            isEdit={Boolean(editTask)}
            initial={
              editTask
                ? {
                    title: editTask.title,
                    description: editTask.description ?? "",
                    yearId: editTask.yearId?._id ?? "",
                    subjectId: editTask.subjectId?._id ?? "",
                    lectureId: editTask.lectureId?._id ?? "",
                    durationDays: editTask.durationDays,
                    durationHours: editTask.durationHours,
                    durationMinutes: editTask.durationMinutes,
                  }
                : undefined
            }
            isSubmitting={createState.isLoading || updateState.isLoading}
            error={modalError}
            onClose={() => {
              setShowModal(false);
              setEditTask(null);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {submissionsTask && (
          <TaskSubmissionsModal
            task={submissionsTask}
            onClose={() => setSubmissionsTask(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            onClick={() => !deleteState.isLoading && setDeletingTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="mb-2 text-lg font-black text-gray-900">
                {t("tasks.confirmDelete.title")}
              </h3>
              <p className="mb-1 text-sm text-gray-500">
                {t("tasks.confirmDelete.body")}
              </p>
              <p className="mb-6 text-sm font-black text-[#404293]">
                "{deletingTask.title}"
              </p>
              <p className="mb-6 text-xs text-gray-400">
                {t("tasks.confirmDelete.irreversible")}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingTask(null)}
                  disabled={deleteState.isLoading}
                  className="flex-1 rounded-xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  {t("common:actions.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteState.isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-md shadow-red-200 transition-all hover:bg-red-600 disabled:opacity-60"
                >
                  {deleteState.isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RefreshCcw size={14} />
                      </motion.div>
                      {t("tasks.confirmDelete.working")}
                    </>
                  ) : (
                    t("tasks.confirmDelete.yes")
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {closingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            onClick={() => !closeState.isLoading && setClosingTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                <Lock className="h-7 w-7 text-amber-500" />
              </div>
              <h3 className="mb-2 text-lg font-black text-gray-900">
                {t("tasks.confirmClose.title")}
              </h3>
              <p className="mb-1 text-sm text-gray-500">
                {t("tasks.confirmClose.body")}
              </p>
              <p className="mb-6 text-sm font-black text-[#404293]">
                "{closingTask.title}"
              </p>
              <p className="mb-6 text-xs text-gray-400">
                {t("tasks.confirmClose.note")}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setClosingTask(null)}
                  disabled={closeState.isLoading}
                  className="flex-1 rounded-xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  {t("common:actions.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={closeState.isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-600 disabled:opacity-60"
                >
                  {closeState.isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RefreshCcw size={14} />
                      </motion.div>
                      {t("tasks.confirmDelete.working")}
                    </>
                  ) : (
                    t("tasks.confirmClose.yes")
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className={`fixed bottom-6 left-1/2 z-[500] -translate-x-1/2 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-xl ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}
        >
          {toast.msg}
        </motion.div>
      ) : null}
    </div>
  );
}
