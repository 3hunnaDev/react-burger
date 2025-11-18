import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./profile.module.css";
import type { RootState, AppDispatch } from "store";
import { logoutUser, updateUserProfile } from "store/auth/thunks";
import TextInput from "components/shared/text-input/text-input";
import {
  isEmailValid,
  isPasswordValid,
  EMAIL_ERROR_TEXT,
  PASSWORD_ERROR_TEXT,
} from "utils/validation";

type EditableField = "name" | "email" | "password";

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, errors } = useSelector((state: RootState) => state.auth);
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

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (name === "password") {
        setPasswordError(null);
      }
      if (name === "email") {
        setEmailError(null);
      }
    },
    []
  );

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
        setForm((prev) => ({ ...prev, password: "" }));
        setPasswordError(null);
      }
      if (field === "email") {
        setEmailError(null);
      }
      setTimeout(() => focusField(field), 0);
    },
    [focusField]
  );

  const handleFieldBlur = useCallback(
    (field: EditableField) => {
      if (editableField !== field) {
        return;
      }

      if (field === "password") {
        if (form.password && !isPasswordValid(form.password)) {
          setPasswordError(PASSWORD_ERROR_TEXT);
          return;
        }
        setPasswordError(null);
      }
      if (field === "email") {
        if (!isEmailValid(form.email)) {
          setEmailError(EMAIL_ERROR_TEXT);
          return;
        }
        setEmailError(null);
      }

      setEditableField(null);

      const payload: Partial<{
        name: string;
        email: string;
        password: string;
      }> = {};

      if (field === "name" && form.name !== (user?.name ?? "")) {
        payload.name = form.name;
      }
      if (field === "email" && form.email !== (user?.email ?? "")) {
        payload.email = form.email;
      }
      if (field === "password" && form.password) {
        payload.password = form.password;
      }

      if (Object.keys(payload).length > 0) {
        dispatch(updateUserProfile(payload));
      }

      if (field === "password") {
        setForm((prev) => ({ ...prev, password: "" }));
      }
    },
    [
      dispatch,
      editableField,
      form.email,
      form.name,
      form.password,
      user?.email,
      user?.name,
    ]
  );

  const updateError = errors.updateUser;
  const passwordValue = editableField === "password" ? form.password : "******";

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch {
      navigate("/404", { replace: true });
    }
  }, [dispatch, navigate]);

  const renderProfileContent = () => (
    <form
      className={styles.formWrapper}
      onSubmit={(event) => event.preventDefault()}
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
          onBlur={() => handleFieldBlur("name")}
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
          onBlur={() => handleFieldBlur("email")}
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
          onBlur={() => handleFieldBlur("password")}
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
    </form>
  );

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
            В этом разделе вы можете изменить свои персональные данные
          </p>
        </aside>
        {renderProfileContent()}
      </div>
    </section>
  );
};

export default Profile;
