import { AppError } from './AppError';

export class BadRequestError extends AppError {
  statusCode = 400;
  constructor(message?: string) {
    super(message ?? 'Bad request');
  }

  serializeError = () => ({ message: this.message });
}