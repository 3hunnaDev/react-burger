import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import type { OrderSummary } from "types/orders";
import AppHeader from "components/app-header/app-header";
import ProtectedRouteElement from "components/shared/protected-route/protected-route";
import IngredientDetailsModal from "components/ingredient-details/ingredient-details-modal";
import OrderDetailsModal from "components/orders/order-details/order-details-modal";
import HomePage from "pages/home/home";
import LoginPage from "pages/login/login";
import RegisterPage from "pages/register/register";
import ForgotPasswordPage from "pages/forgot-password/forgot-password";
import ResetPasswordPage from "pages/reset-password/reset-password";
import ProfilePage from "pages/profile/profile";
import ProfileSettingsPage from "pages/profile/settings";
import ProfileOrdersPage from "pages/profile/orders";
import FeedPage from "pages/order-feed/order-feed";
import IngredientPage from "pages/ingredient/ingredient";
import NotFoundPage from "pages/not-found/not-found";
import OrderDetailsPage from "pages/order-details/order-details";
import "./index.css";
import { useAppDispatch } from "hooks/redux";
import { fetchCurrentUser } from "store/auth/thunks";
import { fetchIngredients } from "store/constructor/thunk";

export { default as AppHeader } from "./components/app-header/app-header";

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const state = location.state as
    | { backgroundLocation?: Location; order?: OrderSummary }
    | undefined;

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className="app">
      <AppHeader />
      <main>
        <Routes location={state?.backgroundLocation ?? location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/feed/:number" element={<OrderDetailsPage />} />
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
          >
            <Route index element={<ProfileSettingsPage />} />
            <Route path="orders" element={<ProfileOrdersPage />} />
            <Route path="orders/:number" element={<OrderDetailsPage />} />
          </Route>
          <Route path="/ingredients/:id" element={<IngredientPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {state?.backgroundLocation && (
          <Routes>
            <Route
              path="/ingredients/:id"
              element={<IngredientDetailsModal />}
            />
            <Route path="/feed/:number" element={<OrderDetailsModal />} />
            <Route
              path="/profile/orders/:number"
              element={
                <ProtectedRouteElement element={<OrderDetailsModal />} />
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
