import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import type {
  AppHeaderIconComponent,
  AppHeaderTabName,
} from "./app-header.types";

export interface HeaderNavItem {
  name: AppHeaderTabName;
  to: string;
  icon: AppHeaderIconComponent;
  end?: boolean;
  matchPath?: (pathname: string) => boolean;
}

export const HEADER_NAVIGATION: {
  left: HeaderNavItem[];
  right: HeaderNavItem[];
} = {
  left: [
    {
      name: "Конструктор",
      to: "/",
      icon: BurgerIcon,
      end: true,
      matchPath: (pathname) =>
        pathname === "/" || pathname.startsWith("/ingredients"),
    },
    {
      name: "Лента заказов",
      to: "/orders",
      icon: ListIcon,
    },
  ],
  right: [
    {
      name: "Личный кабинет",
      to: "/profile",
      icon: ProfileIcon,
    },
  ],
};
