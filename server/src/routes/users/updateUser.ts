import { Router } from 'express';
import { userService } from '../../services';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { ForbiddenError } from '../../errors/ForbiddenError';

const router = Router();

router.patch('/:userId', async (req, res) => {
  const { user: authenticatedUser } = req;
  if (!authenticatedUser) throw new UnauthorizedError();

  const { userId } = req.params;
  if (authenticatedUser.id !== userId) throw new ForbiddenError();

  // ToDo
  // Separate handling for email update
  const data = await userService.update(userId, {});
  return res.json(data);
});

export { router as updateCollectionRouter };