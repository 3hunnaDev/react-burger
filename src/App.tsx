import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppHeader from "components/app-header/app-header";
import ProtectedRouteElement from "components/shared/protected-route/protected-route";
import IngredientDetailsModal from "components/ingredient-details/ingredient-details-modal";
import HomePage from "pages/home/home";
import LoginPage from "pages/login/login";
import RegisterPage from "pages/register/register";
import ForgotPasswordPage from "pages/forgot-password/forgot-password";
import ResetPasswordPage from "pages/reset-password/reset-password";
import ProfilePage from "pages/profile/profile";
import IngredientPage from "pages/ingredient/ingredient";
import NotFoundPage from "pages/not-found/not-found";
/* import SectionOrdersPage from "pages/orders/orders"; */
import "./index.css";
import type { AppDispatch } from "store";
import { fetchCurrentUser } from "store/auth/thunks";

export { default as AppHeader } from "./components/app-header/app-header";
export type { AppHeaderTabName } from "./components/app-header/app-header";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div className="app">
      <AppHeader />
      <main>
        <Routes location={state?.backgroundLocation ?? location}>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/orders" element={<SectionOrdersPage />} /> */}
          <Route path="/orders" element={<NotFoundPage />} />
          <Route
            path="/login"
            element={
              <ProtectedRouteElement onlyUnAuth element={<LoginPage />} />
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRouteElement onlyUnAuth element={<RegisterPage />} />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ProtectedRouteElement
                onlyUnAuth
                element={<ForgotPasswordPage />}
              />
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRouteElement
                onlyUnAuth
                element={<ResetPasswordPage />}
              />
            }
          />
          <Route
            path="/profile"
            element={<ProtectedRouteElement element={<ProfilePage />} />}
          />
          <Route path="/ingredients/:id" element={<IngredientPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {state?.backgroundLocation && (
          <Routes>
            <Route
              path="/ingredients/:id"
              element={<IngredientDetailsModal />}
            />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
