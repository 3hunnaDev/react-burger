import { createAsyncThunk } from "@reduxjs/toolkit";
import { getIngredients, createIngredientsOrder } from "api";
import type { BurgerIngredientType } from "components/app-sections/section-constructor/section-constructor.type";
import type { RootState } from "store";

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

export const submitConstructorOrder = createAsyncThunk<
    { orderNumber: number },
    void,
    { state: RootState; rejectValue: string }
>("constructor/submitOrder", async (_, { getState, rejectWithValue }) => {
    const state = getState().burgerConstructor;
    const { selectedIngredients = {}, selectedOrder = [], ingredients } = state;

    const ingredientsById = ingredients.reduce<Record<string, BurgerIngredientType>>(
        (accumulator, ingredient) => {
            accumulator[ingredient._id] = ingredient;
            return accumulator;
        },
        {}
    );

    let bunId: BurgerIngredientType["_id"] | null = null;
    const fillingByUid = new Map<string, BurgerIngredientType>();

    Object.values(selectedIngredients).forEach((entry) => {
        const ingredient = ingredientsById[entry._id];

        if (!ingredient || entry.selected.length === 0) {
            return;
        }

        if (ingredient.type === "bun") {
            bunId = ingredient._id;
            return;
        }

        entry.selected.forEach((uid) => {
            fillingByUid.set(uid, ingredient);
        });
    });

    if (!bunId) {
        return rejectWithValue("Выберите булку для заказа.");
    }

    const fillingIds = selectedOrder.reduce<string[]>((accumulator, uid) => {
        const ingredient = fillingByUid.get(uid);
        if (ingredient) {
            accumulator.push(ingredient._id);
        }
        return accumulator;
    }, []);

    if (fillingIds.length === 0) {
        return rejectWithValue("Добавьте начинку перед оформлением заказа.");
    }

    try {
        const response = await createIngredientsOrder([bunId, ...fillingIds, bunId]);
        return { orderNumber: response.order.number };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Не удалось оформить заказ. Попробуйте позже.";
        return rejectWithValue(message);
    }
});
