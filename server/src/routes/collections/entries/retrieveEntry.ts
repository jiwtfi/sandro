import { Router } from 'express';
import { collectionService, entryService } from '../../../services';
import { CollectionNotFoundError, EntryNotFoundError, ForbiddenError, UnauthorizedError } from '../../../errors';
import { verifyCollectionReadAccess } from '../../../utils';

const router = Router();

router.get('/:collectionId/entries/:entryId', async (req, res) => {
  const { collectionId, entryId } = req.params;
  const { user } = req;

  const collection = await collectionService.retrieve(collectionId);
  if (!collection) throw new CollectionNotFoundError();

  verifyCollectionReadAccess(user, collection);

  const entry = await entryService.retrieve(collectionId, entryId);
  if (!entry) throw new EntryNotFoundError();

  // ToDo: select fields
  return res.json(entry);
});

export { router as retrieveEntryRouter };