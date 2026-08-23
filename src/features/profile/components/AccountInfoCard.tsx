// src/features/profile/components/AccountInfoCard.tsx
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Mail, ShieldCheck, CalendarDays, KeyRound, RefreshCw } from "lucide-react";
import { useFormatters } from "../../../shared/i18n/useFormatters";
import type { User } from "../types/profile.types";

export default function AccountInfoCard({ user }: { user: User }) {
  const { t } = useTranslation(["profile", "common"]);
  const { formatMediumDateOrDash } = useFormatters();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const rows = [
    { icon: Mail, label: t("accountInfo.email"), value: user.email },
    {
      icon: ShieldCheck,
      label: t("accountInfo.role"),
      value: t(`common:roles.${user.role}`),
    },
    {
      icon: CalendarDays,
      label: t("accountInfo.memberSince"),
      value: formatMediumDateOrDash(user.createdAt),
    },
    {
      icon: RefreshCw,
      label: t("accountInfo.lastUpdated"),
      value: formatMediumDateOrDash(user.updatedAt),
    },
    {
      icon: KeyRound,
      label: t("accountInfo.passwordChanged"),
      value: formatMediumDateOrDash(user.passwordChangedAt),
    },
  ];

  return (
    <div
      className={`rounded-2xl border shadow-sm p-6 ${
        isDark ? "bg-white/5 border-white/10" : "bg-white/98 border-gray-200/80"
      }`}
    >
      <h2 className={`text-[15px] font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
        {t("accountInfo.title")}
      </h2>
      <div className="mt-4 space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
              isDark ? "bg-white/[0.03] hover:bg-[#2376BB]/10" : "bg-gray-50 hover:bg-[#404293]/6"
            }`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${isDark ? "text-[#7fb5e4]" : "text-[#404293]"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-gray-400">{label}</p>
              <p className={`text-[12px] font-semibold truncate ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}