import type { LecturePopulated } from "../../../admin/lectures/types";
import type { DoctorSubjectStats } from "../../types";

export interface DoctorContentMetrics {
  subjects: number;
  lecturesTotal: number;
  lecturesPublished: number;
  lecturesDraft: number;
  banksTotal: number;
  banksPublished: number;
  banksDraft: number;
  totalQuestions: number;
}

export interface DoctorDashboardData {
  stats: DoctorSubjectStats[];
  content: DoctorContentMetrics;
  recentLectures: LecturePopulated[];
}

export interface DoctorDashboardState extends DoctorDashboardData {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refresh: () => void;
}
