import React, { useEffect, useRef } from "react";
import ingredientsListStyles from "./burger-ingredients.module.css";
import { LABEL_TO_TYPE } from "../section-constructor.constants";
import BurgerIngredientsItem from "./burger-ingredients-item";
import type {
  BurgerIngredientsListProps,
  IngredientType,
} from "../section-constructor.type";

const BurgerIngredientsList: React.FC<BurgerIngredientsListProps> = ({
  groupedData,
  activeTab,
  getCounterById,
  onIngredientSelect,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const groupRefs = useRef<Record<IngredientType, HTMLElement | null>>({
    bun: null,
    sauce: null,
    main: null,
  });

  useEffect(() => {
    if (!groupedData.length) {
      return;
    }

    const activeType = LABEL_TO_TYPE[activeTab];
    const target = groupRefs.current[activeType];

    const container = containerRef.current;
    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const offsetTop =
        targetRect.top - containerRect.top + container.scrollTop;
      const top = Math.max(offsetTop, 0);

      container.scrollTop = top;
    }
  }, [activeTab, groupedData]);

  return (
    <div ref={containerRef} className={ingredientsListStyles.list}>
      {groupedData.map(({ name, type, items }) => (
        <section
          key={type}
          ref={(node) => {
            groupRefs.current[type] = node;
          }}
          className={ingredientsListStyles.listGroup}
        >
          <h2
            className={`${ingredientsListStyles.groupTitle} text text_type_main-medium`}
          >
            {name}
          </h2>
          <ul className={ingredientsListStyles.groupItems}>
            {items.map((ingredient) => (
              <BurgerIngredientsItem
                key={`itemComponent_${ingredient._id}${type}`}
                ingredient={ingredient}
                counter={getCounterById(ingredient._id)}
                onSelect={onIngredientSelect}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default React.memo(BurgerIngredientsList);
