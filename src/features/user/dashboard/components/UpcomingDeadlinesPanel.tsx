import { Link } from "react-router-dom";
import { CalendarClock, CheckSquare, GraduationCap } from "lucide-react";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  faintClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import {
  deadlineInfo,
  formatShortDate,
  urgencyBadgeClass,
} from "../../../../shared/utils/datetime";
import { useNow } from "../../../../shared/hooks/useNow";
import type { DeadlineItem } from "../types";

interface UpcomingDeadlinesPanelProps {
  items: DeadlineItem[];
  isDark: boolean;
  isLoading: boolean;
}

/** أقرب المواعيد من المهام الشخصية والأكاديمية في قائمة واحدة مرتّبة زمنياً */
export default function UpcomingDeadlinesPanel({
  items,
  isDark,
  isLoading,
}: UpcomingDeadlinesPanelProps) {
  const now = useNow();

  return (
    <SectionCard
      icon={CalendarClock}
      title="أقرب المواعيد"
      hint="مرتّبة من الأقرب للأبعد"
      tone="amber"
      isDark={isDark}
      to="/user/todo"
    >
      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`h-14 w-full ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <SectionEmpty
          icon={CalendarClock}
          title="لا توجد مواعيد قادمة"
          hint="أنجزت كل ما عليك — أضف مهمة جديدة عند الحاجة"
          isDark={isDark}
        />
      ) : (
        <ul className="space-y-2.5">
          {items.map((item) => {
            const info = deadlineInfo(item.dueDate, now);
            const Icon = item.source === "personal" ? CheckSquare : GraduationCap;
            return (
              <li key={`${item.source}-${item.id}`}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${softBoxClass(isDark)}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${faintClass(isDark)}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs font-bold ${bodyClass(isDark)}`}>
                      {item.title}
                    </p>
                    <p className={`mt-0.5 truncate text-[11px] font-semibold ${faintClass(isDark)}`}>
                      {item.subtitle} · {formatShortDate(item.dueDate)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-black ${urgencyBadgeClass(
                      isDark,
                      info.urgency,
                    )}`}
                  >
                    {info.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}
