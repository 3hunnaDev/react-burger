import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import type { OrdersPayload } from "./types";
import { refreshAuthToken } from "store/auth/thunks";

interface SocketActions {
  connect: ActionCreatorWithoutPayload;
  disconnect: ActionCreatorWithoutPayload;
  connectionSuccess: ActionCreatorWithoutPayload;
  connectionError: ActionCreatorWithPayload<string>;
  connectionClosed: ActionCreatorWithoutPayload;
  ordersReceived: ActionCreatorWithPayload<OrdersPayload>;
}

interface SocketConfig {
  url: string;
  actions: SocketActions;
  requiresAuth?: boolean;
}

interface OrdersMessage extends OrdersPayload {
  success: boolean;
  message?: string;
}

const isInvalidTokenMessage = (message: string): boolean =>
  message.toLowerCase().includes("invalid or missing token");

const buildSocketUrl = (url: string, token?: string): string =>
  token ? `${url}?token=${token}` : url;

export const createSocketMiddleware = ({
  url,
  actions,
  requiresAuth = false,
}: SocketConfig): Middleware => {
  let socket: WebSocket | null = null;
  let manuallyClosed = false;

  return (store) => (next) => (action) => {
    const { dispatch, getState } = store;
    const result = next(action);

    if (actions.connect.match(action)) {
      manuallyClosed = false;
      if (requiresAuth) {
        const token = getState().auth.accessToken;
        if (!token) {
          dispatch(actions.connectionError("Требуется авторизация"));
          return result;
        }
        if (socket) {
          manuallyClosed = true;
          socket.close();
        }
        socket = new WebSocket(buildSocketUrl(url, token));
      } else {
        if (socket) {
          manuallyClosed = true;
          socket.close();
        }
        socket = new WebSocket(url);
      }

      socket.onopen = () => {
        dispatch(actions.connectionSuccess());
      };

      socket.onerror = () => {
        console.error("Ошибка WebSocket соединения");
      };

      socket.onclose = (event: CloseEvent) => {
        if (manuallyClosed) {
          manuallyClosed = false;
          dispatch(actions.connectionClosed());
          return;
        }

        if (!event.wasClean) {
          dispatch(actions.connectionError("Ошибка соединения"));
          return;
        }

        dispatch(actions.connectionClosed());
      };

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data: OrdersMessage = JSON.parse(event.data);
          if (!data.success) {
            const errorMessage = data.message ?? "Не удалось получить заказы";
            if (requiresAuth && isInvalidTokenMessage(errorMessage)) {
              socket?.close();
              socket = null;
              dispatch(actions.connectionError("Требуется обновить авторизацию"));
              const thunkDispatch = dispatch as unknown as (
                action: unknown
              ) => Promise<any>;
              const refreshPromise = thunkDispatch(refreshAuthToken());
              refreshPromise.then((refreshAction) => {
                if (refreshAuthToken.fulfilled.match(refreshAction)) {
                  dispatch(actions.connect());
                } else {
                  const refreshMessage =
                    (refreshAction.payload as string | undefined) ??
                    refreshAction.error?.message ??
                    "Не удалось обновить токен";
                  dispatch(actions.connectionError(refreshMessage));
                }
              });
              return;
            }
            dispatch(actions.connectionError(errorMessage));
            return;
          }

          dispatch(
            actions.ordersReceived({
              orders: data.orders,
              total: data.total,
              totalToday: data.totalToday,
            })
          );
        } catch (error) {
          dispatch(
            actions.connectionError(
              error instanceof Error
                ? error.message
                : "Не удалось обработать данные сервера"
            )
          );
        }
      };
    }

    if (actions.disconnect.match(action)) {
      if (socket) {
        manuallyClosed = true;
        socket.close();
        socket = null;
      }
    }

    return result;
  };
};
