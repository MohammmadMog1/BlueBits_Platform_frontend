import { useMemo, useState } from "react";
import { ArrowLeftRight, Database, Search, X } from "lucide-react";
import { motion } from "motion/react";
import type { ConflictType, ScheduleConflict } from "../types";

const PAGE_SIZE = 60;

const CONFLICT_META: Record<
  ConflictType,
  { label: string; badge: string; dot: string }
> = {
  HARD: {
    label: "صارم",
    badge: "border-red-200 bg-red-50 text-red-600",
    dot: "#EF4444",
  },
  MEDIUM: {
    label: "متوسط",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "#F59E0B",
  },
  SOFT: {
    label: "مرن",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    dot: "#0EA5E9",
  },
};

const TYPES: ConflictType[] = ["HARD", "MEDIUM", "SOFT"];

interface ConflictsPanelProps {
  conflicts: ScheduleConflict[];
}

export default function ConflictsPanel({ conflicts }: ConflictsPanelProps) {
  const [typeFilter, setTypeFilter] = useState<ConflictType | "">("");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const counts = useMemo(
    () =>
      conflicts.reduce(
        (acc, conflict) => {
          acc[conflict.type] = (acc[conflict.type] ?? 0) + 1;
          return acc;
        },
        {} as Record<ConflictType, number>,
      ),
    [conflicts],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return conflicts.filter((conflict) => {
      if (typeFilter && conflict.type !== typeFilter) return false;
      if (!term) return true;
      return (
        conflict.examAName.toLowerCase().includes(term) ||
        conflict.examBName.toLowerCase().includes(term)
      );
    });
  }, [conflicts, typeFilter, search]);

  const applyFilter = (type: ConflictType | "") => {
    setTypeFilter(type);
    setVisible(PAGE_SIZE);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
      dir="rtl"
    >
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-[#2376BB]" />
        <h3 className="text-sm font-black text-gray-900">التعارضات بين المواد</h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500">
          {conflicts.length}
        </span>
      </div>

      {/* عدّادات الأنواع – تعمل كفلاتر أيضاً */}
      <div className="grid grid-cols-3 gap-2.5">
        {TYPES.map((type) => {
          const meta = CONFLICT_META[type];
          const isActive = typeFilter === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => applyFilter(isActive ? "" : type)}
              className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-right transition-all ${
                isActive
                  ? "border-[#404293]/40 bg-[#404293]/5 shadow-sm"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div
                className="h-7 w-1.5 shrink-0 rounded-full"
                style={{
                  background: `linear-gradient(180deg,${meta.dot},${meta.dot}55)`,
                }}
              />
              <div>
                <p className="text-base font-black leading-none text-gray-900">
                  {counts[type] ?? 0}
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-gray-400">
                  {meta.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder="بحث باسم المادة..."
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} aria-label="مسح البحث">
            <X size={13} className="text-gray-300 hover:text-gray-500" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-8 text-center text-xs font-bold text-gray-400">
          لا توجد تعارضات مطابقة
        </p>
      ) : (
        <>
          <div className="space-y-1.5">
            {filtered.slice(0, visible).map((conflict, index) => {
              const meta = CONFLICT_META[conflict.type];
              return (
                <div
                  key={`${conflict.examA}-${conflict.examB}-${index}`}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-2.5"
                >
                  <span
                    className={`rounded-lg border px-2 py-0.5 text-[10px] font-black ${meta.badge}`}
                  >
                    {meta.label}
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {conflict.examAName}
                  </span>
                  <ArrowLeftRight size={12} className="text-gray-300" />
                  <span className="text-xs font-bold text-gray-800">
                    {conflict.examBName}
                  </span>
                </div>
              );
            })}
          </div>

          {visible < filtered.length && (
            <button
              type="button"
              onClick={() => setVisible((current) => current + PAGE_SIZE)}
              className="w-full rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-500 transition-colors hover:border-[#404293]/30 hover:text-[#404293]"
            >
              عرض المزيد ({filtered.length - visible} متبقٍ)
            </button>
          )}
        </>
      )}
    </motion.div>
  );
}
