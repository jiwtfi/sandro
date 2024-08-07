import Typography, { TypographyProps } from '@mui/material/Typography';
import { sliceExampleText } from '../utils';
import { Example } from '../types';

interface ExampleTextProps extends TypographyProps {
  example: Pick<Example, 'text' | 'occurrences'>;
  index?: number;
}

const ExampleText: React.FC<ExampleTextProps> = ({ example, index, ...props }) => (
  <Typography {...props}>
    {sliceExampleText(example).map((text, j) => (
      <span key={`example-${index}-${j}`}>{(j % 2 === 1) ? (
        <span style={{ fontWeight: 'bold' }}>{text}</span>
      ) : text}
      </span>
    ))}
  </Typography>
);

export default ExampleText;