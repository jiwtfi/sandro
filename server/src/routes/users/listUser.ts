import { Request, Router } from 'express';
import { userService } from '../../services';
import { ListUserQueryParams } from '../../types';

const router = Router();

router.get('/', async (req: Request<object, object, object, ListUserQueryParams>, res) => {
  const { username } = req.query;

  if (username) {
    const user = await userService.findByUsername(username);
    if (!user) return res.json([]);
    const { id, bio, imageUrl } = user;
    return res.json([{ id, username, bio, imageUrl }]);
  }

  return res.json([]);
});

export { router as listUsersRouter };