import fetchMock from "fetch-mock";
import { thunk } from "redux-thunk";
import { legacy_configureStore as configureMockStore } from "redux-mock-store";
import type { RootState } from "store";
import { createInitialOrdersState } from "store/orders/types";
import { initialAuthState, ACCESS_TOKEN_KEY } from "store/auth/state";
import { deleteCookie, setCookie } from "utils/cookies";
import type { BurgerIngredientType } from "components/app-sections/section-constructor/section-constructor.type";
import { initialConstructorState } from "./state";
import type { ConstructorState } from "./types";
import { fetchIngredients, submitConstructorOrder } from "./thunk";

const API_BASE_URL = "https://norma.education-services.ru/api";

const jsonResponse = (body: unknown, status = 200) => ({
  status,
  body: JSON.stringify(body),
  headers: { "Content-Type": "application/json" },
});

const mockStore = configureMockStore<RootState>([thunk as any]);

const createConstructorState = (overrides?: Partial<ConstructorState>): ConstructorState => ({
  ...initialConstructorState,
  ...overrides,
});

const createMockState = (constructorOverrides?: Partial<ConstructorState>): RootState => ({
  burgerConstructor: createConstructorState(constructorOverrides),
  auth: {
    ...initialAuthState,
    status: { ...initialAuthState.status },
    errors: { ...initialAuthState.errors },
  },
  feedOrders: createInitialOrdersState(),
  profileOrders: createInitialOrdersState(),
});

const resetStorage = () => {
  deleteCookie(ACCESS_TOKEN_KEY);
};

const sampleBun: BurgerIngredientType = {
  _id: "bun-1",
  name: "Test bun",
  type: "bun",
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 120,
  image: "https://via.placeholder.com/150",
  image_mobile: "https://via.placeholder.com/80",
  image_large: "https://via.placeholder.com/240",
  __v: 0,
};

const sampleFilling: BurgerIngredientType = {
  _id: "main-1",
  name: "Test filling",
  type: "main",
  proteins: 2,
  fat: 2,
  carbohydrates: 2,
  calories: 2,
  price: 200,
  image: "https://via.placeholder.com/150",
  image_mobile: "https://via.placeholder.com/80",
  image_large: "https://via.placeholder.com/240",
  __v: 0,
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

describe("constructor thunks", () => {
  it("dispatches fulfilled after fetching ingredients", async () => {
    const store = mockStore(createMockState());
    fetchMock.getOnce(
      `${API_BASE_URL}/ingredients`,
      jsonResponse({ success: true, data: [sampleBun, sampleFilling] })
    );

    await store.dispatch(fetchIngredients() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchIngredients.pending.type);
    expect(actions[1].type).toBe(fetchIngredients.fulfilled.type);
    expect(actions[1].payload).toEqual([sampleBun, sampleFilling]);
  });

  it("dispatches rejected when ingredient fetch fails", async () => {
    const store = mockStore(createMockState());
    fetchMock.getOnce(
      `${API_BASE_URL}/ingredients`,
      jsonResponse({ success: false, data: [] })
    );

    await store.dispatch(fetchIngredients() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(fetchIngredients.pending.type);
    expect(actions[1].type).toBe(fetchIngredients.rejected.type);
    expect(actions[1].payload).toBe("Failed to fetch ingredients");
  });

  it("rejects order when there is no access token", async () => {
    const store = mockStore(createMockState());

    await store.dispatch(submitConstructorOrder() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(submitConstructorOrder.pending.type);
    expect(actions[1].type).toBe(submitConstructorOrder.rejected.type);
    expect(actions[1].payload).toBe("Необходимо авторизоваться для оформления заказа.");
    expect(fetchMock.callHistory.called()).toBe(false);
  });

  it("rejects order when bun is missing", async () => {
    setCookie(ACCESS_TOKEN_KEY, "access-token");
    const store = mockStore(
      createMockState({
        ingredients: [sampleFilling],
        selectedIngredients: {
          [sampleFilling._id]: { _id: sampleFilling._id, selected: ["fill-1"] },
        },
        selectedOrder: ["fill-1"],
      })
    );

    await store.dispatch(submitConstructorOrder() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(submitConstructorOrder.pending.type);
    expect(actions[1].type).toBe(submitConstructorOrder.rejected.type);
    expect(actions[1].payload).toBe("Выберите булку для заказа.");
    expect(fetchMock.callHistory.called()).toBe(false);
  });

  it("rejects order when fillings are missing", async () => {
    setCookie(ACCESS_TOKEN_KEY, "access-token");
    const store = mockStore(
      createMockState({
        ingredients: [sampleBun],
        selectedIngredients: {
          [sampleBun._id]: { _id: sampleBun._id, selected: ["bun-uid"] },
        },
        selectedOrder: [],
      })
    );

    await store.dispatch(submitConstructorOrder() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(submitConstructorOrder.pending.type);
    expect(actions[1].type).toBe(submitConstructorOrder.rejected.type);
    expect(actions[1].payload).toBe("Добавьте начинку перед оформлением заказа.");
    expect(fetchMock.callHistory.called()).toBe(false);
  });

  it("submits order with bun and fillings", async () => {
    setCookie(ACCESS_TOKEN_KEY, "access-token");
    const store = mockStore(
      createMockState({
        ingredients: [sampleBun, sampleFilling],
        selectedIngredients: {
          [sampleBun._id]: { _id: sampleBun._id, selected: ["bun-uid"] },
          [sampleFilling._id]: {
            _id: sampleFilling._id,
            selected: ["fill-1", "fill-2"],
          },
        },
        selectedOrder: ["fill-1", "fill-2"],
      })
    );
    fetchMock.postOnce(
      `${API_BASE_URL}/orders`,
      jsonResponse({ success: true, name: "Order", order: { number: 123 } })
    );

    await store.dispatch(submitConstructorOrder() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(submitConstructorOrder.pending.type);
    expect(actions[1].type).toBe(submitConstructorOrder.fulfilled.type);
    expect(actions[1].payload).toEqual({ orderNumber: 123 });

    const lastCall = fetchMock.callHistory.lastCall();
    const body = JSON.parse(String(lastCall?.options.body));
    expect(lastCall?.url).toBe(`${API_BASE_URL}/orders`);
    expect(body.ingredients).toEqual([
      sampleBun._id,
      sampleFilling._id,
      sampleFilling._id,
      sampleBun._id,
    ]);
    const headers = lastCall?.options.headers as Record<string, string> | undefined;
    expect(headers?.authorization).toBe("Bearer access-token");
  });

  it("rejects order when request fails", async () => {
    setCookie(ACCESS_TOKEN_KEY, "access-token");
    const store = mockStore(
      createMockState({
        ingredients: [sampleBun, sampleFilling],
        selectedIngredients: {
          [sampleBun._id]: { _id: sampleBun._id, selected: ["bun-uid"] },
          [sampleFilling._id]: { _id: sampleFilling._id, selected: ["fill-1"] },
        },
        selectedOrder: ["fill-1"],
      })
    );
    fetchMock.postOnce(`${API_BASE_URL}/orders`, { status: 500, body: "order error" });

    await store.dispatch(submitConstructorOrder() as any);

    const actions = store.getActions();
    expect(actions[0].type).toBe(submitConstructorOrder.pending.type);
    expect(actions[1].type).toBe(submitConstructorOrder.rejected.type);
    expect(actions[1].payload).toContain("Fetch error: 500");
  });
});
