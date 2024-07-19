import { Router } from 'express';
import { collectionService, entryService } from '../../services';
import { CollectionNotFoundError, ForbiddenError, UnauthorizedError } from '../../errors';

const router = Router();

router.delete('/:collectionId', async (req, res) => {
  const { collectionId } = req.params;

  const { user } = req;
  if (!user) throw new UnauthorizedError();

  const collection = await collectionService.retrieve(collectionId);
  if (!collection) throw new CollectionNotFoundError();
  if (user.id !== collection.createdBy.id) throw new ForbiddenError();

  // ToDo: delete all the entries
  // await entryService.delete

  await collectionService.delete(collectionId);
  return res.sendStatus(204);
});

export { router as deleteCollectionRouter };