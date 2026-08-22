import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../app/store/store";
import type { LecturesCountPerSubjectResponse, LectureSubjectStats } from "../types";

const productionBaseUrl = "https://bluebits24.onrender.com/api/v1.0.0";

export const lecturesStatsApi = createApi({
  reducerPath: "lecturesStatsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: productionBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["LectureStats"],
  endpoints: (builder) => ({
    getLecturesCountPerSubject: builder.query<LectureSubjectStats[], void>({
      query: () => "/lectures/stats/per-subject",
      transformResponse: (response: LecturesCountPerSubjectResponse) =>
        Array.isArray(response?.data) ? response.data : [],
      providesTags: [{ type: "LectureStats", id: "LIST" }],
    }),
  }),
});

export const { useGetLecturesCountPerSubjectQuery } = lecturesStatsApi;
