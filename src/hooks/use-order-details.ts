import { useEffect, useMemo, useState } from "react";
import { getOrderByNumber } from "api/orders";
import type { OrderSummary } from "types/orders";
import type { RequestStatus } from "store/auth/types";
import { useAppSelector } from "./redux";
import {
  createIngredientDictionary,
  mapApiOrderToSummary,
} from "utils/order";

interface UseOrderDetailsOptions {
  orderNumber?: number;
  initialOrder?: OrderSummary;
}

interface UseOrderDetailsResult {
  order: OrderSummary | null;
  status: RequestStatus;
  error: string | null;
}

export const useOrderDetails = ({
  orderNumber,
  initialOrder,
}: UseOrderDetailsOptions): UseOrderDetailsResult => {
  const { ingredients } = useAppSelector((state) => state.burgerConstructor);

  const ingredientsDictionary = useMemo(
    () => createIngredientDictionary(ingredients),
    [ingredients]
  );

  const [order, setOrder] = useState<OrderSummary | null>(
    initialOrder ?? null
  );
  const [status, setStatus] = useState<RequestStatus>(
    initialOrder ? "succeeded" : "idle"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrder && initialOrder.number === orderNumber) {
      setOrder(initialOrder);
      setStatus("succeeded");
      setError(null);
    }
  }, [initialOrder, orderNumber]);

  useEffect(() => {
    if (!orderNumber || Number.isNaN(orderNumber)) {
      setOrder(null);
      setError("Некорректный номер заказа");
      setStatus("failed");
      return;
    }

    if (initialOrder && initialOrder.number === orderNumber) {
      return;
    }

    if (ingredients.length === 0) {
      setStatus("loading");
      return;
    }

    let ignore = false;

    const loadOrder = async () => {
      setStatus("loading");
      setError(null);

      try {
        const response = await getOrderByNumber(orderNumber);
        const apiOrder = response.orders[0];

        if (!apiOrder) {
          throw new Error("Заказ не найден");
        }

        const summary = mapApiOrderToSummary(apiOrder, ingredientsDictionary);

        if (!summary) {
          throw new Error("Не удалось подготовить детали заказа");
        }

        if (!ignore) {
          setOrder(summary);
          setStatus("succeeded");
        }
      } catch (err) {
        if (!ignore) {
          setOrder(null);
          setStatus("failed");
          setError(
            err instanceof Error
              ? err.message
              : "Не удалось загрузить информацию о заказе"
          );
        }
      }
    };

    loadOrder();

    return () => {
      ignore = true;
    };
  }, [orderNumber, initialOrder, ingredients.length, ingredientsDictionary]);

  return { order, status, error };
};
