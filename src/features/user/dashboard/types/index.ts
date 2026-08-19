import type { Announcement } from "../../../admin/announcements/types";
import type { LecturePopulated } from "../../Lectures/types";
import type { SurveyForm } from "../../../admin/surveys/types";

export type DeadlineSource = "personal" | "academic";

/** عنصر موحّد في قائمة "أقرب المواعيد" — يجمع المهام الشخصية والأكاديمية */
export interface DeadlineItem {
  id: string;
  title: string;
  /** المادة للمهام الأكاديمية، أو وصف مختصر للشخصية */
  subtitle: string;
  dueDate: string;
  source: DeadlineSource;
  to: string;
}

export interface TasksSummary {
  personalTotal: number;
  personalDone: number;
  personalOverdue: number;
  academicOpen: number;
  academicTotal: number;
  /** إجمالي المنجز من إجمالي المهام (0..100) */
  progress: number;
}

export interface SurveyInvite {
  form: SurveyForm | null;
  alreadySubmitted: boolean;
  /** يظهر النداء فقط عند وجود فورم مفتوح لم يُجب عليه */
  shouldPrompt: boolean;
}

export interface UserDashboardState {
  studentName: string;
  yearName: string;
  tasks: TasksSummary;
  upcoming: DeadlineItem[];
  latestLectures: LecturePopulated[];
  announcements: Announcement[];
  survey: SurveyInvite;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refresh: () => void;
}
