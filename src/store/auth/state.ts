import { getCookie } from "utils/cookies";
import type { AuthErrorMap, AuthState, AuthStatusMap } from "./types";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

const defaultStatusValue: AuthStatusMap = {
  login: "idle",
  register: "idle",
  logout: "idle",
  forgotPassword: "idle",
  resetPassword: "idle",
  getUser: "idle",
  updateUser: "idle",
  refresh: "idle",
};

const defaultErrorMap: AuthErrorMap = {
  login: null,
  register: null,
  logout: null,
  forgotPassword: null,
  resetPassword: null,
  getUser: null,
  updateUser: null,
  refresh: null,
};

const getStoredAccessToken = (): string | null => getCookie(ACCESS_TOKEN_KEY) ?? null;

const getStoredRefreshToken = (): string | null => {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const initialAuthState: AuthState = {
  user: null,
  accessToken: getStoredAccessToken(),
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: false,
  isUserChecked: false,
  isResetPasswordAllowed: false,
  status: { ...defaultStatusValue },
  errors: { ...defaultErrorMap },
};
