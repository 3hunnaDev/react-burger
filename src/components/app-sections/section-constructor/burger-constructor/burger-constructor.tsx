import React from "react";
import burgerConstructorStyles from "./burger-constructor.module.css";
import {
  ConstructorElement,
  DragIcon,
  Button,
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import type { BurgerConstructorProps } from "../section-constructor.type";

const BurgerConstructor: React.FC<BurgerConstructorProps> = ({
  bun,
  items,
  totalPrice,
}) => {
  const hasFillings = items.length > 0;

  return (
    <div className={burgerConstructorStyles.main}>
      <section className={burgerConstructorStyles.listGroup}>
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
        <Button htmlType="button" type="primary" size="large">
          Оформить заказ
        </Button>
      </div>
    </div>
  );
};

export default React.memo(BurgerConstructor);
