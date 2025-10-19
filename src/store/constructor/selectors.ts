import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "store";
import type {
    IngredientGroupConfig,
    IngredientType,
    TabLabel,
} from "components/app-sections/section-constructor/section-constructor.type";

export const selectIngredientGroupsConfig = (state: RootState): readonly IngredientGroupConfig[] =>
    state.burgerConstructor.ingredientGroups;

export const selectIngredientTabLabels = createSelector(
    selectIngredientGroupsConfig,
    (groups): readonly TabLabel[] => groups.map(({ label }) => label)
);

export const selectLabelToTypeMap = createSelector(
    selectIngredientGroupsConfig,
    (groups): Record<TabLabel, IngredientType> =>
        groups.reduce<Record<TabLabel, IngredientType>>((accumulator, { label, type }) => {
            accumulator[label] = type;
            return accumulator;
        }, {} as Record<TabLabel, IngredientType>)
);

export const selectTypeToLabelMap = createSelector(
    selectIngredientGroupsConfig,
    (groups): Record<IngredientType, TabLabel> =>
        groups.reduce<Record<IngredientType, TabLabel>>((accumulator, { label, type }) => {
            accumulator[type] = label;
            return accumulator;
        }, {} as Record<IngredientType, TabLabel>)
);
