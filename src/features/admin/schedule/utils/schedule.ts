import type { DayGroup, Ref, SubjectConfigRow, TimetableEntry } from "../types";

const DAY_MS = 86_400_000;
/** سقف أمان حتى لا تدور الحلقة على مدى تواريخ غير منطقي */
const MAX_RANGE_DAYS = 730;

export const DAYS_OF_WEEK = [
  { value: 0, label: "الأحد" },
  { value: 1, label: "الإثنين" },
  { value: 2, label: "الثلاثاء" },
  { value: 3, label: "الأربعاء" },
  { value: 4, label: "الخميس" },
  { value: 5, label: "الجمعة" },
  { value: 6, label: "السبت" },
] as const;

/** يستخرج الـ id سواء كان المرجع populated أو نصاً أو null */
export const getRefId = (ref: Ref<{ _id: string }>): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return ref._id ?? "";
};

/**
 * ISO → YYYY-MM-DD الصالحة لـ input[type=date].
 * نقتطع النص مباشرة بدل new Date حتى لا تُزيح المنطقة الزمنية اليوم.
 */
export const toDateInputValue = (value?: string | null): string => {
  if (!value) return "";
  return value.slice(0, 10);
};

const dateFormatter = new Intl.DateTimeFormat("ar-EG-u-ca-gregory-nu-latn", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** 2026-08-17T00:00:00.000Z → 17 أغسطس 2026 */
export const formatDate = (value?: string | null): string => {
  const day = toDateInputValue(value);
  if (!day) return "—";
  const time = Date.parse(`${day}T00:00:00Z`);
  if (Number.isNaN(time)) return day;
  return dateFormatter.format(new Date(time));
};

/** اسم اليوم من تاريخ YYYY-MM-DD */
export const dayOfWeekLabel = (day: string): string => {
  const time = Date.parse(`${toDateInputValue(day)}T00:00:00Z`);
  if (Number.isNaN(time)) return "";
  return DAYS_OF_WEEK[new Date(time).getUTCDay()].label;
};

/** كل أيام المدى (شاملاً الطرفين) بصيغة YYYY-MM-DD */
export const eachDayBetween = (start: string, end: string): string[] => {
  const startTime = Date.parse(`${toDateInputValue(start)}T00:00:00Z`);
  const endTime = Date.parse(`${toDateInputValue(end)}T00:00:00Z`);
  if (Number.isNaN(startTime) || Number.isNaN(endTime)) return [];
  if (endTime < startTime) return [];
  if (endTime - startTime > MAX_RANGE_DAYS * DAY_MS) return [];

  const days: string[] = [];
  for (let time = startTime; time <= endTime; time += DAY_MS) {
    days.push(new Date(time).toISOString().slice(0, 10));
  }
  return days;
};

export interface CapacitySummary {
  /** كل الأيام بين البداية والنهاية */
  totalDays: number;
  /** الأيام الصالحة للفحص بعد استبعاد العطل */
  examDays: number;
  /** الأيام المستبعدة بسبب يوم الأسبوع أو تاريخ محدد */
  excludedDays: number;
  /** إجمالي الفترات المتاحة = أيام الفحص × الفترات اليومية */
  totalSlots: number;
}

/** حساب سعة الجدول من المدخلات الحالية – يُستخدم للمعاينة الحية في النموذج */
export const calcCapacity = (
  startDate: string,
  endDate: string,
  excludedDaysOfWeek: number[],
  excludedDates: string[],
  timeslotsPerDay: number,
): CapacitySummary => {
  const days = eachDayBetween(startDate, endDate);
  const excludedSet = new Set(excludedDates.map(toDateInputValue));

  const examDays = days.filter((day) => {
    const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
    return !excludedDaysOfWeek.includes(weekday) && !excludedSet.has(day);
  }).length;

  const slots = Number.isFinite(timeslotsPerDay) ? Math.max(timeslotsPerDay, 0) : 0;

  return {
    totalDays: days.length,
    examDays,
    excludedDays: days.length - examDays,
    totalSlots: examDays * slots,
  };
};

/** هل التاريخ داخل مدى الامتحانات؟ (لتنبيه التواريخ المستبعدة خارج المدى) */
export const isWithinRange = (day: string, start: string, end: string): boolean => {
  const time = Date.parse(`${toDateInputValue(day)}T00:00:00Z`);
  const startTime = Date.parse(`${toDateInputValue(start)}T00:00:00Z`);
  const endTime = Date.parse(`${toDateInputValue(end)}T00:00:00Z`);
  if (Number.isNaN(time) || Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return true;
  }
  return time >= startTime && time <= endTime;
};

/** تجميع مواعيد الامتحانات حسب اليوم ثم الفترة، مرتّبة زمنياً */
export const groupTimetableByDay = (entries: TimetableEntry[]): DayGroup[] => {
  const byDay = new Map<string, Map<number, TimetableEntry[]>>();

  entries.forEach((entry) => {
    const day = toDateInputValue(entry.examDate);
    const slots = byDay.get(day) ?? new Map<number, TimetableEntry[]>();
    slots.set(entry.timeslot, [...(slots.get(entry.timeslot) ?? []), entry]);
    byDay.set(day, slots);
  });

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, slots]) => ({
      day,
      slots: [...slots.entries()]
        .sort(([a], [b]) => a - b)
        .map(([timeslot, slotEntries]) => ({ timeslot, entries: slotEntries })),
    }));
};

/**
 * أعمدة الجدول المصفوفي: 1..أكبر فترة مستخدمة.
 * نملأ الفجوات حتى تبقى الأعمدة متسقة عبر كل الأيام.
 */
export const listTimeslots = (entries: TimetableEntry[]): number[] => {
  const max = entries.reduce((top, entry) => Math.max(top, entry.timeslot), 0);
  return Array.from({ length: max }, (_, index) => index + 1);
};

/** عدد الفترات التي تحوي أكثر من مادة – أي تصادم فعلي */
export const countClashes = (days: DayGroup[]): number =>
  days.reduce(
    (total, day) => total + day.slots.filter((slot) => slot.entries.length > 1).length,
    0,
  );

let rowSeq = 0;

/** صف مادة جديد في النموذج – الـ key يبقى ثابتاً لتستقر قائمة React */
export const createSubjectRow = (
  overrides: Partial<Omit<SubjectConfigRow, "key">> = {},
): SubjectConfigRow => ({
  key: `subject-row-${(rowSeq += 1)}`,
  subjectId: "",
  carriedStudentsCount: "0",
  examDurationOverride: "120",
  ...overrides,
});

/** السنة الأكاديمية الافتراضية: تبدأ من سبتمبر (2025-2026) */
export const defaultAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const startYear = now.getMonth() >= 8 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
};

/** رسالة الخطأ القادمة من الباك (envelope فيه message) */
export const errorMessage = (
  error: unknown,
  fallback = "تعذّر تنفيذ الطلب. حاول مرة أخرى.",
): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data: unknown }).data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      return (data as { message: string }).message;
    }
  }
  return fallback;
};
