// src/features/profile/api/profileApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../app/store/store";
import type {
  User,
  ApiResponse,
  UpdateMePayload,
  ActiveMePayload,
} from "../types/profile.types";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (res: ApiResponse<User>) => res.data,
      providesTags: (result) => [{ type: "Profile", id: result?._id }],
    }),

    updateMe: builder.mutation<User, UpdateMePayload>({
      // ⚠️ غيّرها PUT/POST إذا كان الـ backend مختلف
      query: (body) => ({ url: "/users/updateMe", method: "PATCH", body }),
      transformResponse: (res: ApiResponse<User>) => res.data,
      invalidatesTags: ["Profile"],
    }),

    updateMeAndUpload: builder.mutation<User, FormData>({
      query: (formData) => ({ url: "/users/updateMeAndUpload", method: "PATCH", body: formData }),
      transformResponse: (res: ApiResponse<User>) => res.data,
      invalidatesTags: ["Profile"],
    }),

    activeMe: builder.mutation<{ status: string }, ActiveMePayload>({
      query: (body) => ({ url: "/users/activeMe", method: "PATCH", body }),
    }),

    deleteMe: builder.mutation<{ status: string }, void>({
      query: () => ({ url: "/users/deleteMe", method: "DELETE" }),
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useUpdateMeMutation,
  useUpdateMeAndUploadMutation,
  useActiveMeMutation,
  useDeleteMeMutation,
} = profileApi;