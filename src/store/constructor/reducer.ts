import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { BurgerIngredientType } from "components/app-sections/section-constructor/section-constructor.type";
import type { ConstructorState } from "./types";
import { fetchIngredients, submitConstructorOrder } from "./thunk";
import { initialConstructorState } from "./state";
import { appendIngredientSelection, ensureBunSelection, ensureSelectedDictionary } from "./utils";

const initialState: ConstructorState = initialConstructorState;

const constructorSlice = createSlice({
    name: "constructor",
    initialState,
    reducers: {
        addIngredient: (state, action: PayloadAction<BurgerIngredientType>) => {
            const ingredient = action.payload;
            const uid = `${ingredient._id}_${nanoid()}`;

            if (ingredient.type === "bun") {
                ensureBunSelection(state, ingredient, uid);
            } else {
                appendIngredientSelection(state, ingredient, uid);
            }
        },
        removeIngredient: (
            state,
            action: PayloadAction<{ ingredientId: BurgerIngredientType["_id"]; uid: string }>
        ) => {
            const { ingredientId, uid } = action.payload;
            const dictionary = ensureSelectedDictionary(state);
            const entry = dictionary[ingredientId];

            if (entry) {
                entry.selected = entry.selected.filter((selectedUid) => selectedUid !== uid);

                if (entry.selected.length === 0) {
                    delete dictionary[ingredientId];
                }
            }

            state.selectedOrder = state.selectedOrder.filter((selectedUid) => selectedUid !== uid);
        },
        reorderIngredients: (
            state,
            action: PayloadAction<{ fromIndex: number; toIndex: number }>
        ) => {
            const { fromIndex, toIndex } = action.payload;
            const orderLength = state.selectedOrder.length;

            if (
                fromIndex === toIndex ||
                fromIndex < 0 ||
                toIndex < 0 ||
                fromIndex >= orderLength ||
                toIndex >= orderLength
            ) {
                return;
            }

            const [movedItem] = state.selectedOrder.splice(fromIndex, 1);
            state.selectedOrder.splice(toIndex, 0, movedItem);
        },
        resetConstructor: (state) => {
            state.selectedIngredients = {};
            state.selectedOrder = [];
        },
        closeOrderModal: (state) => {
            state.isOrderModalOpen = false;
            state.orderNumber = null;
            state.orderStatus = "empty";
        },
        clearOrderError: (state) => {
            state.orderError = null;
            state.orderStatus = "empty";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIngredients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIngredients.fulfilled, (state, action) => {
                state.loading = false;
                state.ingredients = action.payload;
            })
            .addCase(fetchIngredients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Ошибка загрузки данных";
            })
            .addCase(submitConstructorOrder.pending, (state) => {
                state.orderStatus = "loading";
                state.orderError = null;
            })
            .addCase(submitConstructorOrder.fulfilled, (state, action) => {
                state.orderStatus = "succeeded";
                state.orderNumber = action.payload.orderNumber;
                state.isOrderModalOpen = true;
                state.orderError = null;
            })
            .addCase(submitConstructorOrder.rejected, (state, action) => {
                state.orderStatus = "failed";
                state.orderError =
                    action.payload ?? action.error.message ?? "Не удалось оформить заказ";
            });
    },
});

export const {
    addIngredient,
    removeIngredient,
    reorderIngredients,
    resetConstructor,
    closeOrderModal,
    clearOrderError,
} = constructorSlice.actions;

export default constructorSlice.reducer;
