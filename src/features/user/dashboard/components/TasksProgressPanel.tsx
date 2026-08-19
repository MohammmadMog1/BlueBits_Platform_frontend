import { Link } from "react-router-dom";
import { AlertTriangle, CheckSquare, GraduationCap } from "lucide-react";
import {
  brandGradient,
  cardClass,
  faintClass,
  headingClass,
  mutedClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import type { TasksSummary } from "../types";

interface TasksProgressPanelProps {
  tasks: TasksSummary;
  isDark: boolean;
  isLoading: boolean;
}

/** نظرة سريعة على تقدّم المهام — نفس مقياس صفحة "مهامي" */
export default function TasksProgressPanel({
  tasks,
  isDark,
  isLoading,
}: TasksProgressPanelProps) {
  if (isLoading) {
    return <div className={`h-44 w-full ${skeletonClass(isDark)}`} />;
  }

  const items = [
    {
      icon: CheckSquare,
      label: "مهام شخصية منجزة",
      value: `${tasks.personalDone}/${tasks.personalTotal}`,
    },
    {
      icon: GraduationCap,
      label: "مهام أكاديمية مفتوحة",
      value: tasks.academicOpen,
    },
    {
      icon: AlertTriangle,
      label: "متأخرة",
      value: tasks.personalOverdue,
    },
  ];

  return (
    <div className={`p-5 ${cardClass(isDark)}`}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className={`text-sm font-black ${headingClass(isDark)}`}>التقدّم الإجمالي</p>
          <p className={`text-[11px] font-semibold ${mutedClass(isDark)}`}>
            المهام الشخصية والأكاديمية معاً
          </p>
        </div>
        <span className="text-2xl font-black text-[#2376BB]">{tasks.progress}%</span>
      </div>

      <div
        className={`h-3.5 w-full overflow-hidden rounded-full ${
          isDark ? "bg-white/10" : "bg-gray-100"
        }`}
      >
        <div
          className={`h-full rounded-full ${brandGradient} transition-all duration-700 ease-out`}
          style={{ width: `${tasks.progress}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`px-2.5 py-3 text-center ${softBoxClass(isDark)}`}>
              <Icon className={`mx-auto mb-1 h-4 w-4 ${faintClass(isDark)}`} />
              <p className={`text-base font-black leading-none ${headingClass(isDark)}`}>
                {item.value}
              </p>
              <p className={`mt-1 text-[10px] font-bold ${mutedClass(isDark)}`}>
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        to="/user/todo"
        className={`mt-4 flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-bold transition-all ${
          isDark
            ? "border-white/10 bg-white/5 text-gray-300 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
            : "border-gray-200 bg-white text-gray-600 hover:border-[#404293]/30 hover:text-[#404293]"
        }`}
      >
        فتح صفحة المهام
      </Link>
    </div>
  );
}
