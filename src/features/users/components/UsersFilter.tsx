import { ChevronDown, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { USER_ROLES } from "../types";

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
}: UsersFilterProps) {
  const { t } = useTranslation(["users", "admin"]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 flex-1 min-w-[180px]">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("filter.searchPlaceholder")}
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
        />
        {search && (
          <button onClick={onClearFilter} className="text-gray-300 hover:text-gray-500">
            <X size={13} />
          </button>
        )}
      </div>

      <div className="relative">
        <select
          value={roleFilter}
          onChange={(event) => onRoleChange(event.target.value)}
          className="appearance-none ps-4 pe-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#404293]/20 cursor-pointer"
        >
          <option value="">{t("filter.allRoles")}</option>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {t(`admin:roles.${role}`)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {roleFilter && (
        <button
          type="button"
          onClick={() => onRoleChange("")}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
        >
          <X size={13} /> {t("filter.clear")}
        </button>
      )}

      <div className="relative">
        <select
          value={yearFilter}
          onChange={(event) => onYearChange(event.target.value)}
          className="appearance-none ps-4 pe-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#404293]/20 cursor-pointer"
        >
          <option value="">{t("filter.allYears")}</option>
          {years.map((year) => (
            <option key={year._id} value={year._id}>
              {year.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {yearFilter && (
        <button
          type="button"
          onClick={() => onYearChange("")}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
        >
          <X size={13} /> {t("filter.clear")}
        </button>
      )}
    </div>
  );
}
