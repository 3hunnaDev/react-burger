import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialAuthState } from "./state";
import type { AuthRequestKey, AuthState } from "./types";
import {
  fetchCurrentUser,
  forgotPassword,
  loginUser,
  logoutUser,
  refreshAuthToken,
  registerUser,
  resetPassword,
  updateUserProfile,
} from "./thunks";

const setRequestStatus = (
  state: AuthState,
  key: AuthRequestKey,
  status: AuthState["status"][AuthRequestKey]
) => {
  state.status[key] = status;
  if (status === "loading") {
    state.errors[key] = null;
  }
};

const setRequestError = (
  state: AuthState,
  key: AuthRequestKey,
  error: string | undefined | null
) => {
  state.status[key] = "failed";
  state.errors[key] = error ?? "Произошла ошибка";
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setResetPasswordAllowed: (state, action: PayloadAction<boolean>) => {
      state.isResetPasswordAllowed = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        setRequestStatus(state, "register", "loading");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        setRequestStatus(state, "register", "succeeded");
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isUserChecked = true;
        state.errors.register = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        setRequestError(state, "register", action.payload ?? action.error.message);
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        setRequestStatus(state, "login", "loading");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        setRequestStatus(state, "login", "succeeded");
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isUserChecked = true;
        state.errors.login = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        setRequestError(state, "login", action.payload ?? action.error.message);
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        setRequestStatus(state, "logout", "loading");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        setRequestStatus(state, "logout", "succeeded");
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isResetPasswordAllowed = false;
        state.isUserChecked = true;
        state.errors.logout = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        setRequestError(state, "logout", action.payload ?? action.error.message);
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.isUserChecked = true;
      })
      .addCase(refreshAuthToken.pending, (state) => {
        setRequestStatus(state, "refresh", "loading");
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        setRequestStatus(state, "refresh", "succeeded");
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.errors.refresh = null;
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        setRequestError(state, "refresh", action.payload ?? action.error.message);
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        setRequestStatus(state, "getUser", "loading");
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        setRequestStatus(state, "getUser", "succeeded");
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isUserChecked = true;
        state.errors.getUser = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        setRequestError(state, "getUser", action.payload ?? action.error.message);
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isUserChecked = true;
      })
      .addCase(updateUserProfile.pending, (state) => {
        setRequestStatus(state, "updateUser", "loading");
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        setRequestStatus(state, "updateUser", "succeeded");
        state.user = action.payload;
        state.errors.updateUser = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        setRequestError(state, "updateUser", action.payload ?? action.error.message);
      })
      .addCase(forgotPassword.pending, (state) => {
        setRequestStatus(state, "forgotPassword", "loading");
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        setRequestStatus(state, "forgotPassword", "succeeded");
        state.isResetPasswordAllowed = true;
        state.errors.forgotPassword = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        setRequestError(state, "forgotPassword", action.payload ?? action.error.message);
        state.isResetPasswordAllowed = false;
      })
      .addCase(resetPassword.pending, (state) => {
        setRequestStatus(state, "resetPassword", "loading");
      })
      .addCase(resetPassword.fulfilled, (state) => {
        setRequestStatus(state, "resetPassword", "succeeded");
        state.isResetPasswordAllowed = false;
        state.errors.resetPassword = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        setRequestError(state, "resetPassword", action.payload ?? action.error.message);
      });
  },
});

export const { setResetPasswordAllowed } = authSlice.actions;
export default authSlice.reducer;
