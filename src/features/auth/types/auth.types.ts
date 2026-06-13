// ===== ENUMS =====
export type UserRole =
  | "STUDENT"
  | "LECTURER"
  | "BLUE"
  | "ADMIN"
  | "SUPER_ADMIN";

// ===== PERMISSIONS =====
// export type Permission = string;

// ===== USER =====
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;

  // permissions?: Permission[];

  profile_image: string;
  isVerified: boolean;
  isBanned: boolean;

  year?: string;
  number?: string;

  createdAt: string;
  updatedAt: string;
}

// ===== BASE API RESPONSE =====
export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}

// ===== LOGIN =====
export type LoginResponse = ApiResponse<{
  token: string;
  user: User;
}>;


export interface RegisterUser {
  id: string;
  name: string;
  email: string;
}

// ===== REGISTER =====
export type RegisterResponse = ApiResponse<{
  user: RegisterUser;
  message: string;
}>;

// ===== VERIFY EMAIL =====
export interface VerifyEmailResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

// ===== AUTH STATE =====
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ===== FORGOT PASSWORD =====
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

// ===== UPDATE MY PASSWORD =====
export interface UpdateMyPasswordRequest {
  passwordCurrent: string;
  password: string;
}

export type UpdateMyPasswordResponse = ApiResponse<{
  token: string;
  user: User;
}>;

// ===== RESET PASSWORD =====
export interface ResetPasswordRequest {
  password: string;
  passwordConfirm: string;
}

export type ResetPasswordResponse = ApiResponse<{
  token: string;
  user: User;
}>;

// ===== GET ME =====
export type GetMeResponse = ApiResponse<{
  user: User;
}>;
