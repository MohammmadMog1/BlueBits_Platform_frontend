import { ChevronDown, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { USER_ROLES } from "../types";
import { cardClass, mutedClass } from "../../../shared/utils/theme";

interface YearOption {
  _id: string;
  name: string;
}

interface UsersFilterProps {
  search: string;
  roleFilter: string;
  yearFilter: string;
  years: YearOption[];
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onClearFilter: () => void;
  isDark: boolean;
}

export default function UsersFilter({
  search,
  roleFilter,
  yearFilter,
  years,
  onSearchChange,
  onRoleChange,
  onYearChange,
  onClearFilter,
  isDark,
}: UsersFilterProps) {
  const { t } = useTranslation(["users", "admin"]);

  return (
    <div className={`p-4 flex flex-wrap items-center gap-3 ${cardClass(isDark)}`}>
      <div
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border flex-1 min-w-[180px] ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
        }`}
      >
        <Search className={`w-4 h-4 flex-shrink-0 ${mutedClass(isDark)}`} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("filter.searchPlaceholder")}
          className={`bg-transparent text-sm outline-none flex-1 ${
            isDark ? "text-gray-200 placeholder-gray-500" : "text-gray-700 placeholder-gray-400"
          }`}
        />
        {search && (
          <button
            onClick={onClearFilter}
            className={isDark ? "text-gray-600 hover:text-gray-400" : "text-gray-300 hover:text-gray-500"}
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="relative">
        <select
          value={roleFilter}
          onChange={(event) => onRoleChange(event.target.value)}
          className={`appearance-none ps-4 pe-10 py-2.5 rounded-xl border text-sm font-semibold outline-none focus:ring-2 focus:ring-[#404293]/20 cursor-pointer ${
            isDark
              ? "border-white/10 bg-white/5 text-gray-200"
              : "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        >
          <option value="">{t("filter.allRoles")}</option>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {t(`admin:roles.${role}`)}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${mutedClass(isDark)}`}
        />
      </div>

      {roleFilter && (
        <button
          type="button"
          onClick={() => onRoleChange("")}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors border border-transparent ${
            isDark
              ? "text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
              : "text-red-500 hover:bg-red-50 hover:border-red-100"
          }`}
        >
          <X size={13} /> {t("filter.clear")}
        </button>
      )}

      <div className="relative">
        <select
          value={yearFilter}
          onChange={(event) => onYearChange(event.target.value)}
          className={`appearance-none ps-4 pe-10 py-2.5 rounded-xl border text-sm font-semibold outline-none focus:ring-2 focus:ring-[#404293]/20 cursor-pointer ${
            isDark
              ? "border-white/10 bg-white/5 text-gray-200"
              : "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        >
          <option value="">{t("filter.allYears")}</option>
          {years.map((year) => (
            <option key={year._id} value={year._id}>
              {year.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${mutedClass(isDark)}`}
        />
      </div>

      {yearFilter && (
        <button
          type="button"
          onClick={() => onYearChange("")}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors border border-transparent ${
            isDark
              ? "text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
              : "text-red-500 hover:bg-red-50 hover:border-red-100"
          }`}
        >
          <X size={13} /> {t("filter.clear")}
        </button>
      )}
    </div>
  );
}
