import { configureStore } from "@reduxjs/toolkit";
import constructorReducer from "./constructor/reducer";
import navigationReducer from "./navigate/reducer";

export const store = configureStore({
    reducer: {
        burgerConstructor: constructorReducer,
        navigation: navigationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
