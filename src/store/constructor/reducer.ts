import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type {
    BurgerIngredientDictionary,
    BurgerIngredientDictionaryItem,
    BurgerIngredientType,
} from "components/app-sections/section-constructor/section-constructor.type";
import { fetchIngredients } from "./thunk";

interface ConstructorState {
    ingredients: BurgerIngredientType[];
    loading: boolean;
    error: string | null;
    selectedIngredients: BurgerIngredientDictionary;
}

const initialState: ConstructorState = {
    ingredients: [],
    loading: false,
    error: null,
    selectedIngredients: {},
};

const ensureSelectedDictionary = (state: ConstructorState): BurgerIngredientDictionary => {
    if (!state.selectedIngredients) {
        state.selectedIngredients = {};
    }
    return state.selectedIngredients;
};

const ensureBunSelection = (
    state: ConstructorState,
    payload: BurgerIngredientType,
    uid: string
) => {
    const dictionary = ensureSelectedDictionary(state);

    Object.keys(dictionary).forEach((key) => {
        const ingredient = state.ingredients.find(({ _id }) => _id === key);
        if (ingredient?.type === "bun" && key !== payload._id) {
            delete dictionary[key];
        }
    });

    dictionary[payload._id] = {
        _id: payload._id,
        selected: [uid],
    };
};

const appendIngredientSelection = (
    state: ConstructorState,
    payload: BurgerIngredientType,
    uid: string
) => {
    const dictionary = ensureSelectedDictionary(state);
    const currentEntry: BurgerIngredientDictionaryItem | undefined =
        dictionary[payload._id];

    if (!currentEntry) {
        dictionary[payload._id] = {
            _id: payload._id,
            selected: [uid],
        };
        return;
    }

    currentEntry.selected.push(uid);
};

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
        },
        resetConstructor: (state) => {
            state.selectedIngredients = {};
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
            });
    },
});

export const { addIngredient, removeIngredient, resetConstructor } =
    constructorSlice.actions;

export default constructorSlice.reducer;
