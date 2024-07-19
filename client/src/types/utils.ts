export type Optional<T, K extends keyof T> = Omit<T, K> & Pick<Partial<T>, K>;
export type WithId<T> = { id: string; } & T;