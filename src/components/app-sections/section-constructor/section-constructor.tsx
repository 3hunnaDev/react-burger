import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BurgerConstructor from "./burger-constructor/burger-constructor";
import BurgerIngredients from "./burger-ingredients/burger-ingredients";
import stylesConstructor from "./section-constructor.module.css";
import type {
  BurgerIngredientGroup,
  BurgerIngredientType,
  ConstructorSelectedIngredient,
  IngredientGroupConfig,
} from "./section-constructor.type";
import OrderDetails, {
  orderModalStyles,
} from "./burger-constructor/burger-constructor-order";
import {
  addIngredient,
  removeIngredient,
  reorderIngredients,
  closeOrderModal,
  clearOrderError,
} from "store/constructor/reducer";
import {
  fetchIngredients,
  submitConstructorOrder,
} from "store/constructor/thunk";
import type { AppDispatch, RootState } from "store";
import {
  selectIngredientGroupsConfig,
  selectIngredientTabLabels,
  selectLabelToTypeMap,
  selectTypeToLabelMap,
} from "store/constructor/selectors";
import ErrorMessege from "components/shared/messeges/error/error-messege";
import Modal from "components/shared/modal/modal";

const groupIngredientsByType = (
  ingredients: BurgerIngredientType[] = [],
  groups: readonly IngredientGroupConfig[] = []
): BurgerIngredientGroup[] =>
  groups.map(({ type, label }) => ({
    type,
    name: label,
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
    selectedOrder = [],
    orderNumber,
    orderStatus,
    orderError,
    isOrderModalOpen,
  } = useSelector((state: RootState) => state.burgerConstructor);
  const tabLabels = useSelector(selectIngredientTabLabels);
  const labelToType = useSelector(selectLabelToTypeMap);
  const typeToLabel = useSelector(selectTypeToLabelMap);
  const ingredientGroupsConfig = useSelector(selectIngredientGroupsConfig);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const ingredientsById = useMemo(
    () => ingredientsByIdMap(ingredients),
    [ingredients]
  );

  const groupedData = useMemo<BurgerIngredientGroup[]>(
    () => groupIngredientsByType(ingredients, ingredientGroupsConfig),
    [ingredientGroupsConfig, ingredients]
  );

  const { bun, items: constructorItems } = useMemo<{
    bun: BurgerIngredientType | null;
    items: ConstructorSelectedIngredient[];
  }>(() => {
    let bunIngredient: BurgerIngredientType | null = null;
    const fillingByUid = new Map<string, BurgerIngredientType>();

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
        fillingByUid.set(uid, ingredient);
      });
    });

    const items = selectedOrder.reduce<ConstructorSelectedIngredient[]>(
      (accumulator, uid) => {
        const ingredient = fillingByUid.get(uid);

        if (!ingredient) {
          return accumulator;
        }

        accumulator.push({
          uid,
          ingredient,
        });

        return accumulator;
      },
      []
    );

    return { bun: bunIngredient, items };
  }, [ingredientsById, selectedIngredients, selectedOrder]);

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

  const handleIngredientDrop = useCallback(
    (ingredient: BurgerIngredientType) => {
      dispatch(addIngredient(ingredient));
    },
    [dispatch]
  );

  const handleRemoveFromConstructor = useCallback(
    (ingredientId: BurgerIngredientType["_id"], uid: string) => {
      dispatch(removeIngredient({ ingredientId, uid }));
    },
    [dispatch]
  );

  const handleReorderIngredients = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch(reorderIngredients({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  const handleOrder = useCallback(() => {
    if (orderStatus === "loading") {
      return;
    }
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    dispatch(submitConstructorOrder());
  }, [dispatch, isAuthenticated, location, navigate, orderStatus]);

  const handleOrderModalClose = () => {
    dispatch(closeOrderModal());
  };

  const handleOrderErrorClose = useCallback(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

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
        tabLabels={tabLabels}
        labelToType={labelToType}
        typeToLabel={typeToLabel}
        getCounterById={getCounterById}
      />
      <BurgerConstructor
        bun={bun}
        items={constructorItems}
        totalPrice={totalPrice}
        onOrder={handleOrder}
        removeItem={handleRemoveFromConstructor}
        onDropIngredient={handleIngredientDrop}
        moveItem={handleReorderIngredients}
      />
      {isOrderModalOpen && orderNumber !== null && (
        <Modal onClose={handleOrderModalClose} styles={orderModalStyles}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
      {orderError && (
        <ErrorMessege
          title="Ошибка заказа"
          message={orderError}
          onClose={handleOrderErrorClose}
        />
      )}
    </div>
  );
};

export default SectionConstructor;
