import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SearchInput, SearchWrapper } from './SearchField';

export interface SearchAutocompleteProps extends Omit<AutocompleteProps<string, false, false, true>, 'renderInput'> { }

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = props => {
  return (
    <SearchWrapper>
      <Autocomplete
        fullWidth
        freeSolo
        // filterOptions={x => x}
        {...props}
        getOptionLabel={option => option}
        renderInput={({ InputProps: { ref, ...InputProps }, InputLabelProps, ...params }) => (
          <SearchInput {...InputProps} {...params} />
          // <TextField
          //   variant="standard"
          //   placeholder="Search"
          //   {...params}
          // />
        )}
      />
    </SearchWrapper>
  );
};

export default SearchAutocomplete;