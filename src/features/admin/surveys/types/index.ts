// ==============================
// Generic API envelope
// ==============================
export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}

// ==============================
// Populated reference shapes
// ==============================
export interface PopulatedYearRef {
  _id: string;
  name: string;
  order?: number;
}

export interface PopulatedSemesterRef {
  _id: string;
  name: string;
}

export interface PopulatedUserRef {
  _id: string;
  name: string;
  email?: string;
}

export interface PopulatedSubjectRef {
  _id: string;
  name: string;
  yearId?: PopulatedYearRef | string | null;
  semesterId?: PopulatedSemesterRef | string | null;
  createdBy?: PopulatedUserRef | string | null;
}

/** الـ API يرجّع المرجع أحياناً populated وأحياناً id فقط (وأحياناً null) */
export type Ref<T> = T | string | null;

// ==============================
// Survey form
// ==============================
/** draft → open → closed. الإغلاق نهائي: لا يمكن إعادة فتح فورم مغلق. */
export type SurveyFormStatus = "draft" | "open" | "closed";

export interface SurveyForm {
  _id: string;
  semesterId: Ref<PopulatedSemesterRef>;
  yearId: Ref<PopulatedYearRef>;
  academicYear: string;
  status: SurveyFormStatus;
  openedAt: string | null;
  closedAt: string | null;
  createdBy: Ref<PopulatedUserRef>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSurveyFormPayload {
  semesterId: string;
  yearId: string;
  academicYear: string;
}

/** ما يملأه الأدمن في نافذة الإنشاء */
export interface SurveyFormValues {
  yearId: string;
  semesterId: string;
  academicYear: string;
}

// ==============================
// Responses
// ==============================
export interface SubjectResponseInput {
  subjectId: string;
  isCarrying: boolean;
  /** كم يوم راحة يريد الطالب قبل امتحان هذه المادة */
  preferredDaysBefore: number;
  /** 1 = سهلة جداً ... 5 = صعبة جداً */
  difficultyRating: number;
}

export interface SubmitSurveyResponsePayload {
  formId: string;
  subjectResponses: SubjectResponseInput[];
}

export interface SubjectResponseEntry {
  subjectId: Ref<PopulatedSubjectRef>;
  isCarrying: boolean;
  preferredDaysBefore: number;
  difficultyRating: number;
}

export interface SurveyResponse {
  _id: string;
  formId: Ref<SurveyForm>;
  userId: Ref<PopulatedUserRef>;
  yearId: Ref<PopulatedYearRef>;
  semesterId: Ref<PopulatedSemesterRef>;
  subjectResponses: SubjectResponseEntry[];
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

/** GET /surveys/forms/:id/responses */
export interface FormResponsesResult {
  form: SurveyForm;
  totalResponses: number;
  responses: SurveyResponse[];
}

/** GET /surveys/forms/active – الفورم المفتوح لسنة الطالب */
export interface ActiveSurveyForm {
  form: SurveyForm | null;
  alreadySubmitted: boolean;
}

// ==============================
// Statistics
// ==============================
export interface SubjectStats {
  subjectId: string;
  subjectName: string;
  /** عدد الطلاب الذين اعتبروا المادة "حملة" */
  carryingCount: number;
  totalResponsesForSubject: number;
  avgPreferredDaysBefore: number;
  avgDifficultyRating: number;
}

export interface YearStats {
  yearId: string;
  /** موجود في all-years فقط */
  yearName?: string;
  formId: string;
  academicYear: string;
  /** موجود في stats/year/:yearId فقط */
  formStatus?: SurveyFormStatus;
  totalStudentsResponded: number;
  subjects: SubjectStats[];
}

export interface YearStatsQuery {
  yearId: string;
  /** اختياري: إحصاءات فورم بعينه بدل الفورم الحالي للسنة */
  formId?: string;
}

// ==============================
// UI state
// ==============================
/** صف إجابة داخل نموذج الطالب – الأرقام تُخزَّن كأرقام (المدخلات محكومة بأزرار) */
export interface SubjectAnswerRow {
  subjectId: string;
  subjectName: string;
  isCarrying: boolean;
  preferredDaysBefore: number;
  difficultyRating: number;
}

export type SurveyFormFilter = "all" | SurveyFormStatus;

export type StatsScope = "year" | "all";

export type SubjectStatsSortKey =
  | "name"
  | "responses"
  | "carrying"
  | "days"
  | "difficulty";
