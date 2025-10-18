import React from "react";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./burger-ingredients.module.css";
import type {
  BurgerIngredientsTabsProps,
  TabLabel,
} from "../section-constructor.type";

const BurgerIngredientsTabs: React.FC<BurgerIngredientsTabsProps> = ({
  activeTab,
  onTabChange,
  tabLabels,
}) => {
  const handleTabClick = (value: string) => {
    if (tabLabels.includes(value as TabLabel)) {
      onTabChange(value as TabLabel);
    }
  };

  return (
    <div className={styles.tabs}>
      {tabLabels.map((label) => (
        <Tab
          key={label}
          value={label}
          active={activeTab === label}
          onClick={handleTabClick}
        >
          {label}
        </Tab>
      ))}
    </div>
  );
};

export default React.memo(BurgerIngredientsTabs);
