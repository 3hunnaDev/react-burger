import React, { useCallback } from "react";
import appHeaderStyles from "./app-header.module.css";
import type {
  AppHeaderIconType,
  AppHeaderTabProps,
} from "./app-header.types";

const AppHeaderTab: React.FC<AppHeaderTabProps> = ({
  name,
  icon: IconComponent,
  isActive = false,
  onSelect,
}) => {
  const handleClick = useCallback(() => {
    onSelect?.(name);
  }, [name, onSelect]);

  const tabClassName = `${appHeaderStyles.appHeaderTab}${
    isActive ? ` ${appHeaderStyles.appHeaderTabActive}` : ""
  }`;
  const iconType: AppHeaderIconType = isActive ? "primary" : "secondary";

  return (
    <button type="button" className={tabClassName} onClick={handleClick}>
      <span className={appHeaderStyles.appHeaderTabContent}>
        {IconComponent ? <IconComponent type={iconType} /> : null}
        <span className="text text_type_main-default">{name}</span>
      </span>
    </button>
  );
};

export default React.memo(AppHeaderTab);
