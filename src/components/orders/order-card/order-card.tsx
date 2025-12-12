import React, { useMemo } from "react";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import type { OrderSummary, OrderStatus } from "types/orders";
import { formatOrderDate } from "utils/date";
import { getOrderTotal } from "utils/order";
import { ORDER_STATUS_TEXT } from "components/orders/order-status";
import styles from "./order-card.module.css";

interface OrderCardProps {
  order: OrderSummary;
  onSelect?: (order: OrderSummary) => void;
  showStatus?: boolean;
}

const STATUS_CLASS_MAP: Record<OrderStatus, string> = {
  done: styles.statusDone,
  pending: styles.statusPending,
  created: styles.statusCreated,
};

const MAX_VISIBLE_INGREDIENTS = 6;

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onSelect,
  showStatus = false,
}) => {
  const uniqueIngredients = useMemo(() => {
    const seen = new Set<string>();
    return order.ingredients.filter((ingredient) => {
      if (seen.has(ingredient.id)) {
        return false;
      }
      seen.add(ingredient.id);
      return true;
    });
  }, [order.ingredients]);

  const visibleIngredients = uniqueIngredients.slice(
    0,
    MAX_VISIBLE_INGREDIENTS
  );
  const hiddenCount = uniqueIngredients.length - visibleIngredients.length;
  const total = getOrderTotal(order);
  const formattedDate = formatOrderDate(order.createdAt);

  const handleClick = () => {
    onSelect?.(order);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(order);
    }
  };

  const statusClassName = STATUS_CLASS_MAP[order.status];

  return (
    <article
      className={`${styles.card} text text_type_main-default`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <header className={styles.header}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          {formattedDate}
        </span>
      </header>
      <div>
        <p className={`${styles.name} text text_type_main-medium`}>
          {order.name}
        </p>
        {showStatus ? (
          <p className={`${styles.status} ${statusClassName}`}>
            {ORDER_STATUS_TEXT[order.status]}
          </p>
        ) : null}
      </div>
      <div className={styles.footer}>
        <ul className={styles.ingredientsList}>
          {visibleIngredients.map((ingredient, index) => (
            <li
              key={`${order.id}-${ingredient.id}-${index}`}
              style={{ zIndex: visibleIngredients.length - index }}
            >
              <div className={styles.ingredient}>
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className={styles.ingredientImage}
                />
                {index === MAX_VISIBLE_INGREDIENTS - 1 && hiddenCount > 0 ? (
                  <div className={styles.ingredientOverlay}>
                    <span className="text text_type_main-default">
                      +{hiddenCount}
                    </span>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{total}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </article>
  );
};

export default OrderCard;
