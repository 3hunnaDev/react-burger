/// <reference types="cypress" />

const dataTransferCopy = () => new DataTransfer();

export const constructorSelectors = {
  groupByType: (type: string) => `[data-cy=ingredients-group-${type}]`,
  groupListByType: (type: string) => `[data-cy=ingredients-list-${type}]`,
  ingredientById: (id: string) => `[data-cy=ingredient-${id}]`,
  ingredientCounterById: (id: string) => `[data-cy=ingredient-counter-${id}]`,
  dropzone: "[data-cy=constructor-dropzone]",
  fillingsList: "[data-cy=constructor-fillings]",
  emptyState: "[data-cy=constructor-empty]",
  bunTop: "[data-cy=constructor-bun-top]",
  bunBottom: "[data-cy=constructor-bun-bottom]",
  totalPrice: "[data-cy=constructor-total-price]",
  orderButton: "[data-cy=constructor-order-actions] button",
  fillingById: (id: string) => `[data-cy=constructor-filling-${id}]`,
};

export const dragIngredientIntoConstructor = (ingredientId: string) => {
  const dataTransfer = dataTransferCopy();
  cy.get(constructorSelectors.ingredientById(ingredientId)).trigger(
    "dragstart",
    { dataTransfer }
  );
  cy.get(constructorSelectors.dropzone)
    .trigger("dragover", { dataTransfer })
    .trigger("drop", { dataTransfer });
};

export const reorderConstructorFilling = (
  sourceId: string,
  targetId: string,
  position: "top" | "bottom" = "top"
) => {
  const dataTransfer = dataTransferCopy();

  cy.get(constructorSelectors.fillingById(sourceId)).then(($source) => {
    const rect = $source[0]?.getBoundingClientRect();
    const clientX = rect ? rect.left + rect.width / 2 : 0;
    const clientY = rect ? rect.top + rect.height / 2 : 0;

    cy.wrap($source).trigger("dragstart", {
      dataTransfer,
      clientX,
      clientY,
      force: true,
    });
  });

  cy.get(constructorSelectors.fillingById(targetId)).then(($target) => {
    const rect = $target[0]?.getBoundingClientRect();
    const clientX = rect ? rect.left + rect.width / 2 : 0;
    const clientY = rect
      ? position === "top"
        ? rect.top + 1
        : rect.bottom - 1
      : 0;

    cy.wrap($target).trigger("dragenter", {
      dataTransfer,
      clientX,
      clientY,
      force: true,
    });
    cy.wrap($target).trigger("dragover", {
      dataTransfer,
      clientX,
      clientY,
      force: true,
    });
    cy.wrap($target).trigger("dragover", {
      dataTransfer,
      clientX,
      clientY,
      force: true,
    });
    cy.wrap($target).trigger("drop", {
      dataTransfer,
      clientX,
      clientY,
      force: true,
    });
  });

  cy.get(constructorSelectors.fillingById(sourceId)).trigger("dragend", {
    dataTransfer,
    force: true,
  });
};
