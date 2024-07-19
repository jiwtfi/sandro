import { Example, Occurrence } from '../types';

type ExampleHandlerInput = Pick<Example, 'text' | 'occurrences'>;

// The odd indices correspond to the occurrences
export const sliceExampleText = ({ text, occurrences }: ExampleHandlerInput) => {
  const result: string[] = [];
  let index = 0;
  for (let i = 0; i < occurrences.length; i++) {
    result.push(text.slice(index, occurrences[i].start));
    result.push(text.slice(occurrences[i].start, occurrences[i].end));
    index = occurrences[i].end;
  }
  result.push(text.slice(index));
  return result;
};

export const stringifyExampleText = (example: ExampleHandlerInput) => (
  sliceExampleText(example).reduce((acc, text, i) => `${acc}${i % 2 === 1 ? `{{${text}}}` : text}`, '')
);

export const parseExampleOccurrences = (rawText: string) => {
  let text = rawText;
  let currentIndex = 0;
  const occurrences: Occurrence[] = [];
  while (true) {
    const match = text.match(/{{[^{]*}}/);
    if (!match || match.index === undefined) break;
    const start = currentIndex + match.index;
    text = `${text.slice(0, start)}${text.slice(start + 2)}`;
    const length = match[0].length - 4;
    const end = start + length;
    text = `${text.slice(0, end)}${text.slice(end + 2)}`;
    occurrences.push({ start, end });
  }

  return { text, occurrences };
};

export const splitExample = (example: ExampleHandlerInput) => {
  const sliced = sliceExampleText(example);
  let prompt: string[] = [];
  const words: string[] = [];

  sliced.forEach((text, i) => {
    if (i % 2 === 1) {
      words.push(text);
      prompt.push(text.replace(/\S/g, '*'));
    } else {
      prompt.push(text);
    }
  });

  return { prompt, words };
};