import type { ComponentType } from "react";
import type { TIconProps } from "@ya.praktikum/react-developer-burger-ui-components/dist/ui/icons/utils";

export type AppHeaderTabName =
  | "Конструктор"
  | "Лента заказов"
  | "Личный кабинет";

export type AppHeaderIconComponent = ComponentType<TIconProps>;
export type AppHeaderIconType = TIconProps["type"];
