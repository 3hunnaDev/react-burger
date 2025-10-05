import { apiRequest } from "./api-request";
import type { BurgerIngredientType } from "../components/app-sections/section-constructor/section-constructor.type";

interface IngredientsResponse {
    success: boolean;
    data: BurgerIngredientType[];
}

export async function getIngredients(): Promise<BurgerIngredientType[]> {
    const res = await apiRequest<IngredientsResponse>(
        "https://norma.nomoreparties.space/api/ingredients"
    );

    if (!res.success) {
        throw new Error("Failed to fetch ingredients");
    }

    return res.data;
}