import { feedOrdersActions, feedOrdersConnect, feedOrdersDisconnect, feedOrdersReducer } from "./feed-slice";
import { createInitialOrdersState } from "./types";
import type { ApiOrder } from "api/orders";

describe("feed orders reducer", () => {
  const sampleOrder: ApiOrder = {
    _id: "order-1",
    ingredients: ["a", "b"],
    status: "done",
    name: "Test order",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    number: 42,
  };

  it("returns the initial state", () => {
    const nextState = feedOrdersReducer(undefined, { type: "unknown" } as any);
    expect(nextState).toEqual(createInitialOrdersState());
  });

  it("handles socket connection start", () => {
    const state = createInitialOrdersState();
    const nextState = feedOrdersReducer(state, feedOrdersConnect());
    expect(nextState.status).toBe("loading");
    expect(nextState.error).toBeNull();
  });

  it("handles successful connection messages", () => {
    const state = createInitialOrdersState();
    const nextState = feedOrdersReducer(state, feedOrdersActions.connectionSuccess());
    expect(nextState.status).toBe("succeeded");
    expect(nextState.error).toBeNull();
  });

  it("tracks connection errors", () => {
    const state = createInitialOrdersState();
    const nextState = feedOrdersReducer(state, feedOrdersActions.connectionError("boom"));
    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe("boom");
  });

  it("stores incoming orders", () => {
    const state = createInitialOrdersState();
    const payload = {
      orders: [sampleOrder],
      total: 100,
      totalToday: 20,
    };

    const nextState = feedOrdersReducer(state, feedOrdersActions.ordersReceived(payload));
    expect(nextState.orders).toEqual(payload.orders);
    expect(nextState.total).toBe(100);
    expect(nextState.totalToday).toBe(20);
    expect(nextState.status).toBe("succeeded");
    expect(nextState.error).toBeNull();
  });

  it("resets the status on disconnect", () => {
    const state = createInitialOrdersState();
    const nextState = feedOrdersReducer(state, feedOrdersDisconnect());
    expect(nextState.status).toBe("idle");
  });
});
