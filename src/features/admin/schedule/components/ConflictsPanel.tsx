import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, Database, Search, X } from "lucide-react";
import { motion } from "motion/react";
import type { AdminKey } from "../../../../shared/i18n/types";
import type { ConflictType, ScheduleConflict } from "../types";
import {
  emptyBoxClass,
  headingClass,
  mutedClass,
  panelClass,
} from "../../../../shared/utils/theme";

const PAGE_SIZE = 60;

const CONFLICT_META: Record<
  ConflictType,
  {
    labelKey: AdminKey;
    badge: { light: string; dark: string };
    dot: string;
  }
> = {
  HARD: {
    labelKey: "schedule.conflicts.strict",
    badge: {
      light: "border-red-200 bg-red-50 text-red-600",
      dark: "border-red-500/25 bg-red-500/10 text-red-400",
    },
    dot: "#EF4444",
  },
  MEDIUM: {
    labelKey: "schedule.conflicts.medium",
    badge: {
      light: "border-amber-200 bg-amber-50 text-amber-700",
      dark: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    },
    dot: "#F59E0B",
  },
  SOFT: {
    labelKey: "schedule.conflicts.soft",
    badge: {
      light: "border-sky-200 bg-sky-50 text-sky-700",
      dark: "border-sky-500/25 bg-sky-500/10 text-sky-400",
    },
    dot: "#0EA5E9",
  },
};

const TYPES: ConflictType[] = ["HARD", "MEDIUM", "SOFT"];

interface ConflictsPanelProps {
  conflicts: ScheduleConflict[];
  isDark: boolean;
}

export default function ConflictsPanel({ conflicts, isDark }: ConflictsPanelProps) {
  const { t } = useTranslation("admin");
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
      className={`space-y-4 p-6 ${panelClass(isDark)}`}
    >
      <div className="flex items-center gap-2">
        <Database className={`h-4 w-4 ${isDark ? "text-[#7fb5e4]" : "text-[#2376BB]"}`} />
        <h3 className={`text-sm font-black ${headingClass(isDark)}`}>
          {t("schedule.conflicts.title")}
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
            isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-500"
          }`}
        >
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
                  ? isDark
                    ? "border-[#2376BB]/40 bg-[#2376BB]/10 shadow-sm"
                    : "border-[#404293]/40 bg-[#404293]/5 shadow-sm"
                  : isDark
                    ? "border-white/10 bg-white/5 hover:border-white/20"
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
                <p className={`text-base font-black leading-none ${headingClass(isDark)}`}>
                  {counts[type] ?? 0}
                </p>
                <p className={`mt-0.5 text-[10px] font-bold ${mutedClass(isDark)}`}>
                  {t(meta.labelKey)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div
        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
        }`}
      >
        <Search className={`h-4 w-4 shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder={t("schedule.conflicts.searchPlaceholder")}
          className={`flex-1 bg-transparent text-sm outline-none placeholder-gray-400 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} aria-label={t("schedule.conflicts.clearSearch")}>
            <X
              size={13}
              className={isDark ? "text-gray-600 hover:text-gray-400" : "text-gray-300 hover:text-gray-500"}
            />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className={`py-8 text-center text-xs font-bold ${mutedClass(isDark)} ${emptyBoxClass(isDark)}`}>
          {t("schedule.conflicts.noMatches")}
        </p>
      ) : (
        <>
          <div className="space-y-1.5">
            {filtered.slice(0, visible).map((conflict, index) => {
              const meta = CONFLICT_META[conflict.type];
              return (
                <div
                  key={`${conflict.examA}-${conflict.examB}-${index}`}
                  className={`flex flex-wrap items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
                    isDark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50/60"
                  }`}
                >
                  <span
                    className={`rounded-lg border px-2 py-0.5 text-[10px] font-black ${
                      isDark ? meta.badge.dark : meta.badge.light
                    }`}
                  >
                    {t(meta.labelKey)}
                  </span>
                  <span className={`text-xs font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    {conflict.examAName}
                  </span>
                  <ArrowLeftRight size={12} className={isDark ? "text-gray-600" : "text-gray-300"} />
                  <span className={`text-xs font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
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
              className={`w-full rounded-xl border py-2.5 text-xs font-bold transition-colors ${
                isDark
                  ? "border-white/10 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
                  : "border-gray-200 text-gray-500 hover:border-[#404293]/30 hover:text-[#404293]"
              }`}
            >
              {t("schedule.conflicts.showMore", {
                count: filtered.length - visible,
              })}
            </button>
          )}
        </>
      )}
    </motion.div>
  );
}
