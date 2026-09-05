import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query";
import type { RootState } from "../../../../app/store/store";
import type {
  ApiResponse,
  CreateSubjectGroupPayload,
  SubjectGroup,
  SubjectGroupMemberPayload,
  UpdateSubjectGroupPayload,
} from "../types";

/**
 * غروبات المواد الاختيارية: مواد داخل غروب واحد تتشارك نفس الفترة الامتحانية
 * ونفس الوقت لأن الطلاب ينقسمون بينها (مواد اختيارية).
 */
const unwrapItem = <T>(response: ApiResponse<T> | T): T => {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const unwrapList = <T>(response: ApiResponse<T[]> | T[]): T[] => {
  const data = unwrapItem<T[] | T>(response as ApiResponse<T[]>);
  return Array.isArray(data) ? data : [];
};

type GroupsQueryReturn = QueryReturnValue<SubjectGroup[], FetchBaseQueryError, FetchBaseQueryMeta>;

export const subjectGroupsApi = createApi({
  reducerPath: "subjectGroupsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["SubjectGroup"],
  endpoints: (builder) => ({
    getSubjectGroups: builder.query<SubjectGroup[], void>({
      query: () => "/subject-groups",
      transformResponse: (response: ApiResponse<SubjectGroup[]> | SubjectGroup[]) =>
        unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((group) => ({ type: "SubjectGroup" as const, id: group._id })),
              { type: "SubjectGroup" as const, id: "LIST" },
            ]
          : [{ type: "SubjectGroup" as const, id: "LIST" }],
    }),

    getSubjectGroup: builder.query<SubjectGroup, string>({
      query: (id) => `/subject-groups/${id}`,
      transformResponse: (response: ApiResponse<SubjectGroup> | SubjectGroup) =>
        unwrapItem(response),
      providesTags: (_result, _error, id) => [{ type: "SubjectGroup", id }],
    }),

    /**
     * غروبات فصل معيّن مع تفاصيل موادها الكاملة.
     * قائمة "/subject-groups/semester/:id" لا ترجّع حقل subjects، لذا نجلب
     * كل غروب بمفرده بعدها لنعرف عضوية كل مادة (اللازمة لتمييز التصادمات المتوقعة).
     */
    getSubjectGroupsBySemesterDetailed: builder.query<SubjectGroup[], string>({
      queryFn: async (semesterId, _api, _extra, fetchWithBQ): Promise<GroupsQueryReturn> => {
        const listResult = await fetchWithBQ(`/subject-groups/semester/${semesterId}`);
        if (listResult.error) return { error: listResult.error };

        const summaries = unwrapList<SubjectGroup>(
          listResult.data as ApiResponse<SubjectGroup[]> | SubjectGroup[],
        );
        if (summaries.length === 0) return { data: [] };

        const detailResults = await Promise.all(
          summaries.map((summary) => fetchWithBQ(`/subject-groups/${summary._id}`)),
        );

        const groups = detailResults.map((result, index) => {
          if (result.error) return summaries[index];
          return unwrapItem<SubjectGroup>(result.data as ApiResponse<SubjectGroup> | SubjectGroup);
        });

        return { data: groups };
      },
      providesTags: (result, _error, semesterId) => [
        ...(result?.map((group) => ({ type: "SubjectGroup" as const, id: group._id })) ?? []),
        { type: "SubjectGroup", id: `SEMESTER-${semesterId}` },
      ],
    }),

    createSubjectGroup: builder.mutation<SubjectGroup, CreateSubjectGroupPayload>({
      query: (body) => ({ url: "/subject-groups", method: "POST", body }),
      transformResponse: (response: ApiResponse<SubjectGroup> | SubjectGroup) =>
        unwrapItem(response),
      invalidatesTags: [{ type: "SubjectGroup", id: "LIST" }],
    }),

    updateSubjectGroup: builder.mutation<SubjectGroup, UpdateSubjectGroupPayload>({
      query: ({ id, data }) => ({ url: `/subject-groups/${id}`, method: "PATCH", body: data }),
      transformResponse: (response: ApiResponse<SubjectGroup> | SubjectGroup) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SubjectGroup", id },
        { type: "SubjectGroup", id: "LIST" },
      ],
    }),

    addSubjectToGroup: builder.mutation<SubjectGroup, SubjectGroupMemberPayload>({
      query: ({ id, subjectId }) => ({
        url: `/subject-groups/${id}/add-subject`,
        method: "PATCH",
        body: { subjectId },
      }),
      transformResponse: (response: ApiResponse<SubjectGroup> | SubjectGroup) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SubjectGroup", id },
        { type: "SubjectGroup", id: "LIST" },
      ],
    }),

    removeSubjectFromGroup: builder.mutation<SubjectGroup, SubjectGroupMemberPayload>({
      query: ({ id, subjectId }) => ({
        url: `/subject-groups/${id}/remove-subject`,
        method: "PATCH",
        body: { subjectId },
      }),
      transformResponse: (response: ApiResponse<SubjectGroup> | SubjectGroup) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SubjectGroup", id },
        { type: "SubjectGroup", id: "LIST" },
      ],
    }),

    deleteSubjectGroup: builder.mutation<void, string>({
      query: (id) => ({ url: `/subject-groups/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "SubjectGroup", id },
        { type: "SubjectGroup", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSubjectGroupsQuery,
  useGetSubjectGroupQuery,
  useGetSubjectGroupsBySemesterDetailedQuery,
  useCreateSubjectGroupMutation,
  useUpdateSubjectGroupMutation,
  useAddSubjectToGroupMutation,
  useRemoveSubjectFromGroupMutation,
  useDeleteSubjectGroupMutation,
} = subjectGroupsApi;
