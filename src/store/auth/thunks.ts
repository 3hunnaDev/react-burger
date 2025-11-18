import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserRequest,
  loginUserRequest,
  logoutUserRequest,
  refreshTokenRequest,
  registerUserRequest,
  requestPasswordReset,
  resetPasswordRequest,
  updateUserRequest,
} from "api";
import type { LoginPayload, RegisterPayload } from "api/auth";
import { deleteCookie, getCookie, setCookie } from "utils/cookies";
import type { AuthUser } from "./types";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./state";

const normalizeAccessToken = (token: string): string =>
  token.startsWith("Bearer ") ? token.slice(7) : token;

const withLocalStorage = <T>(callback: (storage: Storage) => T): T | null => {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }

  try {
    return callback(window.localStorage);
  } catch {
    return null;
  }
};

const getRefreshTokenFromStorage = (): string | null =>
  withLocalStorage((storage) => storage.getItem(REFRESH_TOKEN_KEY));

const saveRefreshToken = (token: string): void => {
  withLocalStorage((storage) => storage.setItem(REFRESH_TOKEN_KEY, token));
};

const removeRefreshToken = (): void => {
  withLocalStorage((storage) => storage.removeItem(REFRESH_TOKEN_KEY));
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  const normalizedAccessToken = normalizeAccessToken(accessToken);
  setCookie(ACCESS_TOKEN_KEY, normalizedAccessToken);
  if (refreshToken) {
    saveRefreshToken(refreshToken);
  }
  return { accessToken: normalizedAccessToken, refreshToken };
};

const clearTokens = () => {
  deleteCookie(ACCESS_TOKEN_KEY);
  removeRefreshToken();
};

const getStoredAccessToken = (): string | null => getCookie(ACCESS_TOKEN_KEY) ?? null;

const isTokenError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("jwt expired") ||
    message.includes("403") ||
    message.includes("401") ||
    message.includes("token")
  );
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Произошла ошибка. Попробуйте позже";
};

const refreshTokensFlow = async () => {
  const refreshToken = getRefreshTokenFromStorage();
  if (!refreshToken) {
    throw new Error("Отсутствует refresh token");
  }

  const response = await refreshTokenRequest(refreshToken);
  return saveTokens(response.accessToken, response.refreshToken);
};

const requestWithRefresh = async <T>(callback: (accessToken: string) => Promise<T>) => {
  let accessToken = getStoredAccessToken();
  if (!accessToken) {
    throw new Error("Требуется авторизация");
  }

  try {
    return await callback(accessToken);
  } catch (error) {
    if (!isTokenError(error)) {
      throw error;
    }

    const tokens = await refreshTokensFlow();
    accessToken = tokens.accessToken;
    return callback(accessToken);
  }
};

export const registerUser = createAsyncThunk<
  { user: AuthUser; accessToken: string; refreshToken: string },
  RegisterPayload,
  { rejectValue: string }
>("auth/registerUser", async (payload, { rejectWithValue }) => {
  try {
    const response = await registerUserRequest(payload);
    const tokens = saveTokens(response.accessToken, response.refreshToken);
    return { user: response.user, ...tokens };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<
  { user: AuthUser; accessToken: string; refreshToken: string },
  LoginPayload,
  { rejectValue: string }
>("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const response = await loginUserRequest(payload);
    const tokens = saveTokens(response.accessToken, response.refreshToken);
    return { user: response.user, ...tokens };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshTokenFromStorage();
      clearTokens();

      if (!refreshToken) {
        return;
      }

      await logoutUserRequest(refreshToken);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const refreshAuthToken = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  { rejectValue: string }
>("auth/refreshAuthToken", async (_, { rejectWithValue }) => {
  try {
    return await refreshTokensFlow();
  } catch (error) {
    clearTokens();
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCurrentUser = createAsyncThunk<
  { user: AuthUser; accessToken: string | null; refreshToken: string | null },
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await requestWithRefresh((accessToken) => getUserRequest(accessToken));
    const accessToken = getStoredAccessToken();
    const refreshToken = getRefreshTokenFromStorage();
    return { user: response.user, accessToken, refreshToken };
  } catch (error) {
    if (isTokenError(error)) {
      clearTokens();
    }
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateUserProfile = createAsyncThunk<
  AuthUser,
  Partial<RegisterPayload>,
  { rejectValue: string }
>("auth/updateUserProfile", async (payload, { rejectWithValue }) => {
  try {
    const response = await requestWithRefresh((accessToken) =>
      updateUserRequest(payload, accessToken)
    );
    return response.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk<
  string,
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await requestPasswordReset({ email });
    return response.message;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const resetPassword = createAsyncThunk<
  string,
  { password: string; token: string },
  { rejectValue: string }
>("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await resetPasswordRequest(payload);
    return response.message;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
