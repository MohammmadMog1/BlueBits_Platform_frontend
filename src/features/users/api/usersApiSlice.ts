import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../../app/store/store";
import type {
  CreateUserPayload,
  Permission,
  User,
  UsersResponse,
  UserRole,
} from "../types";

/**
 * يفكّ تغليف استجابة قائمة المستخدمين مهما كان شكلها:
 * مصفوفة مباشرة، أو { data: [...] }، أو { data: { users: [...] } } (envelope الحالي).
 * بدون هذا التفكيك يصبح `result` كائناً لا مصفوفة، فيفشل `.map()` داخل
 * `providesTags` بصمت ويبقى الطلب عالقاً في حالة "تحميل" للأبد رغم نجاحه.
 */
const unwrapUsers = (response: unknown): User[] => {
  if (Array.isArray(response)) return response;
  const data = (response as { data?: unknown })?.data;
  if (Array.isArray(data)) return data;
  const nestedUsers = (data as { users?: unknown })?.users;
  if (Array.isArray(nestedUsers)) return nestedUsers;
  const directUsers = (response as { users?: unknown })?.users;
  if (Array.isArray(directUsers)) return directUsers;
  return [];
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");

      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: (response: UsersResponse | User[]) => unwrapUsers(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({
                type: "Users" as const,
                id: user._id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUsersByYear: builder.query<User[], string>({
      query: (yearId) => `/users/year/${yearId}`,
      transformResponse: (response: UsersResponse | User[]) => unwrapUsers(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({
                type: "Users" as const,
                id: user._id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    createUser: builder.mutation<User, CreateUserPayload>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: User } | User) => {
        return (response as { data: User }).data ?? (response as User);
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUserRole: builder.mutation<User, { id: string; role: UserRole }>({
      query: ({ id, role }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: { role },
      }),
      transformResponse: (response: { data: User } | User) => {
        return (response as { data: User }).data ?? (response as User);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    grantPermission: builder.mutation<User, { id: string; permission: Permission }>({
      query: ({ id, permission }) => ({
        url: `/users/${id}/permissions/grant`,
        method: "PATCH",
        body: { permission },
      }),
      transformResponse: (response: { data: User } | User) => {
        return (response as { data: User }).data ?? (response as User);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    revokePermission: builder.mutation<User, { id: string; permission: Permission }>({
      query: ({ id, permission }) => ({
        url: `/users/${id}/permissions/revoke`,
        method: "PATCH",
        body: { permission },
      }),
      transformResponse: (response: { data: User } | User) => {
        return (response as { data: User }).data ?? (response as User);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersByYearQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGrantPermissionMutation,
  useRevokePermissionMutation,
} = usersApi;
