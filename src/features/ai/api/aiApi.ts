// src/features/ai/api/aiApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../app/store/store";
import type {
  ApiEnvelope,
  AskAiPayload,
  AskAiResult,
  ConversationDetail,
  ConversationSummary,
} from "../types/ai.types";

/**
 * رسائل الخطأ من هذا الـ endpoint أحياناً تكون JSON متداخل (خطأ من مزوّد النموذج).
 *
 * ملاحظة i18n: عند غياب رسالة الخادم نُرجع مفتاح ترجمة داخل `ai:errors.*`
 * بدل نصّ جاهز – الطبقة العليا (`useAiChat`) هي التي تترجمه.
 */
function extractErrorMessage(rawMessage: string, fallbackKey: string) {
  if (!rawMessage) return fallbackKey;
  try {
    const parsed = JSON.parse(rawMessage);
    return parsed?.error?.message ?? rawMessage;
  } catch {
    return rawMessage;
  }
}

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Conversation"],
  endpoints: (builder) => ({
    askAi: builder.mutation<AskAiResult, AskAiPayload>({
      query: (body) => ({ url: "/ai/ask", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<AskAiResult>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(
            extractErrorMessage(response.message, "ai:errors.replyFailed"),
          );
        }
        return response.data;
      },
      invalidatesTags: (result) =>
        result
          ? [
              { type: "Conversation", id: result.conversationId },
              { type: "Conversation", id: "LIST" },
            ]
          : [],
    }),

    getConversations: builder.query<ConversationSummary[], void>({
      query: () => "/ai/conversations",
      transformResponse: (response: ApiEnvelope<ConversationSummary[]>) =>
        response.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Conversation" as const, id: c._id })),
              { type: "Conversation" as const, id: "LIST" },
            ]
          : [{ type: "Conversation" as const, id: "LIST" }],
    }),

    getConversationById: builder.query<ConversationDetail, string>({
      query: (id) => `/ai/conversations/${id}`,
      transformResponse: (response: ApiEnvelope<ConversationDetail>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(
            extractErrorMessage(response.message, "ai:errors.loadConversationFailed"),
          );
        }
        return response.data;
      },
      providesTags: (_result, _error, id) => [{ type: "Conversation", id }],
    }),

    deleteConversation: builder.mutation<void, string>({
      query: (id) => ({ url: `/ai/conversations/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Conversation", id },
        { type: "Conversation", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAskAiMutation,
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useDeleteConversationMutation,
} = aiApi;
