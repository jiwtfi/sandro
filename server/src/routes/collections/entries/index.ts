import { Router } from 'express';
import { addEntryRouter } from './addEntry';
import { listEntriesRouter } from './listEntries';
import { batchAddEntriesRouter } from './batchAddEntries';
import { updateEntryRouter } from './updateEntry';
import { deleteEntryRouter } from './deleteEntry';
import { retrieveEntryRouter } from './retrieveEntry';

const router = Router();

router.use(addEntryRouter);
router.use(retrieveEntryRouter);
router.use(updateEntryRouter);
router.use(deleteEntryRouter);
router.use(batchAddEntriesRouter);
router.use(listEntriesRouter);

export { router as entriesRouter };