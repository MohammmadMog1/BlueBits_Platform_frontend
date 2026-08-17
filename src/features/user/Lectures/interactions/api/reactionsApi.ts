import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../../app/store/store";
import type { ApiResponse, LectureReactionsSummary, ReactionType } from "../types";

const unwrapItem = <T>(response: ApiResponse<T> | T): T => {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

export const reactionsApi = createApi({
  reducerPath: "reactionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["LectureReactions"],
  endpoints: (builder) => ({
    getLectureReactions: builder.query<LectureReactionsSummary, string>({
      query: (lectureId) => `/reactions/lecture/${lectureId}`,
      transformResponse: (response: ApiResponse<LectureReactionsSummary>) =>
        unwrapItem(response),
      providesTags: (_result, _error, lectureId) => [
        { type: "LectureReactions", id: lectureId },
      ],
    }),
    reactToLecture: builder.mutation<
      unknown,
      { lectureId: string; type: ReactionType }
    >({
      query: ({ lectureId, type }) => ({
        url: `/reactions/lecture/${lectureId}`,
        method: "POST",
        body: { type },
      }),
      invalidatesTags: (_result, _error, { lectureId }) => [
        { type: "LectureReactions", id: lectureId },
      ],
    }),
  }),
});

export const { useGetLectureReactionsQuery, useReactToLectureMutation } =
  reactionsApi;
