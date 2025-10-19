import React from "react";
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDrop } from "react-dnd";
import burgerConstructorStyles from "./burger-constructor.module.css";
import ConstructorFillingItem from "./burger-constructor-filling-item";
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
  moveItem,
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
              {items.map((item, index) => (
                <ConstructorFillingItem
                  key={item.uid}
                  index={index}
                  item={item}
                  moveItem={moveItem}
                  removeItem={removeItem}
                />
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
