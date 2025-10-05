import React from "react";
import orderStyles from "./burger-constructor.module.css";
import Modal from "../../../shared/modal/modal";
import { OrderDetailsProps } from "../section-constructor.type";
import { ReactComponent as OrderDoneIcon } from "images/order-done-icon.svg";

const orderModalStyles = {
  main: {
    width: 720,
    height: 718,
    borderRadius: 40,
    backgroundColor: "rgba(28, 28, 33, 1)",
  },
  header: {},
  button: {
    border: "none",
    height: 24,
    width: 24,
    background: "transparent",
    cursor: "pointer",
  },
  content: { height: "100%" },
};

const OrderDetails: React.FC<OrderDetailsProps> = ({
  onClose,
  orderNumber,
}) => (
  <Modal onClose={onClose} styles={orderModalStyles}>
    <div className={orderStyles.orderContainer}>
      <p className="text text_type_digits-large">
        <span className={orderStyles.orderNumberShadow}>{orderNumber}</span>
      </p>
      <p className="text text_type_main-medium">идентификатор заказа</p>

      <OrderDoneIcon className={orderStyles.orderDoneIcon} />

      <div className={orderStyles.orderSubTex}>
        <p className={`text text_type_main-default`}>
          Ваш заказ начали готовить
        </p>
        <p className={`text text_type_main-default text_color_inactive`}>
          Дождитесь готовности на орбитальной станции
        </p>
      </div>
    </div>
  </Modal>
);

export default OrderDetails;
