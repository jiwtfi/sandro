import { Router } from 'express';
import { collectionService } from '../../services';
import { UnauthorizedError } from '../../errors';
import { serializeCollection } from '../../utils/serializer';

const router = Router();

router.get('/', async (req, res) => {
  const { user } = req;
  if (!user) throw new UnauthorizedError();

  const collections = await collectionService.list({ userId: user.id });

  return res.json(collections.map(collection => {
    const { id, createdBy, title, description } = collection;
    return serializeCollection({
      id, createdBy, title, description,
      private: collection.private
    });
  }));
});

export { router as listCollectionsRouter };