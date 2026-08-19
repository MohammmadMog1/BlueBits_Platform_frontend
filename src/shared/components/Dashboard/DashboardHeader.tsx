import { RefreshCcw } from "lucide-react";
import {
  brandGradientBr,
  faintClass,
  headingClass,
  iconButtonClass,
  mutedClass,
} from "../../utils/theme";
import { formatFullDate } from "../../utils/datetime";

interface DashboardHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  isDark: boolean;
  isFetching: boolean;
  onRefresh: () => void;
  /** عنصر إضافي في الترويسة (زر إجراء مثلاً) */
  action?: React.ReactNode;
}

/** ترويسة موحّدة لصفحات الداشبورد: هوية + تاريخ اليوم + تحديث */
export default function DashboardHeader({
  icon: Icon,
  title,
  subtitle,
  isDark,
  isFetching,
  onRefresh,
  action,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-2.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${brandGradientBr} shadow-md shadow-[#404293]/25`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h1
            className={`truncate text-xl font-black tracking-tight ${headingClass(isDark)}`}
          >
            {title}
          </h1>
        </div>
        <p className={`text-sm font-medium ${mutedClass(isDark)}`}>{subtitle}</p>
        <p className={`mt-0.5 text-xs font-semibold ${faintClass(isDark)}`}>
          {formatFullDate()}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {action}
        <button
          type="button"
          onClick={onRefresh}
          title="تحديث البيانات"
          aria-label="تحديث البيانات"
          className={iconButtonClass(isDark)}
        >
          <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>
    </header>
  );
}
