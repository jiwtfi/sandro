import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';
import { Collection, Entry } from '../types';

interface SearchState {
  entries: Entry[];
  collections: Collection[];
}

const initialState: SearchState = {
  entries: [],
  collections: []
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<SearchState>) => {
      state.entries = action.payload.entries;
      state.collections = action.payload.collections;
      return state;
    }
  }
});

export const setSearchResults: AppThunk = (dispatch, getState) => async (keyword: string, { entries, collections }: {
  entries?: Entry[], collections?: Collection[];
}) => {
  const results = initialState;
  const keywordLowerCase = keyword.toLowerCase();

  if (entries) {
    const matchedEntries: Entry[][] = [];
    entries.forEach(entry => {
      if (entry.term.text.toLowerCase().includes(keywordLowerCase)) matchedEntries[0].push(entry);
      else if (entry.definition.text.toLowerCase().includes(keywordLowerCase)) matchedEntries[1].push(entry);
      else if (entry.examples.find(example => (example.text.toLowerCase().includes(keywordLowerCase)))) matchedEntries[2].push(entry);
    });
    results.entries = matchedEntries.flat();
  }

  if (collections) {
    const matchedCollections: Collection[][] = [];
    collections.forEach(collection => {
      if (collection.title.toLowerCase().includes(keywordLowerCase)) matchedCollections[0].push(collection);
      else if (collection.description.toLowerCase().includes(keywordLowerCase)) matchedCollections[1].push(collection);
    });
    results.collections = matchedCollections.flat();
  }

  dispatch(searchSlice.actions.setResults(results));
};

export const selectSearchResults = (state: RootState) => state.search;
export default searchSlice.reducer;