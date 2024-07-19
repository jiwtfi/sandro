import { serializeDocRef } from '../fbAdmin';
import { Collection, User, WithId } from '../types';

export const serializeCollection = ({ createdBy, ...collection }: WithId<Collection>) => ({
  createdBy: serializeDocRef(createdBy),
  ...collection
});