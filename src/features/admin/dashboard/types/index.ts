import type { AcademicTask } from "../../tasks";
import type { Announcement } from "../../announcements/types";
import type { SurveyForm } from "../../surveys/types";
import type { UserRole } from "../../../users/types";

/**
 * توزيع المستخدمين على الأدوار (مرتّب تنازلياً).
 * لا يحمل تسمية جاهزة – المكوّن يترجم `role` عبر `admin:roles.*`.
 */
export interface RoleBreakdownItem {
  role: UserRole;
  count: number;
  /** النسبة من إجمالي المستخدمين (0..100) */
  percentage: number;
}

/** أكثر المواد امتلاءً بالمحاضرات */
export interface SubjectLoadItem {
  subjectId: string;
  subjectName: string;
  totalLectures: number;
  theoreticalCount: number;
  practicalCount: number;
  /** النسبة من أعلى مادة (0..100) — لعرض الشريط */
  percentage: number;
}

export interface UsersMetrics {
  total: number;
  verified: number;
  unverified: number;
  /** نسبة التفعيل (0..100) */
  verifiedRate: number;
  /** المسجّلون خلال آخر 7 أيام */
  joinedLastWeek: number;
  breakdown: RoleBreakdownItem[];
}

export interface ContentMetrics {
  subjects: number;
  years: number;
  lectures: number;
  theoretical: number;
  practical: number;
  topSubjects: SubjectLoadItem[];
}

export interface TasksMetrics {
  total: number;
  open: number;
  closed: number;
  /** المهام المفتوحة الأقرب إغلاقاً */
  closingSoon: AcademicTask[];
}

export interface SurveysMetrics {
  total: number;
  open: number;
  draft: number;
  closed: number;
  /** أحدث فورم مفتوح — أو null */
  activeForm: SurveyForm | null;
}

export interface AdminDashboardData {
  users: UsersMetrics;
  content: ContentMetrics;
  tasks: TasksMetrics;
  surveys: SurveysMetrics;
  latestAnnouncements: Announcement[];
}

export interface AdminDashboardState extends AdminDashboardData {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refresh: () => void;
}
