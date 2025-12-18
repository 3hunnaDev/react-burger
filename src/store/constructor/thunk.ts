import { createAsyncThunk } from "@reduxjs/toolkit";
import { getIngredients, createIngredientsOrder } from "api";
import type {
    BurgerIngredientDictionaryItem,
    BurgerIngredientType,
} from "components/app-sections/section-constructor/section-constructor.type";
import type { RootState } from "store";
import { ACCESS_TOKEN_KEY } from "store/auth/state";
import { getCookie } from "utils/cookies";

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
    const rootState = getState();
    const { selectedIngredients = {}, selectedOrder = [], ingredients } = rootState.burgerConstructor;
    const accessToken = getCookie(ACCESS_TOKEN_KEY);

    if (!accessToken) {
        return rejectWithValue("Необходимо авторизоваться для оформления заказа.");
    }

    const ingredientsById = ingredients.reduce<Record<string, BurgerIngredientType>>(
        (
            accumulator: Record<string, BurgerIngredientType>,
            ingredient: BurgerIngredientType
        ) => {
            accumulator[ingredient._id] = ingredient;
            return accumulator;
        },
        {}
    );

    let bunId: BurgerIngredientType["_id"] | null = null;
    const fillingByUid = new Map<string, BurgerIngredientType>();

    const selectedEntries = Object.values(
        selectedIngredients ?? {}
    ) as BurgerIngredientDictionaryItem[];

    selectedEntries.forEach((entry) => {
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

    const fillingIds = selectedOrder.reduce<string[]>((accumulator: string[], uid: string) => {
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
        const response = await createIngredientsOrder([bunId, ...fillingIds, bunId], accessToken);
        return { orderNumber: response.order.number };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Не удалось оформить заказ. Попробуйте позже.";
        return rejectWithValue(message);
    }
});
