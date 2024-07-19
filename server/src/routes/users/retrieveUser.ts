import { Router } from 'express';
import { userService } from '../../services';
import { UserNotFoundError } from '../../errors/UserNotFoundError';

const router = Router();

router.get('/:userId', async (req, res) => {
  // ToDo: collections
  const { userId } = req.params;

  const user = await userService.retrieve(userId);
  if (!user) throw new UserNotFoundError();

  const { id, username, bio, imageUrl } = user;
  return res.json({ id, username, bio, imageUrl });
});

export { router as retrieveUserRouter };