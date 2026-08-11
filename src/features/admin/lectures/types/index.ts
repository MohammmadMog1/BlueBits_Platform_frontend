export type LectureType = "theoretical" | "practical";

export interface Lecture {
  _id: string;
  title: string;
  description?: string;
  yearId: string;
  semesterId: string;
  subjectId: string;
  type: LectureType;
  isPublished?: boolean;
  fileUrl?: string;
  downloads?: number;
  views?: number;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LectureFilters {
  yearId: string;
  semesterId: string;
  subjectId: string;
  type: LectureType;
}

export interface LectureUploadPayload {
  title: string;
  description?: string;
  file: File;
  yearId: string;
  semesterId: string;
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
