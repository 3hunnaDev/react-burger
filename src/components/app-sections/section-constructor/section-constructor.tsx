import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BurgerConstructor from "./burger-constructor/burger-constructor";
import BurgerIngredients from "./burger-ingredients/burger-ingredients";
import stylesConstructor from "./section-constructor.module.css";
import { GROUP_ORDER, TYPE_LABELS } from "./section-constructor.constants";
import type {
  BurgerIngredientGroup,
  BurgerIngredientType,
  ConstructorSelectedIngredient,
} from "./section-constructor.type";
import IngredientDetails from "./burger-ingredients/burger-ingredients-details";
import OrderDetails from "./burger-constructor/burger-constructor-order";
import { addIngredient, removeIngredient } from "store/constructor/reducer";
import { fetchIngredients } from "store/constructor/thunk";
import type { AppDispatch, RootState } from "store";

const groupIngredientsByType = (
  ingredients: BurgerIngredientType[] = []
): BurgerIngredientGroup[] =>
  GROUP_ORDER.map((type) => ({
    type,
    name: TYPE_LABELS[type],
    items: ingredients.filter((ingredient) => ingredient.type === type),
  }));

const ingredientsByIdMap = (ingredientsList: BurgerIngredientType[] = []) =>
  ingredientsList.reduce((accumulator, ingredient) => {
    accumulator[ingredient._id] = ingredient;
    return accumulator;
  }, {} as Record<string, BurgerIngredientType>);

const SectionConstructor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    ingredients,
    loading,
    error,
    selectedIngredients = {},
  } = useSelector((state: RootState) => state.burgerConstructor);

  const [activeIngredient, setActiveIngredient] =
    useState<BurgerIngredientType | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const ingredientsById = useMemo(
    () => ingredientsByIdMap(ingredients),
    [ingredients]
  );

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
      const ingredient = ingredientsById[entry._id];

      if (!ingredient || entry.selected.length === 0) {
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
      dispatch(addIngredient(selectedIngredient));
    },
    [dispatch, ingredientsById]
  );

  const handleRemoveFromConstructor = useCallback(
    (ingredientId: BurgerIngredientType["_id"], uid: string) => {
      setOrderNumber(null);
      dispatch(removeIngredient({ ingredientId, uid }));
    },
    [dispatch]
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
