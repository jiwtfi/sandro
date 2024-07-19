import { PropsWithChildren } from 'react';
import Stack, { StackProps } from '@mui/material/Stack';

const ActionButtonsContainer: React.FC<StackProps> = props => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1}
    {...props}
  />
);

export default ActionButtonsContainer;