import { DocumentReference } from 'firebase-admin/firestore';

export type Optional<T, K extends keyof T> = Omit<T, K> & Pick<Partial<T>, K>;
export type WithId<T> = { id: string; } & T;
export type DocumentDataOf<T extends DocumentReference> = NonNullable<ReturnType<Awaited<ReturnType<T['get']>>['data']>>;