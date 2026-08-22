import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../app/store/store";
import type { LecturePopulated } from "../types";

const productionBaseUrl = "https://bluebits24.onrender.com/api/v1.0.0";

const unwrapLectureList = (response: any): LecturePopulated[] => {
  const payload = response?.data ?? response;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.lectures)) return payload.lectures;
  return [];
};

export const userLecturesApi = createApi({
  reducerPath: "userLecturesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: productionBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["UserLecture"],
  endpoints: (builder) => ({
    getAllLectures: builder.query<LecturePopulated[], void>({
      query: () => "/lectures",
      transformResponse: (response: any) => unwrapLectureList(response),
      providesTags: [{ type: "UserLecture", id: "LIST" }],
    }),
  }),
});

export const { useGetAllLecturesQuery } = userLecturesApi;
