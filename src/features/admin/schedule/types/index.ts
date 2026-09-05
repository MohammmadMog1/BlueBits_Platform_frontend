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
export interface PopulatedSemester {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PopulatedSubjectRef {
  _id: string;
  name: string;
}

/** الـ API يرجّع المرجع أحياناً populated وأحياناً id فقط (وأحياناً null) */
export type Ref<T> = T | string | null;

// ==============================
// Schedule config
// ==============================
export interface SubjectConfig {
  subjectId: Ref<PopulatedSubjectRef>;
  carriedStudentsCount: number;
  examDurationOverride: number;
}

/** مادة مثبّتة بموعد وفترة محدّدين مسبقاً – لا يُغيّرهما المولّد التلقائي */
export interface FixedSubjectConfig {
  subjectId: Ref<PopulatedSubjectRef>;
  /** ISO */
  examDate: string;
  timeslot: number;
}

export interface ScheduleConfig {
  _id: string;
  semesterId: Ref<PopulatedSemester>;
  academicYear: string;
  startDate: string;
  endDate: string;
  excludedDates: string[];
  /** 0 = الأحد ... 6 = السبت (نفس ترقيم Date.getDay) */
  excludedDaysOfWeek: number[];
  timeslotsPerDay: number;
  subjectsConfig: SubjectConfig[];
  fixedSubjects?: FixedSubjectConfig[];
  createdBy: Ref<{ _id: string; name?: string }>;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// Payloads
// ==============================
export interface SubjectConfigInput {
  subjectId: string;
  carriedStudentsCount: number;
  examDurationOverride: number;
}

export interface FixedSubjectInput {
  subjectId: string;
  /** ISO */
  examDate: string;
  timeslot: number;
}

/** ما يملأه الأدمن في النموذج – بدون الفصل (تختاره الصفحة) */
export interface ScheduleConfigFormValues {
  academicYear: string;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  /** YYYY-MM-DD[] */
  excludedDates: string[];
  excludedDaysOfWeek: number[];
  timeslotsPerDay: number;
  subjectsConfig: SubjectConfigInput[];
  fixedSubjects: FixedSubjectInput[];
}

export interface ScheduleConfigPayload extends ScheduleConfigFormValues {
  semesterId: string;
}

/**
 * صف مادة داخل النموذج: الأرقام تبقى نصوصاً أثناء الكتابة
 * (حتى لا تنقلب لـ NaN عند مسح الحقل) وتُحوَّل عند الإرسال.
 */
export interface SubjectConfigRow {
  key: string;
  subjectId: string;
  carriedStudentsCount: string;
  examDurationOverride: string;
}

/**
 * صف مادة مثبّتة داخل النموذج: نفس منطق `SubjectConfigRow` –
 * الفترة تبقى نصاً أثناء الكتابة وتُحوَّل رقماً عند الإرسال.
 */
export interface FixedSubjectRow {
  key: string;
  subjectId: string;
  /** YYYY-MM-DD */
  examDate: string;
  timeslot: string;
}

export interface UpdateScheduleConfigPayload {
  id: string;
  data: ScheduleConfigPayload;
}

export interface DeleteScheduleConfigPayload {
  id: string;
  /** لتحديث الكاش فقط – لا يُرسل للـ API */
  semesterId: string;
}

// ==============================
// Generate data (تجميع بيانات الجدولة)
// ==============================
export type ConflictType = "HARD" | "MEDIUM" | "SOFT";

export interface ScheduleConflict {
  examA: string;
  examAName: string;
  examB: string;
  examBName: string;
  type: ConflictType;
}

export interface ScheduleData {
  _id: string;
  semesterId: string;
  conflicts: ScheduleConflict[];
  createdAt?: string;
  updatedAt?: string;
}

// ==============================
// Generated timetable (solve / result / publish)
// ==============================
export type ScheduleStatus = "draft" | "published";

export interface ScheduleScore {
  hardScore: number;
  softScore: number;
  raw: string;
}

export interface TimetableEntry {
  _id: string;
  subjectId: string;
  subjectName: string;
  examDate: string;
  timeslot: number;
}

/** فترة واحدة داخل يوم – قد تحوي أكثر من مادة (تصادم) */
export interface SlotGroup {
  timeslot: number;
  entries: TimetableEntry[];
}

export interface DayGroup {
  /** YYYY-MM-DD */
  day: string;
  slots: SlotGroup[];
}

export type TimetableViewMode = "grid" | "cards";

export interface GeneratedSchedule {
  _id: string;
  semesterId: string;
  academicYear: string;
  status: ScheduleStatus;
  score: ScheduleScore;
  timetable: TimetableEntry[];
  createdAt: string;
  updatedAt: string;
}

// ==============================
// Subject groups (مواد اختيارية تتشارك نفس الفترة الامتحانية)
// ==============================
export interface PopulatedGroupYear {
  _id: string;
  name: string;
  order?: number;
}

export interface PopulatedGroupSemester {
  _id: string;
  name: string;
}

export interface PopulatedGroupCreator {
  _id: string;
  name?: string;
  email?: string;
}

/** مادة داخل الغروب – كما يرجعها /subject-groups/:id (مع تفاصيل إضافية أحياناً) */
export interface SubjectGroupSubject {
  _id: string;
  name: string;
  yearId?: Ref<PopulatedGroupYear>;
  semesterId?: Ref<PopulatedGroupSemester>;
  lecturerIds?: string[];
  groupId?: Ref<{ _id: string; name?: string }>;
}

export interface SubjectGroup {
  _id: string;
  id?: string;
  name: string;
  yearId: Ref<PopulatedGroupYear>;
  semesterId: Ref<PopulatedGroupSemester>;
  createdBy?: Ref<PopulatedGroupCreator>;
  createdAt?: string;
  updatedAt?: string;
  /** غائبة من قوائم الفهرسة (getAll/بحسب فصل)، وحاضرة عند جلب الغروب بمفرده */
  subjects?: SubjectGroupSubject[];
}

export interface CreateSubjectGroupPayload {
  name: string;
  yearId: string;
  semesterId: string;
}

export interface UpdateSubjectGroupPayload {
  id: string;
  data: { name: string };
}

/** إضافة/إزالة مادة من غروب */
export interface SubjectGroupMemberPayload {
  id: string;
  subjectId: string;
}

/** عضوية مادة داخل غروب اختياري – مشتقة محلياً من قائمة الغروبات لفصل معيّن */
export interface SubjectGroupMembership {
  groupId: string;
  groupName: string;
}

/** subjectId → عضويته في غروب (إن وُجدت) */
export type SubjectGroupIndex = Map<string, SubjectGroupMembership>;
