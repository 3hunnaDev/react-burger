import type { OrderStatus } from "types/orders";

export const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
  done: "Выполнен",
  pending: "Готовится",
  created: "Создан",
};
