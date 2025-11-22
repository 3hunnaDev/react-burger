import { apiRequest } from "./api-request";

export interface UserResponse {
  email: string;
  name: string;
}

interface AuthSuccessResponse {
  success: boolean;
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

interface TokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

interface UserDataResponse {
  success: boolean;
  user: UserResponse;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  password: string;
  token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUserRequest(
  payload: RegisterPayload
): Promise<AuthSuccessResponse> {
  return apiRequest<AuthSuccessResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUserRequest(
  payload: LoginPayload
): Promise<AuthSuccessResponse> {
  return apiRequest<AuthSuccessResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutUserRequest(token: string): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function refreshTokenRequest(token: string): Promise<TokenResponse> {
  return apiRequest<TokenResponse>("/auth/token", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function getUserRequest(accessToken: string): Promise<UserDataResponse> {
  return apiRequest<UserDataResponse>("/auth/user", {
    method: "GET",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function updateUserRequest(
  data: Partial<RegisterPayload>,
  accessToken: string
): Promise<UserDataResponse> {
  return apiRequest<UserDataResponse>("/auth/user", {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
}

export async function requestPasswordReset(
  payload: ForgotPasswordPayload
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/password-reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPasswordRequest(
  payload: ResetPasswordPayload
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>("/password-reset/reset", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
