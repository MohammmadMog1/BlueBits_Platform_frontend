import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../../../../app/store/store";
import type {
  ApiResponse,
  Attempt,
  BulkUploadPayload,
  BulkUploadResult,
  DeleteQuestionPayload,
  DocxUploadPayload,
  Question,
  QuestionBank,
  QuestionBankDetail,
  SubmitAnswersPayload,
  UpdateQuestionPayload,
} from "../types";

// ==============================
// Unwrap helpers
// ==============================
const unwrapItem = <T>(response: ApiResponse<T> | T): T => {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const unwrapList = <T>(response: ApiResponse<T[]> | T[]): T[] => {
  if (Array.isArray(response)) return response;
  const data = (response as ApiResponse<T[]>)?.data;
  return Array.isArray(data) ? data : [];
};

/** بنك + أسئلته: يدعم { bank, questions } أو البنك مباشرة */
const unwrapDetail = (response: unknown): QuestionBankDetail => {
  const payload = unwrapItem<Record<string, unknown>>(
    response as ApiResponse<Record<string, unknown>>,
  );
  const bank = (payload?.bank ?? payload) as QuestionBank;
  const questions = Array.isArray(payload?.questions)
    ? (payload.questions as Question[])
    : [];
  return { bank, questions };
};

/** الـ baseQuery المُمرَّر داخل queryFn يستقبل الوسيط الأول فقط */
type BankQueryReturn = QueryReturnValue<
  unknown,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

type FetchWithBQ = (
  arg: string | FetchArgs,
) => BankQueryReturn | PromiseLike<BankQueryReturn>;

/**
 * توصيف الباك ما حدّد الـ method لـ publish / unpublish،
 * فنجرّب PATCH ثم POST (نفس أسلوب الـ fallback المستخدم في lecturesService).
 * أي خطأ غير 404/405 يعني أن الـ method صحيح والمشكلة من الـ API نفسه.
 */
const statusChangeQueryFn =
  (action: "publish" | "unpublish") =>
  async (id: string, _api: unknown, _extra: unknown, fetchWithBQ: FetchWithBQ) => {
    let lastError: FetchBaseQueryError | undefined;

    for (const method of ["PATCH", "POST"] as const) {
      const result = await fetchWithBQ({
        url: `/question-banks/${id}/${action}`,
        method,
      });

      if (!result.error) {
        return { data: unwrapItem<QuestionBank>(result.data as ApiResponse<QuestionBank>) };
      }

      lastError = result.error;
      const status = result.error.status;
      if (status !== 404 && status !== 405) return { error: result.error };
    }

    return { error: lastError as FetchBaseQueryError };
  };

// ==============================
// API slice
// ==============================
export const questionBanksApi = createApi({
  reducerPath: "questionBanksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    // ملاحظة: لا نضبط Content-Type يدوياً حتى لا نُفسد رفع الـ FormData (ملف الوورد)
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Bank", "BankList", "Attempt", "BankResults"],
  endpoints: (builder) => ({
    // ── View ────────────────────────────────
    getBank: builder.query<QuestionBankDetail, string>({
      query: (id) => `/question-banks/${id}`,
      transformResponse: (response: unknown) => unwrapDetail(response),
      providesTags: (_result, _error, id) => [{ type: "Bank", id }],
    }),

    getBankByLecture: builder.query<QuestionBankDetail, string>({
      query: (lectureId) => `/question-banks/lecture/${lectureId}`,
      transformResponse: (response: unknown) => unwrapDetail(response),
      providesTags: (result, _error, lectureId) => [
        { type: "Bank", id: `LECTURE-${lectureId}` },
        ...(result?.bank?._id ? [{ type: "Bank" as const, id: result.bank._id }] : []),
      ],
    }),

    getBanksByYear: builder.query<QuestionBank[], string>({
      query: (yearId) => `/question-banks/year/${yearId}`,
      transformResponse: (response: ApiResponse<QuestionBank[]> | QuestionBank[]) =>
        unwrapList(response),
      providesTags: (_result, _error, yearId) => [
        { type: "BankList", id: `YEAR-${yearId}` },
      ],
    }),

    getBanksBySubject: builder.query<QuestionBank[], string>({
      query: (subjectId) => `/question-banks/subject/${subjectId}`,
      transformResponse: (response: ApiResponse<QuestionBank[]> | QuestionBank[]) =>
        unwrapList(response),
      providesTags: (_result, _error, subjectId) => [
        { type: "BankList", id: `SUBJECT-${subjectId}` },
      ],
    }),

    // ── Upload ──────────────────────────────
    bulkUploadQuestions: builder.mutation<BulkUploadResult, BulkUploadPayload>({
      query: (body) => ({
        url: "/question-banks/bulk-upload",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<BulkUploadResult> | BulkUploadResult) =>
        unwrapItem(response),
      invalidatesTags: (result, _error, { lectureId }) => [
        { type: "Bank", id: `LECTURE-${lectureId}` },
        ...(result?.bank?._id ? [{ type: "Bank" as const, id: result.bank._id }] : []),
        "BankList",
      ],
    }),

    uploadQuestionsDocx: builder.mutation<BulkUploadResult, DocxUploadPayload>({
      query: ({ lectureId, file }) => {
        const formData = new FormData();
        formData.append("lectureId", lectureId);
        formData.append("file", file);
        return {
          url: "/question-banks/upload-docx",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: ApiResponse<BulkUploadResult> | BulkUploadResult) =>
        unwrapItem(response),
      invalidatesTags: (result, _error, { lectureId }) => [
        { type: "Bank", id: `LECTURE-${lectureId}` },
        ...(result?.bank?._id ? [{ type: "Bank" as const, id: result.bank._id }] : []),
        "BankList",
      ],
    }),

    // ── Review ──────────────────────────────
    updateQuestion: builder.mutation<Question, UpdateQuestionPayload>({
      query: ({ questionId, data }) => ({
        url: `/question-banks/questions/${questionId}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Question> | Question) =>
        unwrapItem(response),
      invalidatesTags: (result, _error, { bankId }) => [
        { type: "Bank", id: bankId ?? result?.bankId },
      ],
    }),

    deleteQuestion: builder.mutation<void, DeleteQuestionPayload>({
      query: ({ questionId }) => ({
        url: `/question-banks/questions/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { bankId }) => [
        { type: "Bank", id: bankId },
        "BankList",
      ],
    }),

    // ── Publish ─────────────────────────────
    publishBank: builder.mutation<QuestionBank, string>({
      queryFn: statusChangeQueryFn("publish"),
      invalidatesTags: (_result, _error, id) => [{ type: "Bank", id }, "BankList"],
    }),

    unpublishBank: builder.mutation<QuestionBank, string>({
      queryFn: statusChangeQueryFn("unpublish"),
      invalidatesTags: (_result, _error, id) => [{ type: "Bank", id }, "BankList"],
    }),

    deleteBank: builder.mutation<void, string>({
      query: (id) => ({ url: `/question-banks/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Bank", id }, "BankList"],
    }),

    // ── Submit / results ────────────────────
    submitAnswers: builder.mutation<Attempt, SubmitAnswersPayload>({
      query: ({ bankId, answers }) => ({
        url: `/question-banks/${bankId}/submit`,
        method: "POST",
        body: { answers },
      }),
      transformResponse: (response: ApiResponse<Attempt> | Attempt) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { bankId }) => [
        { type: "Attempt", id: bankId },
        { type: "BankResults", id: bankId },
      ],
    }),

    getMyAttempts: builder.query<Attempt[], string>({
      query: (bankId) => `/question-banks/${bankId}/my-attempts`,
      transformResponse: (response: ApiResponse<Attempt[]> | Attempt[]) =>
        unwrapList(response),
      providesTags: (_result, _error, bankId) => [{ type: "Attempt", id: bankId }],
    }),

    getBankResults: builder.query<Attempt[], string>({
      query: (bankId) => `/question-banks/${bankId}/results`,
      transformResponse: (response: ApiResponse<Attempt[]> | Attempt[]) =>
        unwrapList(response),
      providesTags: (_result, _error, bankId) => [
        { type: "BankResults", id: bankId },
      ],
    }),
  }),
});

export const {
  useGetBankQuery,
  useGetBankByLectureQuery,
  useGetBanksByYearQuery,
  useGetBanksBySubjectQuery,
  useBulkUploadQuestionsMutation,
  useUploadQuestionsDocxMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  usePublishBankMutation,
  useUnpublishBankMutation,
  useDeleteBankMutation,
  useSubmitAnswersMutation,
  useGetMyAttemptsQuery,
  useGetBankResultsQuery,
} = questionBanksApi;
