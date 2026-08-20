import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "../../../../shared/components/Dashboard/SectionCard";
import SectionEmpty from "../../../../shared/components/Dashboard/SectionEmpty";
import {
  bodyClass,
  brandGradient,
  faintClass,
  headingClass,
  mutedClass,
  skeletonClass,
  softBoxClass,
} from "../../../../shared/utils/theme";
import type { UsersMetrics } from "../types";

interface RoleBreakdownPanelProps {
  users: UsersMetrics;
  isDark: boolean;
  isLoading: boolean;
}

/** توزيع المستخدمين على الأدوار + نسبة تفعيل الحسابات */
export default function RoleBreakdownPanel({
  users,
  isDark,
  isLoading,
}: RoleBreakdownPanelProps) {
  const { t } = useTranslation("admin");

  return (
    <SectionCard
      icon={Users}
      title={t("roleBreakdown.title")}
      hint={t("roleBreakdown.hint", {
        total: users.total,
        rate: users.verifiedRate,
      })}
      isDark={isDark}
      to="/admin/users"
      toLabel={t("roleBreakdown.manageUsers")}
    >
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`h-9 w-full ${skeletonClass(isDark)}`} />
          ))}
        </div>
      ) : users.total === 0 ? (
        <SectionEmpty
          icon={Users}
          title={t("roleBreakdown.emptyTitle")}
          hint={t("roleBreakdown.emptyHint")}
          isDark={isDark}
        />
      ) : (
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-3.5 ${softBoxClass(isDark)}`}>
            <div>
              <p className={`text-[11px] font-bold ${mutedClass(isDark)}`}>
                {t("roleBreakdown.verifiedAccounts")}
              </p>
              <p className={`text-lg font-black ${headingClass(isDark)}`}>
                {users.verified}
                <span className={`text-xs font-bold ${faintClass(isDark)}`}>
                  {" / "}
                  {users.total}
                </span>
              </p>
            </div>
            <div className="w-32">
              <div
                className={`h-2.5 w-full overflow-hidden rounded-full ${
                  isDark ? "bg-white/10" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-full rounded-full ${brandGradient} transition-all duration-700`}
                  style={{ width: `${users.verifiedRate}%` }}
                />
              </div>
              <p className={`mt-1 text-start text-[10px] font-bold ${mutedClass(isDark)}`}>
                {t("roleBreakdown.awaitingVerification", {
                  count: users.unverified,
                })}
              </p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {users.breakdown.map((item) => (
              <li key={item.role}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className={`font-bold ${bodyClass(isDark)}`}>
                    {t(`roles.${item.role}`)}
                  </span>
                  <span className={`font-black ${mutedClass(isDark)}`}>
                    {item.count}
                    <span className={faintClass(isDark)}> · {item.percentage}%</span>
                  </span>
                </div>
                <div
                  className={`h-1.5 w-full overflow-hidden rounded-full ${
                    isDark ? "bg-white/10" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${brandGradient} transition-all duration-700`}
                    style={{ width: `${Math.max(item.percentage, 2)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}
