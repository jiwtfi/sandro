import { AlphaLocale, isEmail, isAlpha } from 'validator';

const fieldEmptyErrorMessage = 'The field must not be empty';

export const languages = {
  'en': 'en-US',
  'fi': 'fi-FI',
  'da': 'da-DK',
  'ja': 'ja-JP'
};

export const isLocaleAlpha = (text: string, lang: string) => isAlpha(text, languages[lang as keyof typeof languages] as AlphaLocale);

export const validateTextField = (value: string) => {
  if (value.length === 0) return fieldEmptyErrorMessage;
  return null;
};

export const validateEmail = (email: string) => {
  if (email.length === 0) return fieldEmptyErrorMessage;
  if (!isEmail(email)) return 'The email address must be valid';
  return null;
};

export const validatePassword = (password: string) => {
  if (password.length === 0) return fieldEmptyErrorMessage;
  if (password.length < 8) return 'The password must be at least 8 characters long';
  return null;
};

export const validateConfirmPassword = (password: string) => (confirmPassword: string) => {
  if (confirmPassword.length === 0) return fieldEmptyErrorMessage;
  if (confirmPassword !== password) return 'The passwords do not match';
  return null;
};

export const validateUsername = (username: string) => {
  const usernameRegEx = /^[a-zA-Z0-9_]+$/;
  if (username.length === 0) return fieldEmptyErrorMessage;
  if (username.length < 3) return 'The username must be at least 3 characters long';
  if (username.length > 20) return 'The username must not be over 20 characters long';
  if (!usernameRegEx.test(username)) return 'The username can only consist of alphanumeric characters and underscores';
  return null;
};

export const validateTermText = (text: string) => {
  if (text.length === 0) return fieldEmptyErrorMessage;
  return null;
};

export const validateDefinitionText = (text: string) => {
  if (text.length === 0) return fieldEmptyErrorMessage;
  return null;
};

export const validateExampleTextStringInput = (text: string) => {
  if (text.length === 0) return fieldEmptyErrorMessage;
  return null;
};