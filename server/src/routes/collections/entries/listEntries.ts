import { Request, Router } from 'express';
import { collectionService, entryService } from '../../../services';
import { CollectionNotFoundError, RequestValidationError, ValidationErrorParams } from '../../../errors';
import { catchValidationError, validatePaginationParams, verifyCollectionReadAccess } from '../../../utils';
import { PaginationOutput, PaginationParams } from '../../../types/pagination';
import { ListEntriesResponseBody } from '../../../types';

type ListEntriesQueryParams = {
  [Property in keyof PaginationParams]: string;
}

const router = Router();

const validate = ({ offset, limit }: Request['query']): PaginationParams => {
  const errors: ValidationErrorParams[] = [];

  try {
    return validatePaginationParams({ offset, limit });
  } catch (err) {
    catchValidationError(err, errors);
    throw new RequestValidationError(errors);
  }
};


router.get('/:collectionId/entries', async (req: Request<{ collectionId: string; }, ListEntriesResponseBody, object, ListEntriesQueryParams>, res) => {
  const { collectionId } = req.params;
  const { user } = req;

  const collection = await collectionService.retrieve(collectionId);
  if (!collection) throw new CollectionNotFoundError();

  verifyCollectionReadAccess(user, collection);

  const queryParams = validate(req.query);
  const offset = queryParams.offset ?? 0;
  const limit = queryParams.limit ?? 2000;

  const count = await entryService.count(collectionId);
  const entries = await entryService.list(collectionId, { offset, limit });

  const prev = offset - limit;
  const next = offset + limit;

  const pagination: PaginationOutput = {
    count, offset, limit,
    ...(prev >= 0 ? { prev } : (offset !== 0 ? { prev: 0 } : {})),
    ...(next < count ? { next } : {})
  };
  return res.json({ data: entries, pagination });
});

export { router as listEntriesRouter };