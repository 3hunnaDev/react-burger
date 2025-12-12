import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OrderCard from "components/orders/order-card/order-card";
import type { OrderSummary } from "types/orders";
import styles from "./profile-orders.module.css";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { profileOrdersActions } from "store/orders";
import { selectProfileOrderSummaries } from "store/orders/selectors";
import { OrderLoader } from "components/app-sections/section-constructor/burger-constructor/burger-constructor-order";

const ProfileOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const orders = useAppSelector(selectProfileOrderSummaries);
  const { status, error } = useAppSelector((state) => state.profileOrders);
  const isLoading = status === "loading";
  const hasOrders = orders.length > 0;
  const showError = Boolean(error) && !hasOrders && status === "failed";
  const [isErrorDelayElapsed, setIsErrorDelayElapsed] = useState(false);
  const showErrorLoader = showError && !isErrorDelayElapsed;

  useEffect(() => {
    dispatch(profileOrdersActions.connect());
    return () => {
      dispatch(profileOrdersActions.disconnect());
    };
  }, [dispatch]);

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

  const handleSelectOrder = (order: OrderSummary) => {
    navigate(`/profile/orders/${order.number}`, {
      state: { backgroundLocation: location, order },
    });
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.list}>
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
        {hasOrders
          ? orders.map((order) => (
              <OrderCard
                key={`${order.id}-${order.number}`}
                order={order}
                showStatus
                onSelect={handleSelectOrder}
              />
            ))
          : null}
      </div>
      {!hasOrders && !isLoading && !error ? (
        <p className={`${styles.empty} text text_type_main-default`}>
          У вас пока нет заказов
        </p>
      ) : null}
    </section>
  );
};

export default ProfileOrders;
