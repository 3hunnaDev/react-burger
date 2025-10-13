import React, { useCallback, useMemo } from "react";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag } from "react-dnd";
import styles from "./burger-ingredients.module.css";
import type {
  BurgerIngredientItemProps,
  DraggedIngredient,
} from "../section-constructor.type";

const BurgerIngredientsItem: React.FC<BurgerIngredientItemProps> = ({
  ingredient,
  counter = 0,
  onSelect,
}) => {
  const dragItem = useMemo<DraggedIngredient>(
    () => ({ ingredient }),
    [ingredient]
  );

  const [{ isDragging }, dragRef] = useDrag<DraggedIngredient, void, { isDragging: boolean }>(
    () => ({
      type: "ingredient",
      item: dragItem,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [dragItem]
  );

  const handleSelect = useCallback(() => {
    onSelect(ingredient._id);
  }, [ingredient._id, onSelect]);

  const opacity = isDragging ? 0.4 : 1;

  return (
    <li className={styles.listItem}>
      <article
        ref={dragRef}
        className={styles.itemWrapper}
        onClick={handleSelect}
        style={{ opacity }}
      >
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
