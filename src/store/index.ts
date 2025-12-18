import { configureStore } from "@reduxjs/toolkit";
import constructorReducer from "./constructor/reducer";
import authReducer from "./auth/reducer";
import {
  feedOrdersMiddleware,
  feedOrdersReducer,
  profileOrdersMiddleware,
  profileOrdersReducer,
} from "./orders";

export const store = configureStore({
  reducer: {
    burgerConstructor: constructorReducer,
    auth: authReducer,
    feedOrders: feedOrdersReducer,
    profileOrders: profileOrdersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedOrdersMiddleware, profileOrdersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
