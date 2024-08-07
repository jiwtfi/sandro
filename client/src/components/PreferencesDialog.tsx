import { PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface PreferenceRowProps extends PropsWithChildren {
  label: string;
}

export const PreferenceRow: React.FC<PreferenceRowProps> = ({ label, children }) => (
  <Stack direction="row" alignItems="center">
    <FormLabel>{label}</FormLabel>
    <Stack flex={1} />
    {children}
  </Stack>
);

interface PreferencesProps extends DialogProps { }

const PreferencesDialog: React.FC<PreferencesProps> = ({ children, ...props }) => (
  <Dialog {...props} >
    <Stack padding="1rem" width="80vw" maxWidth="360px" spacing={2}>
      <Typography variant="h6" fontWeight="bold">Preferences</Typography>
      <Stack spacing={1}>
        {children}
      </Stack>
      <Stack direction="row" width="100%" justifyContent="end">
        <Button onClick={() => { if (props.onClose) props.onClose({}, 'backdropClick'); }}>OK</Button>
      </Stack>
    </Stack>
  </Dialog>
);

export default PreferencesDialog;