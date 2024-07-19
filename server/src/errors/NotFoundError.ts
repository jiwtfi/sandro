import { AppError } from './AppError';

export class NotFoundError extends AppError {
  statusCode = 404;
  constructor(message?: string) {
    super(message ?? 'Not found');
  }

  serializeError = () => ({ message: this.message });
}