import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import {
  Button,
  EmailInput,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../authorization.module.css";
import { registerUser } from "store/auth/thunks";
import TextInput from "components/shared/text-input/text-input";
import { isEmailValid, isPasswordValid, EMAIL_ERROR_TEXT } from "utils/validation";
import { useAppDispatch, useAppSelector } from "hooks/redux";

const AppRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, errors, isAuthenticated } = useAppSelector((state) => state.auth);

  const registerStatus = status.register;
  const registerError = errors.register;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (registerStatus === "succeeded" && isAuthenticated) {
      const from = (location.state as { from?: Location })?.from;
      navigate(from?.pathname ?? "/", { replace: true });
    }
  }, [isAuthenticated, location.state, navigate, registerStatus]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const isPasswordFieldValid = isPasswordValid(form.password);
  const isEmailFieldValid = isEmailValid(form.email);
  const isFormValid = isEmailFieldValid && isPasswordFieldValid;

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isPasswordValid(form.password) || !isEmailValid(form.email)) {
        return;
      }
      dispatch(registerUser(form));
    },
    [dispatch, form]
  );

  return (
    <section className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={`text text_type_main-medium ${styles.title}`}>
          Регистрация
        </h1>
        <div className={styles.fields}>
          <TextInput
            name="name"
            placeholder="Имя"
            value={form.name}
            onChange={handleChange}
          />
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
        {registerError ? (
          <p className={`text text_type_main-default ${styles.error}`}>
            {registerError}
          </p>
        ) : null}
        <div className={styles.actions}>
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            disabled={registerStatus === "loading" || !isFormValid}
          >
            {registerStatus === "loading" ? "Создаём..." : "Зарегистрироваться"}
          </Button>
          <p className={`text text_type_main-default ${styles.linkRow}`}>
            Уже зарегистрированы?
            <Link to="/login">Войти</Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default AppRegister;
