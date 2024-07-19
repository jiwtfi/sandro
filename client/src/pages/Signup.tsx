import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ConfirmPasswordField, EmailField, PasswordField, UsernameField } from '../components/TextField';
import { validateConfirmPassword, validateEmail, validatePassword, validateUsername } from '../utils';
import { useTextField, useUsernameField } from '../hooks/useTextField';
import AuthFormContainer from '../components/AuthFormContainer';
import { auth } from '../firebase';
import { useCreateUserMutation, useLazyListUsersQuery } from '../api';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { ErrorData, FieldError } from '../types/errors';
import { extractFieldError } from '../utils/errorHandlers';

const emailDuplicateErrorMessage = 'This email address is already in use';

const Signup = () => {
  const navigate = useNavigate();
  const [createUser] = useCreateUserMutation();
  const listUserQuery = useLazyListUsersQuery();
  const [emailDuplicateError, setEmailDuplicateError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const {
    isValid: isEmailValid,
    fieldProps: email
  } = useTextField({
    validator: validateEmail,
    error: emailDuplicateError ?? extractFieldError(fieldErrors, 'email')
  });
  const {
    isValid: isUsernameValid,
    fieldProps: username
  } = useUsernameField({
    validator: validateUsername,
    listUserQuery,
    error: extractFieldError(fieldErrors, 'username')
  });
  const {
    isValid: isPasswordValid,
    fieldProps: password
  } = useTextField({
    validator: validatePassword,
    error: extractFieldError(fieldErrors, 'password')
  });
  const {
    isValid: isConfirmPasswordValid,
    fieldProps: confirmPassword
  } = useTextField({
    validator: validateConfirmPassword(password.value)
  });
  const isValid = isEmailValid && isUsernameValid && isPasswordValid && isConfirmPasswordValid && !emailDuplicateError;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!isValid) return;
    setError(null);
    setFieldErrors([]);
    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const result = await createUser({
        body: {
          id: user.uid, email: email.value, username: username.value
        }
      });
      if ('data' in result) {
        navigate('/home');
      } else {
        if ('data' in result.error) {
          const { message, errors } = result.error.data as ErrorData;
          setError(message);
          if (errors) setFieldErrors(errors);
        }
      }
    } catch (err) {
      console.error(err);
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/email-already-in-use') setEmailDuplicateError(emailDuplicateErrorMessage);
      } else {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <AuthFormContainer title="Signup" onSubmit={handleSubmit}>
        <EmailField
          persistentHelperText
          {...email}
          onChange={event => {
            setEmailDuplicateError(null);
            email.onChange(event);
          }}
        />
        <UsernameField
          persistentHelperText
          {...username}
        />
        <PasswordField
          persistentHelperText
          {...password}
        />
        <ConfirmPasswordField
          persistentHelperText
          {...confirmPassword}
        />
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isLoading || listUserQuery[1].isLoading}
        >Sign Up</LoadingButton>
      </AuthFormContainer>
    </Stack>
  );
};

export default Signup;