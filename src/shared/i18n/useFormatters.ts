// src/shared/i18n/useFormatters.ts
import { useMemo } from "react";
import { useLanguage } from "./useLanguage";

/**
 * تنسيق الأرقام والتواريخ حسب اللغة الحالية عبر واجهة `Intl` المدمجة.
 *
 * لماذا لا نكتب هذه يدوياً؟ لأن `Intl` تتكفّل بترتيب اليوم/الشهر، وأسماء
 * الأشهر، وفواصل الآلاف، وصيغ الجمع العربية الست – وكلّها تختلف بين ar و en.
 * الكائنات مُخزَّنة بـ useMemo لأن إنشاء `Intl.DateTimeFormat` مكلف نسبياً.
 */
export function useFormatters() {
  const { locale } = useLanguage();

  return useMemo(() => {
    const fullDate = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const shortDate = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
    });

    const dateTime = new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const time = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });

    const number = new Intl.NumberFormat(locale);

    const percent = new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    });

    const relative = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    const toDate = (value: Date | string | number): Date | null => {
      const date = value instanceof Date ? value : new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const longDate = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const mediumDate = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const safe =
      (formatter: Intl.DateTimeFormat, fallback = "") =>
      (value: Date | string | number | null | undefined): string => {
        if (value === null || value === undefined || value === "") return fallback;
        const date = toDate(value);
        return date ? formatter.format(date) : fallback;
      };

    return {
      locale,

      /** "الثلاثاء، 19 أغسطس 2026" / "Tuesday, August 19, 2026" */
      formatFullDate: safe(fullDate),
      /** "19 أغسطس" / "Aug 19" */
      formatShortDate: safe(shortDate),
      /** تاريخ + وقت */
      formatDateTime: safe(dateTime),
      /** "14:30" */
      formatTime: safe(time),

      /**
       * صيغ تعرض "—" بدل فراغ عند غياب القيمة – تُستخدم في الجداول
       * ولوحات الإدارة حيث الخانة الفارغة تبدو خطأً في العرض.
       */
      formatLongDateOrDash: safe(longDate, "—"),
      formatDateTimeOrDash: safe(dateTime, "—"),
      /** "19 Aug 2026" / "19 أغسطس 2026" مع "—" عند غياب القيمة */
      formatMediumDateOrDash: safe(mediumDate, "—"),

      formatNumber: (value: number) => number.format(value),
      /** يتوقّع كسراً: 0.75 -> "75%" */
      formatPercent: (value: number) => percent.format(value),

      /**
       * "منذ 3 أيام" / "3 days ago" – تختار أكبر وحدة مناسبة تلقائياً.
       * القيمة السالبة = الماضي، الموجبة = المستقبل.
       */
      formatRelative: (value: Date | string | number): string => {
        const date = toDate(value);
        if (!date) return "";

        const diffSeconds = (date.getTime() - Date.now()) / 1000;
        const units: [Intl.RelativeTimeFormatUnit, number][] = [
          ["year", 60 * 60 * 24 * 365],
          ["month", 60 * 60 * 24 * 30],
          ["week", 60 * 60 * 24 * 7],
          ["day", 60 * 60 * 24],
          ["hour", 60 * 60],
          ["minute", 60],
          ["second", 1],
        ];

        for (const [unit, seconds] of units) {
          if (Math.abs(diffSeconds) >= seconds || unit === "second") {
            return relative.format(Math.round(diffSeconds / seconds), unit);
          }
        }
        return "";
      },
    };
  }, [locale]);
}
