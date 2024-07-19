import MuiIconButton, { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

export interface IconButtonProps extends MuiIconButtonProps {
  title?: string;
  tooltipProps?: Omit<TooltipProps, 'children'>;
  border?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ title, tooltipProps, sx, border, ...props }) => {
  const theme = useTheme();
  const renderButton = () => (
    <MuiIconButton
      {...props}
      sx={{
        border: border ? '1px solid' : undefined,
        borderColor: border ? theme.palette.divider : undefined,
        marginY: 'auto',
        ...sx
      }}
    />
  );
  if (!title || props.disabled) return renderButton();
  return (
    <Tooltip title={title} {...tooltipProps}>
      {renderButton()}
    </Tooltip>
  )
};

export default IconButton;