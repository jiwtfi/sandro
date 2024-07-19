import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';

const defaultSize = "6rem";

const Spinner: React.FC<CircularProgressProps> = (props) => (
  <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
    <CircularProgress
      size={defaultSize}
      {...props}
    />
  </Box>
);

export default Spinner;