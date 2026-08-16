export interface Subject {
  _id: string;
  name: string;
  description?: string;
  createdBy?: string;
  yearId: string;
  semesterId: string;
}

export interface SubjectFormData {
  name: string;
  description: string;
  yearId: string;
  semesterId: string;
}

export interface CreateSubjectPayload extends SubjectFormData {
  createdBy: string;
}

import type { LectureType } from "../../lectures/types";

export interface UpdateSubjectPayload {
  id: string;
  data: Partial<SubjectFormData>;
}

export interface SubjectsQuery {
  yearId?: string;
  semesterId?: string;
  type?: LectureType;
}

export interface SubjectListResponse {
  data?: Subject[];
  subjects?: Subject[];
}

export type SubjectResponse = Subject | { data?: Subject };
