import React from "react";
import orderStyles from "./burger-constructor.module.css";
import { OrderDetailsProps } from "../section-constructor.type";
import { ReactComponent as OrderDoneIcon } from "images/order-done-icon.svg";

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderNumber }) => (
  <div className={orderStyles.orderContainer}>
    <p className="text text_type_digits-large">
      <span className={orderStyles.orderNumberShadow}>{orderNumber}</span>
    </p>
    <p className="text text_type_main-medium">идентификатор заказа</p>

    <OrderDoneIcon className={orderStyles.orderDoneIcon} />

    <div className={orderStyles.orderSubTex}>
      <p className={`text text_type_main-default`}>Ваш заказ начали готовить</p>
      <p className={`text text_type_main-default text_color_inactive`}>
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  </div>
);

export const OrderLoader: React.FC = () => (
  <div className={orderStyles.orderContainer}>
    <div
      className={orderStyles.orderLoader}
      role="status"
      aria-label="Оформление заказа"
    />
    <div className={orderStyles.orderLoaderText}>
      <p className="text text_type_main-medium">Оформляем заказ...</p>
      <p className="text text_type_main-default text_color_inactive">
        Ожидаем номер заказа от сервера
      </p>
    </div>
  </div>
);

export const orderModalStyles = {
  main: {
    width: 720,
    height: 718,
    borderRadius: 40,
    backgroundColor: "rgba(28, 28, 33, 1)",
  },
  button: {
    border: "none",
    height: 24,
    width: 24,
    background: "transparent",
    cursor: "pointer",
  },
  content: { height: "100%" },
};

export default OrderDetails;
