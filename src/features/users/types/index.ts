export type UserRole =
  | "USER"
  | "DOCTOR"
  | "LECTURER"
  | "BLUE"
  | "ADMIN"
  | "SUPER_ADMIN";

export type Permission =
  | "CREATE_QUESTION_BANK"
  | "UPDATE_QUESTION"
  | "DELETE_QUESTION";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  yearId?: string | null;
  year?: string;
  profile_image?: string;
  profile_image_publicId?: string | null;
  permissions?: Permission[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRolePayload {
  role: UserRole;
}

export interface UsersResponse {
  data: User[];
}

export interface UsersStatsItem {
  label: string;
  value: number;
  color: string;
}

export const USER_ROLES: UserRole[] = [
  "USER",
  "DOCTOR",
  "LECTURER",
  "BLUE",
  "ADMIN",
  "SUPER_ADMIN",
];

export const ROLE_COLORS: Record<UserRole, string> = {
  USER: "bg-slate-100 text-slate-700",
  DOCTOR: "bg-violet-100 text-violet-700",
  LECTURER: "bg-indigo-100 text-indigo-700",
  BLUE: "bg-cyan-100 text-cyan-700",
  ADMIN: "bg-emerald-100 text-emerald-700",
  SUPER_ADMIN: "bg-rose-100 text-rose-700",
};

/**
 * قائمة الصلاحيات – نخزّن المفتاح فقط، والتسمية والوصف يُترجَمان عند العرض
 * عبر `users:permissions.<key>.label` و `.description`.
 */
export const PERMISSIONS_LIST: Permission[] = [
  "CREATE_QUESTION_BANK",
  "UPDATE_QUESTION",
  "DELETE_QUESTION",
];
