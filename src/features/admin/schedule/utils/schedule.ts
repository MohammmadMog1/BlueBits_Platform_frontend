import type {
  DayGroup,
  FixedSubjectRow,
  Ref,
  SubjectConfigRow,
  SubjectGroup,
  SubjectGroupIndex,
  TimetableEntry,
} from "../types";

const DAY_MS = 86_400_000;
/** سقف أمان حتى لا تدور الحلقة على مدى تواريخ غير منطقي */
const MAX_RANGE_DAYS = 730;

/**
 * أرقام أيام الأسبوع كما يفهمها `Date.getUTCDay` (0 = الأحد).
 * الأسماء تُشتقّ من `Intl` عبر `useWeekdayNames` فتتبع اللغة الحالية.
 */
export const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6] as const;

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

/**
 * رقم اليوم في الأسبوع من تاريخ YYYY-MM-DD، أو `null` للتاريخ غير الصالح.
 * التسمية تُشتقّ في `useScheduleDates` لأنها تتبع اللغة.
 */
export const dayOfWeekIndex = (day: string): number | null => {
  const time = Date.parse(`${toDateInputValue(day)}T00:00:00Z`);
  if (Number.isNaN(time)) return null;
  return new Date(time).getUTCDay();
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

/**
 * subjectId → عضويته في غروب اختياري، مبنية من غروبات فصل معيّن.
 * تُستخدم لتمييز الفترات التي تحوي أكثر من مادة اختيارية بنفس الغروب
 * (تداخل متوقّع ومقصود) عن التصادمات الفعلية.
 */
export const buildSubjectGroupIndex = (groups: SubjectGroup[]): SubjectGroupIndex => {
  const index: SubjectGroupIndex = new Map();
  groups.forEach((group) => {
    (group.subjects ?? []).forEach((subject) => {
      index.set(subject._id, { groupId: group._id, groupName: group.name });
    });
  });
  return index;
};

/** هل كل مواد هذه الفترة تتبع نفس الغروب الاختياري؟ (تداخل متوقع، ليس تصادماً) */
export const isExpectedGroupOverlap = (
  entries: { subjectId: string }[],
  groupIndex: SubjectGroupIndex,
): boolean => {
  if (entries.length < 2) return false;
  const groupIds = entries.map((entry) => groupIndex.get(entry.subjectId)?.groupId);
  const first = groupIds[0];
  return Boolean(first) && groupIds.every((id) => id === first);
};

/**
 * عدد الفترات التي تحوي أكثر من مادة – أي تصادم فعلي.
 * الفترات التي تحوي فقط مواد اختيارية من نفس الغروب لا تُحتسب تصادماً
 * (يُمرَّر `groupIndex` عند توفّره).
 */
export const countClashes = (days: DayGroup[], groupIndex?: SubjectGroupIndex): number =>
  days.reduce(
    (total, day) =>
      total +
      day.slots.filter(
        (slot) =>
          slot.entries.length > 1 &&
          !(groupIndex && isExpectedGroupOverlap(slot.entries, groupIndex)),
      ).length,
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

let fixedRowSeq = 0;

/** صف مادة مثبّتة جديد في النموذج – الـ key يبقى ثابتاً لتستقر قائمة React */
export const createFixedSubjectRow = (
  overrides: Partial<Omit<FixedSubjectRow, "key">> = {},
): FixedSubjectRow => ({
  key: `fixed-row-${(fixedRowSeq += 1)}`,
  subjectId: "",
  examDate: "",
  timeslot: "1",
  ...overrides,
});

/** السنة الأكاديمية الافتراضية: تبدأ من سبتمبر (2025-2026) */
export const defaultAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const startYear = now.getMonth() >= 8 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
};

/** رسالة الخطأ – المصدر الموحّد الآن `shared/i18n/useErrorMessage` */
export { serverMessage } from "../../../../shared/utils/apiError";

/** أدوات تصدير CSV – المصدر الموحّد الآن `shared/utils/csv` */
export { csvEscape, downloadTextFile, rowsToCsv } from "../../../../shared/utils/csv";
