import React, { useCallback } from "react";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./burger-ingredients.module.css";
import type { BurgerIngredientItemProps } from "../section-constructor.type";

const BurgerIngredientsItem: React.FC<BurgerIngredientItemProps> = ({
  ingredient,
  counter = 0,
  onSelect,
}) => {
  const handleSelect = useCallback(() => {
    onSelect(ingredient._id);
  }, [ingredient._id, onSelect]);

  return (
    <li className={styles.listItem}>
      <article className={styles.itemWrapper} onClick={handleSelect}>
        {counter > 0 && (
          <div className={styles.counterWrapper}>
            <Counter count={counter} size="default" />
          </div>
        )}
        <div className={styles.itemImage}>
          <img
            alt={ingredient.name}
            src={ingredient.image}
            className="ml-4 mr-4"
          />
        </div>
        <div className={styles.itemPrice}>
          <span className="text text_type_digits-default">
            {ingredient.price}
          </span>
          <CurrencyIcon type="primary" />
        </div>
        <span className={`${styles.itemTitle} text text_type_main-small`}>
          {ingredient.name}
        </span>
      </article>
    </li>
  );
};

export default React.memo(BurgerIngredientsItem);
