import { NotFoundError } from './NotFoundError';

export class CollectionNotFoundError extends NotFoundError {
  statusCode = 404;
  constructor(message?: string) {
    super(message ?? 'The collection does not exist');
  }

  serializeError = () => ({ message: this.message });
}