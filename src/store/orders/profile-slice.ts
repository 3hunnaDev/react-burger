import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrdersPayload, OrdersState } from "./types";
import { createInitialOrdersState } from "./types";

export const profileOrdersConnect = createAction("orders/profile/connect");
export const profileOrdersDisconnect = createAction("orders/profile/disconnect");

const initialState: OrdersState = createInitialOrdersState();

const profileOrdersSlice = createSlice({
  name: "profileOrders",
  initialState,
  reducers: {
    connectionSuccess: (state) => {
      state.status = "succeeded";
      state.error = null;
    },
    connectionError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
    connectionClosed: (state) => {
      state.status = "idle";
    },
    ordersReceived: (state, action: PayloadAction<OrdersPayload>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profileOrdersConnect, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(profileOrdersDisconnect, (state) => {
        state.status = "idle";
      });
  },
});

export const profileOrdersReducer = profileOrdersSlice.reducer;
export const profileOrdersActions = {
  ...profileOrdersSlice.actions,
  connect: profileOrdersConnect,
  disconnect: profileOrdersDisconnect,
};
