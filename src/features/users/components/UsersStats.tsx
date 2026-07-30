import type { UsersStatsItem } from "../types";

interface UsersStatsProps {
  stats: UsersStatsItem[];
}

export default function UsersStats({ stats }: UsersStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div
            className="w-1.5 h-8 rounded-full flex-shrink-0"
            style={{ background: `linear-gradient(180deg,${item.color},${item.color}55)` }}
          />
          <div>
            <p className="text-lg font-black text-gray-900 leading-none">{item.value}</p>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
