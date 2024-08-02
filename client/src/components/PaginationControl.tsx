import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '../components/IconButton';

interface PaginationControlProps {
  onBack?: React.MouseEventHandler<HTMLButtonElement>;
  onForward?: React.MouseEventHandler<HTMLButtonElement>;
  currentIndex: number;
  totalCount: number;
}

const PaginationControl: React.FC<PaginationControlProps> = ({ onBack, onForward, currentIndex, totalCount }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="center"
    >
      <IconButton
        disabled={!onBack}
        onClick={onBack}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography>
        {currentIndex} / {totalCount}
      </Typography>

      <IconButton
        disabled={!onForward}
        onClick={onForward}
      >
        <ArrowForwardIcon />
      </IconButton>
    </Stack>
  );
};

export default PaginationControl;