import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  statusCode = 401;
  constructor(message?: string) {
    super(message ?? 'Unauthorized');
  }

  serializeError = () => ({ message: this.message });
}