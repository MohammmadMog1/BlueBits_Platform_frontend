import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../../../../app/store/store";
import type {
  ActiveSurveyForm,
  ApiResponse,
  CreateSurveyFormPayload,
  FormResponsesResult,
  SubmitSurveyResponsePayload,
  SurveyForm,
  SurveyResponse,
  YearStats,
  YearStatsQuery,
} from "../types";

// ==============================
// Unwrap helpers
// ==============================
const unwrapItem = <T>(response: ApiResponse<T> | T): T => {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

const unwrapList = <T>(response: ApiResponse<T[]> | T[]): T[] => {
  if (Array.isArray(response)) return response;
  return response?.data ?? [];
};

type SurveyQueryReturn = QueryReturnValue<
  unknown,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

type FetchWithBQ = (
  arg: string | FetchArgs,
) => SurveyQueryReturn | PromiseLike<SurveyQueryReturn>;

/**
 * استعلام يتسامح مع 404: غياب المورد ليس خطأً هنا
 * (لا يوجد فورم مفتوح، لم أُجب بعد، لا إحصاءات للسنة...) فنرجّع null.
 */
const fetchOptional = async <T>(
  fetchWithBQ: FetchWithBQ,
  url: string,
): Promise<{ data: T | null } | { error: FetchBaseQueryError }> => {
  const result = await fetchWithBQ(url);

  if (result.error) {
    if (result.error.status === 404) return { data: null };
    return { error: result.error };
  }

  return { data: unwrapItem<T | null>(result.data as ApiResponse<T | null>) ?? null };
};

export const surveysApi = createApi({
  reducerPath: "surveysApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["SurveyForm", "FormResponses", "ActiveForm", "MyResponse", "SurveyStats"],
  endpoints: (builder) => ({
    // ==============================
    // Admin – الفورمات
    // ==============================
    /** كل الفورمات: draft و open و closed */
    getSurveyForms: builder.query<SurveyForm[], void>({
      query: () => "/surveys/forms",
      transformResponse: (response: ApiResponse<SurveyForm[]> | SurveyForm[]) =>
        unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((form) => ({
                type: "SurveyForm" as const,
                id: form._id,
              })),
              { type: "SurveyForm" as const, id: "LIST" },
            ]
          : [{ type: "SurveyForm" as const, id: "LIST" }],
    }),

    getSurveyForm: builder.query<SurveyForm, string>({
      query: (id) => `/surveys/forms/${id}`,
      transformResponse: (response: ApiResponse<SurveyForm> | SurveyForm) =>
        unwrapItem(response),
      providesTags: (_result, _error, id) => [{ type: "SurveyForm", id }],
    }),

    /** ينشئ الفورم كمسودة – لا يراه الطلاب حتى يُفتح */
    createSurveyForm: builder.mutation<SurveyForm, CreateSurveyFormPayload>({
      query: (body) => ({ url: "/surveys/forms", method: "POST", body }),
      transformResponse: (response: ApiResponse<SurveyForm> | SurveyForm) =>
        unwrapItem(response),
      invalidatesTags: [{ type: "SurveyForm", id: "LIST" }],
    }),

    openSurveyForm: builder.mutation<SurveyForm, string>({
      query: (id) => ({ url: `/surveys/forms/${id}/open`, method: "PATCH" }),
      transformResponse: (response: ApiResponse<SurveyForm> | SurveyForm) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, id) => [
        { type: "SurveyForm", id },
        { type: "SurveyForm", id: "LIST" },
        { type: "ActiveForm", id: "ME" },
      ],
    }),

    /** إغلاق نهائي – الباك لا يسمح بإعادة الفتح */
    closeSurveyForm: builder.mutation<SurveyForm, string>({
      query: (id) => ({ url: `/surveys/forms/${id}/close`, method: "PATCH" }),
      transformResponse: (response: ApiResponse<SurveyForm> | SurveyForm) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, id) => [
        { type: "SurveyForm", id },
        { type: "SurveyForm", id: "LIST" },
        { type: "ActiveForm", id: "ME" },
      ],
    }),

    getFormResponses: builder.query<FormResponsesResult, string>({
      query: (id) => `/surveys/forms/${id}/responses`,
      transformResponse: (
        response: ApiResponse<FormResponsesResult> | FormResponsesResult,
      ) => unwrapItem(response),
      providesTags: (_result, _error, id) => [{ type: "FormResponses", id }],
    }),

    // ==============================
    // Any user – الإجابة
    // ==============================
    /** الفورم المفتوح لسنة المستخدم – غيابه ليس خطأ */
    getActiveSurveyForm: builder.query<ActiveSurveyForm, void>({
      queryFn: async (_arg, _api, _extra, fetchWithBQ: FetchWithBQ) => {
        const result = await fetchOptional<ActiveSurveyForm>(
          fetchWithBQ,
          "/surveys/forms/active",
        );

        if ("error" in result) return result;
        return {
          data: result.data ?? { form: null, alreadySubmitted: false },
        };
      },
      providesTags: [{ type: "ActiveForm", id: "ME" }],
    }),

    submitSurveyResponse: builder.mutation<
      SurveyResponse,
      SubmitSurveyResponsePayload
    >({
      query: (body) => ({ url: "/surveys/responses", method: "POST", body }),
      transformResponse: (response: ApiResponse<SurveyResponse> | SurveyResponse) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { formId }) => [
        { type: "ActiveForm", id: "ME" },
        { type: "MyResponse", id: "LAST" },
        { type: "MyResponse", id: formId },
        { type: "FormResponses", id: formId },
        { type: "SurveyStats", id: "LIST" },
      ],
    }),

    /** إجابتي على فورم معيّن – غيابها ليست خطأ */
    getMyResponseForForm: builder.query<SurveyResponse | null, string>({
      queryFn: (formId, _api, _extra, fetchWithBQ: FetchWithBQ) =>
        fetchOptional<SurveyResponse>(
          fetchWithBQ,
          `/surveys/responses/my/${formId}`,
        ),
      providesTags: (_result, _error, formId) => [
        { type: "MyResponse", id: formId },
      ],
    }),

    /** آخر إجابة عبّأتها – غيابها ليست خطأ */
    getMyLastResponse: builder.query<SurveyResponse | null, void>({
      queryFn: (_arg, _api, _extra, fetchWithBQ: FetchWithBQ) =>
        fetchOptional<SurveyResponse>(fetchWithBQ, "/surveys/responses/my"),
      providesTags: [{ type: "MyResponse", id: "LAST" }],
    }),

    // ==============================
    // Statistics
    // ==============================
    /**
     * إحصاءات مواد سنة واحدة. بلا formId يأخذ الباك فورم السنة الحالي،
     * ومع formId يقيّدها بذلك الفورم. 404 = لا فورم لهذه السنة.
     */
    getSubjectsStatsByYear: builder.query<YearStats | null, YearStatsQuery>({
      queryFn: ({ yearId, formId }, _api, _extra, fetchWithBQ: FetchWithBQ) =>
        fetchOptional<YearStats>(
          fetchWithBQ,
          `/surveys/stats/year/${yearId}${formId ? `?formId=${formId}` : ""}`,
        ),
      providesTags: (_result, _error, { yearId }) => [
        { type: "SurveyStats", id: yearId },
        { type: "SurveyStats", id: "LIST" },
      ],
    }),

    getSubjectsStatsAllYears: builder.query<YearStats[], void>({
      query: () => "/surveys/stats/all-years",
      transformResponse: (response: ApiResponse<YearStats[]> | YearStats[]) =>
        unwrapList(response),
      providesTags: [{ type: "SurveyStats", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSurveyFormsQuery,
  useGetSurveyFormQuery,
  useCreateSurveyFormMutation,
  useOpenSurveyFormMutation,
  useCloseSurveyFormMutation,
  useGetFormResponsesQuery,
  useGetActiveSurveyFormQuery,
  useSubmitSurveyResponseMutation,
  useGetMyResponseForFormQuery,
  useGetMyLastResponseQuery,
  useGetSubjectsStatsByYearQuery,
  useGetSubjectsStatsAllYearsQuery,
} = surveysApi;
