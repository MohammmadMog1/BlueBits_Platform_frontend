import { useState } from "react";
import { useTheme } from "next-themes";
import { AlertCircle, GraduationCap, RefreshCcw, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import StudentAcademicTaskCard from "../components/StudentAcademicTaskCard";
import SubmissionModal from "../components/SubmissionModal";
import { useGetAcademicTasksQuery } from "../../admin/tasks";
import type { AcademicTask } from "../../admin/tasks";

const errorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    )
      return (data as { message: string }).message;
  }
  return "تعذّر تحميل المهام الأكاديمية.";
};

export default function StudentAcademicTasksPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [submissionTask, setSubmissionTask] = useState<AcademicTask | null>(null);

  const tasksQuery = useGetAcademicTasksQuery();
  const tasks = tasksQuery.data ?? [];

  const filteredTasks = tasks.filter((task) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      task.title.toLowerCase().includes(term) ||
      (task.description ?? "").toLowerCase().includes(term)
    );
  });
  const openTasks = filteredTasks.filter((task) => task.status === "open");
  const closedTasks = filteredTasks.filter((task) => task.status === "closed");

  const renderCard = (task: AcademicTask) => (
    <StudentAcademicTaskCard
      key={task._id}
      task={task}
      isDark={isDark}
      onOpenSubmission={setSubmissionTask}
    />
  );

  return (
    <div className="flex flex-col gap-5" dir="rtl">
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
            placeholder="بحث عن مهمة..."
            className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="مسح البحث">
              <X size={13} className="text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => tasksQuery.refetch()}
          title="تحديث"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${
            isDark
              ? "border-white/10 bg-white/5 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
              : "border-gray-200 bg-white text-gray-400 shadow-sm hover:border-[#404293]/30 hover:text-[#404293]"
          }`}
        >
          <RefreshCcw className={`h-4 w-4 ${tasksQuery.isFetching ? "animate-spin" : ""}`} />
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`animate-pulse rounded-2xl border p-5 ${
                isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"
              }`}
            >
              <div className={`mb-5 h-1 w-full rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`mb-3 h-4 w-3/4 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`mb-2 h-3 w-full rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`mb-5 h-3 w-2/3 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`h-8 w-full rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
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
            <GraduationCap className={`h-7 w-7 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
          </div>
          <p className={`mb-1 font-bold ${isDark ? "text-gray-400" : "text-gray-400"}`}>
            {search ? "لا توجد نتائج" : "لا توجد مهام أكاديمية بعد"}
          </p>
          <p className={`text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}>
            {search ? "جرّب مصطلح بحث مختلف" : "ستظهر هنا المهام التي ينشئها فريقك الأكاديمي"}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {openTasks.length > 0 && (
            <motion.div key="open-group" layout>
              <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                مفتوحة — {openTasks.length}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {openTasks.map(renderCard)}
              </div>
            </motion.div>
          )}
          {closedTasks.length > 0 && (
            <motion.div key="closed-group" layout>
              <p className={`mb-2 mt-5 text-xs font-bold uppercase tracking-wide ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                مغلقة — {closedTasks.length}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {closedTasks.map(renderCard)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {submissionTask && (
          <SubmissionModal
            task={submissionTask}
            isDark={isDark}
            onClose={() => setSubmissionTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
