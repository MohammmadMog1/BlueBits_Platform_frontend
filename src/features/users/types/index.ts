export type UserRole =
  | "USER"
  | "DOCTOR"
  | "LECTURER"
  | "BLUE"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  yearId?: string | { _id: string; name: string; order?: number } | null;
  profile_image?: string;
  profile_image_publicId?: string | null;
  isBanned?: boolean;
  createdAt: string;
  updatedAt: string;
  yearId?: string | null;
  year?: string;
  profile_image?: string;
  profile_image_publicId?: string | null;
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
