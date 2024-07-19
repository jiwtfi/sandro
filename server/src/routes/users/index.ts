import { Router } from 'express';
import { createUserRouter } from './createUser';
import { retrieveCurrentUserRouter } from './retrieveCurrentUser';
import { retrieveUserRouter } from './retrieveUser';
import { listUsersRouter } from './listUser';
// import { updateUserRouter } from './updateUser';
// import { deleteUserRouter } from './deleteUser';

const router = Router();

router.use(createUserRouter);
router.use(retrieveCurrentUserRouter);
router.use(retrieveUserRouter);
router.use(listUsersRouter);
// router.use(updateUserRouter);
// router.use(deleteUserRouter);

export { router as usersRouter };