export interface DoctorSubjectLectureStats {
  total: number;
  published: number;
  draft: number;
}

export interface DoctorSubjectBankStats {
  total: number;
  published: number;
  draft: number;
  totalQuestions: number;
}

export interface DoctorSubjectStats {
  subjectId: string;
  subjectName: string;
  year: string | null;
  semester: string | null;
  lectures: DoctorSubjectLectureStats;
  questionBanks: DoctorSubjectBankStats;
}

export interface DoctorLectureUploadPayload {
  title: string;
  description?: string;
  subjectId: string;
  type: "theoretical" | "practical";
  isPublished?: boolean;
  file: File;
}

export interface DoctorLectureUpdatePayload {
  id: string;
  data: {
    title?: string;
    description?: string;
    isPublished?: boolean;
    lecture?: File;
  };
}
