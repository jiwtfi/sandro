import { AppError } from './AppError';

export class ContentTooLargeError extends AppError {
  statusCode = 413;
  constructor(message?: string) {
    super(message ?? 'Content too large');
  }

  serializeError = () => ({ message: this.message });
}