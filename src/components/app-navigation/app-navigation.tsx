import React, { useCallback, useState } from "react";
import AppHeader, { AppHeaderTabName } from "../app-header/app-header";
import SectionConstructor from "../app-sections/section-constructor/section-constructor";
import SectionOrders from "../app-sections/section-orders/section-orders";
import SectionProfile from "../app-sections/section-profile/section-profile";

const TAB_CONSTRUCTOR: AppHeaderTabName = "Конструктор";
const TAB_ORDER_FEED: AppHeaderTabName = "Лента заказов";
const TAB_PROFILE: AppHeaderTabName = "Личный кабинет";

const AppNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppHeaderTabName>(TAB_CONSTRUCTOR);

  const handleTabSelect = useCallback((tabName: AppHeaderTabName) => {
    setActiveTab(tabName);
  }, []);

  const renderActiveSection = () => {
    switch (activeTab) {
      case TAB_CONSTRUCTOR:
        return <SectionConstructor />;
      case TAB_ORDER_FEED:
        return <SectionOrders />;
      case TAB_PROFILE:
        return <SectionProfile />;
      default:
        return null;
    }
  };

  return (
    <>
      <AppHeader activeTab={activeTab} onTabSelect={handleTabSelect} />
      <main>{renderActiveSection()}</main>
    </>
  );
};

export default AppNavigation;
