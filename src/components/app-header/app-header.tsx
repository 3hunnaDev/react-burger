import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import appHeaderStyles from "./app-header.module.css";
import { Logo } from "@ya.praktikum/react-developer-burger-ui-components";
import type { AppHeaderIconType } from "./app-header.types";
import { HEADER_NAVIGATION, type HeaderNavItem } from "./app-header.const";

const getTabClassName = (isActive: boolean): string =>
  `${appHeaderStyles.appHeaderTab}${
    isActive ? ` ${appHeaderStyles.appHeaderTabActive}` : ""
  }`;

const AppHeader: React.FC = () => {
  const location = useLocation();

  const renderNavItem = (item: HeaderNavItem) => {
    const resolveIsActive = (isActive: boolean) =>
      item.matchPath ? isActive || item.matchPath(location.pathname) : isActive;

    return (
      <NavLink
        key={item.name}
        to={item.to}
        end={item.end}
        className={({ isActive }) => getTabClassName(resolveIsActive(isActive))}
      >
        {({ isActive }) => {
          const active = resolveIsActive(isActive);
          const Icon = item.icon;
          const iconType: AppHeaderIconType = active ? "primary" : "secondary";

          return (
            <span className={appHeaderStyles.appHeaderTabContent}>
              {Icon ? <Icon type={iconType} /> : null}
              <span className="text text_type_main-default">{item.name}</span>
            </span>
          );
        }}
      </NavLink>
    );
  };

  return (
    <header className={appHeaderStyles.header}>
      <div className={appHeaderStyles.bar}>
        <nav className={appHeaderStyles.appHeaderNavigateLeft}>
          {HEADER_NAVIGATION.left.map(renderNavItem)}
        </nav>
        <Link
          to="/"
          className={appHeaderStyles.appHeaderLogo}
          aria-label="На главную"
        >
          <Logo />
        </Link>
        <nav className={appHeaderStyles.appHeaderNavigateRight}>
          {HEADER_NAVIGATION.right.map(renderNavItem)}
        </nav>
      </div>
    </header>
  );
};

export default React.memo(AppHeader);
export type {
  AppHeaderTabName,
  AppHeaderIconComponent,
  AppHeaderIconType,
} from "./app-header.types";
