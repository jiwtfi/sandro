import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

type TextFieldProps = MuiTextFieldProps & {
  persistentHelperText?: boolean;
};

const renderHelperText = ({ persistentHelperText, helperText }: TextFieldProps) => (
  helperText ?? (persistentHelperText ? ' ' : undefined)
);

export const EmailField: React.FC<TextFieldProps> = (props) => (
  <TextField
    fullWidth
    label="Email"
    name="email"
    type="email"
    {...props}
  />
);

export const UsernameField: React.FC<TextFieldProps> = (props) => (
  <TextField
    fullWidth
    label="Username"
    name="username"
    {...props}
  />
);

export const PasswordField: React.FC<TextFieldProps> = (props) => (
  <TextField
    fullWidth
    label="Password"
    name="password"
    type="password"
    {...props}
  />
);

export const ConfirmPasswordField: React.FC<TextFieldProps> = (props) => (
  <TextField
    fullWidth
    label="Confirm Password"
    name="confirm-password"
    type="password"
    {...props}
  />
);

const TextField: React.FC<TextFieldProps> = ({ persistentHelperText, helperText, ...props }) => (
  <MuiTextField
    fullWidth
    margin="dense"
    helperText={renderHelperText({ persistentHelperText, helperText })}
    {...props}
  />
);

export default TextField;