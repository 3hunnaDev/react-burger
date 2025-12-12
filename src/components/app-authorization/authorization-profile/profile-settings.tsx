import React, { useCallback, useEffect, useRef, useState } from "react";
import TextInput from "components/shared/text-input/text-input";
import { Button } from "@ya.praktikum/react-developer-burger-ui-components";
import {
  EMAIL_ERROR_TEXT,
  PASSWORD_ERROR_TEXT,
  isEmailValid,
  isPasswordValid,
} from "utils/validation";
import { useAppDispatch, useAppSelector } from "hooks/redux";
import { updateUserProfile } from "store/auth/thunks";
import styles from "./profile.module.css";

type EditableField = "name" | "email" | "password";

const ProfileSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, errors, status } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
  });

  const [editableField, setEditableField] = useState<EditableField | null>(
    null
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
    });
    setEditableField(null);
    setPasswordError(null);
    setEmailError(null);
  }, [user?.email, user?.name]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setPasswordError(null);
    }
    if (name === "email") {
      setEmailError(null);
    }
  }, []);

  const focusField = useCallback((field: EditableField) => {
    const refs: Record<EditableField, React.RefObject<HTMLInputElement>> = {
      name: nameInputRef,
      email: emailInputRef,
      password: passwordInputRef,
    };
    const ref = refs[field];
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const handleEnableField = useCallback(
    (field: EditableField) => {
      setEditableField(field);
      if (field === "password") {
        setPasswordError(null);
      }
      if (field === "email") {
        setEmailError(null);
      }
      setTimeout(() => focusField(field), 0);
    },
    [focusField]
  );

  const updateError = errors.updateUser;
  const updateStatus = status.updateUser;
  const passwordValue = editableField === "password" ? form.password : "******";

  const hasNameChanged = form.name !== (user?.name ?? "");
  const hasEmailChanged = form.email !== (user?.email ?? "");
  const hasPassword = Boolean(form.password);

  const isEmailInputValid = !hasEmailChanged || isEmailValid(form.email);
  const isPasswordInputValid = !hasPassword || isPasswordValid(form.password);

  const hasChanges = hasNameChanged || hasEmailChanged || hasPassword;
  const isActionVisible = editableField !== null || hasChanges;
  const isSubmitDisabled =
    !hasChanges ||
    !isEmailInputValid ||
    !isPasswordInputValid ||
    updateStatus === "loading";

  const handleCancel = useCallback(() => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
    });
    setEditableField(null);
    setEmailError(null);
    setPasswordError(null);
  }, [user?.email, user?.name]);

  const handleFormKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLFormElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCancel();
      }
    },
    [handleCancel]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!hasChanges) {
        return;
      }

      if (hasEmailChanged && !isEmailValid(form.email)) {
        setEmailError(EMAIL_ERROR_TEXT);
        return;
      }

      if (hasPassword && !isPasswordValid(form.password)) {
        setPasswordError(PASSWORD_ERROR_TEXT);
        return;
      }

      const payload: Partial<{
        name: string;
        email: string;
        password: string;
      }> = {};

      if (hasNameChanged) {
        payload.name = form.name;
      }
      if (hasEmailChanged) {
        payload.email = form.email;
      }
      if (hasPassword) {
        payload.password = form.password;
      }

      try {
        await dispatch(updateUserProfile(payload)).unwrap();
        setEditableField(null);
        if (hasPassword) {
          setForm((prev) => ({ ...prev, password: "" }));
        }
      } catch (error) {
        const fallbackMessage =
          "Не удалось обновить данные учетной записи. Попробуйте позже";
        const errorMessage =
          typeof error === "string"
            ? error
            : error instanceof Error
            ? error.message
            : fallbackMessage;

        if (hasEmailChanged) {
          setEmailError(errorMessage);
        }

        if (hasPassword) {
          setPasswordError(errorMessage);
        }
      }
    },
    [
      dispatch,
      form.email,
      form.name,
      form.password,
      hasChanges,
      hasEmailChanged,
      hasNameChanged,
      hasPassword,
    ]
  );

  return (
    <form
      className={styles.formWrapper}
      onSubmit={handleSubmit}
      onKeyDown={handleFormKeyDown}
    >
      <div className={styles.fields}>
        <TextInput
          name="name"
          placeholder="Имя"
          value={form.name}
          onChange={handleChange}
          disabled={editableField !== "name"}
          isIcon
          onIconClick={() => handleEnableField("name")}
          ref={nameInputRef}
        />
        <TextInput
          name="email"
          type="email"
          placeholder="Логин"
          value={form.email}
          onChange={handleChange}
          disabled={editableField !== "email"}
          isIcon
          onIconClick={() => handleEnableField("email")}
          ref={emailInputRef}
          error={Boolean(emailError)}
          errorText={emailError ?? undefined}
        />
        <TextInput
          name="password"
          type="password"
          placeholder="Пароль"
          value={passwordValue}
          onChange={handleChange}
          disabled={editableField !== "password"}
          isIcon
          onIconClick={() => handleEnableField("password")}
          ref={passwordInputRef}
          autoComplete="new-password"
          error={Boolean(passwordError)}
          errorText={passwordError ?? undefined}
        />
      </div>
      {updateError ? (
        <p className={`text text_type_main-default ${styles.error}`}>
          {updateError}
        </p>
      ) : null}
      {isActionVisible ? (
        <div className={styles.formActions}>
          <Button
            type="secondary"
            size="medium"
            htmlType="button"
            onClick={handleCancel}
          >
            Отменить
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            size="medium"
            disabled={isSubmitDisabled}
          >
            {updateStatus === "loading" ? "Сохраняем..." : "Сохранить"}
          </Button>
        </div>
      ) : null}
    </form>
  );
};

export default ProfileSettings;
