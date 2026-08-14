// src/features/profile/types/profile.types.ts
export type UserRole =
  | "USER"
  | "LECTURER"
  | "BLUE"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface User {
  _id: string;
  name: string;
  yearId?: string | null;
  email: string;
  role: UserRole;
  profile_image: string;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  passwordChangedAt?: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export interface UpdateMePayload {
  name?: string;
  yearId?: string;
}

export interface UpdateImagePayload {
  profile_image: string;
}

export interface ActiveMePayload {
  active: string; // "true" | "false" — string حسب الـ API عندك
}

export interface AcademicYear {
  _id: string;
  name: string;
}