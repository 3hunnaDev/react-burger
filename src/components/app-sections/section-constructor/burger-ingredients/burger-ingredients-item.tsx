import React, { useMemo } from "react";
import {
  Counter,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrag } from "react-dnd";
import { Link, useLocation } from "react-router-dom";
import styles from "./burger-ingredients.module.css";
import type {
  BurgerIngredientItemProps,
  DraggedIngredient,
} from "../section-constructor.type";

const BurgerIngredientsItem: React.FC<BurgerIngredientItemProps> = ({
  ingredient,
  counter = 0,
}) => {
  const dragItem = useMemo<DraggedIngredient>(
    () => ({ ingredient }),
    [ingredient]
  );

  const location = useLocation();

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

  const opacity = isDragging ? 0.4 : 1;

  return (
    <li className={styles.listItem}>
      <Link
        ref={dragRef}
        to={`/ingredients/${ingredient._id}`}
        state={{ backgroundLocation: location }}
        className={styles.itemWrapper}
        style={{ opacity }}
        data-cy={`ingredient-${ingredient._id}`}
      >
        {counter > 0 && (
          <div
            className={styles.counterWrapper}
            data-cy={`ingredient-counter-${ingredient._id}`}
          >
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
      </Link>
    </li>
  );
};

export default React.memo(BurgerIngredientsItem);
