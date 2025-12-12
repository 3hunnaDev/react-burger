import type { ApiOrder } from "api/orders";
import type { BurgerIngredientType } from "components/app-sections/section-constructor/section-constructor.type";
import type { OrderSummary } from "types/orders";

export const getOrderTotal = (order: OrderSummary): number =>
  order.ingredients.reduce(
    (sum, ingredient) => sum + ingredient.price * ingredient.quantity,
    0
  );

export const createIngredientDictionary = (
  ingredients: BurgerIngredientType[]
): Record<string, BurgerIngredientType> =>
  ingredients.reduce<Record<string, BurgerIngredientType>>((acc, ingredient) => {
    acc[ingredient._id] = ingredient;
    return acc;
  }, {});

export const mapApiOrderToSummary = (
  order: ApiOrder,
  dictionary: Record<string, BurgerIngredientType>
): OrderSummary | null => {
  const aggregated = order.ingredients.reduce<
    Record<
      string,
      { id: string; name: string; image: string; price: number; quantity: number }
    >
  >((acc, ingredientId) => {
    const ingredient = dictionary[ingredientId];
    if (!ingredient) {
      return acc;
    }

    const entry = acc[ingredientId];
    if (entry) {
      entry.quantity += 1;
    } else {
      acc[ingredientId] = {
        id: ingredientId,
        name: ingredient.name,
        image: ingredient.image,
        price: ingredient.price,
        quantity: 1,
      };
    }

    return acc;
  }, {});

  const ingredientsList = Object.values(aggregated);

  if (ingredientsList.length === 0) {
    return null;
  }

  return {
    id: order._id,
    number: order.number,
    name: order.name,
    status: order.status,
    createdAt: order.createdAt,
    ingredients: ingredientsList,
  };
};

export const mapApiOrdersToSummaries = (
  orders: ApiOrder[],
  dictionary: Record<string, BurgerIngredientType>
): OrderSummary[] =>
  orders.reduce<OrderSummary[]>((acc, order) => {
    const summary = mapApiOrderToSummary(order, dictionary);
    if (summary) {
      acc.push(summary);
    }
    return acc;
  }, []);
