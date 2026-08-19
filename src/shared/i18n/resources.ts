// src/shared/i18n/resources.ts
import type { Resource } from "i18next";
import { SUPPORTED_LANGUAGES, type AppLanguage, isSupportedLanguage } from "./config";

/**
 * تجميع تلقائي لكل ملفات الترجمة عبر `import.meta.glob` من Vite.
 *
 * لماذا هذا الأسلوب؟ لأن إضافة namespace جديد (مثلاً `locales/ar/lectures.json`)
 * تصبح مجرّد إنشاء ملف – بدون أي تعديل على ملفات الإعداد. هذا يمنع الخطأ
 * الأشيع في مشاريع i18n: ملف ترجمة موجود لكنه غير مسجَّل فيظهر المفتاح خاماً.
 *
 * المسار المتوقّع: ./locales/{lang}/{namespace}.json
 */
const modules = import.meta.glob<Record<string, unknown>>("./locales/*/*.json", {
  eager: true,
  import: "default",
});

function buildResources(): Resource {
  const resources: Resource = {};

  for (const [path, translations] of Object.entries(modules)) {
    // "./locales/ar/common.json" -> ["ar", "common"]
    const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
    if (!match) continue;

    const [, language, namespace] = match;
    if (!isSupportedLanguage(language)) {
      // ملف بلغة غير مُعلَنة في SUPPORTED_LANGUAGES – نتجاهله بدل تحميله صامتاً
      if (import.meta.env.DEV) {
        console.warn(
          `[i18n] تم تجاهل "${path}" – اللغة "${language}" غير مُدرجة في SUPPORTED_LANGUAGES.`
        );
      }
      continue;
    }

    resources[language] ??= {};
    resources[language][namespace] = translations;
  }

  return resources;
}

export const resources = buildResources();

/** كل الـ namespaces المكتشفة – مشتقّة من اللغة الافتراضية باعتبارها المرجع */
export const namespaces = Object.keys(resources[SUPPORTED_LANGUAGES[0]] ?? {});

/**
 * فحص تطويري: يبلّغ عن المفاتيح الناقصة بين اللغات.
 * يعمل في وضع التطوير فقط ولا يدخل حزمة الإنتاج.
 */
export function reportMissingKeys(): void {
  if (!import.meta.env.DEV) return;

  const flatten = (obj: unknown, prefix = ""): string[] => {
    if (typeof obj !== "object" || obj === null) return [prefix];
    return Object.entries(obj).flatMap(([key, value]) =>
      flatten(value, prefix ? `${prefix}.${key}` : key)
    );
  };

  const [reference, ...others] = SUPPORTED_LANGUAGES as readonly AppLanguage[];

  for (const namespace of namespaces) {
    const referenceKeys = new Set(flatten(resources[reference]?.[namespace]));

    for (const language of others) {
      const languageKeys = new Set(flatten(resources[language]?.[namespace]));

      const missing = [...referenceKeys].filter((key) => !languageKeys.has(key));
      const extra = [...languageKeys].filter((key) => !referenceKeys.has(key));

      if (missing.length) {
        console.warn(`[i18n] ${language}/${namespace} – مفاتيح ناقصة:`, missing);
      }
      if (extra.length) {
        console.warn(`[i18n] ${language}/${namespace} – مفاتيح زائدة:`, extra);
      }
    }
  }
}
