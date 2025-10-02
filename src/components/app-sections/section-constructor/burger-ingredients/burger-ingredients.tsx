import React, { useState } from "react";
import styles from "./burger-ingredients.module.css";
import { TAB_LABELS } from "../section-constructor.constants";
import type {
  BurgerIngredientsProps,
  TabLabel,
} from "../section-constructor.type";
import BurgerIngredientsTabs from "./burger-ingredients-tabs";
import BurgerIngredientsList from "./burger-ingredients-list";

const BurgerIngredients: React.FC<BurgerIngredientsProps> = ({
  groupedData,
  getCounterById,
  onIngredientSelect,
}) => {
  const [currentActiveTab, setCurrentActiveTab] = useState<TabLabel>(
    TAB_LABELS[0]
  );

  return (
    <div className={styles.main}>
      <p className={`text text_type_main-large ${styles.heading}`}>
        Соберите бургер
      </p>
      <BurgerIngredientsTabs
        activeTab={currentActiveTab}
        onTabChange={setCurrentActiveTab}
      />
      <BurgerIngredientsList
        groupedData={groupedData}
        activeTab={currentActiveTab}
        getCounterById={getCounterById}
        onIngredientSelect={onIngredientSelect}
      />
    </div>
  );
};

export default React.memo(BurgerIngredients);
