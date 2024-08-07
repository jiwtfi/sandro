import { Fragment, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MuiCSSBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import NavBar from '../components/NavBar';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectIsAppLoading, setSoundAutoplay } from '../reducers/uiSlice';
import Spinner from '../components/Spinner';
import { retrievePreferencesFromLocalStorage } from '../utils/preferences';
import { useAppDispatch } from '../hooks/useAppDispatch';

const Root = () => {
  const isLoading = useAppSelector(selectIsAppLoading);
  const dispatch = useAppDispatch();

  const defaultTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });
  const muiTheme = createTheme(defaultTheme, {
    typography: {
      body2: {
        color: defaultTheme.palette.text.secondary
      }
    }
  });

  useEffect(() => {
    const { autoPlay } = retrievePreferencesFromLocalStorage();
    dispatch(setSoundAutoplay(autoPlay));
  }, [dispatch]);

  return (
    <Fragment>
      <ThemeProvider theme={muiTheme}>
        <MuiCSSBaseline>
          <Stack
            width="100vw"
            height="100vh"
            paddingBottom="2rem"
            maxHeight="-webkit-fill-available"
            overflow="hidden"
          >
            {isLoading ? <Spinner /> : (
              <Fragment>
                <NavBar />
                <Box flexGrow={1} overflow="auto">
                  <Container sx={{ height: '100%' }}>
                    <Outlet />
                  </Container>
                </Box>
              </Fragment>
            )}
          </Stack>
        </MuiCSSBaseline>
      </ThemeProvider>
    </Fragment>
  )
};

export default Root;