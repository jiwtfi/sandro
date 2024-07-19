import { PropsWithChildren } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface AuthFormContainerProps extends PropsWithChildren {
  title: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ title, onSubmit, children }) => {
  return (
    <Stack alignItems="center" paddingTop="4rem">
      <Typography variant="h5" sx={{ paddingBottom: '1rem' }}>{title}</Typography>
      <Stack maxWidth="30rem" width="100%">
        <form onSubmit={e => { e.preventDefault(); onSubmit(e); }}>
          {children}
        </form>
      </Stack>
    </Stack>
  );
};

export default AuthFormContainer;