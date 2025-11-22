import React from "react";
import { useParams } from "react-router-dom";
import IngredientDetails from "components/app-sections/section-constructor/burger-ingredients/burger-ingredients-details";
import { useIngredientDetails } from "hooks/use-ingredient-details";
import styles from "./ingredient.module.css";

const IngredientPage: React.FC = () => {
  const { id } = useParams();
  const { ingredient, loading } = useIngredientDetails(id);

  if (!id) {
    return (
      <section className={styles.page}>
        <p className="text text_type_main-default">Некорректный запрос</p>
      </section>
    );
  }

  if (loading && !ingredient) {
    return (
      <section className={styles.page}>
        <p className="text text_type_main-default text_color_inactive">
          Загрузка ингредиента...
        </p>
      </section>
    );
  }

  if (!ingredient) {
    return (
      <section className={styles.page}>
        <p className="text text_type_main-default">Ингредиент не найден</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1 className="text text_type_main-large">Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredient} />
    </section>
  );
};

export default IngredientPage;
