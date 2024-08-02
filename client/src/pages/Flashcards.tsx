import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useListEntriesQuery } from '../api';
import { ListEntriesResponseBody } from '../types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { AudioButton, PreferencesButton } from '../components/ActionButtons';
import { selectSoundAutoplay } from '../reducers/uiSlice';
import FullScreenContainer from '../components/FullScreenContainer';
import PaginationControl from '../components/PaginationControl';
import { flipCard, initializeFlashcards, nextCard, previousCard, selectCurrentCard, selectCurrentCardIndex, selectCurrentExampleCard, selectDefinitionFirst, selectExampleMode, selectIsFlipped, selectIsShuffled, selectTotalCardLength, setDefinitionFirst, setExampleMode, setIsShuffled } from '../reducers/flashcardsSlice';
import EntryCardContent from '../components/EntryCardContent';
import PreferencesDialog, { PreferenceRow } from '../components/PreferencesDialog';

const Flashcards = () => {
  const navigate = useNavigate();
  const { collectionId } = useParams() as { collectionId: string; };
  const { data: { data: entries } } = useListEntriesQuery({ collectionId }) as { data: ListEntriesResponseBody; };
  const dispatch = useAppDispatch();
  const currentCardIndex = useAppSelector(selectCurrentCardIndex);
  const currentCard = useAppSelector(selectCurrentCard);
  const currentExampleCard = useAppSelector(selectCurrentExampleCard);
  const soundAutoPlay = useAppSelector(selectSoundAutoplay);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const totalCount = useAppSelector(selectTotalCardLength);
  const definitionFirst = useAppSelector(selectDefinitionFirst);
  const exampleMode = useAppSelector(selectExampleMode);
  const isFlipped = useAppSelector(selectIsFlipped);
  const isShuffled = useAppSelector(selectIsShuffled);

  const mode = useMemo(() => {
    if (exampleMode) return 2;
    else if (definitionFirst) return 1;
    return 0;
  }, [exampleMode, definitionFirst]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpen = () => setIsDialogOpen(true);
  const handleClose = () => setIsDialogOpen(false);

  const keydownEventListener = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') dispatch(previousCard());
    else if (event.key === 'ArrowRight') dispatch(nextCard());
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      dispatch(flipCard());
    }
  }, [dispatch]);

  const playAudio = useCallback(() => audioRef.current?.play(), []);
  // const stopAudio = useCallback(() => audioRef.current?.pause(), []);

  useEffect(() => {
    dispatch(initializeFlashcards({ entries }))
  }, [entries, dispatch]);

  useEffect(() => {
    document.addEventListener('keydown', keydownEventListener);
    return () => document.removeEventListener('keydown', keydownEventListener);
  }, [keydownEventListener]);

  useEffect(() => {
    if (soundAutoPlay) playAudio();
  }, [playAudio, soundAutoPlay, isFlipped, currentCardIndex, exampleMode]);

  return (
    <FullScreenContainer
      onExit={() => { navigate(`/collections/${collectionId}/view`) }}
    >
      <Container sx={{ height: '100%' }}>
        {totalCount > 0 ? (
          <Stack
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            padding="1rem"
            spacing={2}
          >
            <Paper
              elevation={6}
              sx={{
                width: '100%',
                maxWidth: '640px',
                height: '40%',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => dispatch(flipCard())}
            >
              <Stack
                width="100%"
                height="100%"
                alignItems="center"
                justifyContent="center"
                padding="1rem"
              >

                <EntryCardContent
                  key={`card-${exampleMode ? `example-${currentExampleCard.exampleIndex}` : `${currentCard.index}`}`}
                  audioRef={audioRef}
                />
              </Stack>
            </Paper>
            <Stack justifyContent="start">
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <AudioButton onClick={playAudio} />
                <PreferencesButton onClick={handleOpen} />
              </Stack>
              <PaginationControl
                onBack={() => dispatch(previousCard())}
                onForward={() => dispatch(nextCard())}
                currentIndex={currentCardIndex + 1}
                totalCount={totalCount}
              />
            </Stack>
          </Stack>
        ) : null}
      </Container>
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
        <PreferenceRow label="Mode">
          <Select
            variant="standard"
            value={mode}
            onChange={({ target: { value } }) => {
              dispatch(setExampleMode(value === 2));
              dispatch(setDefinitionFirst(value === 1));
            }}
          >
            <MenuItem value={0}>Term</MenuItem>
            <MenuItem value={1}>Definition</MenuItem>
            <MenuItem value={2}>Example</MenuItem>
          </Select>
        </PreferenceRow>
      </PreferencesDialog>
    </FullScreenContainer>
  );
};

export default Flashcards;