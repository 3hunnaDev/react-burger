import type { IngredientGroupConfig } from "components/app-sections/section-constructor/section-constructor.type";
import type { ConstructorState } from "./types";

export const ingredientGroups: readonly IngredientGroupConfig[] = [
    { type: "bun", label: "Булки" },
    { type: "sauce", label: "Соусы" },
    { type: "main", label: "Начинки" },
] as const;

export const initialConstructorState: ConstructorState = {
    ingredients: [],
    loading: false,
    error: null,
    selectedIngredients: {},
    selectedOrder: [],
    orderNumber: null,
    orderStatus: "empty",
    orderError: null,
    isOrderModalOpen: false,
    ingredientGroups,
};
