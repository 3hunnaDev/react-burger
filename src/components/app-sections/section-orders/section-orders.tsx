import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderCard from "components/orders/order-card/order-card";
import type { OrderSummary } from "types/orders";
import styles from "./section-orders.module.css";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { feedOrdersActions } from "store/orders";
import { selectFeedOrderSummaries } from "store/orders/selectors";
import { OrderLoader } from "../section-constructor/burger-constructor/burger-constructor-order";

const MAX_STATUS_ITEMS = 10;

const chunkNumbers = (
  numbers: number[],
  chunkSize = MAX_STATUS_ITEMS
): number[][] => {
  const chunks: number[][] = [];
  for (let i = 0; i < numbers.length; i += chunkSize) {
    chunks.push(numbers.slice(i, i + chunkSize));
  }
  return chunks;
};

const SectionOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const orders = useAppSelector(selectFeedOrderSummaries);
  const { total, totalToday, status, error } = useAppSelector(
    (state) => state.feedOrders
  );
  const [isErrorDelayElapsed, setIsErrorDelayElapsed] = useState(false);

  useEffect(() => {
    dispatch(feedOrdersActions.connect());
    return () => {
      dispatch(feedOrdersActions.disconnect());
    };
  }, [dispatch]);

  const handleSelectOrder = (order: OrderSummary) => {
    navigate(`/feed/${order.number}`, {
      state: { backgroundLocation: location, order },
    });
  };

  const readyNumbers = useMemo(
    () =>
      orders
        .filter((order) => order.status === "done")
        .map((order) => order.number),
    [orders]
  );
  const inProgressNumbers = useMemo(
    () =>
      orders
        .filter((order) => order.status !== "done")
        .map((order) => order.number),
    [orders]
  );

  const readyColumns = useMemo(
    () => chunkNumbers(readyNumbers, MAX_STATUS_ITEMS),
    [readyNumbers]
  );
  const inProgressColumns = useMemo(
    () => chunkNumbers(inProgressNumbers, MAX_STATUS_ITEMS),
    [inProgressNumbers]
  );

  const isLoading = status === "loading";
  const hasOrders = orders.length > 0;
  const showError = Boolean(error) && !hasOrders && status === "failed";
  const showErrorLoader = showError && !isErrorDelayElapsed;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (showError) {
      setIsErrorDelayElapsed(false);
      timeoutId = setTimeout(() => {
        setIsErrorDelayElapsed(true);
      }, 2000);
    } else {
      setIsErrorDelayElapsed(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showError]);

  const renderStatusColumns = (columns: number[][], prefix: string) =>
    columns.length > 0 ? (
      columns.map((column, columnIndex) => (
        <div className={styles.statusColumn} key={`${prefix}-${columnIndex}`}>
          {column.map((number) => (
            <span key={`${prefix}-${number}`}>{number}</span>
          ))}
        </div>
      ))
    ) : (
      <div className={styles.statusColumn}>
        <span className={styles.statusPlaceholder}>-</span>
      </div>
    );

  return (
    <section className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.feedColumn}>
          <h1 className={`${styles.feedTitle} text text_type_main-large`}>
            Лента заказов
          </h1>
          <div className={styles.ordersList}>
            {isLoading && !hasOrders ? (
              <div className={styles.loader}>
                <OrderLoader />
              </div>
            ) : null}
            {showError ? (
              showErrorLoader ? (
                <div className={`${styles.loader} ${styles.loaderFallback}`}>
                  <div
                    className={styles.loaderSpinner}
                    aria-label="Загружаем заказы"
                  />
                  <p
                    className={`${styles.loaderMessage} text text_type_main-default`}
                  >
                    Загружаем заказы...
                  </p>
                </div>
              ) : (
                <p className={`${styles.error} text text_type_main-default`}>
                  {error}
                </p>
              )
            ) : null}
            {orders.map((order) => (
              <OrderCard
                key={`${order.id}-${order.number}`}
                order={order}
                onSelect={handleSelectOrder}
              />
            ))}
          </div>
        </div>
        <div className={styles.summaryColumn}>
          <div className={styles.statusGroup}>
            <div className={styles.statusList}>
              <p className={`${styles.statusTitle} text text_type_main-medium`}>
                Готовы:
              </p>
              <div
                className={`${styles.statusNumbers} ${styles.statusReady} text text_type_digits-default`}
              >
                {renderStatusColumns(readyColumns, "ready")}
              </div>
            </div>
            <div className={styles.statusList}>
              <p className={`${styles.statusTitle} text text_type_main-medium`}>
                В работе:
              </p>
              <div
                className={`${styles.statusNumbers} ${styles.statusInWork} text text_type_digits-default`}
              >
                {renderStatusColumns(inProgressColumns, "inprogress")}
              </div>
            </div>
          </div>
          <div className={styles.statCard}>
            <p className={`text text_type_main-medium`}>
              Выполнено за все время:
            </p>

            <p className={`text text_type_digits-large`}>
              <span className={styles.orderNumberShadow}>
                {total.toLocaleString("ru-RU")}
              </span>
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={`text text_type_main-medium`}>
              Выполнено за сегодня:
            </p>
            <p className={`text text_type_digits-large`}>
              <span className={styles.orderNumberShadow}>
                {totalToday.toLocaleString("ru-RU")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionOrders;
