import { DocumentReference } from 'firebase-admin/firestore';
import { User } from './users';
import { Optional, WithId } from './utils';

export type Collection = {
  createdBy: DocumentReference<User>;
  title: string;
  description: string;
  private: boolean;
};

export type SerializedCollection = WithId<Omit<Collection, 'createdBy'>> & {
  createdBy: string;
};

export type CollectionSummary = SerializedCollection;

export interface NewCollectionParams extends Omit<Collection, 'createdBy'> {
  createdBy: string;
}
export interface CreateCollectionRequestBody extends Optional<Omit<NewCollectionParams, 'createdBy'>, 'description' | 'private'> { }
export interface UpdateCollectionParams extends Partial<Omit<Collection, 'createdBy'>> { }
export interface UpdateCollectionRequestBody extends UpdateCollectionParams { }
export interface CreateCollectionResponseBody extends WithId<SerializedCollection> { }
export interface RetrieveCollectionResponseBody extends WithId<SerializedCollection> { }
export type ListCollectionsResponseBody = RetrieveCollectionResponseBody[];

export * from './entries';
