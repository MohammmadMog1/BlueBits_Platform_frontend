import { useState } from "react";
import { useTheme } from "next-themes";
import { AlertCircle, CheckSquare, Plus, RefreshCcw, Search, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useErrorMessage } from "../../../shared/i18n/useErrorMessage";
import PersonalTaskCard from "../components/PersonalTaskCard";
import PersonalTaskFormModal from "../components/PersonalTaskFormModal";
import {
  useCompletePersonalTaskMutation,
  useCreatePersonalTaskMutation,
  useDeletePersonalTaskMutation,
  useGetPersonalTasksQuery,
  useUpdatePersonalTaskMutation,
} from "../api/personalTasksApi";
import type { PersonalTask, PersonalTaskFormData } from "../types";

const toastDuration = 3000;

type StatusFilter = "all" | "completed" | "pending";

export default function PersonalTasksPage() {
  const { t } = useTranslation(["tasks", "common"]);
  const errorMessage = useErrorMessage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<PersonalTask | null>(null);
  const [deletingTask, setDeletingTask] = useState<PersonalTask | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(
    null,
  );

  const tasksQuery = useGetPersonalTasksQuery(
    statusFilter === "all" ? undefined : { isCompleted: statusFilter === "completed" },
  );
  const [createTask, createState] = useCreatePersonalTaskMutation();
  const [updateTask, updateState] = useUpdatePersonalTaskMutation();
  const [deleteTask, deleteState] = useDeletePersonalTaskMutation();
  const [completeTask] = useCompletePersonalTaskMutation();

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), toastDuration);
  };

  const tasks = tasksQuery.data ?? [];

  const filteredTasks = tasks.filter((task) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      task.title.toLowerCase().includes(term) ||
      (task.description ?? "").toLowerCase().includes(term)
    );
  });
  const pendingTasks = filteredTasks.filter((task) => !task.isCompleted);
  const completedTasks = filteredTasks.filter((task) => task.isCompleted);

  const modalError = createState.error
    ? errorMessage(createState.error)
    : updateState.error
      ? errorMessage(updateState.error)
      : undefined;

  const handleSubmit = async (data: PersonalTaskFormData) => {
    try {
      if (editTask) {
        await updateTask({ id: editTask._id, data }).unwrap();
        setEditTask(null);
        showToast(t("personal.messages.updated"), "success");
      } else {
        await createTask(data).unwrap();
        setShowModal(false);
        showToast(t("personal.messages.created"), "success");
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
      showToast(t("personal.messages.deleted"), "success");
    } catch (error) {
      showToast(errorMessage(error), "error");
    }
  };

  const handleComplete = async (task: PersonalTask) => {
    setCompletingId(task._id);
    try {
      await completeTask(task._id).unwrap();
      showToast(t("personal.messages.completed"), "success");
    } catch (error) {
      showToast(errorMessage(error), "error");
    } finally {
      setCompletingId(null);
    }
  };

  const renderCard = (task: PersonalTask) => (
    <PersonalTaskCard
      key={task._id}
      task={task}
      isDark={isDark}
      isCompleting={completingId === task._id}
      onComplete={handleComplete}
      onEdit={setEditTask}
      onDelete={setDeletingTask}
    />
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={`flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
            isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
          }`}
        >
          <Search className={`h-4 w-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label={t("clearSearch")}>
              <X size={13} className="text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          className={`appearance-none rounded-xl border py-2.5 px-4 text-sm font-semibold outline-none focus:border-[#404293] focus:ring-2 focus:ring-[#404293]/20 ${
            isDark ? "border-white/10 bg-white/5 text-gray-200" : "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        >
          <option value="all">{t("personal.filterAll")}</option>
          <option value="pending">{t("personal.filterPending")}</option>
          <option value="completed">{t("personal.filterCompleted")}</option>
        </select>
        <button
          type="button"
          onClick={() => tasksQuery.refetch()}
          title={t("common:actions.refresh")}
          aria-label={t("common:actions.refresh")}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
            isDark
              ? "border-white/10 bg-white/5 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
              : "border-gray-200 bg-white text-gray-400 shadow-sm hover:border-[#404293]/30 hover:text-[#404293]"
          }`}
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
          <Plus size={17} /> {t("personal.new")}
        </button>
      </div>

      {tasksQuery.isError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMessage(tasksQuery.error)}
        </motion.div>
      )}

      {tasksQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`animate-pulse rounded-2xl border p-4 ${
                isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
              }`}
            >
              <div className={`mb-3 h-4 w-3/4 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`h-3 w-1/2 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center rounded-3xl border py-20 text-center shadow-sm ${
            isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
          }`}
        >
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
            <CheckSquare className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          </div>
          <p className={`mb-1 font-bold ${isDark ? "text-gray-400" : "text-gray-400"}`}>
            {t(search ? "personal.emptyNoResults" : "personal.emptyNone")}
          </p>
          <p className={`mb-4 text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}>
            {t(search ? "personal.emptySearchHint" : "personal.emptyHint")}
          </p>
          {!search && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#404293] to-[#2376BB] px-4 py-2 text-sm font-bold text-white shadow-md"
            >
              <Plus size={14} /> {t("personal.addFirst")}
            </button>
          )}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {pendingTasks.length > 0 && (
            <motion.div key="pending-group" layout>
              <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                {t("personal.groupPending", { count: pendingTasks.length })}
              </p>
              <div className="space-y-2">{pendingTasks.map(renderCard)}</div>
            </motion.div>
          )}
          {completedTasks.length > 0 && (
            <motion.div key="completed-group" layout>
              <p className={`mb-2 mt-5 text-xs font-bold uppercase tracking-wide ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                {t("personal.groupCompleted", { count: completedTasks.length })}
              </p>
              <div className="space-y-2">{completedTasks.map(renderCard)}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {(showModal || editTask) && (
          <PersonalTaskFormModal
            isEdit={Boolean(editTask)}
            isDark={isDark}
            initial={
              editTask
                ? {
                    title: editTask.title,
                    description: editTask.description ?? "",
                    dueDate: editTask.dueDate,
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
              className={`w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl ${
                isDark ? "bg-[#1a1b1e] border border-white/10" : "bg-white"
              }`}
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h3 className={`mb-2 text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}>
                {t("personal.confirmDelete.title")}
              </h3>
              <p className={`mb-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {t("personal.confirmDelete.body")}
              </p>
              <p className="mb-6 text-sm font-black text-[#404293] dark:text-[#6b8fd6]">
                "{deletingTask.title}"
              </p>
              <p className={`mb-6 text-xs ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                {t("personal.confirmDelete.irreversible")}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingTask(null)}
                  disabled={deleteState.isLoading}
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
                  onClick={handleDelete}
                  disabled={deleteState.isLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-md shadow-red-200 transition-all hover:bg-red-600 disabled:opacity-60 dark:shadow-none"
                >
                  {deleteState.isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RefreshCcw size={14} />
                      </motion.div>
                      {t("personal.confirmDelete.working")}
                    </>
                  ) : (
                    t("personal.confirmDelete.yes")
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
