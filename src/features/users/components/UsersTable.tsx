import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Trash2, Users } from "lucide-react";
import type { User } from "../types";
import { ROLE_COLORS, USER_ROLES } from "../types";

interface UsersTableProps {
  users: User[];
  search: string;
  roleFilter: string;
  onRoleChange: (id: string, newRole: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function UsersTable({
  users,
  search,
  roleFilter,
  onRoleChange,
  onDelete,
  loading,
}: UsersTableProps) {
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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {loading ? (
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded-full w-1/3" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
              </div>
              <div className="h-7 w-24 bg-gray-100 rounded-full" />
              <div className="h-7 w-20 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="w-10 h-10 text-gray-200 mb-3" />
          <p className="font-bold text-gray-400">لا توجد نتائج</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-4 px-6 py-3.5 bg-gray-50/80 border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-wider">
            <span>المستخدم</span>
            <span>البريد الإلكتروني</span>
            <span>الحالة</span>
            <span>الدور</span>
            <span></span>
          </div>
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ delay: index * 0.03 }}
                className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-4 px-6 py-4 border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
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
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-mono truncate">{user.email}</p>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    user.isVerified !== false
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {user.isVerified !== false ? "✓ موثّق" : "غير موثّق"}
                </span>
                <div className="relative flex-shrink-0">
                  <select
                    value={user.role}
                    onChange={(event) => onRoleChange(user._id, event.target.value)}
                    className={`appearance-none pl-2.5 pr-7 py-1.5 rounded-xl text-[11px] font-black border border-transparent outline-none cursor-pointer transition-all ${
                      ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {USER_ROLES.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                </div>
                <button
                  onClick={() => onDelete(user._id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="px-6 py-3 border-t border-gray-50">
            <p className="text-xs text-gray-400 font-semibold">{filteredUsers.length} مستخدم</p>
          </div>
        </>
      )}
    </div>
  );
}
