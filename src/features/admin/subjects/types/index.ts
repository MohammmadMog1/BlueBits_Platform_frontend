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

export interface UpdateSubjectPayload {
  id: string;
  data: Partial<SubjectFormData>;
}

export interface SubjectsQuery {
  yearId?: string;
  semesterId?: string;
}

export interface SubjectListResponse {
  data?: Subject[];
  subjects?: Subject[];
}

export type SubjectResponse = Subject | { data?: Subject };
