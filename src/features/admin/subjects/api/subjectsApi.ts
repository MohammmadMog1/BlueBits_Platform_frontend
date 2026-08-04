import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../app/store/store";
import type {
  CreateSubjectPayload,
  Subject,
  SubjectListResponse,
  SubjectResponse,
  SubjectsQuery,
  UpdateSubjectPayload,
} from "../types";

const productionBaseUrl = "https://bluebits24.onrender.com/api/v1.0.0";

const unwrapList = (response: SubjectListResponse | Subject[]): Subject[] => {
  if (Array.isArray(response)) return response;
  return response.data ?? response.subjects ?? [];
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
      query: (filters) => {
        const yearId = filters?.yearId;
        const semesterId = filters?.semesterId;

        if (yearId && semesterId) {
          return {
            url: `${productionBaseUrl}/subjects/year/${yearId}/semester/${semesterId}`,
            baseUrl: undefined,
          };
        }
        if (yearId) {
          return {
            url: `${productionBaseUrl}/subjects/year/${yearId}`,
            baseUrl: undefined,
          };
        }
        if (semesterId) {
          return {
            url: `${productionBaseUrl}/subjects/semester/${semesterId}`,
            baseUrl: undefined,
          };
        }
        return "/subjects";
      },
      transformResponse: (response: SubjectListResponse | Subject[]) =>
        unwrapList(response),
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
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectsApi;
