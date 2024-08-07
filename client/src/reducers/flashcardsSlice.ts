import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Entry, TermExample } from '../types';
import { extractExamplesFromEntries, weightedShuffle } from '../utils';
import { retrievePreferencesFromLocalStorage, savePreferencesToLocalStorage } from '../utils/preferences';

interface FlashcardsState {
  cards: Entry[];
  examples: TermExample[];
  exampleCards: TermExample[];
  currentCardIndex: number;
  isShuffled: boolean;
  definitionFirst: boolean;
  exampleMode: boolean;
  isFlipped: boolean;
}

const initialState: FlashcardsState = {
  cards: [],
  examples: [],
  exampleCards: [],
  currentCardIndex: 0,
  isShuffled: false,
  definitionFirst: false,
  exampleMode: false,
  isFlipped: false
};

export const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    initializeFlashcards: (state, { payload: { entries } }: PayloadAction<{ entries: Entry[]; }>) => {
      const preferences = retrievePreferencesFromLocalStorage();
      state.isShuffled = preferences.flashcardsShuffle;
      state.definitionFirst = preferences.flashcardsMode === 1;
      state.exampleMode = preferences.flashcardsMode === 2;
      state.cards = state.isShuffled ? weightedShuffle(entries) : entries;
      const examples = extractExamplesFromEntries(entries);
      state.examples = examples;
      state.exampleCards = state.isShuffled ? weightedShuffle(examples) : examples;
      return state;
    },
    previousCard: state => {
      state.currentCardIndex = (state.currentCardIndex - 1 + state.cards.length) % state.cards.length;
      state.isFlipped = false;
      return state;
    },
    nextCard: state => {
      state.currentCardIndex = (state.currentCardIndex + 1) % state.cards.length;
      state.isFlipped = false;
      return state;
    },
    setIsShuffled: (state, action: PayloadAction<boolean>) => {
      if (action.payload === state.isShuffled) return state;
      state.isShuffled = action.payload;
      savePreferencesToLocalStorage({ flashcardsShuffle: action.payload })
      if (action.payload) {
        state.cards = [
          state.cards[state.currentCardIndex],
          ...weightedShuffle([
            ...state.cards.slice(0, state.currentCardIndex),
            ...state.cards.slice(state.currentCardIndex + 1)
          ])
        ];
        state.exampleCards = [
          state.exampleCards[state.currentCardIndex],
          ...weightedShuffle([
            ...state.exampleCards.slice(0, state.currentCardIndex),
            ...state.exampleCards.slice(state.currentCardIndex + 1)
          ])
        ];
        state.currentCardIndex = 0;
      } else {
        state.currentCardIndex = state.exampleMode ? state.exampleCards[state.currentCardIndex].exampleIndex : state.cards[state.currentCardIndex].index;
        state.cards.sort((a, b) => a.index - b.index);
        state.exampleCards.sort((a, b) => a.exampleIndex - b.exampleIndex);
      }
      return state;
    },
    setDefinitionFirst: (state, action: PayloadAction<boolean>) => {
      state.isFlipped = false;
      state.definitionFirst = action.payload;
      savePreferencesToLocalStorage({
        flashcardsMode: state.exampleMode ? 2 : (action.payload ? 1 : 0)
      });
      return state;
    },
    setExampleMode: (state, action: PayloadAction<boolean>) => {
      state.isFlipped = false;
      state.exampleMode = action.payload;
      savePreferencesToLocalStorage({
        flashcardsMode: action.payload ? 2 : (state.definitionFirst ? 1 : 0)
      });
      if (action.payload) {
        const foundIndex = state.exampleCards.findIndex(({ index }) => index === state.cards[state.currentCardIndex].index);
        state.currentCardIndex = foundIndex >= 0 ? foundIndex : 0;
      } else {
        state.currentCardIndex = state.cards.findIndex(({ index }) => index === state.exampleCards[state.currentCardIndex].index);
      }
      return state;
    },
    flipCard: state => {
      state.isFlipped = !state.isFlipped;
      return state;
    }
  }
});

export const {
  initializeFlashcards,
  previousCard,
  nextCard,
  setDefinitionFirst,
  setExampleMode,
  flipCard,
  setIsShuffled
} = flashcardsSlice.actions;

export const selectCurrentCardIndex = (state: RootState) => state.flashcards.currentCardIndex;
export const selectCurrentCard = ({ flashcards: { cards, currentCardIndex } }: RootState) => cards[currentCardIndex];
export const selectCurrentExampleCard = ({ flashcards: { currentCardIndex, exampleCards } }: RootState) => exampleCards[currentCardIndex];
// export const selectTerm = ({ flashcards: { cards, currentCardIndex } }: RootState) => cards[currentCardIndex].term;
// export const selectDefinition = ({ flashcards: { cards, currentCardIndex } }: RootState) => cards[currentCardIndex].definition;
export const selectTotalCardLength = ({ flashcards: { cards, exampleCards, exampleMode } }: RootState) => exampleMode ? exampleCards.length : cards.length;
export const selectDefinitionFirst = (state: RootState) => state.flashcards.definitionFirst;
export const selectExampleMode = (state: RootState) => state.flashcards.exampleMode;
export const selectIsFlipped = (state: RootState) => state.flashcards.isFlipped;
export const selectIsShuffled = (state: RootState) => state.flashcards.isShuffled;


export default flashcardsSlice.reducer;