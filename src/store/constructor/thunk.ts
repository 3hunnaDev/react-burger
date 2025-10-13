import { createAsyncThunk } from "@reduxjs/toolkit";
import { getIngredients } from "api";
import type { BurgerIngredientType } from "components/app-sections/section-constructor/section-constructor.type";

export const fetchIngredients = createAsyncThunk<
    BurgerIngredientType[],
    void,
    { rejectValue: string }
>("constructor/fetchIngredients", async (_, { dispatch, rejectWithValue }) => {
    try {
        const ingredients = await getIngredients();
        return ingredients;
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Не удалось загрузить ингредиенты";
        return rejectWithValue(message);
    }
});
