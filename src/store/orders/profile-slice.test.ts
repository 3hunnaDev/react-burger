import {
  profileOrdersActions,
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersReducer,
} from "./profile-slice";
import { createInitialOrdersState } from "./types";
import type { ApiOrder } from "api/orders";

describe("profile orders reducer", () => {
  const sampleOrder: ApiOrder = {
    _id: "order-2",
    ingredients: ["x", "y"],
    status: "pending",
    name: "Profile order",
    createdAt: "2024-02-01T00:00:00.000Z",
    updatedAt: "2024-02-01T00:00:00.000Z",
    number: 10,
  };

  it("returns the initial state", () => {
    const nextState = profileOrdersReducer(undefined, { type: "unknown" } as any);
    expect(nextState).toEqual(createInitialOrdersState());
  });

  it("marks connection attempts", () => {
    const state = createInitialOrdersState();
    const nextState = profileOrdersReducer(state, profileOrdersConnect());
    expect(nextState.status).toBe("loading");
    expect(nextState.error).toBeNull();
  });

  it("handles successful connection messages", () => {
    const state = createInitialOrdersState();
    const nextState = profileOrdersReducer(state, profileOrdersActions.connectionSuccess());
    expect(nextState.status).toBe("succeeded");
    expect(nextState.error).toBeNull();
  });

  it("records errors coming from the socket", () => {
    const state = createInitialOrdersState();
    const nextState = profileOrdersReducer(state, profileOrdersActions.connectionError("boom"));
    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe("boom");
  });

  it("keeps the order list in sync", () => {
    const state = createInitialOrdersState();
    const payload = {
      orders: [sampleOrder],
      total: 1,
      totalToday: 1,
    };

    const nextState = profileOrdersReducer(state, profileOrdersActions.ordersReceived(payload));
    expect(nextState.orders).toEqual(payload.orders);
    expect(nextState.total).toBe(1);
    expect(nextState.totalToday).toBe(1);
    expect(nextState.status).toBe("succeeded");
  });

  it("resets the status when the socket disconnects", () => {
    const state = createInitialOrdersState();
    const nextState = profileOrdersReducer(state, profileOrdersDisconnect());
    expect(nextState.status).toBe("idle");
  });
});
