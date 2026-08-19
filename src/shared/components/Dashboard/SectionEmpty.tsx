import { emptyBoxClass, faintClass, mutedClass } from "../../utils/theme";

interface SectionEmptyProps {
  icon: React.ElementType;
  title: string;
  hint?: string;
  isDark: boolean;
}

/** حالة "لا يوجد شيء" داخل قسم من أقسام الداشبورد */
export default function SectionEmpty({
  icon: Icon,
  title,
  hint,
  isDark,
}: SectionEmptyProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-4 py-10 text-center ${emptyBoxClass(isDark)}`}
    >
      <Icon className={`mb-2 h-6 w-6 ${faintClass(isDark)}`} />
      <p className={`text-xs font-bold ${mutedClass(isDark)}`}>{title}</p>
      {hint && <p className={`mt-0.5 text-[11px] ${faintClass(isDark)}`}>{hint}</p>}
    </div>
  );
}
