import { Link } from "react-router-dom";
import {
  accentIconClass,
  cardClass,
  faintClass,
  headingClass,
  mutedClass,
  skeletonClass,
  type AccentTone,
} from "../../utils/theme";

export interface StatTileProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  /** سطر صغير أسفل الرقم (مثلاً: "3 مفتوحة") */
  hint?: string;
  tone?: AccentTone;
  isDark: boolean;
  /** عند تمريره تصبح البطاقة رابطاً لصفحة التفاصيل */
  to?: string;
  isLoading?: boolean;
}

/**
 * بطاقة إحصاءة واحدة — مشتركة بين داشبورد الأدمن وداشبورد الطالب
 * حتى تبقى الأرقام بنفس الشكل في كل مكان.
 */
export default function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = "brand",
  isDark,
  to,
  isLoading = false,
}: StatTileProps) {
  const content = (
    <div
      className={`flex h-full items-center gap-3.5 p-4 ${cardClass(isDark)} transition-all ${
        to ? "hover:-translate-y-0.5 hover:shadow-md" : ""
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accentIconClass(
          isDark,
          tone,
        )}`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        {isLoading ? (
          <div className={`h-6 w-12 ${skeletonClass(isDark)}`} />
        ) : (
          <p className={`text-xl font-black leading-none ${headingClass(isDark)}`}>
            {value}
          </p>
        )}
        <p className={`mt-1 truncate text-[11px] font-bold ${mutedClass(isDark)}`}>
          {label}
        </p>
        {hint && !isLoading && (
          <p className={`mt-0.5 truncate text-[10px] font-semibold ${faintClass(isDark)}`}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );

  if (!to) return content;

  return (
    <Link to={to} aria-label={label} className="block h-full">
      {content}
    </Link>
  );
}
