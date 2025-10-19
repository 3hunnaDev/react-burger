import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppHeader, { AppHeaderTabName } from "../app-header/app-header";
import SectionConstructor from "../app-sections/section-constructor/section-constructor";
import SectionOrders from "../app-sections/section-orders/section-orders";
import SectionProfile from "../app-sections/section-profile/section-profile";
import type { AppDispatch, RootState } from "store";
import {
  setActiveTab,
  TAB_CONSTRUCTOR,
  TAB_ORDER_FEED,
  TAB_PROFILE,
} from "store/navigate/reducer";

const AppNavigation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activeTab = useSelector(
    (state: RootState) => state.navigation.activeTab
  );

  const handleTabSelect = useCallback(
    (tabName: AppHeaderTabName) => {
      dispatch(setActiveTab(tabName));
    },
    [dispatch]
  );

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
