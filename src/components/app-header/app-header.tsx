import React, { useCallback } from "react";
import appHeaderStyles from "./app-header.module.css";
import {
  BurgerIcon,
  Logo,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import AppHeaderTab from "./app-header-tab";
import type {
  AppHeaderProps,
  AppHeaderTabName,
} from "./app-header.types";

const DEFAULT_ACTIVE_TAB: AppHeaderTabName = "Конструктор";

const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab = DEFAULT_ACTIVE_TAB,
  onTabSelect,
}) => {
  const handleTabSelect = useCallback(
    (tabName: AppHeaderTabName) => {
      onTabSelect?.(tabName);
    },
    [onTabSelect]
  );

  return (
    <header className={appHeaderStyles.header}>
      <div className={appHeaderStyles.bar}>
        <nav className={appHeaderStyles.appHeaderNavigateLeft}>
          <AppHeaderTab
            name="Конструктор"
            icon={BurgerIcon}
            isActive={activeTab === "Конструктор"}
            onSelect={handleTabSelect}
          />
          <AppHeaderTab
            name="Лента заказов"
            icon={ListIcon}
            isActive={activeTab === "Лента заказов"}
            onSelect={handleTabSelect}
          />
        </nav>
        <div className={appHeaderStyles.appHeaderLogo}>
          <Logo />
        </div>
        <nav className={appHeaderStyles.appHeaderNavigateRight}>
          <AppHeaderTab
            name="Личный кабинет"
            icon={ProfileIcon}
            isActive={activeTab === "Личный кабинет"}
            onSelect={handleTabSelect}
          />
        </nav>
      </div>
    </header>
  );
};

export default React.memo(AppHeader);
export type {
  AppHeaderProps,
  AppHeaderTabName,
  AppHeaderIconComponent,
  AppHeaderIconType,
  AppHeaderTabProps,
} from "./app-header.types";
