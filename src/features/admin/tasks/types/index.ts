export type { LectureType } from "../../lectures/types";

export type AcademicTaskStatus = "open" | "closed";

export interface PopulatedYear {
  _id: string;
  name: string;
  order?: number | string;
}

export interface PopulatedSemester {
  _id: string;
  name: string;
}

export interface PopulatedSubject {
  _id: string;
  name: string;
  yearId?: PopulatedYear;
  semesterId?: PopulatedSemester;
  createdBy?: string | null;
}

export interface PopulatedLectureUser {
  _id: string;
  name: string;
  email: string;
}

export interface PopulatedLecture {
  _id: string;
  title: string;
  subjectId?: PopulatedSubject;
  uploadedBy?: PopulatedLectureUser;
}

export interface PopulatedCreatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface AcademicTask {
  _id: string;
  title: string;
  description: string;
  yearId: PopulatedYear;
  subjectId: PopulatedSubject;
  lectureId: PopulatedLecture;
  createdBy: PopulatedCreatedBy;
  durationDays: number;
  durationHours: number;
  durationMinutes: number;
  status: AcademicTaskStatus;
  opensAt: string;
  closesAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicTaskFormData {
  title: string;
  description: string;
  yearId: string;
  subjectId: string;
  lectureId: string;
  durationDays: number;
  durationHours: number;
  durationMinutes: number;
}

export type CreateAcademicTaskPayload = AcademicTaskFormData;

export interface UpdateAcademicTaskPayload {
  id: string;
  data: Partial<AcademicTaskFormData>;
}

export interface LectureOption {
  _id: string;
  title: string;
}

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface SubmissionUser {
  _id: string;
  name: string;
  email: string;
}

export interface TaskSubmission {
  _id: string;
  taskId: string;
  userId: SubmissionUser;
  fileUrl: string;
  fileType: string;
  publicId: string;
  note: string;
  status: SubmissionStatus;
  reviewNote?: string | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitSolutionPayload {
  taskId: string;
  formData: FormData;
}

export interface ReviewSubmissionPayload {
  id: string;
  status: Extract<SubmissionStatus, "approved" | "rejected">;
  reviewNote?: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}
