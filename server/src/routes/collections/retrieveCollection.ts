import { Request, Router } from 'express';
import { collectionService } from '../../services';
import { CollectionNotFoundError, ForbiddenError, UnauthorizedError } from '../../errors';
import { verifyCollectionReadAccess } from '../../utils';
import { RetrieveCollectionResponseBody } from '../../types';
import { serializeCollection } from '../../utils/serializer';

const router = Router();

router.get('/:collectionId', async (req: Request<{ collectionId: string }, RetrieveCollectionResponseBody>, res) => {
  const { collectionId } = req.params;
  const { user } = req;

  const collection = await collectionService.retrieve(collectionId);
  if (!collection) throw new CollectionNotFoundError();

  verifyCollectionReadAccess(user, collection);

  const { id, createdBy, title, description } = collection;

  return res.json(serializeCollection({
    id, createdBy, title, description,
    private: collection.private
  }));
});

export { router as retrieveCollectionRouter };