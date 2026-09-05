/**
 * لغة بصرية موحّدة لكل صفحات المنصّة (أدمن + طالب).
 * كل دالة ترجّع كلاسّات Tailwind حسب الثيم – نفس نمط الصفحات الحالية
 * التي تعتمد `useTheme()` من next-themes بدل الـ dark: variant.
 *
 * ملاحظة: هذا الملف كان في الأصل داخل ميزة الاستبيانات (surveyTheme.ts)
 * ونُقل إلى shared ليستفيد منه الداشبورد وبقية الميزات دون اعتماد متبادل.
 */

// ==============================
// ألوان الهوية
// ==============================
export const BRAND = {
  from: "#404293",
  to: "#2376BB",
} as const;

export const brandGradient = "bg-gradient-to-r from-[#404293] to-[#2376BB]";
export const brandGradientBr = "bg-gradient-to-br from-[#404293] to-[#2376BB]";

// ==============================
// الأسطح
// ==============================
/** اللوحة الرئيسية: زجاجية بحواف كبيرة وظل واضح */
export const panelClass = (isDark: boolean): string =>
  isDark
    ? "rounded-3xl border border-white/10 bg-[#202121]/90 shadow-xl backdrop-blur-xl"
    : "rounded-3xl border border-gray-200/70 bg-white/90 shadow-xl backdrop-blur-xl";

/** بطاقة أصغر داخل شبكة */
export const cardClass = (isDark: boolean): string =>
  isDark
    ? "rounded-2xl border border-white/10 bg-white/5"
    : "rounded-2xl border border-gray-200 bg-white shadow-sm";

/** صندوق داخلي هادئ (إحصاءة، حقل، ملخّص) */
export const softBoxClass = (isDark: boolean): string =>
  isDark
    ? "rounded-2xl border border-white/10 bg-white/5"
    : "rounded-2xl border border-gray-200 bg-gray-50";

/** حاوية فارغة متقطّعة الحواف */
export const emptyBoxClass = (isDark: boolean): string =>
  isDark
    ? "rounded-2xl border border-dashed border-white/12 bg-white/[0.03]"
    : "rounded-2xl border border-dashed border-gray-200 bg-gray-50/60";

export const dividerClass = (isDark: boolean): string =>
  isDark ? "border-white/10" : "border-gray-100";

// ==============================
// النصوص
// ==============================
export const headingClass = (isDark: boolean): string =>
  isDark ? "text-white" : "text-gray-900";

export const bodyClass = (isDark: boolean): string =>
  isDark ? "text-gray-300" : "text-gray-700";

export const mutedClass = (isDark: boolean): string =>
  isDark ? "text-gray-400" : "text-gray-500";

export const faintClass = (isDark: boolean): string =>
  isDark ? "text-gray-600" : "text-gray-400";

// ==============================
// عناصر التحكّم
// ==============================
export const fieldClass = (isDark: boolean): string =>
  `w-full rounded-xl border px-3.5 py-3 text-sm font-semibold outline-none transition-colors focus:border-[#2376BB] focus:ring-2 focus:ring-[#2376BB]/20 ${
    isDark
      ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-500"
      : "border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400"
  }`;

export const iconButtonClass = (isDark: boolean): string =>
  `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all active:scale-90 ${
    isDark
      ? "border-white/10 bg-white/5 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
      : "border-gray-200 bg-white text-gray-400 shadow-sm hover:border-[#404293]/30 hover:text-[#404293]"
  }`;

export const ghostButtonClass = (isDark: boolean): string =>
  `flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
    isDark
      ? "border-white/10 bg-white/5 text-gray-400 hover:border-[#2376BB]/40 hover:text-[#2376BB]"
      : "border-gray-200 bg-white text-gray-500 hover:border-[#404293]/30 hover:text-[#404293]"
  }`;

export const primaryButtonClass = `flex items-center justify-center gap-2 rounded-xl ${brandGradient} text-sm font-bold text-white shadow-lg shadow-[#404293]/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#404293]/35 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none`;

/** زر ضمن مجموعة اختيارات (تبويب / فلتر) */
export const segmentButtonClass = (isDark: boolean, isActive: boolean): string =>
  isActive
    ? `border-transparent ${brandGradient} text-white shadow-md shadow-[#404293]/25`
    : isDark
      ? "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200"
      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-[#404293]/30 hover:text-[#404293]";

/** مستطيل تحميل نابض */
export const skeletonClass = (isDark: boolean): string =>
  `animate-pulse rounded-2xl ${isDark ? "bg-white/5" : "bg-gray-100"}`;

// ==============================
// التنبيهات
// ==============================
export const successAlertClass = (isDark: boolean): string =>
  `flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold ${
    isDark
      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
      : "border-emerald-200 bg-emerald-50 text-emerald-700"
  }`;

export const errorAlertClass = (isDark: boolean): string =>
  `flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold ${
    isDark
      ? "border-red-500/25 bg-red-500/10 text-red-400"
      : "border-red-200 bg-red-50 text-red-700"
  }`;

export const infoAlertClass = (isDark: boolean): string =>
  `flex flex-wrap items-center gap-3 rounded-2xl border px-5 py-4 ${
    isDark
      ? "border-[#2376BB]/30 bg-[#2376BB]/10 text-[#7fb5e4]"
      : "border-[#404293]/20 bg-[#404293]/5 text-[#404293]"
  }`;

// ==============================
// ألوان الإبراز (بطاقات الإحصاءات والشارات)
// ==============================
export type AccentTone =
  | "brand"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "sky";

/** خلفية + لون أيقونة لكل نغمة */
export const accentIconClass = (isDark: boolean, tone: AccentTone): string => {
  const map: Record<AccentTone, { dark: string; light: string }> = {
    brand: {
      dark: "bg-[#2376BB]/15 text-[#7fb5e4]",
      light: "bg-[#404293]/10 text-[#404293]",
    },
    emerald: {
      dark: "bg-emerald-500/12 text-emerald-400",
      light: "bg-emerald-50 text-emerald-600",
    },
    amber: {
      dark: "bg-amber-500/12 text-amber-400",
      light: "bg-amber-50 text-amber-600",
    },
    rose: {
      dark: "bg-rose-500/12 text-rose-400",
      light: "bg-rose-50 text-rose-600",
    },
    violet: {
      dark: "bg-violet-500/12 text-violet-400",
      light: "bg-violet-50 text-violet-600",
    },
    sky: {
      dark: "bg-sky-500/12 text-sky-400",
      light: "bg-sky-50 text-sky-600",
    },
  };
  return isDark ? map[tone].dark : map[tone].light;
};

/** لون تعبئة الأشرطة والنقاط */
export const accentBarClass: Record<AccentTone, string> = {
  brand: "bg-[#2376BB]",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  sky: "bg-sky-500",
};
