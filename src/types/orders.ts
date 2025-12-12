export type OrderStatus = "done" | "pending" | "created";

export interface OrderIngredient {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface OrderSummary {
  id: string;
  number: number;
  name: string;
  status: OrderStatus;
  createdAt: string;
  ingredients: OrderIngredient[];
}

export interface OrderFeedStats {
  total: number;
  today: number;
}
