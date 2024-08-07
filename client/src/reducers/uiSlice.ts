import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { savePreferencesToLocalStorage } from '../utils/preferences';

interface UiState {
  isAppLoading: boolean;
  hasUnsavedChanges: boolean;
  soundAutoplay: boolean;
}

const initialState: UiState = {
  isAppLoading: true,
  hasUnsavedChanges: false,
  soundAutoplay: true
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsAppLoading: (state, action: PayloadAction<boolean>) => {
      state.isAppLoading = action.payload;
      return state;
    },
    setHasUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
      return state;
    },
    setSoundAutoplay: (state, action: PayloadAction<boolean>) => {
      state.soundAutoplay = action.payload;
      savePreferencesToLocalStorage({ autoPlay: action.payload });
      return state;
    }
  }
});

export const {
  setHasUnsavedChanges, setIsAppLoading, setSoundAutoplay
} = uiSlice.actions;
export const selectIsAppLoading = (state: RootState) => state.ui.isAppLoading;
export const selectHasUnsavedChanges = (state: RootState) => state.ui.hasUnsavedChanges;
export const selectSoundAutoplay = (state: RootState) => state.ui.soundAutoplay;
export default uiSlice.reducer;