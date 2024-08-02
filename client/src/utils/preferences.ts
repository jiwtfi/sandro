import { Preferences } from '../types/preferences';

const localStorageKey = 'sandroPreferences';
const defaultPreferences: Preferences = {
  autoPlay: true,
  flashcardsMode: 0,
  flashcardsShuffle: false,
  gameShuffle: false
};

const completePreferences = (partial: Partial<Preferences>): Preferences => ({
  autoPlay: 'autoPlay' in partial ? partial.autoPlay! : defaultPreferences.autoPlay,
  flashcardsMode: 'flashcardsMode' in partial ? partial.flashcardsMode! : defaultPreferences.flashcardsMode,
  flashcardsShuffle: 'flashcardsShuffle' in partial ? partial.flashcardsShuffle! : defaultPreferences.flashcardsShuffle,
  gameShuffle: 'gameShuffle' in partial ? partial.gameShuffle! : defaultPreferences.gameShuffle,
});

export const retrievePreferencesFromLocalStorage = (): Preferences => {
  const localStorageItem = window.localStorage.getItem(localStorageKey);
  if (localStorageItem) {
    const partial = JSON.parse(localStorageItem) as Partial<Preferences>;
    return completePreferences(partial);
  }
  return defaultPreferences;
};

export const savePreferencesToLocalStorage = (partial: Partial<Preferences>) => {
  if (!window.localStorage) return;
  const existingPreferences = retrievePreferencesFromLocalStorage();
  const preferences = completePreferences({ ...existingPreferences, ...partial });
  localStorage.setItem(localStorageKey, JSON.stringify(preferences));
};