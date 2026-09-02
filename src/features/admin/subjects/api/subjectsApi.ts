import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../app/store/store";
import type {
  AssignLecturerPayload,
  CreateSubjectPayload,
  MySubject,
  Subject,
  SubjectResponse,
  SubjectsQuery,
  UpdateSubjectPayload,
} from "../types";

const productionBaseUrl = "https://bluebits24.onrender.com/api/v1.0.0";

// ✅ تم إصلاح unwrapList للتعامل مع جميع أشكال الاستجابات
const unwrapList = <T = Subject>(response: any): T[] => {
  // 1. مصفوفة مباشرة
  if (Array.isArray(response)) return response;
  
  // 2. Bluebits envelope مع data = مصفوفة مباشرة
  if (Array.isArray(response?.data)) return response.data;
  
  // 3. ✅ Bluebits envelope مع data = { count, subjects }
  if (Array.isArray(response?.data?.subjects)) return response.data.subjects;
  
  // 4. response مباشرة مع subjects
  if (Array.isArray(response?.subjects)) return response.subjects;
  
  return [];
};

const unwrapItem = (response: SubjectResponse): Subject => {
  if ("data" in response && response.data) return response.data;
  return response as Subject;
};

export const subjectsApi = createApi({
  reducerPath: "subjectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: productionBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Subject"],
  endpoints: (builder) => ({
    getSubjects: builder.query<Subject[], SubjectsQuery | void>({
      // ✅ تم تبسيط query function لتكون أنظف وأكثر اتساقاً
      query: (filters) => {
        const yearId = filters?.yearId;
        const semesterId = filters?.semesterId;
        const type = filters?.type;

        if (yearId && semesterId && type) {
          return `/subjects/year/${yearId}/semester/${semesterId}/type/${type}`;
        }
        if (yearId && semesterId) {
          return `/subjects/year/${yearId}/semester/${semesterId}`;
        }
        if (yearId) {
          return `/subjects/year/${yearId}`;
        }
        if (semesterId) {
          return `/subjects/semester/${semesterId}`;
        }
        return "/subjects";
      },
      transformResponse: (response: any) => unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((subject) => ({
                type: "Subject" as const,
                id: subject._id,
              })),
              { type: "Subject" as const, id: "LIST" },
            ]
          : [{ type: "Subject" as const, id: "LIST" }],
    }),
    getSubject: builder.query<Subject, string>({
      query: (id) => `/subjects/${id}`,
      transformResponse: (response: SubjectResponse) => unwrapItem(response),
      providesTags: (...args) => [{ type: "Subject", id: args[2] }],
    }),
    createSubject: builder.mutation<Subject, CreateSubjectPayload>({
      query: (body) => ({ url: "/subjects", method: "POST", body }),
      transformResponse: (response: SubjectResponse) => unwrapItem(response),
      invalidatesTags: [{ type: "Subject", id: "LIST" }],
    }),
    updateSubject: builder.mutation<Subject, UpdateSubjectPayload>({
      query: ({ id, data }) => ({
        url: `/subjects/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: SubjectResponse) => unwrapItem(response),
      invalidatesTags: (...args) => [
        { type: "Subject", id: args[2].id },
        { type: "Subject", id: "LIST" },
      ],
    }),
    deleteSubject: builder.mutation<void, string>({
      query: (id) => ({ url: `/subjects/${id}`, method: "DELETE" }),
      invalidatesTags: (...args) => [
        { type: "Subject", id: args[2] },
        { type: "Subject", id: "LIST" },
      ],
    }),
    getMySubjects: builder.query<MySubject[], void>({
      query: () => "/subjects/my-subjects",
      transformResponse: (response: unknown) => unwrapList<MySubject>(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((subject) => ({
                type: "Subject" as const,
                id: subject._id,
              })),
              { type: "Subject" as const, id: "MY_LIST" },
            ]
          : [{ type: "Subject" as const, id: "MY_LIST" }],
    }),
    getSubjectsByLecturer: builder.query<MySubject[], string>({
      query: (lecturerId) => `/subjects/lecturer/${lecturerId}`,
      transformResponse: (response: unknown) => unwrapList<MySubject>(response),
      providesTags: [{ type: "Subject" as const, id: "LIST" }],
    }),
    assignLecturer: builder.mutation<Subject, AssignLecturerPayload>({
      query: ({ subjectId, lecturerId }) => ({
        url: `/subjects/${subjectId}/assign-lecturer`,
        method: "PATCH",
        body: { lecturerId },
      }),
      transformResponse: (response: SubjectResponse) => unwrapItem(response),
      invalidatesTags: (...args) => [
        { type: "Subject", id: args[2].subjectId },
        { type: "Subject", id: "LIST" },
        { type: "Subject", id: "MY_LIST" },
      ],
    }),
    unassignLecturer: builder.mutation<Subject, AssignLecturerPayload>({
      query: ({ subjectId, lecturerId }) => ({
        url: `/subjects/${subjectId}/unassign-lecturer`,
        method: "PATCH",
        body: { lecturerId },
      }),
      transformResponse: (response: SubjectResponse) => unwrapItem(response),
      invalidatesTags: (...args) => [
        { type: "Subject", id: args[2].subjectId },
        { type: "Subject", id: "LIST" },
        { type: "Subject", id: "MY_LIST" },
      ],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetMySubjectsQuery,
  useGetSubjectsByLecturerQuery,
  useAssignLecturerMutation,
  useUnassignLecturerMutation,
} = subjectsApi;