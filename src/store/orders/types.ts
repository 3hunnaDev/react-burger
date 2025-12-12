import type { ApiOrder } from "api/orders";
import type { RequestStatus } from "store/auth/types";

export interface OrdersPayload {
  orders: ApiOrder[];
  total: number;
  totalToday: number;
}

export interface OrdersState extends OrdersPayload {
  status: RequestStatus;
  error: string | null;
}

export const createInitialOrdersState = (): OrdersState => ({
  orders: [],
  total: 0,
  totalToday: 0,
  status: "idle",
  error: null,
});
