import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../../../../app/store/store";
import type {
  ApiResponse,
  DeleteScheduleConfigPayload,
  GeneratedSchedule,
  ScheduleConfig,
  ScheduleConfigPayload,
  ScheduleData,
  UpdateScheduleConfigPayload,
} from "../types";

/**
 * ⚠️ مسارات solve / result / publish لم يحدّدها توصيف الباك،
 * واستُنتجت من نمط بقية المسارات: /schedule/<action>/:semesterId
 * إن اختلفت في الباك، التعديل هنا فقط يكفي.
 */
const SCHEDULE_PATHS = {
  solve: (semesterId: string) => `/schedule/solve/${semesterId}`,
  result: (semesterId: string) => `/schedule/result/${semesterId}`,
  publish: (semesterId: string) => `/schedule/publish/${semesterId}`,
} as const;

// ==============================
// Unwrap helpers
// ==============================
const unwrapItem = <T>(response: ApiResponse<T> | T): T => {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
};

type ScheduleQueryReturn = QueryReturnValue<
  unknown,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

type FetchWithBQ = (
  arg: string | FetchArgs,
) => ScheduleQueryReturn | PromiseLike<ScheduleQueryReturn>;

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT";

/**
 * يجرّب الـ methods بالترتيب حتى ينجح أحدها.
 * 404/405 تعني أن الـ method خاطئ فنكمل، وأي خطأ آخر يعني
 * أننا وصلنا للمسار الصحيح والمشكلة من الـ API نفسه فنتوقف.
 */
const tryMethods = async <T>(
  fetchWithBQ: FetchWithBQ,
  url: string,
  methods: readonly HttpMethod[],
  body?: unknown,
): Promise<{ data: T } | { error: FetchBaseQueryError }> => {
  let lastError: FetchBaseQueryError | undefined;

  for (const method of methods) {
    const result = await fetchWithBQ({
      url,
      method,
      ...(body === undefined ? {} : { body }),
    });

    if (!result.error) {
      return { data: unwrapItem<T>(result.data as ApiResponse<T>) };
    }

    lastError = result.error;
    const status = result.error.status;
    if (status !== 404 && status !== 405) return { error: result.error };
  }

  return { error: lastError as FetchBaseQueryError };
};

export const scheduleApi = createApi({
  reducerPath: "scheduleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["ScheduleConfig", "ScheduleData", "Schedule"],
  endpoints: (builder) => ({
    /**
     * إعدادات الجدولة لفصل معيّن.
     * غياب الإعدادات ليس خطأ – نرجّع null ليعرض الـ UI حالة "أنشئ الإعدادات".
     */
    getScheduleConfig: builder.query<ScheduleConfig | null, string>({
      queryFn: async (semesterId, _api, _extra, fetchWithBQ: FetchWithBQ) => {
        const result = await fetchWithBQ(`/schedule/config/${semesterId}`);

        if (result.error) {
          if (result.error.status === 404) return { data: null };
          return { error: result.error };
        }

        const config = unwrapItem<ScheduleConfig | null>(
          result.data as ApiResponse<ScheduleConfig | null>,
        );
        return { data: config ?? null };
      },
      providesTags: (_result, _error, semesterId) => [
        { type: "ScheduleConfig", id: semesterId },
      ],
    }),

    createScheduleConfig: builder.mutation<ScheduleConfig, ScheduleConfigPayload>({
      query: (body) => ({ url: "/schedule/config", method: "POST", body }),
      transformResponse: (response: ApiResponse<ScheduleConfig> | ScheduleConfig) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { semesterId }) => [
        { type: "ScheduleConfig", id: semesterId },
      ],
    }),

    /** توصيف الباك ما حدّد method التعديل، فنجرّب PATCH ثم PUT */
    updateScheduleConfig: builder.mutation<ScheduleConfig, UpdateScheduleConfigPayload>({
      queryFn: ({ id, data }, _api, _extra, fetchWithBQ: FetchWithBQ) =>
        tryMethods<ScheduleConfig>(
          fetchWithBQ,
          `/schedule/config/manage/${id}`,
          ["PATCH", "PUT"],
          data,
        ),
      invalidatesTags: (_result, _error, { data }) => [
        { type: "ScheduleConfig", id: data.semesterId },
      ],
    }),

    deleteScheduleConfig: builder.mutation<void, DeleteScheduleConfigPayload>({
      query: ({ id }) => ({
        url: `/schedule/config/manage/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { semesterId }) => [
        { type: "ScheduleConfig", id: semesterId },
        { type: "ScheduleData", id: semesterId },
      ],
    }),

    /**
     * تجميع بيانات الجدولة (ردود الطلاب + إعدادات الأدمن) وحفظها في قاعدة البيانات.
     * هو GET في الباك لكنه يكتب، فنعامله كـ mutation.
     */
    generateScheduleData: builder.mutation<ScheduleData, string>({
      query: (semesterId) => ({
        url: `/schedule/generate-data/${semesterId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ScheduleData> | ScheduleData) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, semesterId) => [
        { type: "ScheduleData", id: semesterId },
      ],
    }),

    /**
     * تشغيل الـ solver: يجمع البيانات ويرسلها لـ exam-solver ثم يرجّع الجدول.
     * عملية طويلة – لا نضع لها timeout يدوي.
     */
    solveSchedule: builder.mutation<GeneratedSchedule, string>({
      queryFn: (semesterId, _api, _extra, fetchWithBQ: FetchWithBQ) =>
        tryMethods<GeneratedSchedule>(fetchWithBQ, SCHEDULE_PATHS.solve(semesterId), [
          "POST",
          "GET",
        ]),
      invalidatesTags: (_result, _error, semesterId) => [
        { type: "Schedule", id: semesterId },
      ],
    }),

    /** آخر جدول محفوظ للفصل – غيابه ليس خطأ */
    getScheduleResult: builder.query<GeneratedSchedule | null, string>({
      queryFn: async (semesterId, _api, _extra, fetchWithBQ: FetchWithBQ) => {
        const result = await fetchWithBQ(SCHEDULE_PATHS.result(semesterId));

        if (result.error) {
          if (result.error.status === 404) return { data: null };
          return { error: result.error };
        }

        const schedule = unwrapItem<GeneratedSchedule | null>(
          result.data as ApiResponse<GeneratedSchedule | null>,
        );
        return { data: schedule ?? null };
      },
      providesTags: (_result, _error, semesterId) => [
        { type: "Schedule", id: semesterId },
      ],
    }),

    publishSchedule: builder.mutation<GeneratedSchedule, string>({
      queryFn: (semesterId, _api, _extra, fetchWithBQ: FetchWithBQ) =>
        tryMethods<GeneratedSchedule>(
          fetchWithBQ,
          SCHEDULE_PATHS.publish(semesterId),
          ["POST", "PATCH", "PUT"],
        ),
      invalidatesTags: (_result, _error, semesterId) => [
        { type: "Schedule", id: semesterId },
      ],
    }),
  }),
});

export const {
  useGetScheduleConfigQuery,
  useCreateScheduleConfigMutation,
  useUpdateScheduleConfigMutation,
  useDeleteScheduleConfigMutation,
  useGenerateScheduleDataMutation,
  useSolveScheduleMutation,
  useGetScheduleResultQuery,
  usePublishScheduleMutation,
} = scheduleApi;
