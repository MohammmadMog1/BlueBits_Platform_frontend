/**
 * أدوات المواعيد المشتركة بين صفحات الداشبورد.
 *
 * ملاحظة i18n: هذه الوحدة **لا تنتج نصّاً مترجَماً**. تُرجع وصفاً بنيوياً
 * (مفتاح + عدد + درجة استعجال) والمكوّن يترجمه عبر `useDeadlineLabel`.
 * السبب: النصّ هنا يُقيَّم خارج شجرة React فلا يعرف اللغة الحالية، وأي نصّ
 * جاهز كان سيتجمّد على العربية. أمّا تنسيق التواريخ فمكانه `useFormatters`.
 */

export type DeadlineUrgency = "overdue" | "urgent" | "soon" | "later";

/** مفتاح الرسالة داخل `common:deadline.*` */
export type DeadlineKey = "none" | "passed" | "minutes" | "hours" | "days";

export interface DeadlineInfo {
  key: DeadlineKey;
  /** العدد المرتبط بالمفتاح (دقائق/ساعات/أيام) – 0 للمفاتيح بلا عدد */
  count: number;
  urgency: DeadlineUrgency;
  /** موجب = باقي وقت، سالب = متأخر */
  hoursLeft: number;
}

/** تحية حسب ساعة اليوم – تُرجع مفتاحاً داخل `common:greeting.*` */
export const greetingKeyByHour = (
  date: Date = new Date(),
): "morning" | "afternoon" | "evening" => {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

/**
 * يصف الوقت المتبقّي حتى موعد الإغلاق.
 * urgent = أقل من 24 ساعة، soon = أقل من 3 أيام.
 */
export const deadlineInfo = (
  iso: string,
  now: number = Date.now(),
): DeadlineInfo => {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) {
    return { key: "none", count: 0, urgency: "later", hoursLeft: Infinity };
  }

  const diffMs = target - now;
  const hoursLeft = diffMs / (1000 * 60 * 60);

  if (diffMs <= 0) {
    return { key: "passed", count: 0, urgency: "overdue", hoursLeft };
  }

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) {
    return { key: "minutes", count: minutes, urgency: "urgent", hoursLeft };
  }

  const hours = Math.floor(hoursLeft);
  if (hours < 24) {
    return { key: "hours", count: hours, urgency: "urgent", hoursLeft };
  }

  const days = Math.floor(hours / 24);
  return {
    key: "days",
    count: days,
    urgency: days <= 3 ? "soon" : "later",
    hoursLeft,
  };
};

/** كلاسّات الشارة الملوّنة حسب درجة الاستعجال */
export const urgencyBadgeClass = (
  isDark: boolean,
  urgency: DeadlineUrgency,
): string => {
  switch (urgency) {
    case "overdue":
      return isDark
        ? "bg-red-500/10 text-red-400"
        : "bg-red-50 text-red-600";
    case "urgent":
      return isDark
        ? "bg-orange-500/10 text-orange-400"
        : "bg-orange-50 text-orange-600";
    case "soon":
      return isDark
        ? "bg-amber-500/10 text-amber-400"
        : "bg-amber-50 text-amber-600";
    default:
      return isDark
        ? "bg-emerald-500/10 text-emerald-400"
        : "bg-emerald-50 text-emerald-600";
  }
};
