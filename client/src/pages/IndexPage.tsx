import { Navigate, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectUser } from '../reducers/authSlice';

const IndexPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  if (user) return <Navigate to="/home" />;
  return (
    <Stack
      width="100%"
      height="80%"
      alignItems="center"
      justifyContent="center"
      spacing={6}
    >
      <Stack alignItems="center">
        <Typography variant="h2">sandro</Typography>
        <Typography variant="h5">Vocabulary Builder App</Typography>
      </Stack>
      <Stack
        alignItems="center"
        spacing={2}
        paddingX="1rem"
        width="100%"
        maxWidth="480px"
      >
        <Button
          variant="contained"
          color="inherit"
          sx={{ width: '100%' }}
          onClick={() => navigate('/signup')}
        >Sign up</Button>
        <Button
          variant="contained"
          color="inherit"
          sx={{ width: '100%' }}
          onClick={() => navigate('/login')}
        >Log in</Button>
      </Stack>
    </Stack>
  );
};

export default IndexPage;