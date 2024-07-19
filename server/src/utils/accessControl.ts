import { Request } from 'express';
import { Collection } from '../types';
import { ForbiddenError, UnauthorizedError } from '../errors';

export const verifyCollectionReadAccess = (user: Request['user'], collection: Collection) => {
  if (collection.private) {
    if (!user) throw new UnauthorizedError();
    if (user.id !== collection.createdBy.id) throw new ForbiddenError();
  }
};

export const verifyCollectionWriteAccess = (user: Request['user'], collection: Collection) => {
  if (!user) throw new UnauthorizedError();
  if (user.id !== collection.createdBy.id) throw new ForbiddenError();
};