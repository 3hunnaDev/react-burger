import React, { useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import {
  EmailInput,
  PasswordInput,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../authorization.module.css";
import { loginUser } from "store/auth/thunks";
import useForm from "hooks/use-form";
import { isEmailValid, isPasswordValid, EMAIL_ERROR_TEXT } from "utils/validation";
import { useAppDispatch, useAppSelector } from "hooks/redux";

const AppLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, errors, isAuthenticated } = useAppSelector((state) => state.auth);
  const { values: form, handleChange } = useForm({ email: "", password: "" });

  const loginStatus = status.login;
  const loginError = errors.login;

  useEffect(() => {
    if (loginStatus === "succeeded" && isAuthenticated) {
      const from = (location.state as { from?: Location })?.from;
      navigate(from?.pathname ?? "/", { replace: true });
    }
  }, [isAuthenticated, location.state, loginStatus, navigate]);

  const isPasswordFieldValid = isPasswordValid(form.password);
  const isEmailFieldValid = isEmailValid(form.email);
  const isFormValid = isPasswordFieldValid && isEmailFieldValid;

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isPasswordValid(form.password) || !isEmailValid(form.email)) {
        return;
      }
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
            errorText={EMAIL_ERROR_TEXT}
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
            disabled={loginStatus === "loading" || !isFormValid}
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
