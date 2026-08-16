import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../../app/store/store";
import type {
  Announcement,
  ApiResponse,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
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

export const announcementsApi = createApi({
  reducerPath: "announcementsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Announcement"],
  endpoints: (builder) => ({
    getAnnouncements: builder.query<Announcement[], void>({
      query: () => "/announcements",
      transformResponse: (response: ApiResponse<Announcement[]> | Announcement[]) =>
        unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((announcement) => ({
                type: "Announcement" as const,
                id: announcement._id,
              })),
              { type: "Announcement" as const, id: "LIST" },
            ]
          : [{ type: "Announcement" as const, id: "LIST" }],
    }),
    getMyAnnouncements: builder.query<Announcement[], void>({
      query: () => "/announcements/my",
      transformResponse: (response: ApiResponse<Announcement[]> | Announcement[]) =>
        unwrapList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((announcement) => ({
                type: "Announcement" as const,
                id: `MY-${announcement._id}`,
              })),
              { type: "Announcement" as const, id: "MY-LIST" },
            ]
          : [{ type: "Announcement" as const, id: "MY-LIST" }],
    }),
    getAnnouncement: builder.query<Announcement, string>({
      query: (id) => `/announcements/${id}`,
      transformResponse: (response: ApiResponse<Announcement> | Announcement) =>
        unwrapItem(response),
      providesTags: (_result, _error, id) => [{ type: "Announcement", id }],
    }),
    createAnnouncement: builder.mutation<Announcement, CreateAnnouncementPayload>({
      query: (body) => ({ url: "/announcements", method: "POST", body }),
      transformResponse: (response: ApiResponse<Announcement> | Announcement) =>
        unwrapItem(response),
      invalidatesTags: [
        { type: "Announcement", id: "LIST" },
        { type: "Announcement", id: "MY-LIST" },
      ],
    }),
    updateAnnouncement: builder.mutation<Announcement, UpdateAnnouncementPayload>({
      query: ({ id, data }) => ({
        url: `/announcements/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Announcement> | Announcement) =>
        unwrapItem(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
        { type: "Announcement", id: "MY-LIST" },
      ],
    }),
    deleteAnnouncement: builder.mutation<void, string>({
      query: (id) => ({ url: `/announcements/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
        { type: "Announcement", id: "MY-LIST" },
      ],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetMyAnnouncementsQuery,
  useGetAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementsApi;
