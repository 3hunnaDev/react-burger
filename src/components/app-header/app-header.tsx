import React, { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import appHeaderStyles from "./app-header.module.css";
import {
  BurgerIcon,
  Logo,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import AppHeaderTab from "./app-header-tab";
import type { AppHeaderProps, AppHeaderTabName } from "./app-header.types";

const DEFAULT_ACTIVE_TAB: AppHeaderTabName = "Конструктор";

const AppHeader: React.FC<AppHeaderProps> = ({ activeTab, onTabSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const resolvedActiveTab = useMemo<AppHeaderTabName>(() => {
    if (activeTab) {
      return activeTab;
    }

    if (location.pathname.startsWith("/profile")) {
      return "Личный кабинет";
    }

    if (location.pathname.startsWith("/ingredients")) {
      return "Конструктор";
    }

    if (location.pathname.startsWith("/orders")) {
      return "Лента заказов";
    }

    return DEFAULT_ACTIVE_TAB;
  }, [activeTab, location.pathname]);

  const handleTabSelect = useCallback(
    (tabName: AppHeaderTabName) => {
      if (tabName === "Личный кабинет") {
        navigate("/profile");
      }
      if (tabName === "Конструктор") {
        navigate("/");
      }
      if (tabName === "Лента заказов") {
        navigate("/orders");
      }

      onTabSelect?.(tabName);
    },
    [navigate, onTabSelect]
  );

  return (
    <header className={appHeaderStyles.header}>
      <div className={appHeaderStyles.bar}>
        <nav className={appHeaderStyles.appHeaderNavigateLeft}>
          <AppHeaderTab
            name="Конструктор"
            icon={BurgerIcon}
            isActive={resolvedActiveTab === "Конструктор"}
            onSelect={handleTabSelect}
          />
          <AppHeaderTab
            name="Лента заказов"
            icon={ListIcon}
            isActive={resolvedActiveTab === "Лента заказов"}
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
            isActive={resolvedActiveTab === "Личный кабинет"}
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
