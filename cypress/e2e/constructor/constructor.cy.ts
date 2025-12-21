/// <reference types="cypress" />

import {
  constructorSelectors,
  dragIngredientIntoConstructor,
  reorderConstructorFilling,
} from "../../support/pages/constructor-page";

const ingredientsFixture = require("../../fixtures/ingredients.json");

const ingredientIds = {
  bun: "bun-1",
  main: "main-1",
  sauce: "sauce-1",
};

const ingredientNames = {
  bun: "Тестовая булка",
  main: "Тестовая начинка",
  sauce: "Тестовый соус",
};

describe("Constructor workflow", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      "**/auth/user",
      {
        statusCode: 200,
        body: { success: true, user: { name: "Tester", email: "tester@example.com" } },
      }
    ).as("getUser");

    cy.intercept("GET", "**/ingredients", {
      statusCode: 200,
      body: ingredientsFixture,
    }).as("getIngredients");

    cy.intercept("POST", "**/orders", {
      delayMs: 200,
      statusCode: 200,
      body: { success: true, name: "Test order", order: { number: 1234 } },
    }).as("postOrder");

    cy.visit("/", {
      onBeforeLoad(win) {
        win.document.cookie = "accessToken=cypress-token";
      },
    });

    cy.wait("@getIngredients");
    cy.wait("@getUser");
  });

  it("renders ingredient groups and empty constructor state", () => {
    cy.contains("Соберите бургер").should("be.visible");
    cy.contains("Булки").should("be.visible");
    cy.contains("Соусы").should("be.visible");
    cy.contains("Начинки").should("be.visible");

    cy.get(constructorSelectors.groupListByType("bun"))
      .children()
      .should("have.length", 1);
    cy.get(constructorSelectors.groupListByType("sauce"))
      .children()
      .should("have.length", 1);
    cy.get(constructorSelectors.groupListByType("main"))
      .children()
      .should("have.length", 1);

    cy.get(constructorSelectors.ingredientById(ingredientIds.bun)).should(
      "contain",
      ingredientNames.bun
    );
    cy.get(constructorSelectors.ingredientById(ingredientIds.main)).should(
      "contain",
      ingredientNames.main
    );

    cy.get(constructorSelectors.emptyState).should(
      "contain",
      "Выберите ингредиенты"
    );
    cy.get(constructorSelectors.totalPrice).should("contain", "0");
  });

  it("opens ingredient details in a modal and returns to constructor", () => {
    cy.get(constructorSelectors.ingredientById(ingredientIds.bun)).click();

    cy.contains("Детали ингредиента").should("be.visible");
    cy.contains(ingredientNames.bun).should("be.visible");
    cy.contains("Калории, ккал").parent().should("contain", "280");
    cy.location("pathname").should(
      "include",
      `/ingredients/${ingredientIds.bun}`
    );

    cy.get("[aria-label=\"Закрыть\"]").last().click();

    cy.contains("Детали ингредиента").should("not.exist");
    cy.location("pathname").should("not.include", "/ingredients/");
    cy.contains("Соберите бургер").should("be.visible");
  });

  it("shows validation errors for missing bun and fillings", () => {
    cy.get(constructorSelectors.orderButton).click();
    cy.contains("Ошибка заказа").should("be.visible");
    cy.contains("Выберите булку для заказа.").should("be.visible");

    cy.get("[aria-label=\"Закрыть\"]").last().click();
    cy.contains("Ошибка заказа").should("not.exist");

    dragIngredientIntoConstructor(ingredientIds.bun);

    cy.get(constructorSelectors.orderButton).click();
    cy.contains("Ошибка заказа").should("be.visible");
    cy.contains("Добавьте начинку перед оформлением заказа.").should(
      "be.visible"
    );

    cy.get("[aria-label=\"Закрыть\"]").last().click();
    cy.contains("Ошибка заказа").should("not.exist");
  });

  it("allows building a burger and submitting an order", () => {
    cy.get(constructorSelectors.ingredientById(ingredientIds.bun)).should(
      "be.visible"
    );
    cy.get(constructorSelectors.ingredientById(ingredientIds.main)).should(
      "be.visible"
    );
    cy.get(constructorSelectors.ingredientById(ingredientIds.sauce)).should(
      "be.visible"
    );

    dragIngredientIntoConstructor(ingredientIds.bun);
    dragIngredientIntoConstructor(ingredientIds.main);
    dragIngredientIntoConstructor(ingredientIds.sauce);

    cy.get(constructorSelectors.bunTop).should(
      "contain",
      `${ingredientNames.bun} (верх)`
    );
    cy.get(constructorSelectors.bunBottom).should(
      "contain",
      `${ingredientNames.bun} (низ)`
    );

    cy.get(constructorSelectors.fillingsList)
      .children()
      .should("have.length", 2);
    cy.get(constructorSelectors.fillingById(ingredientIds.main)).should(
      "contain",
      ingredientNames.main
    );
    cy.get(constructorSelectors.fillingById(ingredientIds.sauce)).should(
      "contain",
      ingredientNames.sauce
    );

    cy.get(constructorSelectors.ingredientCounterById(ingredientIds.bun)).should(
      "contain",
      "1"
    );
    cy.get(constructorSelectors.ingredientCounterById(ingredientIds.main)).should(
      "contain",
      "1"
    );
    cy.get(
      constructorSelectors.ingredientCounterById(ingredientIds.sauce)
    ).should("contain", "1");

    cy.get(constructorSelectors.totalPrice).should("contain", "500");

    cy.get(constructorSelectors.orderButton).click();

    cy.wait("@postOrder").then(({ request }) => {
      const payload =
        typeof request.body === "string"
          ? JSON.parse(request.body)
          : request.body;
      expect(payload.ingredients).to.deep.equal([
        ingredientIds.bun,
        ingredientIds.main,
        ingredientIds.sauce,
        ingredientIds.bun,
      ]);
    });

    cy.contains("идентификатор заказа").should("exist");
    cy.contains("1234").should("exist");

    cy.get("[aria-label=\"Закрыть\"]").last().click();

    cy.get(constructorSelectors.emptyState).should(
      "contain",
      "Выберите ингредиенты"
    );
    cy.get(constructorSelectors.totalPrice).should("contain", "0");
    cy.get(constructorSelectors.ingredientCounterById(ingredientIds.bun)).should(
      "not.exist"
    );
  });

  it("reorders fillings inside the constructor", () => {
    dragIngredientIntoConstructor(ingredientIds.bun);
    dragIngredientIntoConstructor(ingredientIds.main);
    dragIngredientIntoConstructor(ingredientIds.sauce);

    cy.get(constructorSelectors.fillingsList)
      .children()
      .should("have.length", 2);
    cy.get(constructorSelectors.fillingsList)
      .children()
      .eq(0)
      .should("have.attr", "data-cy", `constructor-filling-${ingredientIds.main}`);
    cy.get(constructorSelectors.fillingsList)
      .children()
      .eq(1)
      .should("have.attr", "data-cy", `constructor-filling-${ingredientIds.sauce}`);

    reorderConstructorFilling(ingredientIds.sauce, ingredientIds.main, "top");

    cy.get(constructorSelectors.fillingsList)
      .children()
      .eq(0)
      .should("have.attr", "data-cy", `constructor-filling-${ingredientIds.sauce}`);
    cy.get(constructorSelectors.fillingsList)
      .children()
      .eq(1)
      .should("have.attr", "data-cy", `constructor-filling-${ingredientIds.main}`);
    cy.get(constructorSelectors.totalPrice).should("contain", "500");
  });
});
