import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectUser } from '../reducers/authSlice';
import { auth } from '../firebase';
import { selectHasUnsavedChanges, setHasUnsavedChanges } from '../reducers/uiSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { discardUnsavedChangeConfirmationText } from '../utils/messages';

interface NavBarButtonProps extends ButtonProps {
  title: string
}

interface NavBarLinkButtonProps extends ButtonProps {
  path: string;
  title: string;
}

const NavBarButton: React.FC<NavBarButtonProps> = ({ onClick, title }) => (
  <Button sx={{ color: 'white' }} onClick={onClick} >{title}</Button>
);

const NavBarLinkButton: React.FC<NavBarLinkButtonProps> = ({ path, title }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const hasUnsavedChanges = useAppSelector(selectHasUnsavedChanges);

  const handleClick = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm(discardUnsavedChangeConfirmationText)) return;
      dispatch(setHasUnsavedChanges(false));
    }
    navigate(path);
  };

  return <NavBarButton onClick={handleClick} title={title} />;
};

const NavBar = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen: React.MouseEventHandler<HTMLButtonElement> = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const logout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ButtonBase onClick={() => navigate('/')}>
          <Typography variant="h6">sandro</Typography>
        </ButtonBase>
        <Box flex={1} />
        <Box width="20rem" minWidth="12rem" padding="0 1rem">
        </Box>
        {user ? (
          <Fragment>
            <IconButton
              size="large"
              onClick={handleOpen}
              sx={{ color: 'white' }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={handleClose}
            >
              <MenuItem onClick={() => {
                logout();
                handleClose();
              }}>Log out</MenuItem>
            </Menu>
          </Fragment>
        ) : (
          <Fragment>
            <Stack direction="row">
              <NavBarLinkButton path="/login" title="LOG IN" />
              <NavBarLinkButton path="/signup" title="SIGN UP" />
            </Stack>
          </Fragment>
        )}
      </Toolbar>

    </AppBar>
  );
};

export default NavBar;