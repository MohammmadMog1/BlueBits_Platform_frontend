import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../app/store/store";
import type {
  AcademicListResponse,
  AcademicResponse,
  AcademicYear,
  CreateYearPayload,
  Semester,
  UpdateAcademicPayload,
} from "../types";

const unwrapList = <T>(response: AcademicListResponse<T> | T[]): T[] => {
  if (Array.isArray(response)) return response;
  return response.data ?? response.years ?? response.semesters ?? [];
};

const unwrapItem = <T>(response: AcademicResponse<T>): T => {
  if (typeof response === "object" && response !== null && "data" in response) {
    return response.data ?? (response as T);
  }
  return response as T;
};

export const academicApi = createApi({
  reducerPath: "academicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Year", "Semester"],
  endpoints: (builder) => ({
    getYears: builder.query<AcademicYear[], void>({
      query: () => "/years",
      transformResponse: (
        response: AcademicListResponse<AcademicYear> | AcademicYear[],
      ) => unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((year) => ({
                type: "Year" as const,
                id: year._id,
              })),
              { type: "Year" as const, id: "LIST" },
            ]
          : [{ type: "Year" as const, id: "LIST" }],
    }),
    getYear: builder.query<AcademicYear, string>({
      query: (id) => `/years/${id}`,
      transformResponse: (response: AcademicResponse<AcademicYear>) =>
        unwrapItem(response),
      providesTags: (...args) => [{ type: "Year", id: args[2] }],
    }),
    addYear: builder.mutation<AcademicYear, CreateYearPayload>({
      query: (body) => ({ url: "/years", method: "POST", body }),
      transformResponse: (response: AcademicResponse<AcademicYear>) =>
        unwrapItem(response),
      invalidatesTags: [{ type: "Year", id: "LIST" }],
    }),
    updateYear: builder.mutation<AcademicYear, UpdateAcademicPayload>({
      query: ({ id, name }) => ({
        url: `/years/${id}`,
        method: "PATCH",
        body: { name },
      }),
      transformResponse: (response: AcademicResponse<AcademicYear>) =>
        unwrapItem(response),
      invalidatesTags: (...args) => [
        { type: "Year", id: args[2].id },
        { type: "Year", id: "LIST" },
      ],
    }),
    deleteYear: builder.mutation<void, string>({
      query: (id) => ({ url: `/years/${id}`, method: "DELETE" }),
      invalidatesTags: (...args) => [
        { type: "Year", id: args[2] },
        { type: "Year", id: "LIST" },
      ],
    }),
    getSemesters: builder.query<Semester[], void>({
      query: () => "/semesters",
      transformResponse: (
        response: AcademicListResponse<Semester> | Semester[],
      ) => unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((semester) => ({
                type: "Semester" as const,
                id: semester._id,
              })),
              { type: "Semester" as const, id: "LIST" },
            ]
          : [{ type: "Semester" as const, id: "LIST" }],
    }),
    getSemester: builder.query<Semester, string>({
      query: (id) => `/semesters/${id}`,
      transformResponse: (response: AcademicResponse<Semester>) =>
        unwrapItem(response),
      providesTags: (...args) => [{ type: "Semester", id: args[2] }],
    }),
    addSemester: builder.mutation<Semester, { name: string }>({
      query: (body) => ({ url: "/semesters", method: "POST", body }),
      transformResponse: (response: AcademicResponse<Semester>) =>
        unwrapItem(response),
      invalidatesTags: [{ type: "Semester", id: "LIST" }],
    }),
    updateSemester: builder.mutation<Semester, UpdateAcademicPayload>({
      query: ({ id, name }) => ({
        url: `/semesters/${id}`,
        method: "PATCH",
        body: { name },
      }),
      transformResponse: (response: AcademicResponse<Semester>) =>
        unwrapItem(response),
      invalidatesTags: (...args) => [
        { type: "Semester", id: args[2].id },
        { type: "Semester", id: "LIST" },
      ],
    }),
    deleteSemester: builder.mutation<void, string>({
      query: (id) => ({ url: `/semesters/${id}`, method: "DELETE" }),
      invalidatesTags: (...args) => [
        { type: "Semester", id: args[2] },
        { type: "Semester", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetYearsQuery,
  useGetYearQuery,
  useAddYearMutation,
  useUpdateYearMutation,
  useDeleteYearMutation,
  useGetSemestersQuery,
  useGetSemesterQuery,
  useAddSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
} = academicApi;
