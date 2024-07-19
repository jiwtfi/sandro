import { Fragment } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select';
import { languages } from '../config';

type SelectProps = MuiSelectProps;

export const LanguageSelectMenu: React.FC<{ name?: string; }> = props => (
  <Fragment>
    {languages.map(({ code, name }) => (
      <MenuItem key={`${props.name}-${code}`} value={code}>{name}</MenuItem>
    ))}
  </Fragment>
);

export const LanguageSelectField: React.FC<Omit<SelectProps, 'children'>> = props => (
  <Select {...props}>
    <LanguageSelectMenu name={props.name} />
  </Select>
);

const Select: React.FC<SelectProps> = props => (
  <FormControl fullWidth>
    <InputLabel id={props.labelId}>{props.label}</InputLabel>
    <MuiSelect {...props} />
  </FormControl>
);

export default Select;