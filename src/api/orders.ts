import { apiRequest } from "./api-request";

export type ApiOrderStatus = "done" | "pending" | "created";

export interface ApiOrder {
  _id: string;
  ingredients: string[];
  status: ApiOrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

export interface OrderDetailsResponse {
  success: boolean;
  orders: ApiOrder[];
}

export const getOrderByNumber = (orderNumber: number): Promise<OrderDetailsResponse> =>
  apiRequest<OrderDetailsResponse>(`/orders/${orderNumber}`);
