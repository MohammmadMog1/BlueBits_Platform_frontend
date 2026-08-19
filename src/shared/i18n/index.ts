// src/shared/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  getDirection,
  normalizeLanguage,
} from "./config";
import { resources, reportMissingKeys } from "./resources";

/**
 * يزامن سمات <html> مع اللغة الحالية.
 *
 * هذا هو المصدر الوحيد لاتجاه الواجهة – لا يجوز كتابة dir="rtl" داخل المكوّنات،
 * لأن ذلك يجمّد الاتجاه ويمنع التبديل. الاستثناء الوحيد المشروع هو dir="ltr"
 * على حقل يحتوي محتوى LTR إجبارياً (بريد، رابط، كود، رقم هاتف).
 */
function syncDocumentLanguage(language: string): void {
  const normalized = normalizeLanguage(language);
  const direction = getDirection(normalized);
  const root = document.documentElement;

  root.lang = normalized;
  root.dir = direction;

  // للاستهداف من CSS/Tailwind عند الحاجة إلى قواعد خاصة بلغة بعينها
  root.dataset.lang = normalized;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    fallbackLng: DEFAULT_LANGUAGE,

    // "ar-SY" و "ar-EG" وغيرها تُعامَل كـ "ar" – وإلا فشل البحث عن الموارد
    load: "languageOnly",
    nonExplicitSupportedLngs: true,

    defaultNS: "common",
    ns: Object.keys(resources[DEFAULT_LANGUAGE] ?? {}),

    detection: {
      /**
       * الترتيب مقصود، و`navigator` مستبعَد عمداً.
       *
       * BlueBits منصّة عربية أولاً، ومعظم مستخدميها على ويندوز بلغة نظام
       * "en-US". لو اعتمدنا لغة المتصفّح لظهرت الواجهة إنكليزية لأغلبهم منذ
       * أوّل زيارة – وهو عكس المقصود. لذا: العربية افتراضياً، والإنكليزية
       * باختيار صريح من المستخدم فقط (يُحفظ بعدها في localStorage).
       *
       * لتفعيل كشف لغة المتصفّح لاحقاً – بعد اكتمال ترجمة كل الصفحات –
       * أضف "navigator" قبل "htmlTag" هنا، وأعِد سطر navigator.language
       * في سكربت الإقلاع داخل index.html ليبقى الاثنان متطابقين.
       */
      order: ["querystring", "localStorage", "htmlTag"],
      lookupQuerystring: "lang",
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
      // يمنع تخزين "en-US" خاماً – نخزّن دائماً لغة مدعومة مُطبَّعة
      convertDetectedLanguage: (lng) => normalizeLanguage(lng),
    },

    interpolation: {
      // React يهرّب الخرج أصلاً – التهريب المزدوج يفسد المحارف العربية والاقتباسات
      escapeValue: false,
    },

    returnNull: false,

    // في التطوير: أظهر تحذيراً عند غياب مفتاح بدل ابتلاعه صامتاً
    debug: false,
    saveMissing: false,
    missingKeyHandler: import.meta.env.DEV
      ? (lngs, ns, key) => {
          console.warn(`[i18n] مفتاح مفقود: ${ns}:${key} (${lngs.join(", ")})`);
        }
      : undefined,

    react: {
      useSuspense: false,
    },
  });

// المزامنة الأولى + عند كل تبديل لغة
syncDocumentLanguage(i18n.language);
i18n.on("languageChanged", syncDocumentLanguage);

if (import.meta.env.DEV) {
  reportMissingKeys();
}

export default i18n;
export * from "./config";
