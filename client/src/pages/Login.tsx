import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { EmailField, PasswordField } from '../components/TextField';
import { validateEmail, validatePassword, validateTextField } from '../utils';
import { useTextField } from '../hooks/useTextField';
import AuthFormContainer from '../components/AuthFormContainer';
import { auth } from '../firebase';

const incorrectCredentialsErrorMessage = 'The credentials are incorrect';

const Login = () => {
  const navigate = useNavigate();
  const { isValid: isEmailValid, fieldProps: email } = useTextField({ validator: validateTextField });
  const { isValid: isPasswordValid, fieldProps: password } = useTextField({ validator: validateTextField });
  const isValid = isEmailValid && isPasswordValid;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!!validateEmail(email.value) || !!validatePassword(password.value)) {
      setError(incorrectCredentialsErrorMessage);
    }
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email.value, password.value);
      navigate('/home');
    } catch (err) {
      console.error(err);
      if (err instanceof FirebaseError) {
        // if (err.code === 'auth/user-diabled')
        setError(incorrectCredentialsErrorMessage);
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
      <AuthFormContainer title="Login" onSubmit={handleSubmit}>
        <EmailField
          persistentHelperText
          {...email}
          error={email.error || !!error}
        />
        <PasswordField
          persistentHelperText
          {...password}
          error={password.error || !!error}
        />
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          disabled={!isValid}
          loading={isLoading}
        >Log In</LoadingButton>
      </AuthFormContainer>
    </Stack>
  );
};

export default Login; 