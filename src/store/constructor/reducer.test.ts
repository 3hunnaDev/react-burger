import constructorReducer, {
  addIngredient,
  clearOrderError,
  closeOrderModal,
  removeIngredient,
  reorderIngredients,
  resetConstructor,
} from "./reducer";
import { initialConstructorState } from "./state";
import type { ConstructorState } from "./types";
import type { BurgerIngredientType } from "components/app-sections/section-constructor/section-constructor.type";
import { fetchIngredients, submitConstructorOrder } from "./thunk";

const sampleBun: BurgerIngredientType = {
  _id: "bun-1",
  name: "Тестовая булка",
  type: "bun",
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 120,
  image: "https://via.placeholder.com/150",
  image_mobile: "https://via.placeholder.com/80",
  image_large: "https://via.placeholder.com/240",
  __v: 0,
};

const sampleFilling: BurgerIngredientType = {
  _id: "main-1",
  name: "Тестовая начинка",
  type: "main",
  proteins: 2,
  fat: 2,
  carbohydrates: 2,
  calories: 2,
  price: 200,
  image: "https://via.placeholder.com/150",
  image_mobile: "https://via.placeholder.com/80",
  image_large: "https://via.placeholder.com/240",
  __v: 0,
};

const cloneConstructorState = (): ConstructorState => ({
  ...initialConstructorState,
  ingredients: [...initialConstructorState.ingredients],
  selectedIngredients: {},
  selectedOrder: [],
});

describe("constructor reducer", () => {
  it("returns initial state when action is unknown", () => {
    const nextState = constructorReducer(undefined, { type: "unknown" } as any);
    expect(nextState).toEqual(initialConstructorState);
  });

  it("tracks bun selections without affecting the current order", () => {
    const state = cloneConstructorState();
    state.ingredients = [sampleBun, sampleFilling];
    const nextState = constructorReducer(state, addIngredient(sampleBun));

    const bunEntry = nextState.selectedIngredients[sampleBun._id];
    expect(bunEntry).toBeDefined();
    expect(bunEntry?.selected).toHaveLength(1);
    expect(nextState.selectedOrder).toHaveLength(0);
  });

  it("appends non-bun ingredients to the order and dictionary", () => {
    const state = cloneConstructorState();
    state.ingredients = [sampleBun, sampleFilling];
    const nextState = constructorReducer(state, addIngredient(sampleFilling));

    const fillingEntry = nextState.selectedIngredients[sampleFilling._id];
    const uid = fillingEntry?.selected[0];

    expect(fillingEntry).toBeDefined();
    expect(fillingEntry?.selected).toHaveLength(1);
    expect(uid).toBeDefined();
    expect(nextState.selectedOrder).toContain(uid);
  });

  it("removes ingredients that no longer have selections", () => {
    const state = cloneConstructorState();
    state.ingredients = [sampleBun, sampleFilling];
    const stateWithFilling = constructorReducer(state, addIngredient(sampleFilling));
    const selectedUid = stateWithFilling.selectedIngredients[sampleFilling._id]?.selected[0];

    expect(selectedUid).toBeDefined();

    const nextState = constructorReducer(
      stateWithFilling,
      removeIngredient({ ingredientId: sampleFilling._id, uid: selectedUid! })
    );

    expect(nextState.selectedIngredients[sampleFilling._id]).toBeUndefined();
    expect(nextState.selectedOrder).not.toContain(selectedUid);
  });

  it("reorders items when indices are valid", () => {
    const state = cloneConstructorState();
    state.selectedOrder = ["a", "b", "c"];

    const nextState = constructorReducer(
      state,
      reorderIngredients({ fromIndex: 0, toIndex: 2 })
    );

    expect(nextState.selectedOrder).toEqual(["b", "c", "a"]);
  });

  it("ignores reorders with invalid indices", () => {
    const state = cloneConstructorState();
    state.selectedOrder = ["a", "b", "c"];

    const nextState = constructorReducer(
      state,
      reorderIngredients({ fromIndex: -1, toIndex: 10 })
    );

    expect(nextState.selectedOrder).toEqual(["a", "b", "c"]);
  });

  it("resets selected ingredients and order history", () => {
    const state = cloneConstructorState();
    state.selectedIngredients = { foo: { _id: "foo", selected: ["uid"] } };
    state.selectedOrder = ["uid"];

    const nextState = constructorReducer(state, resetConstructor());

    expect(nextState.selectedIngredients).toEqual({});
    expect(nextState.selectedOrder).toEqual([]);
  });

  it("closes the order modal and resets the status", () => {
    const state = cloneConstructorState();
    state.orderNumber = 42;
    state.isOrderModalOpen = true;
    state.orderStatus = "succeeded";

    const nextState = constructorReducer(state, closeOrderModal());

    expect(nextState.isOrderModalOpen).toBe(false);
    expect(nextState.orderNumber).toBeNull();
    expect(nextState.orderStatus).toBe("empty");
  });

  it("clears order errors while resetting the status", () => {
    const state = cloneConstructorState();
    state.orderError = "oops";
    state.orderStatus = "failed";

    const nextState = constructorReducer(state, clearOrderError());

    expect(nextState.orderError).toBeNull();
    expect(nextState.orderStatus).toBe("empty");
  });

  describe("extra reducers", () => {
    it("handles fetchIngredients pending", () => {
      const state = cloneConstructorState();
      const nextState = constructorReducer(state, {
        type: fetchIngredients.pending.type,
      } as any);

      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    it("stores loaded ingredients on fulfilled", () => {
      const state = cloneConstructorState();
      const payload = [sampleBun, sampleFilling];
      const nextState = constructorReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload,
      } as any);

      expect(nextState.loading).toBe(false);
      expect(nextState.ingredients).toEqual(payload);
    });

    it("captures fetch errors", () => {
      const state = cloneConstructorState();
      const nextState = constructorReducer(state, {
        type: fetchIngredients.rejected.type,
        payload: "fetch-error",
      } as any);

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe("fetch-error");
    });

    it("tracks order submission pending state", () => {
      const state = cloneConstructorState();
      const nextState = constructorReducer(state, {
        type: submitConstructorOrder.pending.type,
      } as any);

      expect(nextState.orderStatus).toBe("loading");
      expect(nextState.orderError).toBeNull();
    });

    it("opens the modal after a successful order", () => {
      const state = cloneConstructorState();
      const nextState = constructorReducer(state, {
        type: submitConstructorOrder.fulfilled.type,
        payload: { orderNumber: 777 },
      } as any);

      expect(nextState.orderStatus).toBe("succeeded");
      expect(nextState.orderNumber).toBe(777);
      expect(nextState.isOrderModalOpen).toBe(true);
      expect(nextState.orderError).toBeNull();
    });

    it("records submission failures", () => {
      const state = cloneConstructorState();
      const nextState = constructorReducer(state, {
        type: submitConstructorOrder.rejected.type,
        payload: "order-failed",
      } as any);

      expect(nextState.orderStatus).toBe("failed");
      expect(nextState.orderError).toBe("order-failed");
    });
  });
});
