import { createSocketMiddleware } from "./middleware";
import { feedOrdersActions, feedOrdersReducer } from "./feed-slice";
import { profileOrdersActions, profileOrdersReducer } from "./profile-slice";

const FEED_ORDERS_URL = "wss://norma.education-services.ru/orders/all";
const PROFILE_ORDERS_URL = "wss://norma.education-services.ru/orders";

export const feedOrdersMiddleware = createSocketMiddleware({
  url: FEED_ORDERS_URL,
  actions: feedOrdersActions,
});

export const profileOrdersMiddleware = createSocketMiddleware({
  url: PROFILE_ORDERS_URL,
  actions: profileOrdersActions,
  requiresAuth: true,
});

export {
  feedOrdersReducer,
  profileOrdersReducer,
  feedOrdersActions,
  profileOrdersActions,
};
