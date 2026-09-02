import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../app/store/store";
import type { Lecture, LecturePopulated } from "../../admin/lectures/types";
import type {
  BulkUploadPayload,
  BulkUploadResult,
  DocxUploadPayload,
  QuestionBank,
} from "../../admin/questionBanks/types";
import type {
  DoctorLectureUpdatePayload,
  DoctorLectureUploadPayload,
  DoctorSubjectStats,
} from "../types";

interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}

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

const buildLectureFormData = (
  payload: DoctorLectureUploadPayload | DoctorLectureUpdatePayload["data"],
): FormData => {
  const formData = new FormData();
  if ("title" in payload && payload.title !== undefined) {
    formData.append("title", payload.title);
  }
  if (payload.description !== undefined) {
    formData.append("description", payload.description ?? "");
  }
  if ("subjectId" in payload && payload.subjectId) {
    formData.append("subjectId", payload.subjectId);
  }
  if ("type" in payload && payload.type) {
    formData.append("type", payload.type);
  }
  if (payload.isPublished !== undefined) {
    formData.append("isPublished", String(payload.isPublished));
  }
  const file = "file" in payload ? payload.file : payload.lecture;
  if (file) formData.append("lecture", file);
  return formData;
};

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    // لا نضبط Content-Type يدوياً حتى لا نُفسد رفع الـ FormData (ملف المحاضرة/الوورد)
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["DoctorLecture", "DoctorBank", "DoctorStats"],
  endpoints: (builder) => ({
    getMyLectures: builder.query<LecturePopulated[], void>({
      query: () => "/doctor/lectures",
      transformResponse: (response: ApiResponse<LecturePopulated[]> | LecturePopulated[]) =>
        unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((lecture) => ({
                type: "DoctorLecture" as const,
                id: lecture._id,
              })),
              { type: "DoctorLecture" as const, id: "LIST" },
            ]
          : [{ type: "DoctorLecture" as const, id: "LIST" }],
    }),

    uploadLecture: builder.mutation<Lecture, DoctorLectureUploadPayload>({
      query: (payload) => ({
        url: "/doctor/lectures",
        method: "POST",
        body: buildLectureFormData(payload),
      }),
      transformResponse: (response: ApiResponse<Lecture> | Lecture) => unwrapItem(response),
      invalidatesTags: [
        { type: "DoctorLecture", id: "LIST" },
        { type: "DoctorStats", id: "LIST" },
      ],
    }),

    updateLecture: builder.mutation<LecturePopulated, DoctorLectureUpdatePayload>({
      query: ({ id, data }) => ({
        url: `/doctor/lectures/${id}`,
        method: "PATCH",
        body: buildLectureFormData(data),
      }),
      transformResponse: (response: ApiResponse<LecturePopulated> | LecturePopulated) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "DoctorLecture", id },
        { type: "DoctorLecture", id: "LIST" },
        { type: "DoctorStats", id: "LIST" },
      ],
    }),

    deleteLecture: builder.mutation<void, string>({
      query: (id) => ({ url: `/doctor/lectures/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "DoctorLecture", id },
        { type: "DoctorLecture", id: "LIST" },
        { type: "DoctorStats", id: "LIST" },
      ],
    }),

    getMyStats: builder.query<DoctorSubjectStats[], void>({
      query: () => "/doctor/lectures/stats/my-stats",
      transformResponse: (response: ApiResponse<DoctorSubjectStats[]> | DoctorSubjectStats[]) =>
        unwrapList(response),
      providesTags: [{ type: "DoctorStats", id: "LIST" }],
    }),

    getMyBanks: builder.query<QuestionBank[], void>({
      query: () => "/doctor/question-banks",
      transformResponse: (response: ApiResponse<QuestionBank[]> | QuestionBank[]) =>
        unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((bank) => ({ type: "DoctorBank" as const, id: bank._id })),
              { type: "DoctorBank" as const, id: "LIST" },
            ]
          : [{ type: "DoctorBank" as const, id: "LIST" }],
    }),

    deleteBank: builder.mutation<void, string>({
      query: (id) => ({ url: `/doctor/question-banks/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "DoctorBank", id },
        { type: "DoctorBank", id: "LIST" },
        { type: "DoctorStats", id: "LIST" },
      ],
    }),

    uploadBankDocx: builder.mutation<BulkUploadResult, DocxUploadPayload>({
      query: ({ lectureId, file }) => {
        const formData = new FormData();
        formData.append("lectureId", lectureId);
        formData.append("file", file);
        return {
          url: "/doctor/question-banks/upload-docx",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: ApiResponse<BulkUploadResult> | BulkUploadResult) =>
        unwrapItem(response),
      invalidatesTags: [
        { type: "DoctorBank", id: "LIST" },
        { type: "DoctorStats", id: "LIST" },
      ],
    }),

    uploadBankJson: builder.mutation<BulkUploadResult, BulkUploadPayload>({
      query: (body) => ({
        url: "/doctor/question-banks/bulk-upload",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<BulkUploadResult> | BulkUploadResult) =>
        unwrapItem(response),
      invalidatesTags: [
        { type: "DoctorBank", id: "LIST" },
        { type: "DoctorStats", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMyLecturesQuery,
  useUploadLectureMutation,
  useUpdateLectureMutation,
  useDeleteLectureMutation,
  useGetMyStatsQuery,
  useGetMyBanksQuery,
  useDeleteBankMutation,
  useUploadBankDocxMutation,
  useUploadBankJsonMutation,
} = doctorApi;
