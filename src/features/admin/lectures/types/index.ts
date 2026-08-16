// ==============================
// Generic API envelope
// ==============================
export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export type LectureType = "theoretical" | "practical";

// ==============================
// Populated reference shapes
// ==============================
export interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

export interface PopulatedYear {
  _id: string;
  name: string;
  order: number;
}

export interface PopulatedSubject {
  _id: string;
  name: string;
  yearId: PopulatedYear | null;
  semesterId: string | null;
  createdBy: PopulatedUser | null;
}

// ==============================
// Lecture
// ==============================
export interface Lecture {
  _id: string;
  title: string;
  description?: string;
  subjectId: string;
  type: LectureType;
  uploadedBy: string;
  isPublished: boolean;
  fileUrl: string;
  publicId: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export interface LecturePopulated
  extends Omit<Lecture, "subjectId" | "uploadedBy"> {
  subjectId: PopulatedSubject;
  uploadedBy: PopulatedUser;
}

// ==============================
// Request payloads
// ==============================
export interface LectureUploadPayload {
  title: string;
  description?: string;
  file: File;
  subjectId: string;
  type: LectureType;
  isPublished?: boolean;
}

export interface LectureUpdatePayload {
  id: string;
  data: Partial<
    Pick<Lecture, "title" | "description" | "isPublished"> & {
      lecture?: File;
    }
  >;
}

export interface LectureFiltersByType {
  subjectId: string;
  type: LectureType;
}

export interface LectureFiltersFull {
  yearId: string;
  semesterId: string;
  subjectId: string;
  type: LectureType;
}

// Union Type ليشمل جميع حالات الفلترة
export type LectureFilters = LectureFiltersByType | LectureFiltersFull;

// ==============================
// Response shapes (per endpoint)
// ==============================
export type UploadLectureResponse = ApiResponse<Lecture>;
export type DeleteLectureResponse = ApiResponse<null>;
export type UpdateLectureResponse = ApiResponse<LecturePopulated>;
export type GetLectureResponse = ApiResponse<LecturePopulated>;
export type GetAllLecturesResponse = ApiResponse<LecturePopulated[]>;

export interface LectureDownloadInfo {
  downloadUrl: string;
  title: string;
  fileType: string;
  fileSize: number;
}
export type DownloadLectureResponse = ApiResponse<LectureDownloadInfo>;

export interface LectureSubjectStats {
  totalLectures: number;
  theoreticalCount: number;
  practicalCount: number;
  subjectId: string;
  subjectName: string;
}
export type LecturesCountPerSubjectResponse = ApiResponse<LectureSubjectStats[]>;

export interface LecturesByTypeData {
  count: number;
  lectures: LecturePopulated[];
}
export type LecturesByTypeResponse = ApiResponse<LecturesByTypeData>;

export interface LecturesByYearSemesterSubjectTypeData {
  count: number;
  type: LectureType;
  lectures: LecturePopulated[];
}
export type LecturesByYearSemesterSubjectTypeResponse =
  ApiResponse<LecturesByYearSemesterSubjectTypeData>;