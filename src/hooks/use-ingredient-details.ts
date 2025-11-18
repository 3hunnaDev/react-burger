import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "store";
import { fetchIngredients } from "store/constructor/thunk";

export const useIngredientDetails = (ingredientId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ingredients, loading, error } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  useEffect(() => {
    if (!ingredientId) {
      return;
    }

    if (!ingredients.length && !loading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientId, ingredients.length, loading]);

  const ingredient = useMemo(
    () => ingredients.find((item) => item._id === ingredientId) ?? null,
    [ingredients, ingredientId]
  );

  return { ingredient, loading, error };
};
