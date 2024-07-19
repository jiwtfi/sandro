// import { Collection } from './collections';
import { Optional, WithId } from './utils';

export type User = {
  email: string;
  username: string;
  bio: string;
  imageUrl: string | null;
  // collections: DocumentReference<Collection>[];
};

export type GeneralUserInfo = WithId<Omit<User, 'email'>>;

export interface NewUserParams extends Omit<User, 'collections'> { }
export interface CreateUserRequestBody extends Optional<NewUserParams, 'imageUrl' | 'bio'> {
  id: string;
}
export interface UpdateUserParams extends Partial<User> { }

export interface ListUserQueryParams {
  username?: string;
}

export interface CreateUserResponseBody extends WithId<User> { }
export interface RetrieveCurrentUserResponseBody extends WithId<User> { }
export interface RetrieveUserResponseBody extends GeneralUserInfo { }
export type ListUserResponseBody = GeneralUserInfo[];