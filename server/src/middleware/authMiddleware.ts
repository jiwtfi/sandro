import { NextFunction, Request, Response } from 'express';
import { auth } from '../fbAdmin';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    try {
      const { uid } = await auth.verifyIdToken(token);
      req.user = { id: uid };
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  return next();

};