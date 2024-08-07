import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '../components/IconButton';

interface PaginationControlProps {
  onBack?: React.MouseEventHandler<HTMLButtonElement>;
  onForward?: React.MouseEventHandler<HTMLButtonElement>;
  currentIndex: number | string;
  totalCount: number;
  actions?: JSX.Element;
}

const PaginationControl: React.FC<PaginationControlProps> = ({ onBack, onForward, currentIndex, totalCount, actions }) => {
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
      <Stack direction="row" alignItems="center" spacing={3} flex={1} justifyContent="center">
        <Typography>
          {currentIndex} / {totalCount}
        </Typography>
        {actions ? (
          <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
            {actions}
          </Stack>
        ) : null}
      </Stack>
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