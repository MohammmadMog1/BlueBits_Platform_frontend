import type { Ref, SubjectStats, SubjectStatsSortKey } from "../types";

// ==============================
// حدود المدخلات
// ==============================
export const MIN_DAYS_BEFORE = 1;
export const MAX_DAYS_BEFORE = 14;
export const DEFAULT_DAYS_BEFORE = 3;

export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 5;
export const DEFAULT_DIFFICULTY = 3;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

// ==============================
// المراجع (populated أو id)
// ==============================
/** يستخرج الـ id سواء كان المرجع populated أو نصاً أو null */
export const getRefId = (ref: Ref<{ _id: string }>): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return ref._id ?? "";
};

/** يستخرج الاسم من مرجع populated، وإلا يرجّع البديل */
export const getRefName = (
  ref: Ref<{ _id: string; name?: string }>,
  fallback = "—",
): string => {
  if (!ref || typeof ref === "string") return fallback;
  return ref.name || fallback;
};

// ==============================
// التواريخ
// ==============================
/**
 * ملاحظة i18n: تنسيق التواريخ انتقل إلى `useFormatters`
 * (`formatLongDateOrDash` / `formatDateTimeOrDash`) لأنه يتبع اللغة الحالية.
 */

/** السنة الأكاديمية الافتراضية: تبدأ من سبتمبر (2026-2027) */
export const defaultAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const startYear = now.getMonth() >= 8 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
};

/** يقبل 2026-2027 فقط – الباك يخزّنها بهذه الصيغة */
export const isValidAcademicYear = (value: string): boolean => {
  const match = /^(\d{4})-(\d{4})$/.exec(value.trim());
  if (!match) return false;
  return Number(match[2]) === Number(match[1]) + 1;
};

// ==============================
// الإحصاءات
// ==============================
export const roundTo = (value: number, digits = 1): number => {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

/**
 * مقارِن الترتيب الأبجدي.
 * `undefined` = لغة المتصفّح، فيرتّب العربية والإنكليزية كلاً بقواعده.
 */
const collator = new Intl.Collator(undefined);

/** ترتيب صفوف الإحصاءات – الاسم تصاعدي والأرقام تنازلية بشكل افتراضي */
export const sortSubjectStats = (
  rows: SubjectStats[],
  key: SubjectStatsSortKey,
): SubjectStats[] => {
  const sorted = [...rows];

  if (key === "name") {
    return sorted.sort((a, b) => collator.compare(a.subjectName, b.subjectName));
  }

  const value = (row: SubjectStats): number => {
    if (key === "responses") return row.totalResponsesForSubject;
    if (key === "carrying") return row.carryingCount;
    if (key === "days") return row.avgPreferredDaysBefore;
    return row.avgDifficultyRating;
  };

  return sorted.sort((a, b) => value(b) - value(a));
};

/** نسبة الطلاب الذين أجابوا على المادة من إجمالي المجيبين على الفورم */
export const responseShare = (row: SubjectStats, total: number): number => {
  if (!total) return 0;
  return clamp(Math.round((row.totalResponsesForSubject / total) * 100), 0, 100);
};

// ==============================
// الأخطاء
// ==============================
/** رسالة الخطأ – المصدر الموحّد الآن `shared/i18n/useErrorMessage` */
export { serverMessage } from "../../../../shared/utils/apiError";
