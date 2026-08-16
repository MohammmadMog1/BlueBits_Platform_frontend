// src/features/profile/components/AccountInfoCard.tsx
import { Mail, ShieldCheck, CalendarDays, KeyRound, RefreshCw } from "lucide-react";
import { getRoleLabel, formatDate } from "../../../shared/utils/user";
import type { User } from "../types/profile.types";

export default function AccountInfoCard({ user }: { user: User }) {
  const rows = [
    { icon: Mail, label: "Email", value: user.email },
    { icon: ShieldCheck, label: "Role", value: getRoleLabel(user.role) },
    { icon: CalendarDays, label: "Member Since", value: formatDate(user.createdAt) },
    { icon: RefreshCw, label: "Last Updated", value: formatDate(user.updatedAt) },
    { icon: KeyRound, label: "Password Changed", value: formatDate(user.passwordChangedAt) },
  ];

  return (
    <div className="rounded-2xl bg-white/98 border border-gray-200/80 shadow-sm p-6">
      <h2 className="text-[15px] font-bold text-gray-800">Account Info</h2>
      <div className="mt-4 space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-[#404293]/6 transition-colors"
          >
            <Icon className="w-4 h-4 text-[#404293] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-400">{label}</p>
              <p className="text-[12px] font-semibold text-gray-700 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}