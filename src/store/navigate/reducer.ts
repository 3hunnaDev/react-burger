import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppHeaderTabName } from "components/app-header/app-header.types";

export const TAB_CONSTRUCTOR: AppHeaderTabName = "Конструктор";
export const TAB_ORDER_FEED: AppHeaderTabName = "Лента заказов";
export const TAB_PROFILE: AppHeaderTabName = "Личный кабинет";

interface NavigationState {
    tabs: AppHeaderTabName[];
    activeTab: AppHeaderTabName;
}

const initialState: NavigationState = {
    tabs: [TAB_CONSTRUCTOR, TAB_ORDER_FEED, TAB_PROFILE],
    activeTab: TAB_CONSTRUCTOR,
};

const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<AppHeaderTabName>) => {
            state.activeTab = action.payload;
        },
    },
});

export const { setActiveTab } = navigationSlice.actions;

export default navigationSlice.reducer;
