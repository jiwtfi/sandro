import { PropsWithChildren } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectSoundAutoplay, setSoundAutoplay } from '../reducers/uiSlice';
import { AudioButton, CancelButton, MuteButton } from './ActionButtons';
import { useAppDispatch } from '../hooks/useAppDispatch';

interface FullScreenContainerProps extends PropsWithChildren {
  onExit: React.MouseEventHandler<HTMLButtonElement>;
}

const FullScreenContainer: React.FC<FullScreenContainerProps> = ({ children, onExit }) => {
  const soundAutoPlay = useAppSelector(selectSoundAutoplay);
  const dispatch = useAppDispatch();

  return (
    <Paper
      sx={{
        height: '100vh',
        width: '100vw',
        maxHeight: '-webkit-fill-available',
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    >
      <Stack
        direction="row"
        position="absolute"
        top={0}
        right={0}
        padding={theme => theme.spacing(1)}
      >
        {soundAutoPlay ? (
          <AudioButton title="Autoplay: ON" onClick={() => {
            // stopAudio();
            dispatch(setSoundAutoplay(false));
          }} />
        ) : (
          <MuteButton title="Autoplay: OFF" onClick={() => dispatch(setSoundAutoplay(true))} />
        )}
        <CancelButton
          title="Exit"
          onClick={onExit}
          border={false}
        />
      </Stack>
      {children}
    </Paper>
  )
};

export default FullScreenContainer;