import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
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
  selectCurrentExampleIndex,
  selectExampleLength,
  selectIsComplete,
  selectIsGameLoaded,
  selectIsShuffled,
  selectLetters,
  setIsComplete,
  setIsShuffled
} from '../reducers/gameSlice';
import { useAppSelector } from '../hooks/useAppSelector';
import { AudioButton, PreferencesButton } from '../components/ActionButtons';
import { selectSoundAutoplay } from '../reducers/uiSlice';
import FullScreenContainer from '../components/FullScreenContainer';
import PaginationControl from '../components/PaginationControl';
import PreferencesDialog, { PreferenceRow } from '../components/PreferencesDialog';

const Game = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams() as { collectionId: string; };
  const { data: { data: entries } } = useListEntriesQuery({ collectionId }) as { data: ListEntriesResponseBody; };
  const dispatch = useAppDispatch();
  const currentExampleIndex = useAppSelector(selectCurrentExampleIndex);
  const isGameLoaded = useAppSelector(selectIsGameLoaded);
  const letters = useAppSelector(selectLetters);
  const isComplete = useAppSelector(selectIsComplete);
  const exampleLength = useAppSelector(selectExampleLength);
  const soundAutoPlay = useAppSelector(selectSoundAutoplay);
  const isShuffled = useAppSelector(selectIsShuffled)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>(Array(4).fill(null));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

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
  // const stopAudio = useCallback(() => audioRef.current?.pause(), []);

  useEffect(() => {
    document.addEventListener('keydown', keydownEventListener);
    return () => document.removeEventListener('keydown', keydownEventListener);
  }, [keydownEventListener]);

  useEffect(() => {
    if (isComplete && soundAutoPlay) playAudio();
  }, [isComplete, playAudio, soundAutoPlay]);

  // useEffect(() => {
  //   if (!soundAutoPlay) stopAudio();
  // }, [soundAutoPlay, stopAudio]);

  useEffect(() => {
    return () => { dispatch(setIsComplete(false)); };
  }, [dispatch]);

  return (
    <FullScreenContainer onExit={() => { navigate(`/collections/${collectionId}/view`) }}>
      <Container sx={{ height: '100%' }}>
        <Stack
          width="100%"
          height="100%"
          alignItems="center"
          spacing={3}
        >
          <Stack
            flex={5}
            width="100%"
            alignItems="center"
            justifyContent="end"
          >
            {isGameLoaded ? (
              <GameQuestion
                key={`question-${currentExampleIndex}`}
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
              <PreferencesButton onClick={handleOpen} />
            </Stack>
            <PaginationControl
              onBack={() => dispatch(previousQuestion())}
              onForward={() => dispatch(nextQuestion())}
              currentIndex={currentExampleIndex + 1}
              totalCount={exampleLength}
            />
          </Stack>
        </Stack>
        <PreferencesDialog
          open={isDialogOpen}
          onClose={handleClose}
        >
          <PreferenceRow label="Shuffle">
            <Switch
              checked={isShuffled}
              onChange={(event, checked) => dispatch(setIsShuffled(checked))}
            />
          </PreferenceRow>
        </PreferencesDialog>
      </Container>
    </FullScreenContainer>
  );
};

export default Game;