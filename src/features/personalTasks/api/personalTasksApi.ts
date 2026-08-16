import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../app/store/store";
import type {
  ApiResponse,
  CreatePersonalTaskPayload,
  GetPersonalTasksParams,
  PersonalTask,
  UpdatePersonalTaskPayload,
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

export const personalTasksApi = createApi({
  reducerPath: "personalTasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["PersonalTask"],
  endpoints: (builder) => ({
    getPersonalTasks: builder.query<PersonalTask[], GetPersonalTasksParams | void>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.isCompleted !== undefined) {
          search.set("isCompleted", String(params.isCompleted));
        }
        const qs = search.toString();
        return `/personal-tasks${qs ? `?${qs}` : ""}`;
      },
      transformResponse: (response: ApiResponse<PersonalTask[]> | PersonalTask[]) =>
        unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((task) => ({ type: "PersonalTask" as const, id: task._id })),
              { type: "PersonalTask" as const, id: "LIST" },
            ]
          : [{ type: "PersonalTask" as const, id: "LIST" }],
    }),
    getPersonalTask: builder.query<PersonalTask, string>({
      query: (id) => `/personal-tasks/${id}`,
      transformResponse: (response: ApiResponse<PersonalTask> | PersonalTask) =>
        unwrapItem(response),
      providesTags: (...args) => [{ type: "PersonalTask", id: args[2] }],
    }),
    createPersonalTask: builder.mutation<PersonalTask, CreatePersonalTaskPayload>({
      query: (body) => ({ url: "/personal-tasks", method: "POST", body }),
      transformResponse: (response: ApiResponse<PersonalTask> | PersonalTask) =>
        unwrapItem(response),
      invalidatesTags: [{ type: "PersonalTask", id: "LIST" }],
    }),
    updatePersonalTask: builder.mutation<PersonalTask, UpdatePersonalTaskPayload>({
      query: ({ id, data }) => ({
        url: `/personal-tasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ApiResponse<PersonalTask> | PersonalTask) =>
        unwrapItem(response),
      invalidatesTags: (...args) => [
        { type: "PersonalTask", id: args[2].id },
        { type: "PersonalTask", id: "LIST" },
      ],
    }),
    deletePersonalTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/personal-tasks/${id}`, method: "DELETE" }),
      invalidatesTags: (...args) => [
        { type: "PersonalTask", id: args[2] },
        { type: "PersonalTask", id: "LIST" },
      ],
    }),
    completePersonalTask: builder.mutation<PersonalTask, string>({
      query: (id) => ({ url: `/personal-tasks/${id}/check`, method: "PATCH" }),
      transformResponse: (response: ApiResponse<PersonalTask> | PersonalTask) =>
        unwrapItem(response),
      invalidatesTags: (...args) => [
        { type: "PersonalTask", id: args[2] },
        { type: "PersonalTask", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPersonalTasksQuery,
  useGetPersonalTaskQuery,
  useCreatePersonalTaskMutation,
  useUpdatePersonalTaskMutation,
  useDeletePersonalTaskMutation,
  useCompletePersonalTaskMutation,
} = personalTasksApi;
