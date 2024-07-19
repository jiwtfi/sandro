import { Definition, Example, Term } from '../types';

export * from './validators';

export const randomId = () => Math.random().toString(36).slice(2, 8);
export const shuffle = <T>(arr: T[]): T[] => arr.map(value => ({
  value, num: Math.random()
})).sort((a, b) => a.num - b.num).map(({ value }) => value);
export const shuffleExamples = (examples: {
  example: Example; definition: Definition; term: Term; priority: number;
}[]) => examples.map(value => ({
  value, num: Math.random() / Math.pow(value.priority, 2)
})).sort((a, b) => a.num - b.num).map(({ value }) => value);