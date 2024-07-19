import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useListEntriesQuery } from '../api';
import { ListEntriesResponseBody } from '../types';
import GameQuestion from '../components/GameQuestion';
import IconButton from '../components/IconButton';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
  initializeGame,
  nextQuestion,
  previousQuestion,
  reveal,
  selectExampleIndex,
  selectExampleLength,
  selectIsComplete,
  selectIsGameLoaded,
  selectLetters,
  selectPreferences,
  setIsComplete,
} from '../reducers/gameSlice';
import { useAppSelector } from '../hooks/useAppSelector';
import { AudioButton, CancelButton, MuteButton, PreferencesButton } from '../components/ActionButtons';
import { selectSoundAutoplay, setSoundAutoplay } from '../reducers/uiSlice';

const Game = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams() as { collectionId: string; };
  const { data: { data: entries } } = useListEntriesQuery({ collectionId }) as { data: ListEntriesResponseBody; };
  const dispatch = useAppDispatch();
  const exampleIndex = useAppSelector(selectExampleIndex);
  const isGameLoaded = useAppSelector(selectIsGameLoaded);
  const letters = useAppSelector(selectLetters);
  const isComplete = useAppSelector(selectIsComplete);
  const exampleLength = useAppSelector(selectExampleLength);
  const preferences = useAppSelector(selectPreferences);
  const soundAutoPlay = useAppSelector(selectSoundAutoplay);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>(Array(4).fill(null));

  useEffect(() => {
    dispatch(initializeGame({ entries }));
  }, [entries, dispatch]);

  const handleInput = useCallback((letter: string) => {
    const index = letters.findIndex(l => l === letter.toLowerCase());
    if (index >= 0) buttonRefs.current[index]?.click();
  }, [letters]);

  const keydownEventListener = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') dispatch(previousQuestion());
    else if (event.key === 'ArrowRight') dispatch(nextQuestion());
    else if (event.key === 'Enter' && isComplete) {
      event.preventDefault();
      dispatch(nextQuestion());
    }
    else handleInput(event.key);
  }, [dispatch, isComplete, handleInput]);

  const playAudio = useCallback(() => audioRef.current?.play(), []);
  const stopAudio = useCallback(() => audioRef.current?.pause(), []);

  useEffect(() => {
    document.addEventListener('keydown', keydownEventListener);
    return () => document.removeEventListener('keydown', keydownEventListener);
  }, [keydownEventListener]);

  useEffect(() => {
    if (isComplete && soundAutoPlay) playAudio();
  }, [isComplete, playAudio, soundAutoPlay]);

  useEffect(() => {
    return () => { dispatch(setIsComplete(false)); };
  }, [dispatch]);

  return (
    <Paper
      sx={{
        height: '100vh',
        width: '100vw',
        maxHeight: '-webkit-fill-available',
        position: 'absolute',
        left: 0,
        top: 0
      }}
    >
      <Container sx={{ height: '100%' }}>
        <Stack
          width="100%"
          height="100%"
          alignItems="center"
          spacing={3}
        >
          <Stack
            width="100%"
            height="64px"
            direction="row"
            alignItems="center"
          >
            <Stack flex={1} />
            {soundAutoPlay ? (
              <AudioButton title="Autoplay: ON" onClick={() => {
                stopAudio();
                dispatch(setSoundAutoplay(false));
              }} />
            ) : (
              <MuteButton title="Autoplay: OFF" onClick={() => dispatch(setSoundAutoplay(true))} />
            )}
            <CancelButton
              title="Exit"
              onClick={() => { navigate(`/collections/${collectionId}/view`) }}
              border={false}

            />
          </Stack>
          <Stack
            flex={5}
            width="100%"
            alignItems="center"
            justifyContent="end"
          >
            {isGameLoaded ? (
              <GameQuestion
                key={`question-${exampleIndex}`}
                audioRef={audioRef}
                buttonRefs={buttonRefs}
              />
            ) : null}
          </Stack>
          <Stack
            flex={4}
            justifyContent="start"
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <AudioButton onClick={playAudio} />
              <IconButton
                title="Hint"
                onClick={() => dispatch(reveal())}
                disabled={isComplete}
              >
                <LightbulbIcon />
              </IconButton>
              {/* <PreferencesButton /> */}
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <IconButton
                onClick={() => dispatch(previousQuestion())}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography>
                {exampleIndex + 1} / {exampleLength}
              </Typography>

              <IconButton
                onClick={() => dispatch(nextQuestion())}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Stack>

          </Stack>


        </Stack>
      </Container>
    </Paper >
  );
};

export default Game;