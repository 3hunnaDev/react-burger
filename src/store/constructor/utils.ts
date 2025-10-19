import type {
    BurgerIngredientDictionary,
    BurgerIngredientDictionaryItem,
    BurgerIngredientType,
} from "components/app-sections/section-constructor/section-constructor.type";
import type { ConstructorState } from "./types";

export const ensureSelectedDictionary = (
    state: ConstructorState
): BurgerIngredientDictionary => {
    if (!state.selectedIngredients) {
        state.selectedIngredients = {};
    }
    return state.selectedIngredients;
};

export const ensureBunSelection = (
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

export const appendIngredientSelection = (
    state: ConstructorState,
    payload: BurgerIngredientType,
    uid: string
) => {
    const dictionary = ensureSelectedDictionary(state);
    const currentEntry: BurgerIngredientDictionaryItem | undefined = dictionary[payload._id];

    if (!currentEntry) {
        dictionary[payload._id] = {
            _id: payload._id,
            selected: [uid],
        };
    } else {
        currentEntry.selected.push(uid);
    }

    state.selectedOrder.push(uid);
};
