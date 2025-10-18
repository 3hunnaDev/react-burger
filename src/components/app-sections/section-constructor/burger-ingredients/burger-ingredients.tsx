import React, { useCallback, useState } from "react";
import styles from "./burger-ingredients.module.css";
import type {
  BurgerIngredientsProps,
  TabLabel,
} from "../section-constructor.type";
import BurgerIngredientsTabs from "./burger-ingredients-tabs";
import BurgerIngredientsList from "./burger-ingredients-list";

const BurgerIngredients: React.FC<BurgerIngredientsProps> = ({
  groupedData,
  tabLabels,
  labelToType,
  typeToLabel,
  getCounterById,
  onIngredientSelect,
}) => {
  const [currentActiveTab, setCurrentActiveTab] = useState<TabLabel>(
    tabLabels[0]!
  );
  const [shouldScrollToActive, setShouldScrollToActive] = useState(false);

  const handleTabChange = useCallback((label: TabLabel) => {
    setCurrentActiveTab(label);
    setShouldScrollToActive(true);
  }, []);

  const handleGroupInView = useCallback((label: TabLabel) => {
    setCurrentActiveTab((prev) => (prev === label ? prev : label));
    setShouldScrollToActive(false);
  }, []);

  const handleScrollAligned = useCallback(() => {
    setShouldScrollToActive(false);
  }, []);

  return (
    <div className={styles.main}>
      <p className={`text text_type_main-large ${styles.heading}`}>
        Соберите бургер
      </p>
      <BurgerIngredientsTabs
        activeTab={currentActiveTab}
        onTabChange={handleTabChange}
        tabLabels={tabLabels}
      />
      <BurgerIngredientsList
        groupedData={groupedData}
        activeTab={currentActiveTab}
        getCounterById={getCounterById}
        onIngredientSelect={onIngredientSelect}
        onGroupInView={handleGroupInView}
        shouldScrollToActive={shouldScrollToActive}
        onScrollAligned={handleScrollAligned}
        labelToType={labelToType}
        typeToLabel={typeToLabel}
      />
    </div>
  );
};

export default React.memo(BurgerIngredients);
