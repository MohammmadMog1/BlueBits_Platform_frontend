import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../../app/store/store";
import type {
  ApiResponse,
  LectureComment,
  LectureCommentsResult,
} from "../types";

const unwrapItem = <T>(response: ApiResponse<T> | T): T => {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["LectureComment"],
  endpoints: (builder) => ({
    getLectureComments: builder.query<LectureCommentsResult, string>({
      query: (lectureId) => `/comments/lecture/${lectureId}`,
      transformResponse: (response: ApiResponse<LectureCommentsResult>) =>
        unwrapItem(response),
      providesTags: (result, _error, lectureId) =>
        result
          ? [
              ...result.comments.map((comment) => ({
                type: "LectureComment" as const,
                id: comment._id,
              })),
              { type: "LectureComment" as const, id: `LIST-${lectureId}` },
            ]
          : [{ type: "LectureComment" as const, id: `LIST-${lectureId}` }],
    }),
    createComment: builder.mutation<
      LectureComment,
      { lectureId: string; userId: string; content: string }
    >({
      query: ({ lectureId, userId, content }) => ({
        url: `/comments/lecture/${lectureId}`,
        method: "POST",
        body: { userId, content },
      }),
      transformResponse: (response: ApiResponse<LectureComment>) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { lectureId }) => [
        { type: "LectureComment", id: `LIST-${lectureId}` },
      ],
    }),
    updateComment: builder.mutation<
      LectureComment,
      { id: string; lectureId: string; content: string }
    >({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PATCH",
        body: { content },
      }),
      transformResponse: (response: ApiResponse<LectureComment>) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { id, lectureId }) => [
        { type: "LectureComment", id },
        { type: "LectureComment", id: `LIST-${lectureId}` },
      ],
    }),
    deleteComment: builder.mutation<void, { id: string; lectureId: string }>({
      query: ({ id }) => ({ url: `/comments/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { id, lectureId }) => [
        { type: "LectureComment", id },
        { type: "LectureComment", id: `LIST-${lectureId}` },
      ],
    }),
  }),
});

export const {
  useGetLectureCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
