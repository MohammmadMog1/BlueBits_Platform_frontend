import apiClient from "../../../shared/api/apiClient";

import type {
  LoginResponse,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  GetMeResponse,
  VerifyEmailResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";


//
export const loginApi = async (
    data: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post("/users/login", data);

  return response.data;
};


export const registerApi = async (
data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await apiClient.post("/users/signup", data);

  return response.data;
};


export const logoutApi = async () => {
  const response = await apiClient.get("/users/logout");

  return response.data;
};


export const getMeApi =
  async (): Promise<GetMeResponse> => {
    const response =
      await apiClient.get("/users/me");

    return response.data;
  };

  export const forgotPasswordApi = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  const response = await apiClient.post(
    "/users/forgotPassword",
    {
      email,
    }
  );

  return response.data;
};




export const resetPasswordApi = async (
  token: string,
  password: string
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.patch(
    `/users/resetPassword/${token}`,
    {
      password,
    }
  );

  return response.data;
};


export const verifyEmailApi = async (
  token: string
): Promise<VerifyEmailResponse> => {
  const response =
    await apiClient.get(
      `/users/verifyEmail/${token}`
    );

  return response.data;
};


export const resendVerificationApi = async (
  email: string
) => {
  const response =
    await apiClient.post(
      "/users/resendVerification",
      {
        email,
      }
    );

  return response.data;
};