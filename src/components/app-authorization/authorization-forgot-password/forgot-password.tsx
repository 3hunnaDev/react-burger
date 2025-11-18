import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  EmailInput,
  Button,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "../authorization.module.css";
import type { RootState, AppDispatch } from "store";
import { forgotPassword } from "store/auth/thunks";
import { isEmailValid, EMAIL_ERROR_TEXT } from "utils/validation";

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, errors } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");

  const forgotStatus = status.forgotPassword;
  const forgotError = errors.forgotPassword;

  useEffect(() => {
    if (forgotStatus === "succeeded") {
      navigate("/reset-password", { replace: true });
    }
  }, [forgotStatus, navigate]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }, []);

  const isEmailFieldValid = isEmailValid(email);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isEmailValid(email)) {
        return;
      }
      dispatch(forgotPassword({ email }));
    },
    [dispatch, email]
  );

  return (
    <section className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={`text text_type_main-medium ${styles.title}`}>
          Восстановление пароля
        </h1>
        <div className={styles.fields}>
          <EmailInput
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Укажите e-mail"
            isIcon={false}
            errorText={EMAIL_ERROR_TEXT}
          />
        </div>
        {forgotError ? (
          <p className={`text text_type_main-default ${styles.error}`}>
            {forgotError}
          </p>
        ) : (
          <p className={`text text_type_main-default ${styles.hint}`}>
            Укажите e-mail, который использовали при регистрации
          </p>
        )}
        <div className={styles.actions}>
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            disabled={forgotStatus === "loading" || !isEmailFieldValid}
          >
            {forgotStatus === "loading" ? "Отправляем..." : "Восстановить"}
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

export default ForgotPassword;
