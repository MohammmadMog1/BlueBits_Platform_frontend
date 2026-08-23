import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ShieldCheck, Trash2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { User, UserRole } from "../types";
import { ROLE_COLORS, USER_ROLES } from "../types";
import {
  cardClass,
  dividerClass,
  faintClass,
  headingClass,
  mutedClass,
} from "../../../shared/utils/theme";

interface UsersTableProps {
  users: User[];
  search: string;
  roleFilter: string;
  onRoleChange: (id: string, newRole: string) => void;
  onDelete: (id: string) => void;
  onManagePermissions: (user: User) => void;
  loading: boolean;
  isDark: boolean;
}

/** ألوان شارة الدور في الوضع الداكن – نفس النغمات، بشفافية أعلى */
const ROLE_COLORS_DARK: Record<UserRole, string> = {
  USER: "bg-slate-500/15 text-slate-300",
  DOCTOR: "bg-violet-500/15 text-violet-300",
  LECTURER: "bg-indigo-500/15 text-indigo-300",
  BLUE: "bg-cyan-500/15 text-cyan-300",
  ADMIN: "bg-emerald-500/15 text-emerald-300",
  SUPER_ADMIN: "bg-rose-500/15 text-rose-300",
};

const roleBadgeClass = (role: UserRole, isDark: boolean): string =>
  (isDark ? ROLE_COLORS_DARK[role] : ROLE_COLORS[role]) ||
  (isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-700");

export default function UsersTable({
  users,
  search,
  roleFilter,
  onRoleChange,
  onDelete,
  onManagePermissions,
  loading,
  isDark,
}: UsersTableProps) {
  const { t } = useTranslation(["users", "admin"]);
  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      !searchValue ||
      user.name.toLowerCase().includes(searchValue) ||
      user.email.toLowerCase().includes(searchValue);
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className={`rounded-3xl overflow-hidden ${cardClass(isDark)}`}>
      {loading ? (
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 animate-pulse">
              <div
                className={`w-10 h-10 rounded-full flex-shrink-0 ${isDark ? "bg-white/10" : "bg-gray-100"}`}
              />
              <div className="flex-1 space-y-2">
                <div className={`h-3.5 rounded-full w-1/3 ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
                <div className={`h-3 rounded-full w-1/2 ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              </div>
              <div className={`h-6 w-16 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`h-7 w-24 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
              <div className={`h-7 w-20 rounded-full ${isDark ? "bg-white/10" : "bg-gray-100"}`} />
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className={`w-10 h-10 mb-3 ${isDark ? "text-white/10" : "text-gray-200"}`} />
          <p className={`font-bold ${mutedClass(isDark)}`}>{t("table.noResults")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1080px]" role="table" aria-label={t("table.label")}>
            <div
              role="row"
              className={`grid grid-cols-[1.4fr_1.5fr_0.9fr_0.9fr_0.9fr_1.3fr_auto] items-center gap-4 px-6 py-3.5 border-b text-[11px] font-black uppercase tracking-wider sticky top-0 z-10 ${
                isDark ? "bg-white/[0.04] border-white/10 text-gray-500" : "bg-gray-50/80 border-gray-100 text-gray-400"
              }`}
            >
              <span role="columnheader">{t("table.colUser")}</span>
              <span role="columnheader">{t("table.colEmail")}</span>
              <span role="columnheader">{t("table.colYear")}</span>
              <span role="columnheader">{t("table.colStatus")}</span>
              <span role="columnheader">{t("table.colRole")}</span>
              <span role="columnheader">{t("table.colPermissions")}</span>
              <span role="columnheader" className="sr-only">
                {t("table.colActions")}
              </span>
            </div>
            <div role="rowgroup">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user._id}
                    role="row"
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ delay: index * 0.03 }}
                    className={`grid grid-cols-[1.4fr_1.5fr_0.9fr_0.9fr_0.9fr_1.3fr_auto] items-center gap-4 px-6 py-4 border-b transition-colors ${
                      isDark
                        ? "border-white/5 hover:bg-white/[0.04]"
                        : "border-gray-50 hover:bg-gray-50/60"
                    }`}
                  >
                    <div role="cell" className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#404293] to-[#2376BB] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-[11px] font-black">
                          {user.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${headingClass(isDark)}`}>{user.name}</p>
                      </div>
                    </div>
                    <p
                      role="cell"
                      title={user.email}
                      className={`text-xs font-mono truncate ${mutedClass(isDark)}`}
                    >
                      {user.email}
                    </p>
                    <div role="cell" className="min-w-0">
                      {user.year ? (
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            isDark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {user.year}
                        </span>
                      ) : (
                        <span className={`text-[11px] font-semibold ${faintClass(isDark)}`}>
                          {t("table.notSet")}
                        </span>
                      )}
                    </div>
                    <span
                      role="cell"
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 w-fit ${
                        user.isVerified !== false
                          ? isDark
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-emerald-100 text-emerald-700"
                          : isDark
                            ? "bg-white/10 text-gray-400"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t(user.isVerified !== false ? "table.verified" : "table.unverified")}
                    </span>
                    <div role="cell" className="relative flex-shrink-0 w-fit">
                      <select
                        value={user.role}
                        onChange={(event) => onRoleChange(user._id, event.target.value)}
                        aria-label={t("table.roleOf", { name: user.name })}
                        className={`appearance-none ps-2.5 pe-7 py-1.5 rounded-xl text-[11px] font-black border border-transparent outline-none cursor-pointer transition-all focus:ring-2 focus:ring-[#404293]/30 ${roleBadgeClass(
                          user.role,
                          isDark,
                        )}`}
                      >
                        {USER_ROLES.map((roleOption) => (
                          <option key={roleOption} value={roleOption}>
                            {t(`admin:roles.${roleOption}`)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute end-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                    </div>
                    <div role="cell" className="flex flex-wrap items-center gap-1.5 min-w-0">
                      {user.permissions && user.permissions.length > 0 ? (
                        user.permissions.map((permission) => (
                          <span
                            key={permission}
                            title={t(`permissions.${permission}.description`)}
                            className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                              isDark ? "bg-[#2376BB]/15 text-[#7fb5e4]" : "bg-[#404293]/10 text-[#404293]"
                            }`}
                          >
                            {t(`permissions.${permission}.label`)}
                          </span>
                        ))
                      ) : (
                        <span className={`text-[11px] font-semibold ${faintClass(isDark)}`}>
                          {t("table.noPermissions")}
                        </span>
                      )}
                    </div>
                    <div role="cell" className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onManagePermissions(user)}
                        title={t("table.managePermissions")}
                        aria-label={t("table.managePermissionsOf", { name: user.name })}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                          isDark
                            ? "text-gray-500 hover:text-[#7fb5e4] hover:bg-[#2376BB]/10"
                            : "text-gray-300 hover:text-[#404293] hover:bg-[#404293]/10"
                        }`}
                      >
                        <ShieldCheck size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(user._id)}
                        title={t("table.delete")}
                        aria-label={t("table.deleteUser", { name: user.name })}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                          isDark
                            ? "text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                            : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className={`px-6 py-3 border-t ${dividerClass(isDark)}`}>
              <p className={`text-xs font-semibold ${mutedClass(isDark)}`}>
                {t("table.count", { count: filteredUsers.length })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
