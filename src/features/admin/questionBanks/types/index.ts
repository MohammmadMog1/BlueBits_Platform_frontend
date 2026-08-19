// ==============================
// Generic API envelope
// ==============================
export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export type QuestionType = "mcq" | "true_false";
export type BankStatus = "draft" | "published";

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

export interface PopulatedSemester {
  _id: string;
  name: string;
}

export interface PopulatedSubject {
  _id: string;
  name: string;
  yearId: PopulatedYear | string | null;
  semesterId: PopulatedSemester | string | null;
  createdBy: PopulatedUser | string | null;
}

export interface PopulatedLecture {
  _id: string;
  title: string;
  subjectId: PopulatedSubject | string | null;
  uploadedBy: PopulatedUser | string | null;
}

// ==============================
// Question
// ==============================
export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  bankId: string;
  type: QuestionType;
  questionText: string;
  options: QuestionOption[];
  explanation?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// Question bank
// ==============================
export interface QuestionBank {
  _id: string;
  id?: string;
  lectureId: PopulatedLecture | string | null;
  subjectId: PopulatedSubject | string | null;
  yearId: PopulatedYear | string | null;
  title: string;
  status: BankStatus;
  createdBy: PopulatedUser | string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
}

/** ما ترجعه endpoints: getBank / getBankByLecture */
export interface QuestionBankDetail {
  bank: QuestionBank;
  questions: Question[];
}

// ==============================
// Upload payloads (bulk-upload as JSON)
// ==============================
export interface McqQuestionInput {
  type: "mcq";
  questionText: string;
  options: QuestionOption[];
  explanation?: string;
}

export interface TrueFalseQuestionInput {
  type: "true_false";
  questionText: string;
  correctAnswer: boolean;
  explanation?: string;
}

export type QuestionInput = McqQuestionInput | TrueFalseQuestionInput;

export interface BulkUploadPayload {
  lectureId: string;
  questions: QuestionInput[];
}

export interface BulkUploadResult {
  bank: QuestionBank;
  questionsCount: number;
}

export interface DocxUploadPayload {
  lectureId: string;
  file: File;
}

// ==============================
// Review payloads
// ==============================
export interface UpdateQuestionPayload {
  questionId: string;
  /** لتحديث الكاش فقط – لا يُرسل للـ API */
  bankId?: string;
  data: {
    questionText?: string;
    explanation?: string;
    options?: QuestionOption[];
    type?: QuestionType;
  };
}

export interface DeleteQuestionPayload {
  questionId: string;
  /** لتحديث الكاش فقط – لا يُرسل للـ API */
  bankId?: string;
}

// ==============================
// Attempts / results
// ==============================
export interface AttemptAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface Attempt {
  _id: string;
  studentId: PopulatedUser | string;
  bankId: string;
  answers: AttemptAnswer[];
  correctCount: number;
  totalQuestions: number;
  scorePercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitAnswerInput {
  questionId: string;
  selectedIndex: number;
}

export interface SubmitAnswersPayload {
  bankId: string;
  answers: SubmitAnswerInput[];
}
