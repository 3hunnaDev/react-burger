import { useMemo } from "react";
import { useAppSelector } from "hooks/redux";
import type { BurgerIngredientType } from "components/app-sections/section-constructor/section-constructor.type";

export const useIngredientDetails = (ingredientId?: string) => {
  const { ingredients, loading, error } = useAppSelector(
    (state) => state.burgerConstructor
  );

  const ingredient = useMemo(
    () =>
      ingredients.find(
        (item: BurgerIngredientType) => item._id === ingredientId
      ) ?? null,
    [ingredients, ingredientId]
  );

  return { ingredient, loading, error };
};
