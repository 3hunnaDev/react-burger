import { configureStore } from "@reduxjs/toolkit";
import constructorReducer from "./constructor/reducer";

export const store = configureStore({
    reducer: {
        burgerConstructor: constructorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
