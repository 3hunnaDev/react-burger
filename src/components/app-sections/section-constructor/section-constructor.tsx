import React, { useCallback, useEffect, useMemo, useState } from "react";
import BurgerConstructor from "./burger-constructor/burger-constructor";
import BurgerIngredients from "./burger-ingredients/burger-ingredients";
import stylesConstructor from "./section-constructor.module.css";
import { getIngredients } from "api";
import { GROUP_ORDER, TYPE_LABELS } from "./section-constructor.constants";
import type {
  BurgerIngredientGroup,
  BurgerIngredientType,
  BurgerIngredientDictionary,
  ConstructorSelectedIngredient,
} from "./section-constructor.type";
import IngredientDetails from "./burger-ingredients/burger-ingredients-details";
import OrderDetails from "./burger-constructor/burger-constructor-order";

const groupIngredientsByType = (
  ingredients: BurgerIngredientType[]
): BurgerIngredientGroup[] =>
  GROUP_ORDER.map((type) => ({
    type,
    name: TYPE_LABELS[type],
    items: ingredients.filter((ingredient) => ingredient.type === type),
  }));

const ingredientsByIdMap = (BURGER_INGREDIENTS: BurgerIngredientType[]) =>
  BURGER_INGREDIENTS.reduce((accumulator, ingredient) => {
    accumulator[ingredient._id] = ingredient;
    return accumulator;
  }, {} as Record<string, BurgerIngredientType>);

const SectionConstructor: React.FC = () => {
  const [ingredients, setIngredients] = useState<BurgerIngredientType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedIngredients, setSelectedIngredients] = useState<
    Partial<BurgerIngredientDictionary>
  >({});

  const [activeIngredient, setActiveIngredient] =
    useState<BurgerIngredientType | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getIngredients()
      .then((data) => {
        console.log("YAH!!! ingredients:", data);
        if (data.length > 0) {
          setIngredients(data);
        } else {
          setError("Нет данных");
        }
      })
      .catch((err) => {
        console.error("Ошибка загрузки:", err);
        setError("Ошибка загрузки данных");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {};
  }, []);

  const ingredientsById = ingredientsByIdMap(ingredients);

  const groupedData = useMemo<BurgerIngredientGroup[]>(
    () => groupIngredientsByType(ingredients),
    [ingredients]
  );

  const { bun, items: constructorItems } = useMemo<{
    bun: BurgerIngredientType | null;
    items: ConstructorSelectedIngredient[];
  }>(() => {
    const items: ConstructorSelectedIngredient[] = [];
    let bunIngredient: BurgerIngredientType | null = null;

    Object.values(selectedIngredients).forEach((entry) => {
      if (!entry) {
        setOrderNumber(null);
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
  }, [ingredientsById, selectedIngredients]);

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

      setActiveIngredient(selectedIngredient);

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

  const handleRemoveFromConstructor = useCallback(
    (ingredientId: BurgerIngredientType["_id"], uid: string) => {
      setOrderNumber(null);

      setSelectedIngredients((prev) => {
        const entry = prev[ingredientId];
        if (!entry) return prev;

        const nextSelected = entry.selected.filter((x) => x !== uid);

        if (nextSelected.length === 0) {
          const { [ingredientId]: _removed, ...rest } = prev;
          return rest;
        }

        return {
          ...prev,
          [ingredientId]: {
            ...entry,
            selected: nextSelected,
          },
        };
      });
    },
    []
  );

  const handleIngredientModalClose = () => {
    setActiveIngredient(null);
  };

  const handleOrder = () => {
    if (constructorItems.length > 0) {
      setOrderNumber(() => Math.floor(100000 + Math.random() * 900000));
      setIsOrderModalOpen(true);
    }
  };

  const handleOrderModalClose = () => {
    setIsOrderModalOpen(false);
    setOrderNumber(null);
  };

  if (loading || error)
    return (
      <div className={stylesConstructor.container}>
        <p
          className={`text text_type_main-default ${stylesConstructor.messege}`}
        >
          {error ? error : "Загрузка ингредиентов..."}
        </p>
      </div>
    );

  return (
    <div className={stylesConstructor.container}>
      <BurgerIngredients
        groupedData={groupedData}
        getCounterById={getCounterById}
        onIngredientSelect={handleIngredientSelect}
      />
      <BurgerConstructor
        bun={bun}
        items={constructorItems}
        totalPrice={totalPrice}
        onOrder={handleOrder}
        removeItem={handleRemoveFromConstructor}
      />
      {activeIngredient && (
        <IngredientDetails
          onClose={handleIngredientModalClose}
          ingredient={activeIngredient}
        />
      )}
      {isOrderModalOpen && orderNumber !== null && (
        <OrderDetails
          onClose={handleOrderModalClose}
          orderNumber={orderNumber}
        />
      )}
    </div>
  );
};

export default SectionConstructor;
