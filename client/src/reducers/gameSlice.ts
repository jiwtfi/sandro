import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Definition, Entry, Example, Term } from '../types';
import { isLocaleAlpha, shuffle, shuffleExamples } from '../utils';
import { splitExample } from '../utils/exampleText';

interface GameState {
  examples: {
    example: Example;
    definition: Definition;
    term: Term;
    priority: number;
  }[];
  exampleIndex: number;
  prompt: string[];
  words: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
  revealed: string[];
  letters: string[];
  isComplete: boolean;
  preferences: {
    prompt: 'example' | 'term';
    multipleChoice: boolean;
  };
}

const initialState: GameState = {
  examples: [],
  exampleIndex: 0,
  prompt: [],
  words: [],
  currentWordIndex: 0,
  currentLetterIndex: 0,
  revealed: [],
  letters: [],
  isComplete: false,
  preferences: {
    prompt: 'example',
    multipleChoice: false
  }
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
  const { words, currentWordIndex, currentLetterIndex, exampleIndex } = state;
  const letters = new Set<string>(state.letters);
  const currentWord = words[currentWordIndex];
  letters.add(currentWord[currentLetterIndex].toLowerCase());
  for (let i = currentLetterIndex; i < currentWord.length; i++) {
    letters.add(currentWord[i].toLowerCase());
    if (letters.size === size) break;
  }

  if (letters.size < size) {
    const { lang } = state.examples[exampleIndex].example;
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
  const { prompt, words } = splitExample(state.examples[state.exampleIndex].example);
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
      state.examples = shuffleExamples(entries.reduce((acc, { term, definition, examples, priority }) => ([
        ...acc,
        ...examples.filter(({ occurrences }) => occurrences.length > 0).map(example => ({
          example, definition, term, priority
        }))
      ]), [] as { example: Example; definition: Definition; term: Term; priority: number; }[]));
      state.exampleIndex = 0;
      state = initQuestion(state);
      return state;
    },
    setIsComplete: (state, action: PayloadAction<boolean>) => {
      state.isComplete = action.payload;
      return state;
    },
    initializeQuestion: state => {
      return initQuestion(state);
    },
    previousQuestion: state => {
      state.exampleIndex = (state.exampleIndex - 1 + state.examples.length) % state.examples.length;
      return initQuestion(state);
    },
    nextQuestion: state => {
      state.exampleIndex = (state.exampleIndex + 1) % state.examples.length;
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

  }
});

export const {
  initializeGame,
  initializeQuestion,
  previousQuestion,
  nextQuestion,
  reveal,
  setIsComplete
} = gameSlice.actions;

export const selectIsGameLoaded = ({ game: { revealed } }: RootState) => revealed.length > 0;
export const selectDefinition = ({ game: { examples, exampleIndex } }: RootState) => examples[exampleIndex].definition;
export const selectTerm = ({ game: { examples, exampleIndex } }: RootState) => examples[exampleIndex].term;
export const selectRevealed = (state: RootState) => state.game.revealed;
export const selectExample = ({ game: { examples, exampleIndex } }: RootState) => examples[exampleIndex].example;;
export const selectExampleIndex = (state: RootState) => state.game.exampleIndex;
export const selectExampleLength = (state: RootState) => state.game.examples.length;
export const selectCurrentLetter = ({ game: { words, currentWordIndex, currentLetterIndex } }: RootState) => (
  words.length === 0 ? '' : words[currentWordIndex][currentLetterIndex]
);
export const selectLetters = (state: RootState) => state.game.letters;
export const selectIsComplete = (state: RootState) => state.game.isComplete;
export const selectPreferences = (state: RootState) => state.game.preferences;

export default gameSlice.reducer;