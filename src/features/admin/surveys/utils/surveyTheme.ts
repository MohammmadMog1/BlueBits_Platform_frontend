import { Flame, Meh, Skull, Smile, Zap } from "lucide-react";
import type { SurveyFormStatus } from "../types";

/**
 * الجزء العام من اللغة البصرية انتقل إلى `shared/utils/theme`
 * (يستخدمه الداشبورد وبقية الميزات). نعيد تصديره هنا حتى تبقى
 * استيرادات صفحات الاستبيان الحالية تعمل كما هي.
 */
export * from "../../../../shared/utils/theme";

// ==============================
// شارات حالة الفورم
// ==============================
/**
 * ملاحظة i18n: نُرجع مفتاح ترجمة لا نصّاً – الوحدة تُقيَّم مرّة واحدة عند
 * التحميل فلا تعرف اللغة الحالية، والمكوّن يترجم المفتاح عند العرض.
 * المفاتيح بلا بادئة لأنها تُستهلك داخل namespace `admin` حصراً.
 */
export const STATUS_LABEL_KEYS = {
  draft: "surveyStatus.draft",
  open: "surveyStatus.open",
  closed: "surveyStatus.closed",
} as const satisfies Record<SurveyFormStatus, string>;

export type StatusLabelKey =
  (typeof STATUS_LABEL_KEYS)[keyof typeof STATUS_LABEL_KEYS];

export const statusLabelKey = (status: SurveyFormStatus): StatusLabelKey =>
  STATUS_LABEL_KEYS[status] ?? STATUS_LABEL_KEYS.draft;

export const statusBadgeClass = (
  isDark: boolean,
  status: SurveyFormStatus,
): { badge: string; dot: string; labelKey: StatusLabelKey } => {
  if (status === "open") {
    return {
      labelKey: STATUS_LABEL_KEYS.open,
      dot: "bg-emerald-500",
      badge: isDark
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
        : "border-emerald-200 bg-emerald-50 text-emerald-600",
    };
  }
  if (status === "closed") {
    return {
      labelKey: STATUS_LABEL_KEYS.closed,
      dot: "bg-red-500",
      badge: isDark
        ? "border-red-500/30 bg-red-500/10 text-red-400"
        : "border-red-200 bg-red-50 text-red-600",
    };
  }
  return {
    labelKey: STATUS_LABEL_KEYS.draft,
    dot: "bg-gray-400",
    badge: isDark
      ? "border-white/12 bg-white/5 text-gray-400"
      : "border-gray-200 bg-gray-50 text-gray-500",
  };
};

// ==============================
// سلّم الصعوبة (1..5)
// ==============================
export interface DifficultyLevel {
  value: number;
  /** مفتاح داخل `admin:difficulty.*` – انظر ملاحظة i18n أعلاه */
  labelKey: `difficulty.${1 | 2 | 3 | 4 | 5}`;
  icon: typeof Smile;
  /** الزر النشط */
  active: string;
  /** الشارة الهادئة (للعرض فقط) */
  chip: (isDark: boolean) => string;
  /** الشريط الملوّن */
  bar: string;
}

export const DIFFICULTY_SCALE: DifficultyLevel[] = [
  {
    value: 1,
    labelKey: "difficulty.1",
    icon: Smile,
    active: "bg-emerald-500 text-white shadow-emerald-500/30",
    chip: (isDark) =>
      isDark
        ? "bg-emerald-500/10 text-emerald-400"
        : "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-500",
  },
  {
    value: 2,
    labelKey: "difficulty.2",
    icon: Meh,
    active: "bg-teal-500 text-white shadow-teal-500/30",
    chip: (isDark) =>
      isDark ? "bg-teal-500/10 text-teal-400" : "bg-teal-50 text-teal-600",
    bar: "bg-teal-500",
  },
  {
    value: 3,
    labelKey: "difficulty.3",
    icon: Zap,
    active: "bg-amber-500 text-white shadow-amber-500/30",
    chip: (isDark) =>
      isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600",
    bar: "bg-amber-500",
  },
  {
    value: 4,
    labelKey: "difficulty.4",
    icon: Flame,
    active: "bg-orange-500 text-white shadow-orange-500/30",
    chip: (isDark) =>
      isDark
        ? "bg-orange-500/10 text-orange-400"
        : "bg-orange-50 text-orange-600",
    bar: "bg-orange-500",
  },
  {
    value: 5,
    labelKey: "difficulty.5",
    icon: Skull,
    active: "bg-red-500 text-white shadow-red-500/30",
    chip: (isDark) =>
      isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600",
    bar: "bg-red-500",
  },
];

/** أقرب مستوى للمتوسّط العشري القادم من الإحصاءات */
export const difficultyLevel = (value: number): DifficultyLevel =>
  DIFFICULTY_SCALE[Math.min(Math.max(Math.round(value), 1), 5) - 1];
