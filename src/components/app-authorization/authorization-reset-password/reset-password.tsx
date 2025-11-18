import React, { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../authorization.module.css";
import type { RootState, AppDispatch } from "store";
import { resetPassword } from "store/auth/thunks";
import TextInput from "components/shared/text-input/text-input";
import { isPasswordValid } from "utils/validation";

const ResetPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, errors, isResetPasswordAllowed } = useSelector(
    (state: RootState) => state.auth
  );
  const [form, setForm] = useState({ password: "", token: "" });

  const resetStatus = status.resetPassword;
  const resetError = errors.resetPassword;

  useEffect(() => {
    if (resetStatus === "succeeded") {
      navigate("/login", { replace: true });
    }
  }, [navigate, resetStatus]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const isPasswordFieldValid = isPasswordValid(form.password);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isPasswordValid(form.password)) {
        return;
      }
      dispatch(resetPassword(form));
    },
    [dispatch, form]
  );

  if (!isResetPasswordAllowed) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <section className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={`text text_type_main-medium ${styles.title}`}>
          Введите новый пароль
        </h1>
        <div className={styles.fields}>
          <PasswordInput
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <TextInput
            name="token"
            placeholder="Введите код из письма"
            value={form.token}
            onChange={handleChange}
          />
        </div>
        {resetError ? (
          <p className={`text text_type_main-default ${styles.error}`}>
            {resetError}
          </p>
        ) : (
          <p className={`text text_type_main-default ${styles.hint}`}>
            Проверьте почту и введите код для подтверждения
          </p>
        )}
        <div className={styles.actions}>
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            disabled={resetStatus === "loading" || !isPasswordFieldValid}
          >
            {resetStatus === "loading" ? "Сохраняем..." : "Сохранить"}
          </Button>
          <p className={`text text_type_main-default ${styles.linkRow}`}>
            Вспомнили пароль?
            <Link to="/login">Войти</Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default ResetPassword;
