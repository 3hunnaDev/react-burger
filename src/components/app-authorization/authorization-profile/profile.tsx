import React, { useCallback, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./profile.module.css";
import { logoutUser } from "store/auth/thunks";
import { useAppDispatch } from "hooks/redux";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return;
    }
    try {
      setIsLoggingOut(true);
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch {
      navigate("/404", { replace: true });
    }
  }, [dispatch, navigate, isLoggingOut]);

  const isOrdersRoute = location.pathname.startsWith("/profile/orders");
  const description = isOrdersRoute
    ? "В этом разделе вы можете просмотреть историю заказов"
    : "В этом разделе вы можете изменить свои персональные данные";

  if (isLoggingOut) {
    return (
      <div className={styles.logoutOverlay}>
        <div className={styles.logoutSpinner} />
        <p className={`text text_type_main-default ${styles.logoutText}`}>
          Выход
        </p>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.navList}>
            <NavLink
              to="/profile"
              end
              className={({ isActive }) =>
                `${styles.navLink} text text_type_main-medium ${
                  isActive ? styles.navLinkActive : "text_color_inactive"
                }`
              }
            >
              Профиль
            </NavLink>
            <NavLink
              to="/profile/orders"
              className={({ isActive }) =>
                `${styles.navLink} text text_type_main-medium ${
                  isActive ? styles.navLinkActive : "text_color_inactive"
                }`
              }
            >
              История заказов
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className={`${styles.navLink} ${styles.navButton} text text_type_main-medium text_color_inactive`}
            >
              Выход
            </button>
          </nav>
          <p className={`text text_type_main-default ${styles.description}`}>
            {description}
          </p>
        </aside>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Profile;
