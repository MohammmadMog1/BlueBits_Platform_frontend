// src/shared/i18n/config.ts
/**
 * المصدر الوحيد للحقيقة بخصوص اللغات المدعومة واتجاهها.
 * أي لغة جديدة تُضاف هنا فقط، وبقية النظام يتبعها تلقائياً.
 */

export const SUPPORTED_LANGUAGES = ["ar", "en"] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export type Direction = "rtl" | "ltr";

export const DEFAULT_LANGUAGE: AppLanguage = "ar";

/** المفتاح المستخدم في localStorage – مشترك بين i18next وسكربت الإقلاع في index.html */
export const LANGUAGE_STORAGE_KEY = "bluebits.lang";

interface LanguageMeta {
  /** الاسم بلغته الأصلية (endonym) – الممارسة الصحيحة في مبدّلات اللغة */
  nativeName: string;
  /** الاسم بالإنكليزية لأغراض aria-label */
  englishName: string;
  dir: Direction;
  /** وسم BCP-47 الكامل لاستخدامه مع Intl */
  locale: string;
}

/**
 * نظام الأرقام في العربية.
 *
 * "latn" = أرقام لاتينية (0-9)، "arab" = أرقام هندية (٠-٩).
 * الافتراضي `latn` لأن الواجهة تخلط الأرقام مع نصوص لاتينية (BlueBits، أسماء
 * المواد) وشارات إحصائية مصمّمة بعرض أرقام لاتينية. لتغييره: بدّل هذا الثابت
 * فقط – كل دوال التنسيق تتبعه.
 */
export const ARABIC_NUMERALS: "latn" | "arab" = "latn";

export const LANGUAGES: Record<AppLanguage, LanguageMeta> = {
  ar: {
    nativeName: "العربية",
    englishName: "Arabic",
    dir: "rtl",
    locale: `ar-u-nu-${ARABIC_NUMERALS}`,
  },
  en: { nativeName: "English", englishName: "English", dir: "ltr", locale: "en" },
};

/** تتحقّق أن القيمة لغة مدعومة (تُستخدم لتنقية المدخلات من localStorage والـ URL) */
export function isSupportedLanguage(value: unknown): value is AppLanguage {
  return (
    typeof value === "string" &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
  );
}

/**
 * ترجّع اتجاه اللغة. تقبل أيضاً وسوماً مركّبة مثل "ar-SY" أو "en-US"
 * لأن كاشف اللغة قد يعيد وسم المتصفّح الكامل.
 */
export function getDirection(language: string | undefined): Direction {
  const base = (language ?? DEFAULT_LANGUAGE).split("-")[0];
  return isSupportedLanguage(base) ? LANGUAGES[base].dir : LANGUAGES[DEFAULT_LANGUAGE].dir;
}

/** تُرجع لغة مدعومة دائماً – تُطبّع "ar-SY" إلى "ar" وتُرجع الافتراضي عند الفشل */
export function normalizeLanguage(language: string | undefined): AppLanguage {
  const base = (language ?? "").split("-")[0];
  return isSupportedLanguage(base) ? base : DEFAULT_LANGUAGE;
}
