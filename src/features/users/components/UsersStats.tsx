import { cardClass, headingClass, mutedClass } from "../../../shared/utils/theme";
import type { UsersStatsItem } from "../types";

interface UsersStatsProps {
  stats: UsersStatsItem[];
  isDark: boolean;
}

export default function UsersStats({ stats, isDark }: UsersStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className={`px-4 py-3.5 flex items-center gap-3 transition-shadow hover:shadow-md ${cardClass(isDark)}`}
        >
          <div
            className="w-1.5 h-8 rounded-full flex-shrink-0"
            style={{ background: `linear-gradient(180deg,${item.color},${item.color}55)` }}
          />
          <div>
            <p className={`text-lg font-black leading-none ${headingClass(isDark)}`}>{item.value}</p>
            <p className={`text-[11px] font-semibold mt-0.5 ${mutedClass(isDark)}`}>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
