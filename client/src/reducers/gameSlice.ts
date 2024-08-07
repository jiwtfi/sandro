import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Entry, TermExample } from '../types';
import { extractExamplesFromEntries, isLocaleAlpha, shuffle, weightedShuffle } from '../utils';
import { splitExample } from '../utils/example';
import { retrievePreferencesFromLocalStorage, savePreferencesToLocalStorage } from '../utils/preferences';

interface GameState {
  examples: TermExample[];
  currentExampleIndex: number;
  prompt: string[];
  words: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
  revealed: string[];
  letters: string[];
  isComplete: boolean;
  isShuffled: boolean;
}

const initialState: GameState = {
  examples: [],
  currentExampleIndex: 0,
  prompt: [],
  words: [],
  currentWordIndex: 0,
  currentLetterIndex: 0,
  revealed: [],
  letters: [],
  isComplete: false,
  isShuffled: false
};

const getLetters = (text: string, lang: string) => shuffle(
  text.split('').filter(char => (
    isLocaleAlpha(char, lang)
  ))
);

const replaceLetters = (state: GameState, letter: string) => {
  const { words, currentWordIndex, currentLetterIndex } = state;
  const index = state.letters.findIndex(l => l === letter.toLowerCase());
  if (index >= 0) {
    const currentWord = words[currentWordIndex];
    for (let i = currentLetterIndex; i < currentWord.length; i++) {
      const newLetter = currentWord[i].toLowerCase();
      if (newLetter === letter) return state;
      if (!state.letters.includes(newLetter)) {
        state.letters[index] = newLetter;
        return state;
      }
    }
  }
  return state;
};

const setLetters = (state: GameState) => {
  const size = 4;
  const { words, currentWordIndex, currentLetterIndex, currentExampleIndex } = state;
  const letters = new Set<string>(state.letters);
  const currentWord = words[currentWordIndex];
  letters.add(currentWord[currentLetterIndex].toLowerCase());
  for (let i = currentLetterIndex; i < currentWord.length; i++) {
    letters.add(currentWord[i].toLowerCase());
    if (letters.size === size) break;
  }

  if (letters.size < size) {
    const { lang } = state.examples[currentExampleIndex].example;
    const examples = shuffle(state.examples);
    for (let i = 0; i < examples.length; i++) {
      const options = getLetters(examples[i].example.text, lang);
      for (let j = 0; j < options.length; j++) {
        letters.add(options[j].toLowerCase());
        if (letters.size === size) break;
      }
      if (letters.size === size) break;
    }
  }

  state.letters = Array.from(letters).sort();
  return state;
};

const initQuestion = (state: GameState): GameState => {
  const { prompt, words } = splitExample(state.examples[state.currentExampleIndex].example);
  state.prompt = prompt;
  state.words = words;
  state.currentWordIndex = 0;
  state.currentLetterIndex = 0;
  state.revealed = prompt;
  state.isComplete = false;
  state.letters = [];
  setLetters(state);
  return state;
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (state, { payload: { entries } }: PayloadAction<{ entries: Entry[]; }>) => {
      const preferences = retrievePreferencesFromLocalStorage();
      state.isShuffled = preferences.gameShuffle;
      const examples = extractExamplesFromEntries(entries, true);
      state.examples = state.isShuffled ? weightedShuffle(examples) : examples;
      state.currentExampleIndex = 0;
      state = initQuestion(state);
      return state;
    },
    setIsComplete: (state, action: PayloadAction<boolean>) => {
      state.isComplete = action.payload;
      return state;
    },
    previousQuestion: state => {
      state.currentExampleIndex = (state.currentExampleIndex - 1 + state.examples.length) % state.examples.length;
      return initQuestion(state);
    },
    nextQuestion: state => {
      state.currentExampleIndex = (state.currentExampleIndex + 1) % state.examples.length;
      return initQuestion(state);
    },
    reveal: state => {
      const index = state.currentWordIndex * 2 + 1;
      let currentLetter = state.words[state.currentWordIndex][state.currentLetterIndex];
      state.revealed = [
        ...state.revealed.slice(0, index),
        state.revealed[index].replace(/\*/, currentLetter),
        ...state.revealed.slice(index + 1)
      ];
      const oldLetter = currentLetter.toLowerCase();
      do {
        if (state.currentLetterIndex === state.words[state.currentWordIndex].length - 1) {
          if (state.currentWordIndex === state.words.length - 1) {
            state.isComplete = true;
          } else {
            state.currentWordIndex += 1;
            state.currentLetterIndex = 0;
          }
        } else {
          state.currentLetterIndex += 1;
        }
        currentLetter = state.words[state.currentWordIndex][state.currentLetterIndex];
      } while (currentLetter === ' ');
      replaceLetters(state, oldLetter);
      return state;
    },
    setIsShuffled: (state, action: PayloadAction<boolean>) => {
      if (action.payload === state.isShuffled) return state;
      state.isShuffled = action.payload;
      savePreferencesToLocalStorage({ gameShuffle: action.payload });
      if (action.payload) {
        state.examples = [
          state.examples[state.currentExampleIndex],
          ...weightedShuffle([
            ...state.examples.slice(0, state.currentExampleIndex),
            ...state.examples.slice(state.currentExampleIndex + 1)
          ])
        ];
        state.currentExampleIndex = 0;
      } else {
        state.currentExampleIndex = state.examples[state.currentExampleIndex].exampleIndex;
        state.examples.sort((a, b) => a.exampleIndex - b.exampleIndex);
      }
      return state;
    }

  }
});

export const {
  initializeGame,
  previousQuestion,
  nextQuestion,
  reveal,
  setIsComplete,
  setIsShuffled
} = gameSlice.actions;

export const selectIsGameLoaded = ({ game: { revealed } }: RootState) => revealed.length > 0;
export const selectDefinition = ({ game: { examples, currentExampleIndex } }: RootState) => examples[currentExampleIndex].definition;
export const selectTerm = ({ game: { examples, currentExampleIndex } }: RootState) => examples[currentExampleIndex].term;
export const selectRevealed = (state: RootState) => state.game.revealed;
export const selectExample = ({ game: { examples, currentExampleIndex } }: RootState) => examples[currentExampleIndex].example;;
export const selectCurrentExampleIndex = (state: RootState) => state.game.currentExampleIndex;
export const selectExampleLength = (state: RootState) => state.game.examples.length;
export const selectCurrentLetter = ({ game: { words, currentWordIndex, currentLetterIndex } }: RootState) => (
  words.length === 0 ? '' : words[currentWordIndex][currentLetterIndex]
);
export const selectLetters = (state: RootState) => state.game.letters;
export const selectIsComplete = (state: RootState) => state.game.isComplete;
export const selectIsShuffled = (state: RootState) => state.game.isShuffled;

export default gameSlice.reducer;