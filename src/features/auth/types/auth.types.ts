// ===== ENUMS =====
export type UserRole =
  | "USER"
  | "LECTURER"
  | "BLUE"
  | "ADMIN"
  | "SUPER_ADMIN";

// ===== PERMISSIONS =====
export type Permission =
  | "CREATE_QUESTION_BANK"
  | "UPDATE_QUESTION"
  | "DELETE_QUESTION";

// ===== AUTH STATE =====
export interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ===== USER =====
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;

  permissions: Permission[];

  profile_image: string;
  isVerified: boolean;
  isBanned: boolean;

  year?: string;
  number?: string;

  createdAt: string;
  updatedAt: string;
}

// ===== BASE API RESPONSE =====
export interface IApiResponse<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
}

// ===== LOGIN =====
export type LoginResponse = IApiResponse<{
  token: string;
  user: IUser;
}>;


export interface LoginRequest {
  email: string;
  password: string;
}



// ===== REGISTER =====
export type RegisterResponse = IApiResponse<IUser>;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// ===== VERIFY EMAIL =====
export interface VerifyEmailResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
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

export type UpdateMyPasswordResponse = IApiResponse<{
  token: string;
  user: IUser;
}>;

// ===== RESET PASSWORD =====
export interface ResetPasswordRequest {
  password: string;
}

export type ResetPasswordResponse = IApiResponse<{
  token: string;
  user: IUser;
}>;

// ===== GET ME =====
export type GetMeResponse = IApiResponse<IUser>;
