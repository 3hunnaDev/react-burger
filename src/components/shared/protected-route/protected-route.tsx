import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "store";

interface ProtectedRouteProps {
  element: JSX.Element;
  onlyUnAuth?: boolean;
}

const ProtectedRouteElement: React.FC<ProtectedRouteProps> = ({
  element,
  onlyUnAuth = false,
}) => {
  const location = useLocation();
  const { isAuthenticated, isUserChecked } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isUserChecked) {
    return null;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = (location.state as { from?: Location })?.from;
    return <Navigate to={from?.pathname ?? "/"} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  return element;
};

export default ProtectedRouteElement;
