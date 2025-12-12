import React from "react";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import type { OrderSummary, OrderStatus } from "types/orders";
import { formatOrderDate } from "utils/date";
import { getOrderTotal } from "utils/order";
import { ORDER_STATUS_TEXT } from "components/orders/order-status";
import styles from "./order-details.module.css";

interface OrderDetailsProps {
  order: OrderSummary;
}

const STATUS_CLASS_MAP: Record<OrderStatus, string> = {
  done: styles.statusDone,
  pending: styles.statusPending,
  created: styles.statusCreated,
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const total = getOrderTotal(order);
  const formattedDate = formatOrderDate(order.createdAt);
  const statusClassName = STATUS_CLASS_MAP[order.status];

  return (
    <div className={styles.container}>
      <p className={`${styles.orderNumber} text text_type_digits-default`}>
        #{order.number}
      </p>
      <div className={styles.header}>
        <h2 className={`${styles.orderName} text text_type_main-medium`}>
          {order.name}
        </h2>
        <p
          className={`${styles.status} ${statusClassName} text text_type_main-default`}
        >
          {ORDER_STATUS_TEXT[order.status]}
        </p>
      </div>
      <div>
        <p className="text text_type_main-medium">Состав:</p>
        <ul className={styles.ingredientsList}>
          {order.ingredients.map((ingredient) => (
            <li key={`${order.id}-${ingredient.id}`}>
              <div className={styles.ingredientRow}>
                <div className={styles.ingredientPreview}>
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className={styles.ingredientImage}
                  />
                </div>
                <p className={`${styles.ingredientName} text text_type_main-default`}>
                  {ingredient.name}
                </p>
                <div className={styles.ingredientPrice}>
                  <span className="text text_type_digits-default">
                    {ingredient.quantity} x {ingredient.price}
                  </span>
                  <CurrencyIcon type="primary" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          {formattedDate}
        </span>
        <div className={styles.ingredientPrice}>
          <span className="text text_type_digits-default">{total}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
