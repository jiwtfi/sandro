import { Optional, WithId } from './utils';

export type User = {
  email: string;
  username: string;
  bio: string;
  imageUrl: string | null;
};

export type GeneralUserInfo = WithId<Omit<User, 'email'>>;

export interface NewUserParams extends User { }
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

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      } | null;
    }
  }
}