import { useMemo } from "react";
import { useAppSelector } from "hooks/redux";

export const useIngredientDetails = (ingredientId?: string) => {
  const { ingredients, loading, error } = useAppSelector(
    (state) => state.burgerConstructor
  );

  const ingredient = useMemo(
    () => ingredients.find((item) => item._id === ingredientId) ?? null,
    [ingredients, ingredientId]
  );

  return { ingredient, loading, error };
};
