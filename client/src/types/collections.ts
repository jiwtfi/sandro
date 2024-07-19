import { Optional, WithId } from './utils';

export type Collection = {
  createdBy: string;
  title: string;
  description: string;
  private: boolean;
};

export interface NewCollectionParams extends Omit<Collection, 'createdBy'> {
  createdBy: string;
}
export interface CreateCollectionRequestBody extends Optional<Omit<NewCollectionParams, 'createdBy'>, 'description' | 'private'> { }
export interface UpdateCollectionParams extends Partial<Omit<Collection, 'createdBy'>> { }
export interface UpdateCollectionRequestBody extends UpdateCollectionParams { }
export interface CreateCollectionResponseBody extends WithId<Collection> { }
export interface RetrieveCollectionResponseBody extends WithId<Collection> { }
export type ListCollectionsResponseBody = RetrieveCollectionResponseBody[];

export * from './entries';
