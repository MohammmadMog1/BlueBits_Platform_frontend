// src/shared/i18n/useLanguage.ts
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  LANGUAGES,
  SUPPORTED_LANGUAGES,
  getDirection,
  normalizeLanguage,
  type AppLanguage,
  type Direction,
} from "./config";

interface UseLanguageResult {
  /** اللغة الحالية مُطبَّعة دائماً إلى لغة مدعومة */
  language: AppLanguage;
  direction: Direction;
  isRTL: boolean;
  /** وسم BCP-47 للاستخدام مع Intl.* */
  locale: string;
  languages: typeof LANGUAGES;
  supportedLanguages: readonly AppLanguage[];
  changeLanguage: (next: AppLanguage) => Promise<void>;
  /** يبدّل بين اللغتين – مفيد لزر تبديل ثنائي */
  toggleLanguage: () => Promise<void>;
}

/**
 * نقطة الوصول الوحيدة لحالة اللغة والاتجاه.
 * المكوّنات لا تقرأ `document.dir` ولا `i18n.language` مباشرةً.
 */
export function useLanguage(): UseLanguageResult {
  const { i18n } = useTranslation();

  const language = normalizeLanguage(i18n.language);
  const direction = getDirection(language);

  const changeLanguage = useCallback(
    async (next: AppLanguage) => {
      if (next === language) return;
      await i18n.changeLanguage(next);
    },
    [i18n, language]
  );

  const toggleLanguage = useCallback(async () => {
    const currentIndex = SUPPORTED_LANGUAGES.indexOf(language);
    const next = SUPPORTED_LANGUAGES[(currentIndex + 1) % SUPPORTED_LANGUAGES.length];
    await i18n.changeLanguage(next);
  }, [i18n, language]);

  return useMemo(
    () => ({
      language,
      direction,
      isRTL: direction === "rtl",
      locale: LANGUAGES[language].locale,
      languages: LANGUAGES,
      supportedLanguages: SUPPORTED_LANGUAGES,
      changeLanguage,
      toggleLanguage,
    }),
    [language, direction, changeLanguage, toggleLanguage]
  );
}

/** اختصار عندما تحتاج الاتجاه فقط (مثلاً لقلب أيقونة سهم) */
export function useDirection(): Direction {
  return useLanguage().direction;
}
