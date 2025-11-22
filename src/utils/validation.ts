const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 6;

export const PASSWORD_ERROR_TEXT = "Некорректный пароль";
export const EMAIL_ERROR_TEXT = "Некорректный e-mail";

export const isPasswordValid = (value: string): boolean =>
  value.length >= MIN_PASSWORD_LENGTH;

export const isEmailValid = (value: string): boolean =>
  EMAIL_REGEX.test(value.trim());
