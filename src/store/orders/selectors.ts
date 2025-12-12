import { createSelector } from "@reduxjs/toolkit";
import type { OrderSummary } from "types/orders";
import type { RootState } from "store";
import { createIngredientDictionary, mapApiOrdersToSummaries } from "utils/order";

const selectIngredients = (state: RootState) => state.burgerConstructor.ingredients;

export const selectFeedOrdersState = (state: RootState) => state.feedOrders;
export const selectProfileOrdersState = (state: RootState) => state.profileOrders;

const sortSummariesByDateDesc = (summaries: OrderSummary[]): OrderSummary[] =>
  [...summaries].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );

export const selectFeedOrderSummaries = createSelector(
  selectFeedOrdersState,
  selectIngredients,
  (ordersState, ingredients) => {
    const dictionary = createIngredientDictionary(ingredients);
    const summaries = mapApiOrdersToSummaries(ordersState.orders, dictionary);
    return sortSummariesByDateDesc(summaries);
  }
);

export const selectProfileOrderSummaries = createSelector(
  selectProfileOrdersState,
  selectIngredients,
  (ordersState, ingredients) => {
    const dictionary = createIngredientDictionary(ingredients);
    const summaries = mapApiOrdersToSummaries(ordersState.orders, dictionary);
    return sortSummariesByDateDesc(summaries);
  }
);
