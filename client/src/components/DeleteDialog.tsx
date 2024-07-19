
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface DeleteDialogProps extends DialogProps {
  title: string;
  prompt: string;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
}


const DeleteDialog: React.FC<DeleteDialogProps> = ({ title, prompt, onDelete, onCancel, ...props }) => {
  return (
    <Dialog
      {...props}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {prompt}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          onClick={onCancel}
        >Cancel</Button>
        <Button
          color="error"
          onClick={onDelete}
        >Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;