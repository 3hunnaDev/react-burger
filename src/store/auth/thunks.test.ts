import fetchMock from "fetch-mock";
import { thunk } from "redux-thunk";
import { legacy_configureStore as configureMockStore } from "redux-mock-store";
import type { RootState } from "store";
import { createInitialOrdersState } from "store/orders/types";
import { initialConstructorState } from "store/constructor/state";
import { deleteCookie, getCookie, setCookie } from "utils/cookies";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, initialAuthState } from "./state";
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

const API_BASE_URL = "https://norma.education-services.ru/api";

const jsonResponse = (body: unknown, status = 200) => ({
  status,
  body: JSON.stringify(body),
  headers: { "Content-Type": "application/json" },
});

const mockStore = configureMockStore<RootState>([thunk as any]);

const createMockState = (): RootState => ({
  burgerConstructor: { ...initialConstructorState },
  auth: {
    ...initialAuthState,
    status: { ...initialAuthState.status },
    errors: { ...initialAuthState.errors },
  },
  feedOrders: createInitialOrdersState(),
  profileOrders: createInitialOrdersState(),
});

const resetStorage = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  deleteCookie(ACCESS_TOKEN_KEY);
};

const sampleUser = {
  email: "tester@example.com",
  name: "Tester",
};

beforeAll(() => {
  fetchMock.mockGlobal();
});

afterEach(() => {
  fetchMock.clearHistory();
  fetchMock.removeRoutes();
  resetStorage();
});

afterAll(() => {
  fetchMock.unmockGlobal();
  resetStorage();
});

describe("auth thunks", () => {
  it("dispatches fulfilled and stores tokens on register success", async () => {
    const store = mockStore(createMockState());
    fetchMock.postOnce(
      `${API_BASE_URL}/auth/register`,
      jsonResponse({
        success: true,
        user: sampleUser,
        accessToken: "Bearer access-123",
        refreshToken: "refresh-123",
      })
    );

    await store.dispatch(
      registerUser({ email: sampleUser.email, password: "secret", name: sampleUser.name }) as any
    );

    const actions = store.getActions();
    expect(actions[0].type).toBe(registerUser.pending.type);
    expect(actions[1].type).toBe(registerUser.fulfilled.type);
    expect(actions[1].payload.user).toEqual(sampleUser);
    expect(getCookie(ACCESS_TOKEN_KEY)).toBe("access-123");
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("refresh-123");
  });

  it("dispatches rejected when register fails", async () => {
    const store = mockStore(createMockState());
    fetchMock.postOnce(`${API_BASE_URL}/auth/register`, {
      status: 500,
      body: "server error",
    });

    await store.dispatch(
      registerUser({ email: sampleUser.email, password: "secret", name: sampleUser.name }) as any
    );

    const actions = store.getActions();
    expect(actions[0].type).toBe(registerUser.pending.type);
    expect(actions[1].type).toBe(registerUser.rejected.type);
    expect(actions[1].payload).toContain("Fetch error: 500");
  });

  it("dispatches fulfilled and stores tokens on login success", async () => {
    const store = mockStore(createMockState());
    fetchMock.postOnce(
      `${API_BASE_URL}/auth/login`,
      jsonResponse({
        success: true,
        user: sampleUser,
        accessToken: "Bearer access-login",
        refreshToken: "refresh-login",
      })
    );

    await store.dispatch(
      loginUser({ email: sampleUser.email, password: "secret" }) as any
    );

    const actions = store.getActions();
    expect(actions[0].type).toBe(loginUser.pending.type);
    expect(actions[1].type).toBe(loginUser.fulfilled.type);
    expect(actions[1].payload.user).toEqual(sampleUser);
    expect(getCookie(ACCESS_TOKEN_KEY)).toBe("access-login");
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("refresh-login");
  });

  it("dispatches rejected when login fails", async () => {
    const store = mockStore(createMockState());
    fetchMock.postOnce(`${API_BASE_URL}/auth/login`, {
      status: 401,
      body: "invalid credentials",
    });

    await store.dispatch(
      loginUser({ email: sampleUser.email, password: "secret" }) as any
    );

    const actions = store.getActions();
    expect(actions[0].type).toBe(loginUser.pending.type);
    expect(actions[1].type).toBe(loginUser.rejected.type);
    expect(actions[1].payload).toContain("Fetch error: 401");
  });

  it("clears tokens and calls logout when refresh token exists", async () => {
    const store = mockStore(createMockState());
    setCookie(ACCESS_TOKEN_KEY, "access-logout");
    localStorage.setItem(REFRESH_TOKEN_KEY, "refresh-logout");
    fetchMock.postOnce(
      `${API_BASE_URL}/auth/logout`,
      jsonResponse({ success: true, message: "ok" })
    );

    await store.dispatch(logoutUser() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(logoutUser.pending.type);
    expect(actions[1].type).toBe(logoutUser.fulfilled.type);
    expect(getCookie(ACCESS_TOKEN_KEY)).toBeUndefined();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
  });

  it("skips logout request when refresh token is missing", async () => {
    const store = mockStore(createMockState());

    await store.dispatch(logoutUser() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(logoutUser.pending.type);
    expect(actions[1].type).toBe(logoutUser.fulfilled.type);
    expect(fetchMock.callHistory.called()).toBe(false);
  });

  it("refreshes tokens when refresh auth succeeds", async () => {
    const store = mockStore(createMockState());
    localStorage.setItem(REFRESH_TOKEN_KEY, "refresh-old");
    fetchMock.postOnce(
      `${API_BASE_URL}/auth/token`,
      jsonResponse({
        success: true,
        accessToken: "Bearer access-new",
        refreshToken: "refresh-new",
      })
    );

    await store.dispatch(refreshAuthToken() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(refreshAuthToken.pending.type);
    expect(actions[1].type).toBe(refreshAuthToken.fulfilled.type);
    expect(getCookie(ACCESS_TOKEN_KEY)).toBe("access-new");
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe("refresh-new");
  });

  it("clears tokens when refresh auth fails", async () => {
    const store = mockStore(createMockState());
    setCookie(ACCESS_TOKEN_KEY, "access-old");
    localStorage.setItem(REFRESH_TOKEN_KEY, "refresh-old");
    fetchMock.postOnce(`${API_BASE_URL}/auth/token`, { status: 403, body: "token expired" });

    await store.dispatch(refreshAuthToken() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(refreshAuthToken.pending.type);
    expect(actions[1].type).toBe(refreshAuthToken.rejected.type);
    expect(getCookie(ACCESS_TOKEN_KEY)).toBeUndefined();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
  });

  it("loads current user when tokens are valid", async () => {
    const store = mockStore(createMockState());
    setCookie(ACCESS_TOKEN_KEY, "access-token");
    localStorage.setItem(REFRESH_TOKEN_KEY, "refresh-token");
    fetchMock.getOnce(
      `${API_BASE_URL}/auth/user`,
      jsonResponse({ success: true, user: sampleUser })
    );

    await store.dispatch(fetchCurrentUser() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchCurrentUser.pending.type);
    expect(actions[1].type).toBe(fetchCurrentUser.fulfilled.type);
    expect(actions[1].payload).toEqual({
      user: sampleUser,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  it("clears tokens when user fetch fails with auth error", async () => {
    const store = mockStore(createMockState());
    setCookie(ACCESS_TOKEN_KEY, "access-token");
    localStorage.setItem(REFRESH_TOKEN_KEY, "refresh-token");
    fetchMock.getOnce(`${API_BASE_URL}/auth/user`, {
      status: 401,
      body: "jwt expired",
    });

    await store.dispatch(fetchCurrentUser() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchCurrentUser.pending.type);
    expect(actions[1].type).toBe(fetchCurrentUser.rejected.type);
    expect(getCookie(ACCESS_TOKEN_KEY)).toBeUndefined();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
  });

  it("updates user profile with valid tokens", async () => {
    const store = mockStore(createMockState());
    setCookie(ACCESS_TOKEN_KEY, "access-token");
    const updatedUser = { ...sampleUser, name: "Updated" };
    fetchMock.patchOnce(
      `${API_BASE_URL}/auth/user`,
      jsonResponse({ success: true, user: updatedUser })
    );

    await store.dispatch(updateUserProfile({ name: "Updated" }) as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(updateUserProfile.pending.type);
    expect(actions[1].type).toBe(updateUserProfile.fulfilled.type);
    expect(actions[1].payload).toEqual(updatedUser);
  });

  it("dispatches success for forgot password requests", async () => {
    const store = mockStore(createMockState());
    fetchMock.postOnce(
      `${API_BASE_URL}/password-reset`,
      jsonResponse({ success: true, message: "Reset email sent" })
    );

    await store.dispatch(forgotPassword({ email: sampleUser.email }) as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(forgotPassword.pending.type);
    expect(actions[1].type).toBe(forgotPassword.fulfilled.type);
    expect(actions[1].payload).toBe("Reset email sent");
  });

  it("dispatches success for reset password requests", async () => {
    const store = mockStore(createMockState());
    fetchMock.postOnce(
      `${API_BASE_URL}/password-reset/reset`,
      jsonResponse({ success: true, message: "Password updated" })
    );

    await store.dispatch(resetPassword({ password: "newpass", token: "reset-token" }) as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(resetPassword.pending.type);
    expect(actions[1].type).toBe(resetPassword.fulfilled.type);
    expect(actions[1].payload).toBe("Password updated");
  });
});
