import { Fragment } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { randomId } from '../utils';
import { useAppSelector } from '../hooks/useAppSelector';
import { reveal, selectCurrentLetter, selectDefinition, selectExample, selectIsComplete, selectLetters, selectRevealed, selectTerm } from '../reducers/gameSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useSelector } from 'react-redux';

interface GameQuestionProps {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

interface LetterButtonProps {
  buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  letter: string;
  index: number;
}

const LetterButton: React.FC<LetterButtonProps> = ({ buttonRefs, letter, index }) => {
  const currentLetter = useSelector(selectCurrentLetter);
  const dispatch = useAppDispatch();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      flex={1}
    >

      <ButtonBase
        sx={theme => ({
          border: `2px solid ${theme.palette.divider}`,
          borderRadius: '25%',
          width: '3.6rem',
          height: '3.6rem',
        })}
        ref={el => { buttonRefs.current[index] = el; }}
        onClick={() => {
          if (letter === currentLetter.toLowerCase()) dispatch(reveal());
        }}
      >
        <Typography
          sx={{ typography: { xs: 'h6', md: 'h5' } }}
          fontFamily="monospace">{letter.toUpperCase()}</Typography>
      </ButtonBase>
    </Stack>
  )
};

const GameQuestion: React.FC<GameQuestionProps> = ({ audioRef, buttonRefs }) => {
  const id = randomId();
  const example = useAppSelector(selectExample);
  const definition = useAppSelector(selectDefinition);
  const term = useAppSelector(selectTerm);
  const revealed = useAppSelector(selectRevealed);
  const isComplete = useAppSelector(selectIsComplete);
  const letters = useAppSelector(selectLetters);
  const theme = useTheme();

  return (
    <Stack spacing={3} width="100%">
      <audio ref={audioRef}>
        <source src={example.audioUrl} />
      </audio>

      <Stack spacing={1}>
        {<Typography
          sx={{
            typography: { xs: 'h6', md: 'h5' },
            visibility: isComplete ? undefined : 'hidden'
          }}
        ><b>{term.text}</b></Typography>}
        <Typography
          sx={{ typography: { xs: 'body1', md: 'h6' } }}
          color={theme => theme.typography.body2.color}
        ><i>{definition.text}</i></Typography>
      </Stack>
      <Typography
        fontFamily="monospace"
        sx={{
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          lineHeight: 1.5

        }}
      >
        {revealed.map((text, i) => (
          <Fragment
            key={`${id}-${i}`}
          >
            {i % 2 === 1 ? (
              <span
                style={{
                  paddingLeft: (i === 1 && revealed[0].length === 0) ? undefined : '1rem',
                  paddingRight: '1rem',
                  fontSize: '120%',
                  letterSpacing: '.25rem',
                  color: isComplete ? theme.palette.success.main : undefined
                }}
              >{text.split(' ').map(t => t.replace(/\*/g, '_').split('').join('')).join(' ')}</span>
            ) : text}
          </Fragment>
        ))}
      </Typography>
      <Stack direction="row" width="20rem" alignSelf="center">
        {letters.slice(0, 4).map((letter, i) => (
          <LetterButton
            letter={letter}
            index={i}
            buttonRefs={buttonRefs}
            key={`letter-${letter}`}
          />
        ))}
      </Stack>
    </Stack >
  );
};

export default GameQuestion;