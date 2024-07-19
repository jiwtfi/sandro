import { useState, Fragment } from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Icon from '@mui/material/Icon';
import IconButton from './IconButton';
import { priorityLevels } from '../config';

interface SelectPriorityProps {
  priority: number;
  onChange: (newValue: number) => void;
  iconButtonProps?: Partial<IconButtonProps>;
}

const SelectPriority: React.FC<SelectPriorityProps> = ({ priority, onChange, iconButtonProps }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpen = !!anchorEl;
  const handleClose = () => setAnchorEl(null);

  return (
    <Fragment>
      <IconButton
        title="Priority"
        onClick={e => setAnchorEl(e.currentTarget)}
        {...iconButtonProps}
      >
        <Icon component={priorityLevels.find(({ value }) => value === priority)!.icon} />
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {priorityLevels.map(({ icon, label, value }) => (
          <MenuItem
            key={`priority-${value}`}
            value={label}
            onClick={() => { onChange(value); handleClose(); }}
          >
            <Icon component={icon} />
          </MenuItem>
        ))}
      </Menu>
    </Fragment >
  );
};

export default SelectPriority;