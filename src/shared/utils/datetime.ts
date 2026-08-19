/**
 * أدوات التاريخ المشتركة بين صفحات الداشبورد.
 * (للماضي: `timeAgoArabic` في ميزة التفاعلات — هذه الأدوات للمواعيد القادمة والعناوين)
 */

const arabicCount = (
  count: number,
  singular: string,
  dual: string,
  plural: string,
): string => {
  if (count === 1) return singular;
  if (count === 2) return dual;
  if (count >= 3 && count <= 10) return `${count} ${plural}`;
  return `${count} ${singular}`;
};

/** "الثلاثاء، 19 أغسطس 2026" */
export const formatFullDate = (value: Date | string = new Date()): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/** "19 أغسطس" — للقوائم المختصرة */
export const formatShortDate = (value: Date | string): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
};

/** تحية حسب ساعة اليوم */
export const greetingByHour = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 12) return "صباح الخير";
  if (hour < 17) return "طاب يومك";
  return "مساء الخير";
};

export type DeadlineUrgency = "overdue" | "urgent" | "soon" | "later";

export interface DeadlineInfo {
  /** "متبقٍ 3 أيام" أو "انتهى الموعد" */
  label: string;
  urgency: DeadlineUrgency;
  /** موجب = باقي وقت، سالب = متأخر */
  hoursLeft: number;
}

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
    return { label: "بدون موعد", urgency: "later", hoursLeft: Infinity };
  }

  const diffMs = target - now;
  const hoursLeft = diffMs / (1000 * 60 * 60);

  if (diffMs <= 0) {
    return { label: "انتهى الموعد", urgency: "overdue", hoursLeft };
  }

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 60) {
    return {
      label: `متبقٍ ${arabicCount(minutes, "دقيقة", "دقيقتان", "دقائق")}`,
      urgency: "urgent",
      hoursLeft,
    };
  }

  const hours = Math.floor(hoursLeft);
  if (hours < 24) {
    return {
      label: `متبقٍ ${arabicCount(hours, "ساعة", "ساعتان", "ساعات")}`,
      urgency: "urgent",
      hoursLeft,
    };
  }

  const days = Math.floor(hours / 24);
  return {
    label: `متبقٍ ${arabicCount(days, "يوم", "يومان", "أيام")}`,
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
