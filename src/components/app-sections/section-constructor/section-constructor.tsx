import React, { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BurgerConstructor from "./burger-constructor/burger-constructor";
import BurgerIngredients from "./burger-ingredients/burger-ingredients";
import stylesConstructor from "./section-constructor.module.css";
import type {
  BurgerIngredientGroup,
  BurgerIngredientType,
  ConstructorSelectedIngredient,
  IngredientGroupConfig,
  BurgerIngredientDictionaryItem,
} from "./section-constructor.type";
import OrderDetails, {
  orderModalStyles,
  OrderLoader,
} from "./burger-constructor/burger-constructor-order";
import {
  addIngredient,
  removeIngredient,
  reorderIngredients,
  closeOrderModal,
  clearOrderError,
  resetConstructor,
} from "store/constructor/reducer";
import { submitConstructorOrder } from "store/constructor/thunk";
import {
  selectIngredientGroupsConfig,
  selectIngredientTabLabels,
  selectLabelToTypeMap,
  selectTypeToLabelMap,
} from "store/constructor/selectors";
import ErrorMessege from "components/shared/messeges/error/error-messege";
import Modal from "components/shared/modal/modal";
import { useAppDispatch, useAppSelector } from "hooks/redux";

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
  ingredientsList.reduce<Record<string, BurgerIngredientType>>(
    (
      accumulator: Record<string, BurgerIngredientType>,
      ingredient: BurgerIngredientType
    ) => {
      accumulator[ingredient._id] = ingredient;
      return accumulator;
    },
    {}
  );

const orderLoaderModalStyles = {
  ...orderModalStyles,
  button: {
    ...(orderModalStyles.button ?? {}),
    display: "none",
  },
};

const SectionConstructor: React.FC = () => {
  const dispatch = useAppDispatch();
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
  } = useAppSelector((state) => state.burgerConstructor);
  const tabLabels = useAppSelector(selectIngredientTabLabels);
  const labelToType = useAppSelector(selectLabelToTypeMap);
  const typeToLabel = useAppSelector(selectTypeToLabelMap);
  const ingredientGroupsConfig = useAppSelector(selectIngredientGroupsConfig);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

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

    const selectedEntries = Object.values(
      selectedIngredients ?? {}
    ) as BurgerIngredientDictionaryItem[];

    selectedEntries.forEach((entry) => {
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
      (accumulator: ConstructorSelectedIngredient[], uid: string) => {
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
    dispatch(resetConstructor());
  };

  const handleOrderErrorClose = useCallback(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

  const handleOrderPendingClose = useCallback(() => {}, []);

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
      {orderStatus === "loading" && (
        <Modal onClose={handleOrderPendingClose} styles={orderLoaderModalStyles}>
          <OrderLoader />
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
