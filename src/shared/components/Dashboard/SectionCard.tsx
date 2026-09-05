import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../i18n/useLanguage";
import {
  accentIconClass,
  cardClass,
  headingClass,
  mutedClass,
  type AccentTone,
} from "../../utils/theme";

interface SectionCardProps {
  icon: React.ElementType;
  title: string;
  hint?: string;
  tone?: AccentTone;
  isDark: boolean;
  /** رابط الصفحة الكاملة لهذا القسم */
  to?: string;
  toLabel?: string;
  className?: string;
  children: React.ReactNode;
}

/** حاوية موحّدة لأقسام الداشبورد (ترويسة + محتوى + رابط للصفحة الكاملة) */
export default function SectionCard({
  icon: Icon,
  title,
  hint,
  tone = "brand",
  isDark,
  to,
  toLabel,
  className = "",
  children,
}: SectionCardProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <section className={`flex flex-col p-5 ${cardClass(isDark)} ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentIconClass(
              isDark,
              tone,
            )}`}
          >
            <Icon className="h-[17px] w-[17px]" />
          </div>
          <div className="min-w-0">
            <h2 className={`truncate text-sm font-black ${headingClass(isDark)}`}>
              {title}
            </h2>
            {hint && (
              <p className={`truncate text-[11px] font-semibold ${mutedClass(isDark)}`}>
                {hint}
              </p>
            )}
          </div>
        </div>

        {to && (
          <Link
            to={to}
            className="group/link flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#2376BB] transition-opacity hover:opacity-75"
          >
            {toLabel ?? t("actions.viewAll")}
            <ArrowLeft
              className={`h-3 w-3 transition-transform duration-200 ${
                isRTL ? "group-hover/link:-translate-x-0.5" : "rotate-180 group-hover/link:translate-x-0.5"
              }`}
            />
          </Link>
        )}
      </div>

      <div className="flex-1">{children}</div>
    </section>
  );
}
