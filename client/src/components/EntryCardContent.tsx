import { Fragment } from 'react';
import Typography from '@mui/material/Typography';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectCurrentCard, selectCurrentExampleCard, selectDefinitionFirst, selectExampleMode, selectIsFlipped } from '../reducers/flashcardsSlice';
import { sliceExampleText } from '../utils';

interface EntryCardContentProps {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const EntryCardContent: React.FC<EntryCardContentProps> = ({ audioRef }) => {
  const currentCard = useAppSelector(selectCurrentCard);
  const currentExampleCard = useAppSelector(selectCurrentExampleCard);
  const definitionFirst = useAppSelector(selectDefinitionFirst);
  const exampleMode = useAppSelector(selectExampleMode);
  const flipped = useAppSelector(selectIsFlipped);


  if (flipped) {
    const card = exampleMode ? currentExampleCard : currentCard;
    return (
      <Fragment>
        <Typography
          sx={{ typography: { xs: 'h5', md: 'h4' } }}
          fontWeight="bold"
        >{card.term.text}</Typography>
        <Typography
          sx={{ typography: { xs: 'body1', md: 'h6' } }}
        >{card.definition.text}</Typography>
        <audio ref={audioRef}>
          <source src={card.term.audioUrl} />
        </audio>
      </Fragment>
    );
  }

  if (exampleMode) return (
    <Fragment>
      <Typography
        sx={{ typography: { xs: 'h6', md: 'h5' } }}
      >
        {sliceExampleText(currentExampleCard.example).map((text, j) => (
          <span key={`example-${currentExampleCard.exampleIndex}-${j}`}>{(j % 2 === 1) ? (
            <span style={{ fontWeight: 'bold' }}>{text}</span>
          ) : text}
          </span>
        ))}
      </Typography>
      <audio ref={audioRef}>
        <source src={currentExampleCard.example.audioUrl} />
      </audio>
    </Fragment>
  );

  if (definitionFirst) return (
    <Fragment>
      <Typography
        sx={{ typography: { xs: 'h6', md: 'h5' } }}
      >{currentCard.definition.text}</Typography>
    </Fragment>
  );

  return (
    <Fragment>
      <Typography
        sx={{ typography: { xs: 'h4', md: 'h3' } }}
      >{currentCard.term.text}</Typography>
      <audio ref={audioRef}>
        <source src={currentCard.term.audioUrl} />
      </audio>
    </Fragment>
  );

};

export default EntryCardContent;