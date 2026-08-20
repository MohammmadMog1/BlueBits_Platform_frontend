import { useMemo } from "react";
import { useLanguage } from "../../../../shared/i18n/useLanguage";
import { dayOfWeekIndex, toDateInputValue } from "../utils/schedule";

/**
 * تنسيق تواريخ الجدول بلغة الواجهة الحالية.
 *
 * كل التواريخ هنا أيام تقويمية (YYYY-MM-DD) لا لحظات زمنية، لذا نثبّت
 * `timeZone: "UTC"` – وإلا أزاحت المنطقة الزمنية اليوم المعروض بيوم كامل.
 */
export function useScheduleDates() {
  const { locale } = useLanguage();

  return useMemo(() => {
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });

    const weekdayFormatter = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      timeZone: "UTC",
    });

    /** أسماء أيام الأسبوع مرتّبة من الأحد (0) إلى السبت (6) */
    const weekdayNames = Array.from({ length: 7 }, (_, index) =>
      // 2024-01-07 يوم أحد – نستخدمه مرجعاً ثابتاً لتوليد بقية الأيام
      weekdayFormatter.format(new Date(Date.UTC(2024, 0, 7 + index))),
    );

    return {
      weekdayNames,

      /** 2026-08-17 → "17 أغسطس 2026" / "17 August 2026" */
      formatDate: (value?: string | null): string => {
        const day = toDateInputValue(value);
        if (!day) return "—";
        const time = Date.parse(`${day}T00:00:00Z`);
        if (Number.isNaN(time)) return day;
        return dateFormatter.format(new Date(time));
      },

      /** اسم اليوم من تاريخ YYYY-MM-DD */
      dayOfWeekLabel: (day: string): string => {
        const index = dayOfWeekIndex(day);
        return index === null ? "" : weekdayNames[index];
      },
    };
  }, [locale]);
}
