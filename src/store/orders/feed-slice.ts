import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OrdersPayload, OrdersState } from "./types";
import { createInitialOrdersState } from "./types";

export const feedOrdersConnect = createAction("orders/feed/connect");
export const feedOrdersDisconnect = createAction("orders/feed/disconnect");

const initialState: OrdersState = createInitialOrdersState();

const feedOrdersSlice = createSlice({
  name: "feedOrders",
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
      .addCase(feedOrdersConnect, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(feedOrdersDisconnect, (state) => {
        state.status = "idle";
      });
  },
});

export const feedOrdersReducer = feedOrdersSlice.reducer;
export const feedOrdersActions = {
  ...feedOrdersSlice.actions,
  connect: feedOrdersConnect,
  disconnect: feedOrdersDisconnect,
};
