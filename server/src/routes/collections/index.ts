import { Router } from 'express';
import { createCollectionRouter } from './createCollection';
import { retrieveCollectionRouter } from './retrieveCollection';
import { updateCollectionRouter } from './updateCollection';
import { deleteCollectionRouter } from './deleteCollection';
import { entriesRouter } from './entries';
import { listCollectionsRouter } from './listCollections';

const router = Router();

router.use(entriesRouter);
router.use(createCollectionRouter);
router.use(retrieveCollectionRouter);
router.use(updateCollectionRouter);
router.use(deleteCollectionRouter);
router.use(listCollectionsRouter);

export { router as collectionsRouter };