import { Calendar, CheckCircle2, Circle, Edit3, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { PersonalTask } from "../types";

interface PersonalTaskCardProps {
  task: PersonalTask;
  isDark: boolean;
  isCompleting: boolean;
  onComplete: (task: PersonalTask) => void;
  onEdit: (task: PersonalTask) => void;
  onDelete: (task: PersonalTask) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ar-EG", { dateStyle: "medium" });

const isOverdue = (task: PersonalTask) =>
  !task.isCompleted && new Date(task.dueDate).getTime() < Date.now();

function StatusDot({ task }: { task: PersonalTask }) {
  const color = task.isCompleted
    ? "bg-emerald-500"
    : isOverdue(task)
      ? "bg-red-500"
      : "bg-[#2376BB]";
  return <div className={`h-2 w-2 shrink-0 rounded-full ${color}`} />;
}

function DueChip({ task, isDark, small }: { task: PersonalTask; isDark: boolean; small?: boolean }) {
  const overdue = isOverdue(task);
  const base = small ? "text-[10px]" : "text-[11px]";
  const px = small ? "px-1.5 py-0.5" : "px-2 py-1";
  const icon = small ? "h-2.5 w-2.5" : "h-3 w-3";
  return (
    <span
      className={`flex items-center gap-1 rounded-lg ${px} ${base} font-semibold ${
        overdue
          ? "border border-red-500/20 bg-red-500/10 text-red-500"
          : isDark
            ? "border border-white/10 bg-white/8 text-gray-400"
            : "border border-gray-200 bg-gray-100 text-gray-500"
      }`}
    >
      <Calendar className={icon} /> {formatDate(task.dueDate)}
    </span>
  );
}

interface CardBodyProps extends PersonalTaskCardProps {
  compact?: boolean;
}

function MobilePersonalTaskCard({
  task,
  isDark,
  isCompleting,
  onComplete,
  onEdit,
  onDelete,
}: CardBodyProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`flex items-start gap-3 rounded-2xl border p-3.5 transition-all active:scale-[0.99] ${
        task.isCompleted ? "opacity-60" : ""
      } ${isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"}`}
    >
      <button
        type="button"
        onClick={() => !task.isCompleted && !isCompleting && onComplete(task)}
        disabled={task.isCompleted || isCompleting}
        className="mt-0.5 shrink-0 disabled:cursor-default"
      >
        {task.isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className={`h-5 w-5 ${isDark ? "text-gray-500" : "text-gray-300"}`} />
        )}
      </button>

      <StatusDot task={task} />

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-bold leading-snug ${
            task.isCompleted
              ? "text-gray-500 line-through"
              : isDark
                ? "text-white"
                : "text-gray-900"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            className={`mt-1 line-clamp-2 text-xs leading-snug ${task.isCompleted ? "line-through" : ""} ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {task.description}
          </p>
        )}
        <div className="mt-1.5">
          <DueChip task={task} isDark={isDark} small />
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className={`rounded-lg p-1.5 transition-all ${
            isDark ? "text-gray-500 active:bg-white/10" : "text-gray-400 active:bg-gray-100"
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className={`rounded-lg p-1.5 transition-all ${
            isDark ? "text-gray-600 active:bg-white/10 active:text-red-400" : "text-gray-300 active:bg-red-50 active:text-red-500"
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function DesktopPersonalTaskCard({
  task,
  isDark,
  isCompleting,
  onComplete,
  onEdit,
  onDelete,
}: CardBodyProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`group flex items-start gap-4 rounded-2xl border p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 ${
        task.isCompleted ? "opacity-60" : ""
      } ${
        isDark
          ? "border-white/10 bg-white/5 hover:bg-white/10 hover:shadow-lg"
          : "border-gray-100 bg-white hover:border-[#404293]/20 hover:shadow-md"
      }`}
    >
      <button
        type="button"
        onClick={() => !task.isCompleted && !isCompleting && onComplete(task)}
        disabled={task.isCompleted || isCompleting}
        title={task.isCompleted ? "مكتملة" : "تحديد كمنجزة"}
        className="mt-0.5 shrink-0 disabled:cursor-default"
      >
        {task.isCompleted ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        ) : (
          <Circle
            className={`h-6 w-6 transition-colors ${
              isDark ? "text-gray-500 hover:text-[#2376BB]" : "text-gray-300 hover:text-[#404293]"
            }`}
          />
        )}
      </button>

      <div className="mt-2.5 shrink-0">
        <StatusDot task={task} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-base font-bold ${
            task.isCompleted
              ? "text-gray-500 line-through"
              : isDark
                ? "text-white"
                : "text-gray-900"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            className={`mt-1 line-clamp-2 text-sm leading-snug ${task.isCompleted ? "line-through" : ""} ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {task.description}
          </p>
        )}
        <div className="mt-2.5">
          <DueChip task={task} isDark={isDark} />
        </div>
      </div>

      <div className="ml-2 flex shrink-0 flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className={`rounded-xl p-2 opacity-0 transition-all group-hover:opacity-100 ${
            isDark ? "text-gray-400 hover:bg-white/10 hover:text-[#2376BB]" : "text-gray-400 hover:bg-[#404293]/6 hover:text-[#404293]"
          }`}
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className={`mt-auto rounded-xl p-2 opacity-0 transition-all group-hover:opacity-100 ${
            isDark ? "text-gray-500 hover:bg-red-500/20 hover:text-red-400" : "text-gray-400 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function PersonalTaskCard(props: PersonalTaskCardProps) {
  return (
    <>
      <div className="sm:hidden">
        <MobilePersonalTaskCard {...props} />
      </div>
      <div className="hidden sm:block">
        <DesktopPersonalTaskCard {...props} />
      </div>
    </>
  );
}
