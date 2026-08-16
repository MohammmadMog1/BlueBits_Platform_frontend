import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../app/store/store";
import type {
  AcademicTask,
  ApiResponse,
  CreateAcademicTaskPayload,
  LectureOption,
  LectureType,
  ReviewSubmissionPayload,
  SubmitSolutionPayload,
  TaskSubmission,
  UpdateAcademicTaskPayload,
} from "../types";

const unwrapList = <T>(response: ApiResponse<T[]> | T[]): T[] => {
  if (Array.isArray(response)) return response;
  return response?.data ?? [];
};

const unwrapItem = <T>(response: ApiResponse<T> | T): T => {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const unwrapLectureOptions = (response: any): LectureOption[] => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.lectures)) return payload.lectures;
  return [];
};

export const academicTasksApi = createApi({
  reducerPath: "academicTasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // multipart/form-data endpoints must let the browser set the boundary itself
      if (endpoint !== "submitSolution") {
        headers.set("Content-Type", "application/json");
      }
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["AcademicTask", "TaskSubmission"],
  endpoints: (builder) => ({
    getAcademicTasks: builder.query<AcademicTask[], void>({
      query: () => "/academic-tasks",
      transformResponse: (response: ApiResponse<AcademicTask[]> | AcademicTask[]) =>
        unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((task) => ({
                type: "AcademicTask" as const,
                id: task._id,
              })),
              { type: "AcademicTask" as const, id: "LIST" },
            ]
          : [{ type: "AcademicTask" as const, id: "LIST" }],
    }),
    getAcademicTask: builder.query<AcademicTask, string>({
      query: (id) => `/academic-tasks/${id}`,
      transformResponse: (response: ApiResponse<AcademicTask> | AcademicTask) =>
        unwrapItem(response),
      providesTags: (...args) => [{ type: "AcademicTask", id: args[2] }],
    }),
    createAcademicTask: builder.mutation<AcademicTask, CreateAcademicTaskPayload>({
      query: (body) => ({ url: "/academic-tasks", method: "POST", body }),
      transformResponse: (response: ApiResponse<AcademicTask> | AcademicTask) =>
        unwrapItem(response),
      invalidatesTags: [{ type: "AcademicTask", id: "LIST" }],
    }),
    updateAcademicTask: builder.mutation<AcademicTask, UpdateAcademicTaskPayload>({
      query: ({ id, data }) => ({
        url: `/academic-tasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ApiResponse<AcademicTask> | AcademicTask) =>
        unwrapItem(response),
      invalidatesTags: (...args) => [
        { type: "AcademicTask", id: args[2].id },
        { type: "AcademicTask", id: "LIST" },
      ],
    }),
    deleteAcademicTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/academic-tasks/${id}`, method: "DELETE" }),
      invalidatesTags: (...args) => [
        { type: "AcademicTask", id: args[2] },
        { type: "AcademicTask", id: "LIST" },
      ],
    }),
    closeAcademicTask: builder.mutation<AcademicTask, string>({
      query: (id) => ({ url: `/academic-tasks/${id}/close`, method: "PATCH" }),
      transformResponse: (response: ApiResponse<AcademicTask> | AcademicTask) =>
        unwrapItem(response),
      invalidatesTags: (...args) => [
        { type: "AcademicTask", id: args[2] },
        { type: "AcademicTask", id: "LIST" },
      ],
    }),
    getLecturesBySubject: builder.query<
      LectureOption[],
      { subjectId: string; type: LectureType }
    >({
      query: ({ subjectId, type }) => `/lectures/subject/${subjectId}/type/${type}`,
      transformResponse: (response: any) => unwrapLectureOptions(response),
    }),
    getMySubmission: builder.query<TaskSubmission | null, string>({
      query: (taskId) => `/academic-tasks/${taskId}/submissions/me`,
      transformResponse: (
        response: ApiResponse<TaskSubmission | null> | TaskSubmission | null,
      ) => unwrapItem(response),
      providesTags: (_result, _error, taskId) => [
        { type: "TaskSubmission", id: `ME-${taskId}` },
      ],
    }),
    submitSolution: builder.mutation<TaskSubmission, SubmitSolutionPayload>({
      query: ({ taskId, formData }) => ({
        url: `/academic-tasks/${taskId}/submissions`,
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: ApiResponse<TaskSubmission> | TaskSubmission) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "TaskSubmission", id: `ME-${taskId}` },
        { type: "TaskSubmission", id: `TASK-${taskId}` },
      ],
    }),
    getTaskSubmissions: builder.query<TaskSubmission[], string>({
      query: (taskId) => `/academic-tasks/${taskId}/submissions`,
      transformResponse: (response: ApiResponse<TaskSubmission[]> | TaskSubmission[]) =>
        unwrapList(response),
      providesTags: (result, _error, taskId) =>
        result
          ? [
              ...result.map((submission) => ({
                type: "TaskSubmission" as const,
                id: submission._id,
              })),
              { type: "TaskSubmission" as const, id: `TASK-${taskId}` },
            ]
          : [{ type: "TaskSubmission" as const, id: `TASK-${taskId}` }],
    }),
    reviewSubmission: builder.mutation<TaskSubmission, ReviewSubmissionPayload>({
      query: ({ id, status, reviewNote }) => ({
        url: `/academic-tasks/submissions/${id}/review`,
        method: "PATCH",
        body: { status, reviewNote },
      }),
      transformResponse: (response: ApiResponse<TaskSubmission> | TaskSubmission) =>
        unwrapItem(response),
      invalidatesTags: (result) =>
        result
          ? [
              { type: "TaskSubmission", id: result._id },
              { type: "TaskSubmission", id: `TASK-${result.taskId}` },
            ]
          : [],
    }),
  }),
});

export const {
  useGetAcademicTasksQuery,
  useGetAcademicTaskQuery,
  useCreateAcademicTaskMutation,
  useUpdateAcademicTaskMutation,
  useDeleteAcademicTaskMutation,
  useCloseAcademicTaskMutation,
  useGetLecturesBySubjectQuery,
  useGetMySubmissionQuery,
  useSubmitSolutionMutation,
  useGetTaskSubmissionsQuery,
  useReviewSubmissionMutation,
} = academicTasksApi;
