export interface PopulatedLecturerRef {
  _id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * الشكل الفعلي غير موحّد بين الـ endpoints: `/subjects` (الأدمن) يُرجع كائنات
 * محاضر كاملة، بينما `/subjects/my-subjects` (الدكتور) يُرجع معرّفات نصّية فقط.
 */
export type LecturerRef = string | PopulatedLecturerRef;

export interface Subject {
  _id: string;
  name: string;
  description?: string;
  createdBy?: string;
  yearId: string;
  semesterId: string;
  lecturerIds?: LecturerRef[];
}

/** يستخرج معرّف المحاضر النصّي مهما كان الشكل (نصّ أو كائن محاضر مُعبَّأ) */
export const getLecturerRefId = (ref: LecturerRef): string =>
  typeof ref === "string" ? ref : ref._id;

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

export interface AssignLecturerPayload {
  subjectId: string;
  lecturerId: string;
}

// ==============================
// my-subjects (populated yearId/semesterId, doctor-facing)
// ==============================
export interface MySubjectYear {
  _id: string;
  name: string;
  order: number;
}

export interface MySubjectSemester {
  _id: string;
  name: string;
}

export interface MySubject {
  _id: string;
  name: string;
  yearId: MySubjectYear | null;
  semesterId: MySubjectSemester | null;
  description?: string;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  lecturerIds: string[];
}
