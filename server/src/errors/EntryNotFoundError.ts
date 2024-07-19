import { NotFoundError } from './NotFoundError';

export class EntryNotFoundError extends NotFoundError {
  statusCode = 404;
  constructor(message?: string) {
    super(message ?? 'The entry does not exist');
  }

  serializeError = () => ({ message: this.message });
}