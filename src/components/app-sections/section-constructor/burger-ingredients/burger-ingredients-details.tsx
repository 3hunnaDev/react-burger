import React from "react";
import detailsStyles from "./burger-ingredients.module.css";
import type { IngredientDetailsProps } from "../section-constructor.type";
import Modal from "../../../shared/modal/modal";

const ingredientModalStyles = {
  main: {
    width: 750,
    height: 539,
    borderRadius: 40,
    backgroundColor: "rgba(28, 28, 33, 1)",
  },
  header: {
    display: "flex",
    marginLeft: 40,
    marginTop: 40,
    marginRight: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    border: "none",
    height: 24,
    width: 24,
    background: "transparent",
    cursor: "pointer",
  },
  content: { padding: "20px" },
};

const IngredientDetails: React.FC<IngredientDetailsProps> = ({
  ingredient,
  onClose,
}) => (
  <Modal
    title={
      <h2 className={`text text_type_main-large `}>Детали ингредиентов</h2>
    }
    onClose={onClose}
    styles={ingredientModalStyles}
  >
    <div className={detailsStyles.detailsContainer}>
      <img
        src={ingredient.image_large}
        alt={ingredient.name}
        className={detailsStyles.detailsImage}
      />
      <p className={`text text_type_main-medium ${detailsStyles.detailsName}`}>
        {ingredient.name}
      </p>
      <ul className={detailsStyles.detailsNutritionList}>
        <li className={detailsStyles.detailsNutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Калории, ккал
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.calories}
          </span>
        </li>
        <li className={detailsStyles.detailsNutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Белки, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.proteins}
          </span>
        </li>
        <li className={detailsStyles.detailsNutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Жиры, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.fat}
          </span>
        </li>
        <li className={detailsStyles.detailsNutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Углеводы, г
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient.carbohydrates}
          </span>
        </li>
      </ul>
    </div>
  </Modal>
);

export default IngredientDetails;
