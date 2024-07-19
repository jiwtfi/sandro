import { Router } from 'express';
import { userService } from '../../services';
import { UserNotFoundError } from '../../errors/UserNotFoundError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

const router = Router();

router.get('/me', async (req, res) => {
  const { user: authenticatedUser } = req;
  if (!authenticatedUser) throw new UnauthorizedError();

  const user = await userService.retrieve(authenticatedUser.id);
  if (!user) throw new UserNotFoundError();

  const { id, email, username, bio, imageUrl } = user;
  return res.json({ id, email, username, bio, imageUrl });
});

export { router as retrieveCurrentUserRouter };