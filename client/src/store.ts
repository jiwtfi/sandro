import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import uiReducer from './reducers/uiSlice';
import gameReducer from './reducers/gameSlice';
import searchReducer from './reducers/searchSlice';
import { api } from './api';
// import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    ui: uiReducer,
    game: gameReducer,
    search: searchReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware)
});

// setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;