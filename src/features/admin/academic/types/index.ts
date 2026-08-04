export interface AcademicYear {
  _id: string;
  name: string;
  order?: number | string;
}

export interface Semester {
  _id: string;
  name: string;
}

export interface CreateYearPayload {
  name: string;
  order?: number;
}

export interface UpdateAcademicPayload {
  id: string;
  name: string;
}

export interface AcademicListResponse<T> {
  data?: T[];
  years?: T[];
  semesters?: T[];
}

export type AcademicResponse<T> = T | { data?: T };
