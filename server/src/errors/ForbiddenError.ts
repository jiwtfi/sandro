import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  statusCode = 403;
  constructor(message?: string) {
    super(message ?? 'Forbidden');
  }

  serializeError = () => ({ message: this.message });
}