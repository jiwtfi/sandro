import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';

export const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).send(err.serializeError());
  }
  return res.status(500).send({ message: 'Internal server error' });
};