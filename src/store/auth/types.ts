export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AuthUser {
  email: string;
  name: string;
}

export type AuthRequestKey =
  | "login"
  | "register"
  | "logout"
  | "forgotPassword"
  | "resetPassword"
  | "getUser"
  | "updateUser"
  | "refresh";

export type AuthStatusMap = Record<AuthRequestKey, RequestStatus>;
export type AuthErrorMap = Record<AuthRequestKey, string | null>;

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isUserChecked: boolean;
  isResetPasswordAllowed: boolean;
  status: AuthStatusMap;
  errors: AuthErrorMap;
}
