import { Router } from 'express';
import { collectionService, entryService } from '../../../services';
import { CollectionNotFoundError, EntryNotFoundError, ForbiddenError, UnauthorizedError } from '../../../errors';

const router = Router();

router.delete('/:collectionId/entries/:entryId', async (req, res) => {
  const { collectionId, entryId } = req.params;

  const { user } = req;
  if (!user) throw new UnauthorizedError();

  const collection = await collectionService.retrieve(collectionId);
  if (!collection) throw new CollectionNotFoundError();
  if (user.id !== collection.createdBy.id) throw new ForbiddenError();

  const entry = await entryService.retrieve(collectionId, entryId);
  if (!entry) throw new EntryNotFoundError();

  await entryService.delete(collectionId, entryId);

  return res.sendStatus(204);
});

export { router as deleteEntryRouter };