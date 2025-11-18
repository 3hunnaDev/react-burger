import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  EmailInput,
  PasswordInput,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../authorization.module.css";
import type { RootState, AppDispatch } from "store";
import { loginUser } from "store/auth/thunks";

const AppLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, errors, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [form, setForm] = useState({ email: "", password: "" });

  const loginStatus = status.login;
  const loginError = errors.login;

  useEffect(() => {
    if (loginStatus === "succeeded" && isAuthenticated) {
      const from = (location.state as { from?: Location })?.from;
      navigate(from?.pathname ?? "/", { replace: true });
    }
  }, [isAuthenticated, location.state, loginStatus, navigate]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch(loginUser(form));
    },
    [dispatch, form]
  );

  return (
    <section className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={`text text_type_main-medium ${styles.title}`}>
          Вход
        </h1>
        <div className={styles.fields}>
          <EmailInput
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="E-mail"
            isIcon={false}
          />
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        {loginError ? (
          <p className={`text text_type_main-default ${styles.error}`}>
            {loginError}
          </p>
        ) : null}
        <div className={styles.actions}>
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            disabled={loginStatus === "loading"}
          >
            {loginStatus === "loading" ? "Входим..." : "Войти"}
          </Button>
          <p className={`text text_type_main-default ${styles.linkRow}`}>
            Вы — новый пользователь?
            <Link to="/register">Зарегистрироваться</Link>
          </p>
          <p className={`text text_type_main-default ${styles.linkRow}`}>
            Забыли пароль?
            <Link to="/forgot-password">Восстановить пароль</Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default AppLogin;
