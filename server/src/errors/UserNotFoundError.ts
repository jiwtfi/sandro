import { NotFoundError } from './NotFoundError';

export class UserNotFoundError extends NotFoundError {
  statusCode = 404;
  constructor(message?: string) {
    super(message ?? 'The user does not exist');
  }

  serializeError = () => ({ message: this.message });
}