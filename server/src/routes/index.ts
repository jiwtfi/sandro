import { Router } from 'express';
import { collectionsRouter } from './collections';
import { usersRouter } from './users';

const router = Router();

router.use('/collections', collectionsRouter);
router.use('/users', usersRouter);

export { router };