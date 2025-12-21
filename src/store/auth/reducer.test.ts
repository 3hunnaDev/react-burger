import authReducer, { setResetPasswordAllowed } from "./reducer";
import { initialAuthState } from "./state";
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
import type { AuthState } from "./types";

const sampleUser = {
  email: "tester@example.com",
  name: "Tester",
};

const cloneAuthState = (): AuthState => ({
  ...initialAuthState,
  status: { ...initialAuthState.status },
  errors: { ...initialAuthState.errors },
});

describe("auth reducer", () => {
  it("returns the initial state for unknown actions", () => {
    const nextState = authReducer(undefined, { type: "unknown" } as any);
    expect(nextState).toEqual(initialAuthState);
  });

  it("toggles the reset password flag", () => {
    const state = cloneAuthState();
    const nextState = authReducer(state, setResetPasswordAllowed(true));
    expect(nextState.isResetPasswordAllowed).toBe(true);
  });

  describe("registerUser lifecycle", () => {
    it("marks the request as loading on pending", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, { type: registerUser.pending.type } as any);
      expect(nextState.status.register).toBe("loading");
      expect(nextState.errors.register).toBeNull();
    });

    it("stores user info on fulfilled", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: registerUser.fulfilled.type,
        payload: {
          user: sampleUser,
          accessToken: "access",
          refreshToken: "refresh",
        },
      } as any);

      expect(nextState.user).toEqual(sampleUser);
      expect(nextState.accessToken).toBe("access");
      expect(nextState.refreshToken).toBe("refresh");
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.isUserChecked).toBe(true);
      expect(nextState.status.register).toBe("succeeded");
      expect(nextState.errors.register).toBeNull();
    });

    it("captures errors on rejection", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: registerUser.rejected.type,
        payload: "register-failed",
        error: { message: "ignored" },
      } as any);

      expect(nextState.errors.register).toBe("register-failed");
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.status.register).toBe("failed");
    });
  });

  describe("loginUser lifecycle", () => {
    it("applies data from fulfilled actions", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: loginUser.fulfilled.type,
        payload: {
          user: sampleUser,
          accessToken: "access-login",
          refreshToken: "refresh-login",
        },
      } as any);

      expect(nextState.user).toEqual(sampleUser);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.status.login).toBe("succeeded");
    });

    it("records error messages from rejection", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: loginUser.rejected.type,
        payload: "login-failed",
      } as any);

      expect(nextState.errors.login).toBe("login-failed");
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.status.login).toBe("failed");
    });
  });

  describe("logoutUser lifecycle", () => {
    it("clears tokens on fulfilled", () => {
      const state = cloneAuthState();
      state.user = sampleUser;
      state.accessToken = "token";
      state.refreshToken = "refresh";
      state.isAuthenticated = true;
      const nextState = authReducer(state, { type: logoutUser.fulfilled.type } as any);

      expect(nextState.user).toBeNull();
      expect(nextState.accessToken).toBeNull();
      expect(nextState.refreshToken).toBeNull();
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.isResetPasswordAllowed).toBe(false);
      expect(nextState.status.logout).toBe("succeeded");
    });

    it("stores logout errors and keeps user cleared", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: logoutUser.rejected.type,
        payload: "logout-failed",
        error: { message: "boom" },
      } as any);

      expect(nextState.errors.logout).toBe("logout-failed");
      expect(nextState.user).toBeNull();
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.status.logout).toBe("failed");
      expect(nextState.isUserChecked).toBe(true);
    });
  });

  describe("refreshAuthToken lifecycle", () => {
    it("updates tokens on success", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: refreshAuthToken.fulfilled.type,
        payload: { accessToken: "refresh-access", refreshToken: "refresh-refresh" },
      } as any);

      expect(nextState.accessToken).toBe("refresh-access");
      expect(nextState.refreshToken).toBe("refresh-refresh");
      expect(nextState.status.refresh).toBe("succeeded");
    });

    it("clears authentication on rejection", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: refreshAuthToken.rejected.type,
        payload: "refresh-failed",
      } as any);

      expect(nextState.accessToken).toBeNull();
      expect(nextState.refreshToken).toBeNull();
      expect(nextState.user).toBeNull();
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.status.refresh).toBe("failed");
    });
  });

  describe("fetchCurrentUser lifecycle", () => {
    it("fills the user data and tokens when fulfilled", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: fetchCurrentUser.fulfilled.type,
        payload: { user: sampleUser, accessToken: "current-access", refreshToken: "current-refresh" },
      } as any);

      expect(nextState.user).toEqual(sampleUser);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.isUserChecked).toBe(true);
      expect(nextState.status.getUser).toBe("succeeded");
    });

    it("resets authentication on rejection", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: fetchCurrentUser.rejected.type,
        payload: "fetch-user-failed",
      } as any);

      expect(nextState.user).toBeNull();
      expect(nextState.accessToken).toBeNull();
      expect(nextState.refreshToken).toBeNull();
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.isUserChecked).toBe(true);
      expect(nextState.errors.getUser).toBe("fetch-user-failed");
    });
  });

  describe("updateUserProfile lifecycle", () => {
    it("updates the stored user on success", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: updateUserProfile.fulfilled.type,
        payload: { ...sampleUser, name: "updated" },
      } as any);

      expect(nextState.user?.name).toBe("updated");
      expect(nextState.status.updateUser).toBe("succeeded");
      expect(nextState.errors.updateUser).toBeNull();
    });

    it("keeps the previous user and records errors on failure", () => {
      const state = cloneAuthState();
      const currentUser = { ...sampleUser };
      state.user = currentUser;
      const nextState = authReducer(state, {
        type: updateUserProfile.rejected.type,
        payload: "update-failed",
      } as any);

      expect(nextState.user).toEqual(currentUser);
      expect(nextState.errors.updateUser).toBe("update-failed");
      expect(nextState.status.updateUser).toBe("failed");
    });
  });

  describe("forgotPassword lifecycle", () => {
    it("allows resetting password after success", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: forgotPassword.fulfilled.type,
      } as any);

      expect(nextState.isResetPasswordAllowed).toBe(true);
      expect(nextState.status.forgotPassword).toBe("succeeded");
      expect(nextState.errors.forgotPassword).toBeNull();
    });

    it("blocks reset when request fails", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: forgotPassword.rejected.type,
        payload: "forgot-failed",
      } as any);

      expect(nextState.isResetPasswordAllowed).toBe(false);
      expect(nextState.errors.forgotPassword).toBe("forgot-failed");
      expect(nextState.status.forgotPassword).toBe("failed");
    });
  });

  describe("resetPassword lifecycle", () => {
    it("clears the reset flag on success", () => {
      const state = cloneAuthState();
      state.isResetPasswordAllowed = true;
      const nextState = authReducer(state, {
        type: resetPassword.fulfilled.type,
      } as any);

      expect(nextState.isResetPasswordAllowed).toBe(false);
      expect(nextState.errors.resetPassword).toBeNull();
      expect(nextState.status.resetPassword).toBe("succeeded");
    });

    it("records errors on failure", () => {
      const state = cloneAuthState();
      const nextState = authReducer(state, {
        type: resetPassword.rejected.type,
        payload: "reset-failed",
      } as any);

      expect(nextState.errors.resetPassword).toBe("reset-failed");
      expect(nextState.status.resetPassword).toBe("failed");
    });
  });
});
