import React from "react";
import { useLocation, useParams } from "react-router-dom";
import OrderDetails from "components/orders/order-details/order-details";
import { useOrderDetails } from "hooks/use-order-details";
import type { OrderSummary } from "types/orders";
import styles from "./order-details-page.module.css";

interface OrderLocationState {
  order?: OrderSummary;
}

const OrderDetailsPage: React.FC = () => {
  const { number } = useParams();
  const location = useLocation();

  const orderNumber = number ? Number(number) : undefined;
  const locationState = location.state as OrderLocationState | undefined;
  const initialOrder =
    locationState?.order && locationState.order.number === orderNumber
      ? locationState.order
      : undefined;

  const { order, status, error } = useOrderDetails({
    orderNumber,
    initialOrder,
  });

  const renderContent = () => {
    if (status === "loading" || status === "idle") {
      return (
        <p className="text text_type_main-default text_color_inactive">
          Загрузка заказа...
        </p>
      );
    }

    if (error) {
      return (
        <p className="text text_type_main-default text_color_inactive">
          {error}
        </p>
      );
    }

    if (order) {
      return <OrderDetails order={order} />;
    }

    return (
      <p className="text text_type_main-default text_color_inactive">
        Заказ не найден
      </p>
    );
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>{renderContent()}</div>
    </section>
  );
};

export default OrderDetailsPage;
