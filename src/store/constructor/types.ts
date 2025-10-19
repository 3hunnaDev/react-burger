import type {
    BurgerIngredientDictionary,
    BurgerIngredientType,
    IngredientGroupConfig,
} from "components/app-sections/section-constructor/section-constructor.type";

export type ConstructorOrderStatus = "empty" | "loading" | "succeeded" | "failed";

export interface ConstructorState {
    ingredients: BurgerIngredientType[];
    loading: boolean;
    error: string | null;
    selectedIngredients: BurgerIngredientDictionary;
    selectedOrder: string[];
    orderNumber: number | null;
    orderStatus: ConstructorOrderStatus;
    orderError: string | null;
    isOrderModalOpen: boolean;
    ingredientGroups: readonly IngredientGroupConfig[];
}
