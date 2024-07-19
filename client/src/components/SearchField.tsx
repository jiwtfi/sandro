import { PropsWithChildren } from 'react';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFieldProps extends SearchInputProps { }
interface SearchInputProps extends InputBaseProps { }

export const SearchWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack
      direction="row"
      width="100%"
      alignItems="center"
      sx={theme => ({
        borderRadius: theme.shape.borderRadius,
        bgcolor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          bgcolor: alpha(theme.palette.common.white, 0.25)
        },
        paddingRight: theme.spacing(1)
      })}
    >
      <Stack
        sx={theme => ({
          padding: theme.spacing(0, 2),
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'

        })}
      >
        <SearchIcon />
      </Stack>
      {children}
    </Stack>
  );
};

export const SearchInput: React.FC<SearchInputProps> = props => {
  return (
    <InputBase
      fullWidth
      placeholder="Search"
      {...props}
    />
  );
};

const SearchField: React.FC<SearchFieldProps> = props => {
  return (
    <SearchWrapper>
      <SearchInput {...props} />
    </SearchWrapper>
  );
};

export default SearchField;