import React, { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "components/shared/modal/modal";
import OrderDetails from "./order-details";
import type { OrderSummary } from "types/orders";
import { useOrderDetails } from "hooks/use-order-details";

export const orderDetailsModalStyles = {
  main: {
    maxWidth: 720,
    width: "100%",
    backgroundColor: "#1c1c21",
    borderRadius: 40,
    padding: 40,
    color: "#f2f2f3",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.45)",
  },
  header: {
    borderBottom: "none",
    marginBottom: 16,
    padding: 0,
  },
  content: {
    padding: 0,
  },
  button: {
    top: 24,
    right: 24,
  },
};

interface OrderDetailsModalState {
  order?: OrderSummary;
}

const OrderDetailsModal: React.FC = () => {
  const navigate = useNavigate();
  const { number } = useParams();
  const location = useLocation();

  const orderNumber = number ? Number(number) : NaN;
  const locationState = location.state as OrderDetailsModalState | undefined;
  const initialOrder =
    locationState?.order && locationState.order.number === orderNumber
      ? locationState.order
      : undefined;

  const { order, status, error } = useOrderDetails({
    orderNumber,
    initialOrder,
  });

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <Modal
      title={<h2 className="text text_type_main-large">Детали заказа</h2>}
      onClose={handleClose}
      styles={orderDetailsModalStyles}
    >
      {status === "loading" || status === "idle" ? (
        <p className="text text_type_main-default text_color_inactive">
          Загрузка заказа...
        </p>
      ) : error ? (
        <p className="text text_type_main-default text_color_inactive">
          {error}
        </p>
      ) : order ? (
        <OrderDetails order={order} />
      ) : (
        <p className="text text_type_main-default text_color_inactive">
          Заказ не найден
        </p>
      )}
    </Modal>
  );
};

export default OrderDetailsModal;
