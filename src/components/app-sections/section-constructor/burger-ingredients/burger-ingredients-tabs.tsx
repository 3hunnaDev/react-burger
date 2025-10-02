import React from "react";
import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./burger-ingredients.module.css";
import { TAB_LABELS } from "../section-constructor.constants";
import type {
  BurgerIngredientsTabsProps,
  TabLabel,
} from "../section-constructor.type";

const isTabLabel = (value: string): value is TabLabel =>
  (TAB_LABELS as readonly string[]).includes(value);

const BurgerIngredientsTabs: React.FC<BurgerIngredientsTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const handleTabClick = (value: string) => {
    if (isTabLabel(value)) {
      onTabChange(value);
    }
  };

  return (
    <div className={styles.tabs}>
      {TAB_LABELS.map((label) => (
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
