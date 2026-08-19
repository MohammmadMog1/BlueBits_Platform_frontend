import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import SectionCard from "./SectionCard";
import {
  accentIconClass,
  faintClass,
  headingClass,
  softBoxClass,
  type AccentTone,
} from "../../utils/theme";

export interface QuickAction {
  icon: React.ElementType;
  label: string;
  hint: string;
  to: string;
  tone?: AccentTone;
}

interface QuickActionsPanelProps {
  actions: QuickAction[];
  isDark: boolean;
  title?: string;
  hint?: string;
}

/** روابط سريعة لأكثر المهام تكراراً — تختصر التنقّل عبر القائمة الجانبية */
export default function QuickActionsPanel({
  actions,
  isDark,
  title = "إجراءات سريعة",
  hint = "اختصارات لأكثر ما تستخدمه",
}: QuickActionsPanelProps) {
  return (
    <SectionCard icon={Zap} title={title} hint={hint} tone="amber" isDark={isDark}>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.to + action.label}
              to={action.to}
              className={`flex items-center gap-2.5 px-3 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${softBoxClass(isDark)}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentIconClass(
                  isDark,
                  action.tone ?? "brand",
                )}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className={`truncate text-[11px] font-black ${headingClass(isDark)}`}>
                  {action.label}
                </p>
                <p className={`truncate text-[10px] font-semibold ${faintClass(isDark)}`}>
                  {action.hint}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}
