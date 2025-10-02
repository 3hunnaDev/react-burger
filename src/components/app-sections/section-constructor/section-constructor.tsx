import React, { useCallback, useMemo, useState } from "react";
import BurgerConstructor from "./burger-constructor/burger-constructor";
import BurgerIngredients from "./burger-ingredients/burger-ingredients";
import styles from "./section-constructor.module.css";
import {
  GROUP_ORDER,
  TYPE_LABELS,
  BURGER_INGREDIENTS,
} from "./section-constructor.constants";
import type {
  BurgerIngredientGroup,
  BurgerIngredientType,
  BurgerIngredientDictionary,
  ConstructorSelectedIngredient,
} from "./section-constructor.type";

const groupIngredientsByType = (
  ingredients: BurgerIngredientType[]
): BurgerIngredientGroup[] =>
  GROUP_ORDER.map((type) => ({
    type,
    name: TYPE_LABELS[type],
    items: ingredients.filter((ingredient) => ingredient.type === type),
  }));

const ingredientsByIdMap = () =>
  BURGER_INGREDIENTS.reduce((accumulator, ingredient) => {
    accumulator[ingredient._id] = ingredient;
    return accumulator;
  }, {} as Record<string, BurgerIngredientType>);

const SectionConstructor: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<
    Partial<BurgerIngredientDictionary>
  >({});

  const ingredientsById = useMemo(ingredientsByIdMap, []);
  const groupedData = useMemo<BurgerIngredientGroup[]>(
    () => groupIngredientsByType(BURGER_INGREDIENTS),
    []
  );

  const { bun, items: constructorItems } = useMemo<{
    bun: BurgerIngredientType | null;
    items: ConstructorSelectedIngredient[];
  }>(
    () => {
      const items: ConstructorSelectedIngredient[] = [];
      let bunIngredient: BurgerIngredientType | null = null;

      Object.values(selectedIngredients).forEach((entry) => {
        if (!entry) {
          return;
        }

        const ingredient = ingredientsById[entry._id];

        if (!ingredient || !entry.selected?.length) {
          return;
        }

        if (ingredient.type === "bun") {
          bunIngredient = ingredient;
          return;
        }

        entry.selected.forEach((uid) => {
          items.push({
            uid,
            ingredient,
          });
        });
      });

      return { bun: bunIngredient, items };
    },
    [ingredientsById, selectedIngredients]
  );

  const totalPrice = useMemo(() => {
    const fillingsTotal = constructorItems.reduce(
      (sum, { ingredient }) => sum + ingredient.price,
      0
    );

    return bun ? fillingsTotal + bun.price * 2 : fillingsTotal;
  }, [bun, constructorItems]);

  const getCounterById = useCallback(
    (_id: BurgerIngredientType["_id"]): number =>
      selectedIngredients[_id]?.selected.length ?? 0,
    [selectedIngredients]
  );

  const handleIngredientSelect = useCallback(
    (ingredientId: BurgerIngredientType["_id"]): void => {
      const selectedIngredient = ingredientsById[ingredientId];

      if (!selectedIngredient) {
        return;
      }

      const uid = `${ingredientId}_${Date.now()}`;

      if (selectedIngredient.type === "bun") {
        setSelectedIngredients((prevState) => {
          const nextState: Partial<BurgerIngredientDictionary> = {};

          Object.entries(prevState).forEach(([key, value]) => {
            if (!value) {
              return;
            }

            const ingredient = ingredientsById[key];

            if (ingredient?.type !== "bun" || key === ingredientId) {
              nextState[key] = value;
            }
          });

          nextState[ingredientId] = {
            _id: ingredientId,
            selected: [uid],
          };

          return nextState;
        });
        return;
      }

      setSelectedIngredients((prevState) => {
        const currentEntry = prevState[ingredientId];

        if (!currentEntry) {
          return {
            ...prevState,
            [ingredientId]: {
              _id: ingredientId,
              selected: [uid],
            },
          };
        }

        return {
          ...prevState,
          [ingredientId]: {
            ...currentEntry,
            selected: [...currentEntry.selected, uid],
          },
        };
      });
    },
    [ingredientsById]
  );

  return (
    <div className={styles.container}>
      <BurgerIngredients
        groupedData={groupedData}
        getCounterById={getCounterById}
        onIngredientSelect={handleIngredientSelect}
      />
      <BurgerConstructor bun={bun} items={constructorItems} totalPrice={totalPrice} />
    </div>
  );
};

export default SectionConstructor;
