export * from './validators';
export * from './example';
export * from './messages';
export * from './errorHandlers';

export const randomId = () => Math.random().toString(36).slice(2, 8);

export const shuffle = <T>(arr: T[]): T[] => arr.map(value => ({
  value, num: Math.random()
})).sort((a, b) => a.num - b.num).map(({ value }) => value);

export const weightedShuffle = <T extends { priority: number; }>(arr: T[]): T[] => arr.map(value => ({
  value, num: Math.random() / Math.pow(value.priority, 2)
})).sort((a, b) => a.num - b.num).map(({ value }) => value);