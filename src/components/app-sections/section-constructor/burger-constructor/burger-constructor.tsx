import React from "react";
import {
  ConstructorElement,
  DragIcon,
  Button,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrop } from "react-dnd";
import burgerConstructorStyles from "./burger-constructor.module.css";
import type {
  BurgerConstructorProps,
  DraggedIngredient,
} from "../section-constructor.type";

const BurgerConstructor: React.FC<BurgerConstructorProps> = ({
  bun,
  items,
  totalPrice,
  onOrder,
  removeItem,
  onDropIngredient,
}) => {
  const hasFillings = items.length > 0;

  const [{ isOver, canDrop }, dropRef] = useDrop<
    DraggedIngredient,
    void,
    {
      isOver: boolean;
      canDrop: boolean;
    }
  >(
    () => ({
      accept: "ingredient",
      drop: ({ ingredient }) => {
        onDropIngredient(ingredient);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onDropIngredient]
  );

  const dropAreaClassName = !canDrop
    ? ""
    : isOver
    ? ` ${burgerConstructorStyles.dropTargetActive}`
    : ` ${burgerConstructorStyles.dropTargetReady}`;

  return (
    <div className={burgerConstructorStyles.main}>
      <section
        ref={dropRef}
        className={`${burgerConstructorStyles.listGroup}${dropAreaClassName}`}
      >
        {bun && (
          <div className={burgerConstructorStyles.lockedItem}>
            <ConstructorElement
              type="top"
              isLocked
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image_mobile}
              extraClass={burgerConstructorStyles.constructorElement}
            />
          </div>
        )}
        {hasFillings || bun ? (
          <div className={burgerConstructorStyles.fillings}>
            <ul className={burgerConstructorStyles.itemsList}>
              {items.map(({ uid, ingredient }) => (
                <li key={uid} className={burgerConstructorStyles.item}>
                  <div className={burgerConstructorStyles.dragIconWrapper}>
                    <DragIcon type="primary" />
                  </div>
                  <ConstructorElement
                    text={ingredient.name}
                    price={ingredient.price}
                    thumbnail={ingredient.image_mobile}
                    handleClose={() => removeItem(ingredient._id, uid)}
                    extraClass={
                      burgerConstructorStyles.constructorElementFilling
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={burgerConstructorStyles.fillingsEmpty}>
            <p className="text text_type_main-default">Выберите ингредиенты</p>
          </div>
        )}
        {bun && (
          <div className={burgerConstructorStyles.lockedItem}>
            <ConstructorElement
              type="bottom"
              isLocked
              text={`${bun.name} (низ)`}
              price={bun.price}
              thumbnail={bun.image_mobile}
              extraClass={burgerConstructorStyles.constructorElement}
            />
          </div>
        )}
      </section>
      <div className={burgerConstructorStyles.orderComfirmGroup}>
        <div className={burgerConstructorStyles.totalPrice}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={onOrder}>
          Оформить заказ
        </Button>
      </div>
    </div>
  );
};

export default React.memo(BurgerConstructor);
