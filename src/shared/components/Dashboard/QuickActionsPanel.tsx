import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionCard from "./SectionCard";
import type { AllNamespaces, TranslationKey } from "../../i18n/types";
import {
  accentIconClass,
  faintClass,
  headingClass,
  softBoxClass,
  type AccentTone,
} from "../../utils/theme";

export interface QuickAction {
  icon: React.ElementType;
  /**
   * مفتاح الترجمة الكامل ("dashboard:quickActions.mcq.label").
   * نخزّن المفتاح لا النصّ لأن قوائم الاختصارات ثوابت على مستوى الوحدة،
   * فالنصّ المترجَم فيها يتجمّد على لغة الإقلاع.
   */
  labelKey: TranslationKey;
  hintKey: TranslationKey;
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
  title,
  hint,
}: QuickActionsPanelProps) {
  // كل الـ namespaces مُحمَّلة هنا لأن مفاتيح الاختصارات تأتي مُسبَقة من الإعدادات
  const { t } = useTranslation<AllNamespaces>([
    "common",
    "nav",
    "auth",
    "landing",
    "dashboard",
    "lectures",
    "admin",
    "survey",
    "mcq",
    "announcements",
    "tasks",
    "users",
    "ai",
    "profile",
    "doctor",
  ]);

  return (
    <SectionCard
      icon={Zap}
      title={title ?? t("dashboard.quickActions")}
      hint={hint ?? t("dashboard.quickActionsHint")}
      tone="amber"
      isDark={isDark}
    >
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.to + action.labelKey}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                to={action.to}
                className={`group flex items-center gap-2.5 px-3 py-3 transition-shadow hover:shadow-md ${softBoxClass(isDark)}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${accentIconClass(
                    isDark,
                    action.tone ?? "brand",
                  )}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className={`truncate text-[11px] font-black ${headingClass(isDark)}`}>
                    {t(action.labelKey)}
                  </p>
                  <p className={`truncate text-[10px] font-semibold ${faintClass(isDark)}`}>
                    {t(action.hintKey)}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </SectionCard>
  );
}
