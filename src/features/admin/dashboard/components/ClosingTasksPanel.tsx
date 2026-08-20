import { ClipboardList } from "lucide-react";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  faintClass,
  mutedClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import { useTranslation } from "react-i18next";
import { deadlineInfo, urgencyBadgeClass } from "../../../../shared/utils/datetime";
import { useDeadlineLabel } from "../../../../shared/i18n/useDeadlineLabel";
import { useNow } from "../../../../shared/hooks/useNow";
import type { TasksMetrics } from "../types";

interface ClosingTasksPanelProps {
  tasks: TasksMetrics;
  isDark: boolean;
  isLoading: boolean;
}

/** المهام الأكاديمية المفتوحة الأقرب إغلاقاً — أهم قائمة تحتاج متابعة يومية */
export default function ClosingTasksPanel({
  tasks,
  isDark,
  isLoading,
}: ClosingTasksPanelProps) {
  const { t } = useTranslation("admin");
  const deadlineLabel = useDeadlineLabel();
  const now = useNow();

  return (
    <SectionCard
      icon={ClipboardList}
      title={t("closingTasks.title")}
      hint={t("closingTasks.hint", { open: tasks.open, total: tasks.total })}
      tone="amber"
      isDark={isDark}
      to="/admin/academic-tasks"
    >
      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`h-14 w-full ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : tasks.closingSoon.length === 0 ? (
        <SectionEmpty
          icon={ClipboardList}
          title={t("closingTasks.emptyTitle")}
          hint={t("closingTasks.emptyHint")}
          isDark={isDark}
        />
      ) : (
        <ul className="space-y-2.5">
          {tasks.closingSoon.map((task) => {
            const info = deadlineInfo(task.closesAt, now);
            return (
              <li
                key={task._id}
                className={`flex items-center justify-between gap-3 px-3.5 py-3 ${softBoxClass(isDark)}`}
              >
                <div className="min-w-0">
                  <p className={`truncate text-xs font-bold ${bodyClass(isDark)}`}>
                    {task.title}
                  </p>
                  <p className={`mt-0.5 truncate text-[11px] font-semibold ${faintClass(isDark)}`}>
                    {task.subjectId?.name ?? "—"}
                    {task.yearId?.name ? ` · ${task.yearId.name}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-black ${urgencyBadgeClass(
                    isDark,
                    info.urgency,
                  )}`}
                >
                  {deadlineLabel(info)}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {!isLoading && tasks.total > 0 && (
        <p className={`mt-3 text-[11px] font-semibold ${mutedClass(isDark)}`}>
          {t("closingTasks.closedCount", { count: tasks.closed })}
        </p>
      )}
    </SectionCard>
  );
}
